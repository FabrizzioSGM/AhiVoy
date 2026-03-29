"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./landing.css";
import { HowItWorksV2 } from "@/components/landing/how-it-works-v2";

// ─── Data ──────────────────────────────────────────────────────────────────

const trustItems = [
  { icon: "🛡️", label: "Identidad verificada" },
  { icon: "🔒", label: "Pago en custodia" },
  { icon: "📍", label: "GPS en tiempo real" },
  { icon: "📄", label: "CFDI automático" },
  { icon: "🚛", label: "Unidad verificada" },
  { icon: "⭐", label: "Sistema de reputación" },
];

const marqueeItems = [
  ...trustItems,
  ...trustItems,
];

const stats = [
  { value: "38%", label: "Ahorro vs flete dedicado", color: "blue" },
  { value: "96%", label: "Entregas a tiempo", color: "green" },
  { value: "< 24h", label: "Cobro post-entrega", color: "blue" },
  { value: "100%", label: "Transportistas verificados", color: "green" },
];

const compareRows = [
  { issue: "Verificación", bad: "Foto de unidad, sin validación", good: "INE, empresa y unidad verificados" },
  { issue: "Pago garantizado", bad: "Anticipo en efectivo o riesgo de no cobrar", good: "Escrow: fondos antes de salir" },
  { issue: "Seguimiento", bad: "Mensajes de WhatsApp intermitentes", good: "GPS en tiempo real + foto en entrega" },
  { issue: "Comprobante fiscal", bad: "Sin CFDI, sin factura formal", good: "CFDI automático al completar" },
  { issue: "Resolución de incidencias", bad: "Sin proceso, sin árbitro", good: "Proceso documentado con escrow" },
];


const faqs = [
  { q: "¿Cómo sé que el transportista es real?", a: "Todos los transportistas pasan por verificación de INE, empresa, vehículo y seguro vigente antes de aparecer en la plataforma. Solo ves perfiles aprobados manualmente por nuestro equipo." },
  { q: "¿Qué pasa si la carga llega dañada?", a: "El proceso de reclamación se activa antes de liberar el pago. ZzingRush actúa como árbitro con la evidencia fotográfica de recolección y entrega como respaldo." },
  { q: "¿Por qué es más barato que flete normal?", a: "Los transportistas de retorno ya pagan su viaje de salida. Cualquier carga de regreso es utilidad adicional, por eso pueden ofrecer hasta 40% menos que flete dedicado." },
  { q: "¿Cuándo se libera el pago al transportista?", a: "Al confirmar la entrega correcta, o automáticamente 24 horas después sin reclamación. El transportista siempre sabe que el dinero ya está apartado." },
  { q: "¿Se genera CFDI?", a: "Sí, ZzingRush genera y envía el CFDI automáticamente al completarse el servicio. Todos los transportistas deben estar activos en el SAT para operar en la plataforma." },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".lp-reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp-root">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="lp-hero">
        {/* Floating live card */}
        <div className="lp-hero-card">
          <div className="lp-hero-card-label">Operación activa</div>
          <div className="lp-hero-card-route">MTY → CDMX</div>
          <div className="lp-hero-card-row">
            <span>Estado</span>
            <strong><span className="lp-hero-status">En tránsito</span></strong>
          </div>
          <div className="lp-hero-card-row">
            <span>Escrow</span>
            <strong style={{ color: "var(--blue)" }}>$10,500 MXN</strong>
          </div>
          <div className="lp-hero-card-row">
            <span>ETA</span>
            <strong>~4 horas</strong>
          </div>
          <div className="lp-hero-card-row">
            <span>Transportista</span>
            <strong>Verificado ✓</strong>
          </div>
        </div>

        {/* Copy */}
        <div className="lp-hero-eyebrow">
          <span className="lp-hero-eyebrow-dot" />
          Logística verificada · México
        </div>
        <h1 className="lp-hero-title">
          Monetiza <em>rutas</em><br />de retorno.
        </h1>
        <div className="lp-hero-body">
          <p className="lp-hero-desc">
            ZzingRush conecta transportistas con capacidad de regreso con empresas que necesitan
            mover carga. Verificado, asegurado, con CFDI y con pago garantizado antes de salir.
          </p>
          <div className="lp-hero-actions">
            <Link href="/registro?rol=embarcador" className="lp-btn lp-btn-primary">
              Soy embarcador →
            </Link>
            <Link href="/registro?rol=transportista" className="lp-btn lp-btn-outline">
              Soy transportista →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marquee trust bar ────────────────────────────────────────────── */}
      <div className="lp-marquee-wrap">
        <div className="lp-marquee-track">
          {marqueeItems.map(({ icon, label }, i) => (
            <span key={i} className="lp-marquee-item">{icon} {label}</span>
          ))}
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="lp-section">
        <div className="lp-stats lp-reveal">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="lp-stat">
              <div className={`lp-stat-value ${color}`}>{value}</div>
              <div className="lp-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────────────── */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-label lp-reveal">El problema</div>
        <h2 className="lp-section-title lp-reveal delay-1">
          Más serio que<br />WhatsApp.
        </h2>
        <p className="lp-section-desc lp-reveal delay-2">
          La logística informal en México opera con mucha confianza y poca trazabilidad.
          ZzingRush cambia eso sin complicar la operación.
        </p>

        <div className="lp-compare lp-reveal delay-3">
          <div className="lp-compare-header">
            <div className="lp-compare-header-cell">Aspecto</div>
            <div className="lp-compare-header-cell">WhatsApp / informal</div>
            <div className="lp-compare-header-cell zzingrush">ZzingRush</div>
          </div>
          {compareRows.map(({ issue, bad, good }) => (
            <div key={issue} className="lp-compare-row">
              <div className="lp-compare-cell issue">{issue}</div>
              <div className="lp-compare-cell bad">{bad}</div>
              <div className="lp-compare-cell good">{good}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works (GSAP ScrollTrigger) ───────────────────────────── */}
      <HowItWorksV2 />

      {/* ── Role cards ───────────────────────────────────────────────────── */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-label lp-reveal">Para quién</div>
        <h2 className="lp-section-title lp-reveal delay-1">Dos lados.<br />Un sistema.</h2>
        <p className="lp-section-desc lp-reveal delay-2">
          ZzingRush sirve a los dos lados del mercado con flujos, protecciones
          y herramientas diseñadas para cada rol.
        </p>

        <div className="lp-roles">
          {/* Embarcadores — dark card */}
          <div className="lp-role-card dark lp-reveal delay-1">
            <span className="lp-role-tag">Embarcadores</span>
            <h3 className="lp-role-title">Mueve carga con certeza total.</h3>
            <p className="lp-role-desc">
              Empresas y negocios que necesitan transportar mercancía con trazabilidad,
              garantías y factura.
            </p>
            <div className="lp-role-features">
              {[
                "Transportistas verificados — no perfiles anónimos",
                "Hasta 40% más barato que flete dedicado",
                "Pago en custodia — si algo falla, te reembolsamos",
                "CFDI automático para tu contabilidad",
                "GPS en tiempo real sin llamadas de seguimiento",
              ].map(f => (
                <div key={f} className="lp-role-feature">
                  <span className="lp-role-feature-dot" />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/registro?rol=embarcador" className="lp-btn lp-btn-blue" style={{ marginTop: 8 }}>
              Empezar gratis →
            </Link>
          </div>

          {/* Transportistas — light card */}
          <div className="lp-role-card light lp-reveal delay-2">
            <span className="lp-role-tag">Transportistas</span>
            <h3 className="lp-role-title">Monetiza viajes que ya haces.</h3>
            <p className="lp-role-desc">
              Operadores y flotas con capacidad de retorno que quieren cobrar sin riesgo
              y operar con clientes confiables.
            </p>
            <div className="lp-role-features">
              {[
                "Publica rutas de retorno en menos de 3 minutos",
                "Pago garantizado antes de que salgas",
                "Clientes verificados — sin riesgo de fraude",
                "Cobro en menos de 24h post-entrega",
                "Tu número protegido hasta confirmar la operación",
              ].map(f => (
                <div key={f} className="lp-role-feature">
                  <span className="lp-role-feature-dot" />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/registro?rol=transportista" className="lp-btn lp-btn-primary" style={{ marginTop: 8 }}>
              Registrar mi flota →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────────────────── */}
      <div className="lp-trust">
        {trustItems.map(({ icon, label }) => (
          <div key={label} className="lp-trust-item">
            <span className="lp-trust-icon">{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="lp-section" style={{ maxWidth: 800, margin: "0 auto" }}>
        <div className="lp-section-label lp-reveal">FAQ</div>
        <h2 className="lp-section-title lp-reveal delay-1">Dudas frecuentes.</h2>

        <div className="lp-faq lp-reveal delay-2">
          {faqs.map((faq, i) => (
            <div key={i} className="lp-faq-item">
              <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span className={`lp-faq-chevron ${openFaq === i ? "open" : ""}`}>+</span>
              </button>
              <div className={`lp-faq-a ${openFaq === i ? "open" : ""}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="lp-cta">
        <h2 className="lp-cta-title lp-reveal">
          ¿Listo para operar<br />con más control?
        </h2>
        <p className="lp-cta-desc lp-reveal delay-1">
          Registro gratuito. Verificación en 24 horas.<br />Primera operación sin comisión.
        </p>
        <div className="lp-cta-actions lp-reveal delay-2">
          <Link href="/registro?rol=embarcador" className="lp-btn-white">
            Soy embarcador →
          </Link>
          <Link href="/registro?rol=transportista" className="lp-btn-ghost">
            Soy transportista →
          </Link>
        </div>
      </section>

    </div>
  );
}
