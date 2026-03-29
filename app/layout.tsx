import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ZzingRush — Logística de rutas de retorno en México",
    template: "%s | ZzingRush",
  },
  description:
    "Plataforma logística que conecta transportistas con capacidad de retorno y embarcadores que necesitan mover carga. Verificado, trazable y con pago protegido.",
  keywords: ["logística", "flete", "rutas de retorno", "transportista", "embarcador", "México"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
