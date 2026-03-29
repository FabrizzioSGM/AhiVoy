# ZzingRush

Marketplace de logística para rutas de retorno en México. Conecta transportistas con capacidad de regreso con empresas que necesitan mover carga — verificado, con escrow y CFDI automático.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Animaciones | Framer Motion + GSAP ScrollTrigger |
| Base de datos | Supabase (Postgres + Auth + Storage + Realtime) |
| Pagos / Escrow | Stripe Connect |
| Email | Resend + React Email |
| SMS | Twilio |
| Facturación | Facturama (CFDI) |
| Mapas / GPS | Google Maps Platform |
| Deploy | Vercel |

---

## Setup local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/zzingrush.git
cd zzingrush
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Abre `.env.local` y llena los valores. Las únicas variables **obligatorias** para correr en local son:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (crear proyecto gratis en supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

El resto (Stripe, Twilio, etc.) son opcionales hasta que implementes esas funcionalidades.

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Build de producción (verificar antes de deploy)
npm run start    # Servidor de producción local
npm run lint     # ESLint
```

---

## Estructura del proyecto

```
zzingrush/
├── app/
│   ├── (marketing)/        # Landing page y páginas públicas
│   ├── (auth)/             # Login y registro
│   ├── app/
│   │   ├── embarcador/     # Dashboard embarcador
│   │   └── transportista/  # Dashboard transportista
│   ├── onboarding/         # Flujos de onboarding por rol
│   └── admin/              # Panel interno
├── components/
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── layout/             # Nav, footer, sidebar
│   ├── landing/            # Componentes de la landing page
│   └── shared/             # Componentes compartidos
├── lib/
│   ├── types.ts            # Modelo de dominio completo
│   ├── seed-data.ts        # Datos de prueba (mock)
│   ├── mock-auth.ts        # Auth mock → reemplazar con Supabase Auth
│   └── utils.ts            # Utilidades generales
└── .env.example            # Plantilla de variables de entorno
```

---

## Deploy en Vercel

### Primera vez

1. Sube el código a GitHub (repo privado recomendado)
2. Entra a [vercel.com](https://vercel.com) → **Add New Project**
3. Importa el repositorio de GitHub
4. En **Environment Variables**, agrega las variables de `.env.example` con sus valores reales
5. Haz clic en **Deploy**

### Deploys posteriores

Cada push a `main` dispara un deploy automático en Vercel.

### Variables requeridas en Vercel

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `NEXT_PUBLIC_APP_URL` | ✓ | URL de producción (ej: https://zzingrush.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | Anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | Service role key (solo servidor) |
| `AUTH_SECRET` | ✓ | String aleatorio ≥32 chars para tokens |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Pagos | Clave pública de Stripe |
| `STRIPE_SECRET_KEY` | Pagos | Clave secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Pagos | Secret del webhook de Stripe |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Mapas | API key de Google Maps |
| `RESEND_API_KEY` | Email | API key de Resend |
| `EMAIL_FROM` | Email | Dirección de envío |
| `TWILIO_ACCOUNT_SID` | SMS | Account SID de Twilio |
| `TWILIO_AUTH_TOKEN` | SMS | Auth token de Twilio |
| `TWILIO_PHONE_NUMBER` | SMS | Número de Twilio |
| `FACTURAMA_USER` | CFDI | Usuario de Facturama |
| `FACTURAMA_PASSWORD` | CFDI | Password de Facturama |
| `FACTURAMA_SANDBOX` | CFDI | `true` en staging, `false` en prod |

---

## Estado del MVP

| Módulo | Estado |
|--------|--------|
| Landing page | ✅ Completo |
| Auth UI (login / registro) | ✅ Completo · mock auth |
| Onboarding embarcador (4 pasos) | ✅ Completo |
| Onboarding transportista (6 pasos) | ✅ Completo |
| Dashboard embarcador | ✅ Completo · mock data |
| Dashboard transportista | ✅ Completo · mock data |
| Publicar envío | ✅ Completo |
| Publicar ruta de retorno | ✅ Completo |
| Matching de cargas | 🔄 UI lista · lógica pendiente |
| Escrow / pagos | 🔄 UI lista · Stripe pendiente |
| Seguimiento GPS | 🔄 UI lista · integración pendiente |
| Verificación de documentos | 🔄 UI lista · lógica pendiente |
| CFDI automático | 🔄 UI lista · Facturama pendiente |
| Base de datos real | ⏳ Pendiente → Supabase |
| Notificaciones | ⏳ Pendiente → Resend + Twilio |

---

## Licencia

Privado — todos los derechos reservados © 2025 ZzingRush S.A.P.I. de C.V.
