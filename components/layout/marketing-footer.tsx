import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  producto: [
    { href: "/como-funciona", label: "Cómo funciona" },
    { href: "/para-embarcadores", label: "Para embarcadores" },
    { href: "/para-transportistas", label: "Para transportistas" },
    { href: "/precios", label: "Precios" },
  ],
  confianza: [
    { href: "/confianza-seguridad", label: "Confianza y seguridad" },
    { href: "/confianza-seguridad#verificacion", label: "Proceso de verificación" },
    { href: "/confianza-seguridad#escrow", label: "Pago protegido" },
    { href: "/confianza-seguridad#seguimiento", label: "Seguimiento GPS" },
  ],
  empresa: [
    { href: "#", label: "Acerca de ZzingRush" },
    { href: "#", label: "Blog" },
    { href: "#", label: "Contacto" },
    { href: "#", label: "Trabaja con nosotros" },
  ],
  legal: [
    { href: "#", label: "Términos de servicio" },
    { href: "#", label: "Política de privacidad" },
    { href: "#", label: "Aviso de privacidad" },
    { href: "#", label: "Cookies" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="bg-ink-950 text-ink-200">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="text-white font-semibold text-lg">ZzingRush</span>
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed max-w-xs">
              Plataforma logística para rutas de retorno en México. Más trazabilidad, menos viajes vacíos.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="badge-verified text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-trust-green inline-block" />
                Plataforma verificada
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Producto</h4>
            <ul className="space-y-2.5">
              {footerLinks.producto.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Seguridad</h4>
            <ul className="space-y-2.5">
              {footerLinks.confianza.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-ink-800" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-500">
          <p>© 2025 ZzingRush S.A.P.I. de C.V. Todos los derechos reservados.</p>
          <p>Hecho en México 🇲🇽 · RFC: ZZR250101XXX</p>
        </div>
      </div>
    </footer>
  );
}
