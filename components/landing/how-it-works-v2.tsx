"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "embarcador" | "transportista";

// ─── Step data ───────────────────────────────────────────────────────────────

const STEPS: Record<Tab, { title: string; desc: string }[]> = {
  embarcador: [
    {
      title: "Describe tu carga",
      desc: "Dile al chatbot qué necesitas mover: tipo de mercancía, peso, dimensiones, origen y destino. Sin formularios, solo conversa.",
    },
    {
      title: "Sube evidencia de tu carga",
      desc: "Toma fotos de tu mercancía y documentos de embarque. Esto protege a ambas partes y agiliza la verificación.",
    },
    {
      title: "Define horarios de carga",
      desc: "Indica los horarios disponibles para cargar en tu almacén o planta. La IA solo mostrará matches compatibles con tu ventana operativa.",
    },
    {
      title: "Verifica tu empresa",
      desc: "Registra RFC, constancia fiscal y datos de tu empresa. Esto te protege de transportistas no verificados y les da confianza de que el pago está garantizado.",
    },
    {
      title: "Revisa opciones y precio",
      desc: "La IA te presenta transportistas verificados con precio, ahorro vs flete dedicado, calificación y tiempo estimado. Tú eliges.",
    },
    {
      title: "Confirma y rastrea",
      desc: "Tu pago queda en custodia (escrow). Rastrea tu carga en tiempo real por GPS. Al confirmar entrega, el pago se libera automáticamente con CFDI.",
    },
  ],
  transportista: [
    {
      title: "Registra tu documentación",
      desc: "Sube tu licencia federal, permisos SCT, póliza de seguro y tarjeta de circulación. La IA verifica todo automáticamente.",
    },
    {
      title: "Registra tu unidad",
      desc: "Agrega los datos de tu tráiler: placas, número de serie, tipo de caja, capacidad máxima y fotos del vehículo.",
    },
    {
      title: "Publica tu ruta de retorno",
      desc: "Dile al chatbot: 'Voy de regreso a CDMX desde Michigan, salgo mañana a las 6am'. La IA extrae todo automáticamente.",
    },
    {
      title: "Explora oportunidades",
      desc: "Recibe notificaciones de cargas compatibles con tu ruta. Ve el desvío en km, la ganancia neta y la calificación del cliente.",
    },
    {
      title: "Acepta y recoge",
      desc: "Acepta la carga con un tap. La IA te muestra la ruta optimizada con el punto de recogida. El pago ya está en custodia antes de que salgas.",
    },
    {
      title: "Entrega y cobra",
      desc: "Confirma la entrega con foto de evidencia. El pago se libera en menos de 24 horas. Tu calificación sube y desbloqueas cargas de mayor valor.",
    },
  ],
};

// ─── Visual Components ───────────────────────────────────────────────────────

function VE1() {
  return (
    <div className="hiw-v">
      <div className="hiw-chat-win">
        <div className="hiw-chat-bar">
          <span className="hiw-chat-dot" style={{ background: "#ef4444" }} />
          <span className="hiw-chat-dot" style={{ background: "#f59e0b" }} />
          <span className="hiw-chat-dot" style={{ background: "#22c55e" }} />
          <span className="hiw-chat-title">ZzingRush AI</span>
        </div>
        <div className="hiw-chat-body">
          <div className="hiw-msg hiw-msg-user">
            "Necesito mover 8 tons de autopartes de Michigan a Saltillo el jueves"
          </div>
          <div className="hiw-msg hiw-msg-ai">
            <div className="hiw-ai-label">Datos extraídos ✓</div>
            <div className="hiw-ai-tags">
              <span className="hiw-tag-blue">📦 8 toneladas</span>
              <span className="hiw-tag-blue">🔩 Autopartes</span>
              <span className="hiw-tag-blue">📍 Michigan → Saltillo</span>
              <span className="hiw-tag-blue">📅 Jueves</span>
            </div>
            <div className="hiw-ai-cta">Buscando transportistas disponibles…</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VE2() {
  return (
    <div className="hiw-v">
      <div className="hiw-card-white">
        <div className="hiw-card-label-sm">Evidencia de carga</div>
        <div className="hiw-photo-grid">
          {["📦", "📋", "🔩", "📄"].map((icon, i) => (
            <div key={i} className="hiw-photo-thumb">
              <span className="hiw-photo-icon">{icon}</span>
              <span className="hiw-photo-check">✓</span>
            </div>
          ))}
        </div>
        <div className="hiw-verified-bar">
          <span className="hiw-badge-green-lg">✓ Evidencia verificada</span>
          <span className="hiw-meta-sm">4 archivos · 12.4 MB</span>
        </div>
        <div className="hiw-doc-row">
          <span>📋</span>
          <span>Carta porte — adjunta</span>
          <span className="hiw-badge-green-sm">✓</span>
        </div>
        <div className="hiw-doc-row">
          <span>📄</span>
          <span>Factura comercial</span>
          <span className="hiw-badge-green-sm">✓</span>
        </div>
      </div>
    </div>
  );
}

function VE3() {
  return (
    <div className="hiw-v">
      <div className="hiw-card-white">
        <div className="hiw-card-label-sm">Ventana operativa de carga</div>
        <div className="hiw-cal-header">
          <span className="hiw-cal-month">Abril 2025</span>
        </div>
        <div className="hiw-cal-days">
          {["L", "M", "X", "J", "V", "S", "D"].map(d => (
            <div key={d} className="hiw-cal-day-label">{d}</div>
          ))}
          {[7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(d => (
            <div key={d} className={`hiw-cal-day ${d === 14 ? "hiw-cal-active" : ""} ${d === 15 || d === 16 ? "hiw-cal-range" : ""}`}>{d}</div>
          ))}
        </div>
        <div className="hiw-time-slot">
          <span className="hiw-time-icon">🏭</span>
          <div>
            <div className="hiw-time-label">Lunes 14 abr</div>
            <div className="hiw-time-range">8:00 am — 2:00 pm</div>
          </div>
          <span className="hiw-badge-blue-sm">Seleccionado</span>
        </div>
      </div>
    </div>
  );
}

function VE4() {
  const items = [
    { label: "RFC validado", done: true },
    { label: "Constancia fiscal", done: true },
    { label: "Datos de contacto", done: true },
    { label: "Correo empresarial", done: true },
  ];
  return (
    <div className="hiw-v">
      <div className="hiw-card-white">
        <div className="hiw-card-label-sm">Verificación de empresa</div>
        <div className="hiw-checklist">
          {items.map(({ label, done }) => (
            <div key={label} className={`hiw-check-row ${done ? "done" : ""}`}>
              <div className={`hiw-check-circle ${done ? "done" : ""}`}>{done ? "✓" : ""}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="hiw-verified-badge-big">
          <span>🏢</span>
          <div>
            <div className="hiw-vbig-title">Empresa verificada</div>
            <div className="hiw-vbig-sub">Grupo BIMSA · RFC: GBI950101XXX</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VE5() {
  const options = [
    { name: "Trans Noreste", stars: 4.9, trips: 148, price: "$18,200", saving: "−38%", eta: "14 h" },
    { name: "Fletes García", stars: 4.7, trips: 92, price: "$19,500", saving: "−34%", eta: "15 h" },
  ];
  return (
    <div className="hiw-v">
      <div className="hiw-options-list">
        {options.map((o, i) => (
          <div key={i} className={`hiw-option-card ${i === 0 ? "selected" : ""}`}>
            <div className="hiw-option-top">
              <div>
                <div className="hiw-option-name">{o.name}</div>
                <div className="hiw-option-meta">{"★".repeat(Math.floor(o.stars))} {o.stars} · {o.trips} viajes</div>
              </div>
              <div className="hiw-option-price">
                <div className="hiw-option-price-val">{o.price}</div>
                <div className="hiw-option-saving">{o.saving} vs dedicado</div>
              </div>
            </div>
            <div className="hiw-option-footer">
              <span>⏱ ETA {o.eta}</span>
              <span className="hiw-badge-green-sm">✓ Verificado</span>
              {i === 0 && <span className="hiw-badge-blue-sm">Mejor opción</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VE6() {
  return (
    <div className="hiw-v">
      <div className="hiw-card-white">
        <div className="hiw-map-mini">
          <svg viewBox="0 0 300 180" style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}>
            <rect width="300" height="180" fill="#f7f7f5" />
            <defs>
              <pattern id="g2" width="18" height="18" patternUnits="userSpaceOnUse">
                <path d="M18 0L0 0 0 18" fill="none" stroke="#e5e5e3" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="300" height="180" fill="url(#g2)" />
            <path d="M40 140 C 80 120, 140 100, 180 80 C 220 60, 250 50, 270 40" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="5 3" />
            <circle cx="40" cy="140" r="6" fill="#10b981" />
            <circle cx="270" cy="40" r="6" fill="#0ea5e9" />
            <circle cx="160" cy="90" r="5" fill="#f59e0b" />
            <text x="162" y="87" fontSize="8" fill="#f59e0b">🚛</text>
          </svg>
        </div>
        <div className="hiw-escrow-row-v">
          <div className="hiw-escrow-badge">🔒 Pago en custodia — $18,200 MXN</div>
        </div>
        <div className="hiw-deliver-row">
          <span className="hiw-badge-green-lg">✓ Entrega confirmada</span>
          <span className="hiw-badge-blue-sm">CFDI emitido</span>
        </div>
      </div>
    </div>
  );
}

// ── Transportista visuals ────────────────────────────────────────────────────

function VT1() {
  const docs = [
    { label: "Licencia federal", icon: "🪪" },
    { label: "Permiso SCT", icon: "📋" },
    { label: "Póliza de seguro", icon: "🛡️" },
    { label: "Tarjeta de circulación", icon: "🚛" },
  ];
  return (
    <div className="hiw-v">
      <div className="hiw-card-white">
        <div className="hiw-card-label-sm">Documentación del operador</div>
        <div className="hiw-doc-list">
          {docs.map(({ label, icon }) => (
            <div key={label} className="hiw-doc-item">
              <span className="hiw-doc-icon">{icon}</span>
              <span className="hiw-doc-label">{label}</span>
              <span className="hiw-badge-green-sm">✓</span>
            </div>
          ))}
        </div>
        <div className="hiw-verified-badge-big" style={{ borderColor: "#bbf7d0", background: "#f0fdf4" }}>
          <span>⭐</span>
          <div>
            <div className="hiw-vbig-title">Transportista Verificado</div>
            <div className="hiw-vbig-sub">Nivel de confianza: Elite</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VT2() {
  return (
    <div className="hiw-v">
      <div className="hiw-card-white">
        <div className="hiw-card-label-sm">Mi unidad</div>
        <div className="hiw-truck-diag">
          <div className="hiw-truck-svg">🚛</div>
          <div className="hiw-truck-labels">
            <div className="hiw-tlabel hiw-tlabel-1">
              <span className="hiw-tlabel-key">Tipo</span>
              <span className="hiw-tlabel-val">Caja seca 53'</span>
            </div>
            <div className="hiw-tlabel hiw-tlabel-2">
              <span className="hiw-tlabel-key">Capacidad</span>
              <span className="hiw-tlabel-val">20 toneladas</span>
            </div>
            <div className="hiw-tlabel hiw-tlabel-3">
              <span className="hiw-tlabel-key">Placas</span>
              <span className="hiw-tlabel-val">BTZ-94-52</span>
            </div>
          </div>
        </div>
        <div className="hiw-doc-row">
          <span>📸</span>
          <span>Foto verificada con geolocalización</span>
          <span className="hiw-badge-green-sm">✓</span>
        </div>
      </div>
    </div>
  );
}

function VT3() {
  return (
    <div className="hiw-v">
      <div className="hiw-chat-win">
        <div className="hiw-chat-bar">
          <span className="hiw-chat-dot" style={{ background: "#ef4444" }} />
          <span className="hiw-chat-dot" style={{ background: "#f59e0b" }} />
          <span className="hiw-chat-dot" style={{ background: "#22c55e" }} />
          <span className="hiw-chat-title">ZzingRush AI</span>
        </div>
        <div className="hiw-chat-body">
          <div className="hiw-msg hiw-msg-user">
            "Voy de regreso a CDMX desde Michigan, salgo mañana a las 6am, llevo 12 tons libres"
          </div>
          <div className="hiw-msg hiw-msg-ai">
            <div className="hiw-ai-label">Ruta publicada ✓</div>
            <div className="hiw-ai-tags">
              <span className="hiw-tag-blue">🗺 Michigan → CDMX</span>
              <span className="hiw-tag-blue">⚖️ 12 ton disponibles</span>
              <span className="hiw-tag-blue">🕕 Mar 6:00 am</span>
            </div>
            <div className="hiw-ai-cta">Buscando cargas compatibles…</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VT4() {
  const opps = [
    { cargo: "8 ton autopartes", dest: "Saltillo", detour: "+45 min", gain: "+$15,500 MXN", rating: "4.8" },
    { cargo: "3 ton electrodomésticos", dest: "Monterrey", detour: "+20 min", gain: "+$8,200 MXN", rating: "4.6" },
  ];
  return (
    <div className="hiw-v">
      <div className="hiw-options-list">
        <div className="hiw-card-label-sm" style={{ marginBottom: 10 }}>Oportunidades en tu ruta</div>
        {opps.map((o, i) => (
          <div key={i} className={`hiw-option-card ${i === 0 ? "selected" : ""}`}>
            <div className="hiw-option-top">
              <div>
                <div className="hiw-option-name">{o.cargo}</div>
                <div className="hiw-option-meta">📍 {o.dest} · desvío {o.detour}</div>
              </div>
              <div className="hiw-option-price">
                <div className="hiw-option-price-val" style={{ color: "#16a34a" }}>{o.gain}</div>
                <div className="hiw-option-saving">ganancia neta</div>
              </div>
            </div>
            <div className="hiw-option-footer">
              <span>⭐ Cliente {o.rating}</span>
              <span className="hiw-badge-green-sm">✓ Empresa verificada</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VT5() {
  return (
    <div className="hiw-v">
      <div className="hiw-card-white">
        <div className="hiw-card-label-sm">Ruta optimizada</div>
        <div className="hiw-map-mini">
          <svg viewBox="0 0 300 180" style={{ width: "100%", borderRadius: 10, overflow: "hidden" }}>
            <rect width="300" height="180" fill="#f7f7f5" />
            <defs>
              <pattern id="g3" width="18" height="18" patternUnits="userSpaceOnUse">
                <path d="M18 0L0 0 0 18" fill="none" stroke="#e5e5e3" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="300" height="180" fill="url(#g3)" />
            {/* Original route */}
            <path d="M40 40 C 100 60, 180 90, 260 140" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="6 4" />
            {/* Detour route */}
            <path d="M40 40 C 80 50, 120 60, 150 65 C 170 68, 185 62, 190 52" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
            <path d="M190 52 C 210 45, 230 60, 260 140" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
            {/* Pickup */}
            <circle cx="190" cy="52" r="7" fill="#8b5cf6" />
            <text x="196" y="48" fontSize="8" fill="#8b5cf6" fontWeight="600">Recogida</text>
            <circle cx="40" cy="40" r="5" fill="#0ea5e9" />
            <circle cx="260" cy="140" r="5" fill="#0a0a0a" />
          </svg>
        </div>
        <div className="hiw-escrow-row-v">
          <div className="hiw-escrow-badge" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#16a34a" }}>
            ✓ Pago garantizado en custodia
          </div>
        </div>
      </div>
    </div>
  );
}

function VT6() {
  return (
    <div className="hiw-v">
      <div className="hiw-card-white">
        <div className="hiw-delivery-check">
          <div className="hiw-deliver-icon">✓</div>
          <div>
            <div className="hiw-vbig-title">Entrega confirmada</div>
            <div className="hiw-vbig-sub">Foto + GPS verificados</div>
          </div>
        </div>
        <div className="hiw-payment-release">
          <div className="hiw-pay-label">Pago liberado a tu cuenta</div>
          <div className="hiw-pay-amount">$18,200 MXN</div>
          <div className="hiw-pay-sub">en &lt; 24 horas</div>
        </div>
        <div className="hiw-level-bar">
          <div className="hiw-level-label">
            <span>Tu nivel</span>
            <span style={{ color: "#0ea5e9", fontWeight: 700 }}>Nivel 3 — Elite</span>
          </div>
          <div className="hiw-level-track">
            <div className="hiw-level-fill" style={{ width: "72%" }} />
          </div>
          <div className="hiw-level-sub">Desbloqueas cargas de mayor valor</div>
        </div>
      </div>
    </div>
  );
}

// ─── Visual map ───────────────────────────────────────────────────────────────

const VISUALS: Record<Tab, React.ReactNode[]> = {
  embarcador: [<VE1 key="e1" />, <VE2 key="e2" />, <VE3 key="e3" />, <VE4 key="e4" />, <VE5 key="e5" />, <VE6 key="e6" />],
  transportista: [<VT1 key="t1" />, <VT2 key="t2" />, <VT3 key="t3" />, <VT4 key="t4" />, <VT5 key="t5" />, <VT6 key="t6" />],
};

// ─── Main component ───────────────────────────────────────────────────────────

export function HowItWorksV2() {
  const [activeTab, setActiveTab] = useState<Tab>("embarcador");
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<any[]>([]);

  const steps = STEPS[activeTab];
  const visuals = VISUALS[activeTab];

  // Set up GSAP ScrollTrigger on each tab change
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // Kill previous triggers
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];

      const stepEls = document.querySelectorAll<HTMLElement>(`[data-hiw-step]`);
      stepEls.forEach((el, i) => {
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 38%",
          onEnter: () => setActiveStep(i),
          onEnterBack: () => setActiveStep(i),
        });
        triggersRef.current.push(trigger);
      });

      // Animate step text in
      gsap.fromTo(stepEls, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out",
        clearProps: "transform",
      });
    }, 80);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
    };
  }, [activeTab]);

  // Reduced motion
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  function handleTabChange(tab: Tab) {
    if (tab === activeTab) return;
    setActiveStep(0);
    setActiveTab(tab);
    sectionRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }

  return (
    <section ref={sectionRef} className="hiw2-section">
      <style>{SCOPED_CSS}</style>

      {/* ── Sticky toggle ── */}
      <div className="hiw2-sticky-tabs">
        <div className="hiw2-tabs-inner">
          <div className="hiw2-tabs-label">¿Eres…</div>
          <div className="hiw2-tabs-toggle">
            <button
              className={`hiw2-tab ${activeTab === "embarcador" ? "active" : ""}`}
              onClick={() => handleTabChange("embarcador")}
            >
              📦 Embarcador
            </button>
            <button
              className={`hiw2-tab ${activeTab === "transportista" ? "active" : ""}`}
              onClick={() => handleTabChange("transportista")}
            >
              🚛 Transportista
            </button>
          </div>
          <div className="hiw2-progress-text">
            Paso {activeStep + 1} / {steps.length}
          </div>
        </div>
      </div>

      {/* ── Section header ── */}
      <div className="hiw2-header">
        <div className="hiw2-eyebrow">Proceso completo</div>
        <h2 className="hiw2-title">Cómo funciona ZzingRush.</h2>
        <p className="hiw2-subtitle">
          {activeTab === "embarcador"
            ? "Desde que describes tu carga hasta que confirmas la entrega — 6 pasos, con pago garantizado en cada uno."
            : "Desde que registras tu unidad hasta que cobras — 6 pasos, con pagos garantizados y rutas optimizadas."}
        </p>
      </div>

      {/* ── Main layout ── */}
      <div className="hiw2-layout">
        {/* Left: scrollable steps */}
        <div className="hiw2-steps-col">
          {steps.map((step, i) => (
            <div
              key={`${activeTab}-${i}`}
              data-hiw-step={i}
              className={`hiw2-step ${activeStep === i ? "active" : ""}`}
              onClick={() => setActiveStep(i)}
            >
              <div className="hiw2-step-left">
                <div className={`hiw2-step-num ${activeStep === i ? "active" : ""}`}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                {i < steps.length - 1 && (
                  <div className={`hiw2-step-line ${activeStep > i ? "done" : ""}`} />
                )}
              </div>
              <div className="hiw2-step-body">
                <h3 className="hiw2-step-title">{step.title}</h3>
                <p className="hiw2-step-desc">{step.desc}</p>
                {/* Mobile: inline visual */}
                <div className="hiw2-mobile-visual">
                  {visuals[i]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: sticky visual */}
        <div className="hiw2-visual-col">
          <div className="hiw2-visual-stage">
            {visuals.map((visual, i) => (
              <div
                key={`${activeTab}-v${i}`}
                className={`hiw2-visual-panel ${activeStep === i ? "active" : ""} ${prefersReducedMotion ? "no-anim" : ""}`}
              >
                {visual}
              </div>
            ))}
            {/* Step dots */}
            <div className="hiw2-dots">
              {steps.map((_, i) => (
                <button
                  key={i}
                  className={`hiw2-dot ${activeStep === i ? "active" : ""}`}
                  onClick={() => setActiveStep(i)}
                  aria-label={`Paso ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Scoped CSS ───────────────────────────────────────────────────────────────

const SCOPED_CSS = `
/* ── Prefers reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .hiw2-visual-panel, .hiw2-step { transition: none !important; animation: none !important; }
}

/* ── Section shell ── */
.hiw2-section {
  background: #f8f9fa;
  border-top: 1px solid #e5e5e3;
  border-bottom: 1px solid #e5e5e3;
}

/* ── Sticky tabs bar ── */
.hiw2-sticky-tabs {
  position: sticky;
  top: 64px;
  z-index: 30;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e5e3;
  padding: 12px 5vw;
  will-change: transform;
}
.hiw2-tabs-inner {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.hiw2-tabs-label {
  font-size: 13px;
  color: #6b6b6b;
  font-weight: 500;
  white-space: nowrap;
}
.hiw2-tabs-toggle {
  display: flex;
  gap: 4px;
  background: #fff;
  border: 1px solid #e5e5e3;
  border-radius: 9999px;
  padding: 3px;
}
.hiw2-tab {
  padding: 8px 20px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #6b6b6b;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.hiw2-tab.active {
  background: #0a0a0a;
  color: #fff;
}
.hiw2-progress-text {
  margin-left: auto;
  font-size: 12px;
  color: #b0b0b0;
  font-weight: 600;
  white-space: nowrap;
}

/* ── Header ── */
.hiw2-header {
  padding: 64px 5vw 40px;
}
.hiw2-eyebrow {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b6b6b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.hiw2-eyebrow::before {
  content: '';
  width: 24px;
  height: 1.5px;
  background: #0ea5e9;
  display: block;
}
.hiw2-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0 0 14px;
  color: #0a0a0a;
}
.hiw2-subtitle {
  font-size: 16px;
  color: #6b6b6b;
  max-width: 540px;
  line-height: 1.6;
  margin: 0;
}

/* ── Main layout ── */
.hiw2-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding: 0 5vw 80px;
  align-items: start;
}
@media (max-width: 899px) {
  .hiw2-layout { grid-template-columns: 1fr; padding-bottom: 48px; }
  .hiw2-visual-col { display: none; }
  .hiw2-mobile-visual { display: block !important; }
}

/* ── Steps column ── */
.hiw2-steps-col {
  padding-right: 48px;
  padding-top: 20px;
}
@media (max-width: 899px) {
  .hiw2-steps-col { padding-right: 0; }
}

.hiw2-step {
  display: flex;
  gap: 20px;
  min-height: calc(100vh * 0.72);
  padding-bottom: 0;
  cursor: default;
  transition: opacity 0.3s ease;
}
.hiw2-step:not(.active) .hiw2-step-title,
.hiw2-step:not(.active) .hiw2-step-desc {
  opacity: 0.35;
}
.hiw2-step-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.hiw2-step-num {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid #e5e5e3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #b0b0b0;
  background: #f8f9fa;
  transition: all 0.3s ease;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}
.hiw2-step-num.active {
  border-color: #0ea5e9;
  color: #0ea5e9;
  background: #e0f2fe;
}
.hiw2-step-line {
  width: 1.5px;
  flex: 1;
  background: #e5e5e3;
  margin-top: 10px;
  min-height: 80px;
  transition: background 0.4s ease;
}
.hiw2-step-line.done {
  background: #0ea5e9;
}
.hiw2-step-body {
  padding-top: 10px;
  flex: 1;
  padding-bottom: 40px;
}
.hiw2-step-title {
  font-size: clamp(18px, 2.2vw, 24px);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  color: #0a0a0a;
  line-height: 1.2;
  transition: opacity 0.3s ease;
}
.hiw2-step-desc {
  font-size: 15px;
  color: #6b6b6b;
  line-height: 1.65;
  margin: 0;
  max-width: 420px;
  transition: opacity 0.3s ease;
}

/* Mobile inline visual */
.hiw2-mobile-visual {
  display: none;
  margin-top: 24px;
  margin-bottom: 24px;
}

/* ── Sticky visual column ── */
.hiw2-visual-col {
  position: sticky;
  top: calc(64px + 53px + 20px);
  height: calc(100vh - 200px);
  max-height: 640px;
}
.hiw2-visual-stage {
  position: relative;
  width: 100%;
  height: 100%;
  will-change: contents;
}
.hiw2-visual-panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.hiw2-visual-panel.active {
  opacity: 1;
  pointer-events: auto;
}

/* Step dots */
.hiw2-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 2;
}
.hiw2-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e5e5e3;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}
.hiw2-dot.active {
  background: #0ea5e9;
  width: 20px;
  border-radius: 3px;
}

/* ── Visual base styles ── */
.hiw-v {
  width: 100%;
  max-width: 380px;
  padding: 0 8px;
}

/* White card */
.hiw-card-white {
  background: #fff;
  border: 1px solid #e5e5e3;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 24px rgba(0,0,0,0.06);
}
.hiw-card-label-sm {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  color: #6b6b6b;
  margin-bottom: 16px;
}

/* Chat window */
.hiw-chat-win {
  background: #fff;
  border: 1px solid #e5e5e3;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 24px rgba(0,0,0,0.06);
}
.hiw-chat-bar {
  background: #f7f7f5;
  border-bottom: 1px solid #e5e5e3;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.hiw-chat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
}
.hiw-chat-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b6b6b;
  margin-left: 8px;
}
.hiw-chat-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hiw-msg {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.5;
}
.hiw-msg-user {
  background: #0ea5e9;
  color: #fff;
  border-bottom-right-radius: 4px;
  align-self: flex-end;
  max-width: 85%;
}
.hiw-msg-ai {
  background: #f7f7f5;
  border: 1px solid #e5e5e3;
  border-bottom-left-radius: 4px;
  max-width: 90%;
}
.hiw-ai-label {
  font-size: 10px;
  font-weight: 700;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.hiw-ai-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 8px;
}
.hiw-tag-blue {
  background: #e0f2fe;
  color: #0284c7;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 9999px;
  border: 1px solid #bae6fd;
}
.hiw-ai-cta {
  font-size: 11px;
  color: #6b6b6b;
  font-style: italic;
}

/* Photo grid */
.hiw-photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;
}
.hiw-photo-thumb {
  background: #f7f7f5;
  border: 1px solid #e5e5e3;
  border-radius: 10px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.hiw-photo-icon { font-size: 22px; }
.hiw-photo-check {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #16a34a;
  color: white;
  font-size: 9px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* Verified bars */
.hiw-verified-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #e5e5e3;
  margin-bottom: 10px;
}
.hiw-badge-green-lg {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 9999px;
}
.hiw-badge-blue-sm {
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #0284c7;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 9999px;
}
.hiw-badge-green-sm {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 9999px;
}
.hiw-meta-sm { font-size: 11px; color: #b0b0b0; }
.hiw-doc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #6b6b6b;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
}
.hiw-doc-row > span:last-child { margin-left: auto; }

/* Calendar */
.hiw-cal-header { margin-bottom: 8px; }
.hiw-cal-month { font-size: 13px; font-weight: 700; color: #0a0a0a; }
.hiw-cal-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: 14px;
}
.hiw-cal-day-label { font-size: 10px; color: #b0b0b0; text-align: center; font-weight: 600; padding: 3px 0; }
.hiw-cal-day {
  font-size: 12px;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  color: #6b6b6b;
}
.hiw-cal-active { background: #0ea5e9; color: #fff; font-weight: 700; }
.hiw-cal-range { background: #e0f2fe; color: #0284c7; }
.hiw-time-slot {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f7f5;
  border: 1px solid #e5e5e3;
  border-radius: 10px;
  padding: 12px 14px;
}
.hiw-time-icon { font-size: 20px; }
.hiw-time-label { font-size: 12px; color: #6b6b6b; }
.hiw-time-range { font-size: 14px; font-weight: 700; color: #0a0a0a; }
.hiw-time-slot > span:last-child { margin-left: auto; }

/* Checklist */
.hiw-checklist { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.hiw-check-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6b6b6b;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.hiw-check-row.done { color: #0a0a0a; }
.hiw-check-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid #e5e5e3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  color: transparent;
}
.hiw-check-circle.done {
  background: #16a34a;
  border-color: #16a34a;
  color: white;
}
.hiw-verified-badge-big {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 22px;
}
.hiw-vbig-title { font-size: 14px; font-weight: 700; color: #0a0a0a; }
.hiw-vbig-sub { font-size: 12px; color: #6b6b6b; }

/* Option cards */
.hiw-options-list { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 380px; }
.hiw-option-card {
  background: #fff;
  border: 1.5px solid #e5e5e3;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04);
}
.hiw-option-card.selected { border-color: #0ea5e9; }
.hiw-option-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 12px; }
.hiw-option-name { font-size: 14px; font-weight: 700; color: #0a0a0a; margin-bottom: 3px; }
.hiw-option-meta { font-size: 12px; color: #6b6b6b; }
.hiw-option-price { text-align: right; flex-shrink: 0; }
.hiw-option-price-val { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; color: #0a0a0a; }
.hiw-option-saving { font-size: 11px; color: #16a34a; font-weight: 600; }
.hiw-option-footer { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 12px; color: #6b6b6b; border-top: 1px solid #f0f0f0; padding-top: 10px; }

/* Map mini */
.hiw-map-mini { margin-bottom: 14px; border: 1px solid #e5e5e3; border-radius: 10px; overflow: hidden; }
.hiw-escrow-row-v { margin-bottom: 12px; }
.hiw-escrow-badge {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0284c7;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 9999px;
  text-align: center;
  display: block;
}
.hiw-deliver-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

/* Docs list */
.hiw-doc-list { display: flex; flex-direction: column; gap: 2px; margin-bottom: 16px; }
.hiw-doc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}
.hiw-doc-icon { font-size: 18px; }
.hiw-doc-label { flex: 1; color: #0a0a0a; }

/* Truck diagram */
.hiw-truck-diag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
}
.hiw-truck-svg { font-size: 52px; line-height: 1; }
.hiw-truck-labels { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.hiw-tlabel {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f7f7f5;
  border: 1px solid #e5e5e3;
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 90px;
}
.hiw-tlabel-key { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #b0b0b0; font-weight: 600; }
.hiw-tlabel-val { font-size: 13px; font-weight: 700; color: #0a0a0a; margin-top: 2px; }

/* Delivery visual */
.hiw-delivery-check {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}
.hiw-deliver-icon {
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
  flex-shrink: 0;
}
.hiw-payment-release {
  text-align: center;
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  margin-bottom: 16px;
}
.hiw-pay-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #16a34a; font-weight: 700; margin-bottom: 4px; }
.hiw-pay-amount { font-size: 32px; font-weight: 800; letter-spacing: -0.03em; color: #0a0a0a; line-height: 1; }
.hiw-pay-sub { font-size: 11px; color: #6b6b6b; margin-top: 4px; }
.hiw-level-bar { }
.hiw-level-label { display: flex; justify-content: space-between; font-size: 12px; color: #6b6b6b; margin-bottom: 6px; }
.hiw-level-track { height: 6px; background: #e5e5e3; border-radius: 3px; overflow: hidden; }
.hiw-level-fill { height: 100%; background: #0ea5e9; border-radius: 3px; }
.hiw-level-sub { font-size: 11px; color: #b0b0b0; margin-top: 5px; }
`;
