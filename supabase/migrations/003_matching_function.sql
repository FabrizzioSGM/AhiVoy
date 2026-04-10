-- ═══════════════════════════════════════════════════════════════════════════
-- Migración 003 — Funciones de matching automático
-- ═══════════════════════════════════════════════════════════════════════════
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── find_matches_for_shipment ────────────────────────────────────────────────
-- Busca rutas de retorno compatibles para un envío publicado.
-- SECURITY DEFINER: corre como el dueño de la función (bypassa RLS)
-- para poder insertar en matches y notifications desde cualquier contexto.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.find_matches_for_shipment(p_shipment_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shipment  shipment_requests%ROWTYPE;
  v_route     RECORD;
  v_score     numeric(5,2);
  v_distance  numeric;
  v_price     numeric(12,2);
  v_earnings  numeric(12,2);
  v_savings   numeric(12,2);
  v_match_id  uuid;
  v_count     integer := 0;
BEGIN
  -- Obtener el envío (debe estar publicado)
  SELECT * INTO v_shipment
  FROM shipment_requests
  WHERE id = p_shipment_id AND status = 'published';

  IF NOT FOUND THEN RETURN 0; END IF;

  -- ── Buscar rutas compatibles ─────────────────────────────────────────────
  FOR v_route IN
    SELECT
      rr.*,
      cp.user_id AS carrier_user_id
    FROM return_routes rr
    JOIN carrier_profiles cp ON cp.id = rr.carrier_id
    WHERE rr.status = 'published'
      -- Filtros duros (geográfico + capacidad + fecha)
      AND LOWER(TRIM(rr.origin_state))      = LOWER(TRIM(v_shipment.origin_state))
      AND LOWER(TRIM(rr.destination_state)) = LOWER(TRIM(v_shipment.destination_state))
      AND rr.available_capacity_kg          >= v_shipment.weight_kg
      AND v_shipment.required_date
          BETWEEN (rr.departure_date_from - INTERVAL '3 days')::date
          AND     (rr.departure_date_to   + INTERVAL '3 days')::date
      -- No re-matchear el mismo par
      AND NOT EXISTS (
        SELECT 1 FROM matches m
        WHERE m.shipment_id = p_shipment_id AND m.route_id = rr.id
      )
      -- El transportista no puede ser el mismo usuario que el embarcador
      AND cp.user_id != v_shipment.shipper_id
  LOOP
    -- ── Scoring (0–100 pts) ────────────────────────────────────────────────
    v_score := 0;

    -- Estado origen + destino ya coinciden (filtro duro) → 40 pts base
    v_score := v_score + 40;

    -- Bonus ciudad exacta (hasta 20 pts)
    IF LOWER(TRIM(v_route.origin_city))      = LOWER(TRIM(v_shipment.origin_city))      THEN v_score := v_score + 10; END IF;
    IF LOWER(TRIM(v_route.destination_city)) = LOWER(TRIM(v_shipment.destination_city)) THEN v_score := v_score + 10; END IF;

    -- Ajuste de fecha (30 pts)
    IF v_shipment.required_date
       BETWEEN v_route.departure_date_from AND v_route.departure_date_to THEN
      v_score := v_score + 30;   -- dentro de la ventana exacta
    ELSIF v_shipment.required_date
       BETWEEN (v_route.departure_date_from - INTERVAL '1 day')::date
       AND     (v_route.departure_date_to   + INTERVAL '1 day')::date THEN
      v_score := v_score + 20;   -- ±1 día
    ELSE
      v_score := v_score + 10;   -- ±3 días (ya filtrado arriba)
    END IF;

    -- Tipo de carga aceptada (10 pts)
    IF array_length(v_route.accepted_cargo_types, 1) IS NULL
       OR array_length(v_route.accepted_cargo_types, 1) = 0
       OR v_shipment.cargo_type = ANY(v_route.accepted_cargo_types) THEN
      v_score := v_score + 10;
    END IF;

    -- Umbral mínimo: descartar matches malos
    IF v_score < 50 THEN CONTINUE; END IF;

    -- ── Cálculo de precio ──────────────────────────────────────────────────
    -- Distancia: usar la de la ruta si existe, o default 600 km (promedio México)
    v_distance := CASE WHEN v_route.estimated_distance > 0
                       THEN v_route.estimated_distance
                       ELSE 600 END;

    IF v_route.price_per_km IS NOT NULL AND v_route.price_per_km > 0 THEN
      v_price := ROUND(v_distance * v_route.price_per_km, 2);
    ELSE
      -- Fallback de mercado: $3.50 MXN / km / tonelada (benchmark Canacar)
      v_price := ROUND(v_distance * GREATEST(v_shipment.weight_kg / 1000.0, 0.5) * 3.50, 2);
    END IF;

    v_earnings := ROUND(v_price * 0.95, 2);   -- transportista recibe 95%
    v_savings  := ROUND(v_price * 0.30, 2);   -- embarcador ahorra ~30% vs spot

    -- ── Insertar match ─────────────────────────────────────────────────────
    INSERT INTO matches (
      shipment_id, route_id, carrier_id, shipper_id,
      match_score, detour_km,
      estimated_price, carrier_earnings, shipper_savings,
      status, expires_at
    ) VALUES (
      p_shipment_id, v_route.id, v_route.carrier_id, v_shipment.shipper_id,
      v_score, 0,
      v_price, v_earnings, v_savings,
      'suggested', NOW() + INTERVAL '48 hours'
    )
    RETURNING id INTO v_match_id;

    -- ── Notificar al embarcador ────────────────────────────────────────────
    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (
      v_shipment.shipper_id,
      'match_found',
      '¡Encontramos un transportista compatible!',
      'Tu envío ' || v_shipment.origin_city || ' → ' || v_shipment.destination_city
        || ' tiene una coincidencia (score ' || v_score::integer || '/100).'
        || ' Precio estimado: $' || TO_CHAR(v_price, 'FM999,999') || ' MXN',
      '/app/embarcador/coincidencias/' || v_match_id::text
    );

    -- ── Notificar al transportista ─────────────────────────────────────────
    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (
      v_route.carrier_user_id,
      'match_found',
      'Carga disponible para tu ruta de retorno',
      v_shipment.weight_kg::integer || ' kg de ' || v_shipment.cargo_type
        || ' en ' || v_shipment.origin_city || ' → ' || v_shipment.destination_city
        || '. Ganancia estimada: $' || TO_CHAR(v_earnings, 'FM999,999') || ' MXN',
      '/app/transportista/coincidencias/' || v_match_id::text
    );

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;


-- ─── find_matches_for_route ───────────────────────────────────────────────────
-- Inverso: cuando un transportista publica una ruta nueva,
-- busca envíos publicados compatibles.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.find_matches_for_route(p_route_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_route     return_routes%ROWTYPE;
  v_carrier   carrier_profiles%ROWTYPE;
  v_shipment  RECORD;
  v_score     numeric(5,2);
  v_distance  numeric;
  v_price     numeric(12,2);
  v_earnings  numeric(12,2);
  v_savings   numeric(12,2);
  v_match_id  uuid;
  v_count     integer := 0;
BEGIN
  SELECT * INTO v_route
  FROM return_routes
  WHERE id = p_route_id AND status = 'published';

  IF NOT FOUND THEN RETURN 0; END IF;

  SELECT * INTO v_carrier
  FROM carrier_profiles
  WHERE id = v_route.carrier_id;

  FOR v_shipment IN
    SELECT * FROM shipment_requests
    WHERE status = 'published'
      AND LOWER(TRIM(origin_state))      = LOWER(TRIM(v_route.origin_state))
      AND LOWER(TRIM(destination_state)) = LOWER(TRIM(v_route.destination_state))
      AND weight_kg                      <= v_route.available_capacity_kg
      AND required_date
          BETWEEN (v_route.departure_date_from - INTERVAL '3 days')::date
          AND     (v_route.departure_date_to   + INTERVAL '3 days')::date
      AND shipper_id != v_carrier.user_id
      AND NOT EXISTS (
        SELECT 1 FROM matches m
        WHERE m.shipment_id = shipment_requests.id AND m.route_id = p_route_id
      )
  LOOP
    v_score := 40; -- estados ya coinciden

    IF LOWER(TRIM(v_route.origin_city))      = LOWER(TRIM(v_shipment.origin_city))      THEN v_score := v_score + 10; END IF;
    IF LOWER(TRIM(v_route.destination_city)) = LOWER(TRIM(v_shipment.destination_city)) THEN v_score := v_score + 10; END IF;

    IF v_shipment.required_date BETWEEN v_route.departure_date_from AND v_route.departure_date_to THEN
      v_score := v_score + 30;
    ELSIF v_shipment.required_date
       BETWEEN (v_route.departure_date_from - INTERVAL '1 day')::date
       AND     (v_route.departure_date_to   + INTERVAL '1 day')::date THEN
      v_score := v_score + 20;
    ELSE
      v_score := v_score + 10;
    END IF;

    IF array_length(v_route.accepted_cargo_types, 1) IS NULL
       OR array_length(v_route.accepted_cargo_types, 1) = 0
       OR v_shipment.cargo_type = ANY(v_route.accepted_cargo_types) THEN
      v_score := v_score + 10;
    END IF;

    IF v_score < 50 THEN CONTINUE; END IF;

    v_distance := CASE WHEN v_route.estimated_distance > 0 THEN v_route.estimated_distance ELSE 600 END;

    IF v_route.price_per_km IS NOT NULL AND v_route.price_per_km > 0 THEN
      v_price := ROUND(v_distance * v_route.price_per_km, 2);
    ELSE
      v_price := ROUND(v_distance * GREATEST(v_shipment.weight_kg / 1000.0, 0.5) * 3.50, 2);
    END IF;

    v_earnings := ROUND(v_price * 0.95, 2);
    v_savings  := ROUND(v_price * 0.30, 2);

    INSERT INTO matches (
      shipment_id, route_id, carrier_id, shipper_id,
      match_score, detour_km,
      estimated_price, carrier_earnings, shipper_savings,
      status, expires_at
    ) VALUES (
      v_shipment.id, p_route_id, v_route.carrier_id, v_shipment.shipper_id,
      v_score, 0,
      v_price, v_earnings, v_savings,
      'suggested', NOW() + INTERVAL '48 hours'
    )
    RETURNING id INTO v_match_id;

    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (
      v_shipment.shipper_id, 'match_found',
      '¡Encontramos un transportista compatible!',
      'Tu envío ' || v_shipment.origin_city || ' → ' || v_shipment.destination_city
        || ' tiene una coincidencia (score ' || v_score::integer || '/100).'
        || ' Precio estimado: $' || TO_CHAR(v_price, 'FM999,999') || ' MXN',
      '/app/embarcador/coincidencias/' || v_match_id::text
    );

    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (
      v_carrier.user_id, 'match_found',
      'Carga disponible para tu ruta de retorno',
      v_shipment.weight_kg::integer || ' kg de ' || v_shipment.cargo_type
        || ' en ' || v_shipment.origin_city || ' → ' || v_shipment.destination_city
        || '. Ganancia estimada: $' || TO_CHAR(v_earnings, 'FM999,999') || ' MXN',
      '/app/transportista/coincidencias/' || v_match_id::text
    );

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;


-- ─── Permisos ─────────────────────────────────────────────────────────────────
-- Permitir que usuarios autenticados llamen las funciones vía supabase.rpc()
GRANT EXECUTE ON FUNCTION public.find_matches_for_shipment(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_matches_for_route(uuid) TO authenticated;
