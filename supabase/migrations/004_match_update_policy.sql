-- ═══════════════════════════════════════════════════════════════════════════
-- Migración 004 — Política RLS para que las partes actualicen el status del match
-- ═══════════════════════════════════════════════════════════════════════════
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Permite al embarcador y al transportista actualizar el status de sus matches
-- (aceptar, rechazar, marcar como visto, etc.)
CREATE POLICY "Involved parties update their matches" ON public.matches
  FOR UPDATE USING (
    auth.uid() = shipper_id OR
    EXISTS (
      SELECT 1 FROM public.carrier_profiles cp
      WHERE cp.id = matches.carrier_id AND cp.user_id = auth.uid()
    )
  );
