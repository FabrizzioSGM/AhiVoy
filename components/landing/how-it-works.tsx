"use client";

import { useEffect, useRef } from "react";

// ─── Step data ─────────────────────────────────────────────────────────────

const steps = [
  {
    id: 1,
    role: "Transportista",
    roleColor: "#0ea5e9",
    title: "El trailero publica su ruta",
    desc: "El transportista registra su ruta de retorno: origen, destino, fecha, tipo de unidad y capacidad disponible. En menos de 3 minutos.",
    visual: "route-publish",
  },
  {
    id: 2,
    role: "Embarcador",
    roleColor: "#8b5cf6",
    title: "El cliente publica su carga",
    desc: "La empresa describe su envío en lenguaje natural. ZzingRush extrae automáticamente peso, volumen, origen y destino.",
    visual: "cargo-publish",
  },
  {
    id: 3,
    role: "Inteligencia artificial",
    roleColor: "#f59e0b",
    title: "La IA calcula el desvío óptimo",
    desc: "El motor analiza si la carga cabe dentro del corredor de la ruta. Calcula kilómetros extra, tiempo y si el negocio sigue siendo rentable para ambos.",
    visual: "ai-map",
  },
  {
    id: 4,
    role: "Match",
    roleColor: "#10b981",
    title: "Se presenta el match con precio",
    desc: "El transportista recibe la propuesta con ganancia estimada. El embarcador ve el precio y el ahorro vs flete dedicado. Ambos confirman.",
    visual: "match",
  },
  {
    id: 5,
    role: "Escrow",
    roleColor: "#0ea5e9",
    title: "El escrow se activa",
    desc: "El embarcador deposita el monto en custodia. El transportista recibe confirmación de pago apartado antes de salir. Nadie trabaja a ciegas.",
    visual: "escrow",
  },
  {
    id: 6,
    role: "Completado",
    roleColor: "#10b981",
    title: "Entrega exitosa · pago liberado",
    desc: "GPS confirma llegada. El embarcador recibe evidencia fotográfica. El pago se libera en menos de 24 horas. Se genera el CFDI automáticamente.",
    visual: "complete",
  },
];

// ─── Visual panels ──────────────────────────────────────────────────────────

function VisualRoutePublish() {
  return (
    <div className="hiw-visual-inner">
      <div className="hiw-card" style={{ maxWidth: 320 }}>
        <div className="hiw-card-label" style={{ color: "#0ea5e9" }}>Nueva ruta de retorno</div>
        <div className="hiw-route-row">
          <div className="hiw-city">
            <div className="hiw-city-dot" style={{ background: "#0ea5e9" }} />
            <span>Monterrey</span>
          </div>
          <div className="hiw-route-line" />
          <div className="hiw-city">
            <div className="hiw-city-dot hiw-city-dot-outline" />
            <span>CDMX</span>
          </div>
        </div>
        <div className="hiw-meta-row">
          <div className="hiw-meta-item"><span className="hiw-meta-label">Unidad</span><span className="hiw-meta-val">Torton 48t</span></div>
          <div className="hiw-meta-item"><span className="hiw-meta-label">Capacidad</span><span className="hiw-meta-val">18 ton libres</span></div>
          <div className="hiw-meta-item"><span className="hiw-meta-label">Fecha</span><span className="hiw-meta-val">Lun 14 abr</span></div>
          <div className="hiw-meta-item"><span className="hiw-meta-label">Estado</span><span className="hiw-meta-val hiw-badge-blue">Publicado</span></div>
        </div>
      </div>
      <div className="hiw-truck-icon">🚛</div>
    </div>
  );
}

function VisualCargoPublish() {
  return (
    <div className="hiw-visual-inner">
      <div className="hiw-card" style={{ maxWidth: 320 }}>
        <div className="hiw-card-label" style={{ color: "#8b5cf6" }}>Nueva carga</div>
        <div className="hiw-ai-input">
          <span className="hiw-ai-cursor">"Necesito mover 8 toneladas de electrodomésticos de Monterrey a CDMX el lunes"</span>
        </div>
        <div className="hiw-extracted">
          <div className="hiw-extracted-title">Datos extraídos automáticamente</div>
          <div className="hiw-tags">
            <span className="hiw-tag">📦 8 toneladas</span>
            <span className="hiw-tag">📍 MTY → CDMX</span>
            <span className="hiw-tag">📅 Lun 14 abr</span>
            <span className="hiw-tag">🏷 Electrodomésticos</span>
          </div>
        </div>
      </div>
      <div className="hiw-box-icon">📦</div>
    </div>
  );
}

function VisualAiMap() {
  return (
    <div className="hiw-visual-inner">
      <div className="hiw-map-container">
        <svg viewBox="0 0 340 260" className="hiw-map-svg">
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e5e3" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="340" height="260" fill="#f7f7f5" rx="12" />
          <rect width="340" height="260" fill="url(#grid)" rx="12" />

          {/* Main route line (Monterrey → CDMX) */}
          <path
            d="M 60 60 C 90 80, 140 100, 170 130 C 200 160, 230 190, 260 210"
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            opacity="0.3"
          />

          {/* Detour line */}
          <path
            d="M 170 130 C 195 125, 218 115, 230 108 C 242 101, 248 95, 246 88"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            className="hiw-detour-path"
          />

          {/* Cities */}
          <circle cx="60" cy="60" r="7" fill="#0ea5e9" />
          <text x="72" y="64" fontSize="10" fontWeight="600" fill="#0a0a0a">Monterrey</text>

          <circle cx="260" cy="210" r="7" fill="#0a0a0a" />
          <text x="218" y="225" fontSize="10" fontWeight="600" fill="#0a0a0a">CDMX</text>

          {/* Pickup point */}
          <circle cx="246" cy="88" r="6" fill="#8b5cf6" />
          <text x="255" y="86" fontSize="9" fill="#8b5cf6" fontWeight="600">Recolección</text>
          <text x="255" y="97" fontSize="8" fill="#6b6b6b">+42 km</text>

          {/* Truck position */}
          <text x="148" y="115" fontSize="16">🚛</text>

          {/* Distance badge */}
          <rect x="8" y="190" width="120" height="52" rx="8" fill="white" stroke="#e5e5e3" strokeWidth="1" />
          <text x="18" y="208" fontSize="9" fill="#6b6b6b" fontWeight="600">DESVÍO CALCULADO</text>
          <text x="18" y="224" fontSize="15" fontWeight="800" fill="#f59e0b">+42 km</text>
          <text x="18" y="237" fontSize="9" fill="#6b6b6b">dentro del corredor</text>
        </svg>
      </div>
    </div>
  );
}

function VisualMatch() {
  return (
    <div className="hiw-visual-inner">
      <div className="hiw-card" style={{ maxWidth: 340 }}>
        <div className="hiw-match-header">
          <div className="hiw-match-badge">✦ Match encontrado</div>
        </div>
        <div className="hiw-match-route">
          <span className="hiw-match-city">MTY</span>
          <span className="hiw-match-arrow">→</span>
          <span className="hiw-match-city">CDMX</span>
        </div>
        <div className="hiw-match-profiles">
          <div className="hiw-profile">
            <div className="hiw-avatar" style={{ background: "#0ea5e9" }}>CR</div>
            <div>
              <div className="hiw-profile-name">Carlos R. — Torton 48t</div>
              <div className="hiw-profile-meta">⭐ 4.9 · 148 viajes</div>
            </div>
          </div>
        </div>
        <div className="hiw-price-row">
          <div className="hiw-price-item">
            <span className="hiw-price-label">Precio acordado</span>
            <span className="hiw-price-val">$9,200 MXN</span>
          </div>
          <div className="hiw-price-item">
            <span className="hiw-price-label">Ahorro vs dedicado</span>
            <span className="hiw-price-val" style={{ color: "#10b981" }}>−38%</span>
          </div>
        </div>
        <div className="hiw-confirm-bar">
          <div className="hiw-confirm-btn hiw-confirm-shipper">Embarcador ✓</div>
          <div className="hiw-confirm-btn hiw-confirm-carrier">Transportista ✓</div>
        </div>
      </div>
    </div>
  );
}

function VisualEscrow() {
  return (
    <div className="hiw-visual-inner">
      <div className="hiw-card" style={{ maxWidth: 320 }}>
        <div className="hiw-escrow-icon">🔒</div>
        <div className="hiw-escrow-title">Pago en custodia activado</div>
        <div className="hiw-escrow-amount">$9,200 MXN</div>
        <div className="hiw-escrow-status">
          <div className="hiw-escrow-row">
            <span>Depositado por</span>
            <strong>Grupo BIMSA</strong>
          </div>
          <div className="hiw-escrow-row">
            <span>Retenido hasta</span>
            <strong>Entrega confirmada</strong>
          </div>
          <div className="hiw-escrow-row">
            <span>Estado</span>
            <strong className="hiw-badge-green">En custodia ✓</strong>
          </div>
        </div>
        <div className="hiw-notice">
          El transportista recibió confirmación de fondos apartados. Puede salir.
        </div>
      </div>
    </div>
  );
}

function VisualComplete() {
  return (
    <div className="hiw-visual-inner">
      <div className="hiw-card hiw-card-success" style={{ maxWidth: 320 }}>
        <div className="hiw-success-check">✓</div>
        <div className="hiw-success-title">Entrega completada</div>
        <div className="hiw-success-rows">
          <div className="hiw-success-row">
            <span>📍 GPS confirmó llegada</span>
            <span className="hiw-badge-green">✓</span>
          </div>
          <div className="hiw-success-row">
            <span>📸 Evidencia fotográfica</span>
            <span className="hiw-badge-green">✓</span>
          </div>
          <div className="hiw-success-row">
            <span>💳 Pago liberado</span>
            <span className="hiw-badge-green">$9,200</span>
          </div>
          <div className="hiw-success-row">
            <span>📄 CFDI generado</span>
            <span className="hiw-badge-green">✓</span>
          </div>
        </div>
        <div className="hiw-rating-row">
          <span>Calificación:</span>
          <span style={{ color: "#f59e0b", fontWeight: 700 }}>★★★★★</span>
        </div>
      </div>
    </div>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  "route-publish": <VisualRoutePublish />,
  "cargo-publish": <VisualCargoPublish />,
  "ai-map": <VisualAiMap />,
  "match": <VisualMatch />,
  "escrow": <VisualEscrow />,
  "complete": <VisualComplete />,
};

// ─── Main component ─────────────────────────────────────────────────────────

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const activeVisualRef = useRef<string>("route-publish");
  const visualPanelsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    let ctx: any;
    let mm: any;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        mm = gsap.matchMedia();

        // Desktop only: sticky visual transitions
        mm.add("(min-width: 900px)", () => {
          steps.forEach((step, i) => {
            const stepEl = document.querySelector(`[data-step="${step.id}"]`);
            const panelEl = visualPanelsRef.current.get(step.visual);
            if (!stepEl || !panelEl) return;

            ScrollTrigger.create({
              trigger: stepEl,
              start: "top 55%",
              end: "bottom 45%",
              onEnter: () => activateStep(step.visual, step.id, gsap),
              onEnterBack: () => activateStep(step.visual, step.id, gsap),
            });
          });

          // Initial state: show first visual
          const firstPanel = visualPanelsRef.current.get("route-publish");
          if (firstPanel) {
            gsap.set(firstPanel, { opacity: 1, y: 0 });
          }
          // Hide others
          steps.slice(1).forEach(step => {
            const panel = visualPanelsRef.current.get(step.visual);
            if (panel) gsap.set(panel, { opacity: 0, y: 20 });
          });
        });

        // Mobile: animate each step card in on scroll
        mm.add("(max-width: 899px)", () => {
          document.querySelectorAll("[data-step]").forEach((el) => {
            gsap.fromTo(el,
              { opacity: 0, y: 32 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 82%",
                  toggleActions: "play none none none",
                },
              }
            );
          });
        });

        // Step number progress
        document.querySelectorAll("[data-step]").forEach((el, i) => {
          const numEl = el.querySelector(".hiw-step-num");
          if (!numEl) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            onEnter: () => numEl.classList.add("hiw-step-num-active"),
            onLeaveBack: () => numEl.classList.remove("hiw-step-num-active"),
          });
        });

      }, sectionRef);
    })();

    function activateStep(visual: string, id: number, gsap: any) {
      const prev = visualPanelsRef.current.get(activeVisualRef.current);
      const next = visualPanelsRef.current.get(visual);
      if (!next || visual === activeVisualRef.current) return;

      if (prev) {
        gsap.to(prev, { opacity: 0, y: -16, duration: 0.3, ease: "power2.in" });
      }
      gsap.fromTo(next,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.1 }
      );
      activeVisualRef.current = visual;

      // Highlight step number
      document.querySelectorAll(".hiw-step-num").forEach(el => el.classList.remove("hiw-step-num-active"));
      const activeNum = document.querySelector(`[data-step="${id}"] .hiw-step-num`);
      if (activeNum) activeNum.classList.add("hiw-step-num-active");
    }

    return () => {
      ctx?.revert();
      mm?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hiw-section">
      <style>{CSS}</style>

      {/* Section header */}
      <div className="hiw-header">
        <div className="hiw-label">Proceso completo</div>
        <h2 className="hiw-title">Cómo funciona ZzingRush.</h2>
        <p className="hiw-subtitle">
          Desde que el trailero publica su ruta hasta que cobra — 6 pasos,
          completamente trazables y protegidos.
        </p>
      </div>

      {/* Scroll-driven layout */}
      <div className="hiw-layout">

        {/* Left: steps */}
        <div ref={stepsRef} className="hiw-steps-col">
          {steps.map((step) => (
            <div
              key={step.id}
              data-step={step.id}
              className="hiw-step"
            >
              <div className="hiw-step-left">
                <div className="hiw-step-num">{String(step.id).padStart(2, "0")}</div>
                <div className="hiw-step-line" />
              </div>
              <div className="hiw-step-body">
                <span className="hiw-step-role" style={{ color: step.roleColor }}>
                  {step.role}
                </span>
                <h3 className="hiw-step-title">{step.title}</h3>
                <p className="hiw-step-desc">{step.desc}</p>

                {/* Mobile: inline visual */}
                <div className="hiw-mobile-visual">
                  {VISUALS[step.visual]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: sticky visual (desktop only) */}
        <div className="hiw-sticky-col">
          <div ref={visualRef} className="hiw-sticky-panel">
            {steps.map((step) => (
              <div
                key={step.visual}
                ref={(el) => {
                  if (el) visualPanelsRef.current.set(step.visual, el);
                }}
                className="hiw-panel"
              >
                {VISUALS[step.visual]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Scoped CSS ─────────────────────────────────────────────────────────────

const CSS = `
/* Section */
.hiw-section {
  padding: 96px 0;
  border-bottom: 1px solid #e5e5e3;
  overflow: hidden;
}
.hiw-header {
  padding: 0 5vw 64px;
}
.hiw-label {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b6b6b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.hiw-label::before {
  content: '';
  width: 24px;
  height: 1.5px;
  background: #0ea5e9;
  display: block;
}
.hiw-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0 0 16px;
  color: #0a0a0a;
}
.hiw-subtitle {
  font-size: 17px;
  color: #6b6b6b;
  max-width: 520px;
  line-height: 1.6;
}

/* Layout */
.hiw-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  align-items: start;
  padding: 0 5vw;
}
@media (max-width: 899px) {
  .hiw-layout { grid-template-columns: 1fr; }
  .hiw-sticky-col { display: none; }
  .hiw-mobile-visual { display: block !important; }
}

/* Steps column */
.hiw-steps-col {
  padding-right: 48px;
}
@media (max-width: 899px) {
  .hiw-steps-col { padding-right: 0; }
}

.hiw-step {
  display: flex;
  gap: 20px;
  padding-bottom: 72px;
  min-height: 200px;
}
.hiw-step-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}
.hiw-step-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid #e5e5e3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #b0b0b0;
  background: #fff;
  transition: all 0.3s ease;
  flex-shrink: 0;
}
.hiw-step-num.hiw-step-num-active {
  border-color: #0ea5e9;
  color: #0ea5e9;
  background: #e0f2fe;
}
.hiw-step-line {
  width: 1.5px;
  flex: 1;
  background: #e5e5e3;
  margin-top: 8px;
  min-height: 60px;
}
.hiw-step:last-child .hiw-step-line { display: none; }
.hiw-step-body {
  padding-top: 8px;
  flex: 1;
}
.hiw-step-role {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
}
.hiw-step-title {
  font-size: clamp(18px, 2.2vw, 22px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  color: #0a0a0a;
  line-height: 1.2;
}
.hiw-step-desc {
  font-size: 15px;
  color: #6b6b6b;
  line-height: 1.6;
  margin: 0;
  max-width: 400px;
}

/* Mobile visual */
.hiw-mobile-visual {
  display: none;
  margin-top: 24px;
}

/* Sticky column */
.hiw-sticky-col {
  position: sticky;
  top: 96px;
  height: calc(100vh - 192px);
  max-height: 620px;
}
.hiw-sticky-panel {
  position: relative;
  width: 100%;
  height: 100%;
}
.hiw-panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.hiw-panel:first-child {
  opacity: 1;
}
.hiw-panel:not(:first-child) {
  opacity: 0;
}

/* ─── Visual components ──── */
.hiw-visual-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 8px;
}
.hiw-card {
  background: #fff;
  border: 1px solid #e5e5e3;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  box-shadow: 0 2px 24px rgba(0,0,0,0.06);
}
.hiw-card-success {
  border-color: #bbf7d0;
  background: #f0fdf4;
}
.hiw-card-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 16px;
}

/* Route row */
.hiw-route-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.hiw-city {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
}
.hiw-city-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.hiw-city-dot-outline {
  background: transparent;
  border: 2.5px solid #0a0a0a;
}
.hiw-route-line {
  flex: 1;
  height: 1.5px;
  background: #e5e5e3;
}
.hiw-meta-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.hiw-meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hiw-meta-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #b0b0b0;
  font-weight: 600;
}
.hiw-meta-val {
  font-size: 13px;
  font-weight: 600;
  color: #0a0a0a;
}
.hiw-truck-icon, .hiw-box-icon {
  font-size: 36px;
  opacity: 0.15;
}

/* Cargo publish */
.hiw-ai-input {
  background: #f7f7f5;
  border: 1px solid #e5e5e3;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.5;
  margin-bottom: 14px;
  font-style: italic;
}
.hiw-extracted-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #b0b0b0;
  font-weight: 600;
  margin-bottom: 8px;
}
.hiw-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.hiw-tag {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0284c7;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 9999px;
}

/* Map */
.hiw-map-container {
  width: 100%;
  max-width: 360px;
}
.hiw-map-svg {
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid #e5e5e3;
}
.hiw-detour-path {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawDetour 1.2s ease-out 0.4s forwards;
}
@keyframes drawDetour {
  to { stroke-dashoffset: 0; }
}

/* Match */
.hiw-match-header {
  margin-bottom: 14px;
}
.hiw-match-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 9999px;
}
.hiw-match-route {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 14px;
}
.hiw-match-arrow { color: #b0b0b0; font-weight: 400; }
.hiw-match-profiles { margin-bottom: 14px; }
.hiw-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hiw-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.hiw-profile-name { font-size: 13px; font-weight: 600; }
.hiw-profile-meta { font-size: 12px; color: #6b6b6b; }
.hiw-price-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 14px 0;
  border-top: 1px solid #e5e5e3;
  margin-bottom: 14px;
}
.hiw-price-item { display: flex; flex-direction: column; gap: 3px; }
.hiw-price-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #b0b0b0; font-weight: 600; }
.hiw-price-val { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; color: #0a0a0a; }
.hiw-confirm-bar {
  display: flex;
  gap: 8px;
}
.hiw-confirm-btn {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
}
.hiw-confirm-shipper { background: #e0f2fe; color: #0284c7; }
.hiw-confirm-carrier { background: #f0fdf4; color: #16a34a; }

/* Escrow */
.hiw-escrow-icon { font-size: 32px; margin-bottom: 8px; }
.hiw-escrow-title { font-size: 14px; font-weight: 700; color: #0a0a0a; margin-bottom: 6px; }
.hiw-escrow-amount { font-size: 32px; font-weight: 800; letter-spacing: -0.03em; color: #0ea5e9; margin-bottom: 16px; }
.hiw-escrow-status { display: flex; flex-direction: column; gap: 0; }
.hiw-escrow-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 10px 0;
  border-top: 1px solid #e5e5e3;
  color: #6b6b6b;
}
.hiw-notice {
  margin-top: 14px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: #0284c7;
  line-height: 1.5;
}

/* Complete */
.hiw-success-check {
  width: 48px;
  height: 48px;
  background: #16a34a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
}
.hiw-success-title { font-size: 18px; font-weight: 800; color: #0a0a0a; margin-bottom: 16px; }
.hiw-success-rows { display: flex; flex-direction: column; gap: 0; }
.hiw-success-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 10px 0;
  border-top: 1px solid #dcfce7;
  color: #0a0a0a;
}
.hiw-rating-row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: #6b6b6b;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #dcfce7;
}

/* Badges */
.hiw-badge-blue { color: #0284c7; font-weight: 700; }
.hiw-badge-green { color: #16a34a; font-weight: 700; }
`;
