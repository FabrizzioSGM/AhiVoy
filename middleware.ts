import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rutas que requieren verificación de rol (no marketing ni estáticas)
const ROLE_PROTECTED = ["/app/", "/admin", "/onboarding/"];

function requiresRoleCheck(pathname: string) {
  return ROLE_PROTECTED.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Siempre refrescar la sesión primero
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // ── Usuarios NO autenticados ─────────────────────────────────────────────
  if (!user) {
    // Proteger /app/* y /admin
    if (path.startsWith("/app/") || path.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // Proteger onboarding (no tiene sentido sin sesión)
    if (path.startsWith("/onboarding/")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // ── Usuarios autenticados — obtener rol y estado de onboarding ───────────
  // Solo consultar BD si la ruta lo requiere (no en marketing pages)
  let role: string | null = null;
  let onboardingCompleted = true;

  if (requiresRoleCheck(path) || path === "/login" || path === "/registro") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed")
      .eq("id", user.id)
      .single();

    role = profile?.role ?? null;
    onboardingCompleted = profile?.onboarding_completed ?? false;
  }

  // Helper para redirigir al dashboard según rol
  const dashboardFor = (r: string | null) =>
    r === "transportista"
      ? "/app/transportista"
      : r === "admin"
      ? "/admin"
      : "/app/embarcador";

  // ── Sacar a usuarios autenticados de /login y /registro ─────────────────
  if (path === "/login" || path === "/registro") {
    const url = request.nextUrl.clone();
    url.pathname = dashboardFor(role);
    return NextResponse.redirect(url);
  }

  // ── Forzar onboarding si no está completado ──────────────────────────────
  if (!onboardingCompleted && path.startsWith("/app/")) {
    const targetOnboarding =
      role === "transportista"
        ? "/onboarding/transportista"
        : "/onboarding/embarcador";

    // Evitar loop infinito si ya está en la ruta de onboarding correcta
    if (path !== targetOnboarding) {
      const url = request.nextUrl.clone();
      url.pathname = targetOnboarding;
      return NextResponse.redirect(url);
    }
  }

  // ── Redirigir desde onboarding si ya está completado ─────────────────────
  if (onboardingCompleted && path.startsWith("/onboarding/")) {
    const url = request.nextUrl.clone();
    url.pathname = dashboardFor(role);
    return NextResponse.redirect(url);
  }

  // ── Proteger /admin y /app/admin — solo rol "admin" ──────────────────────
  if ((path.startsWith("/admin") || path.startsWith("/app/admin")) && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = dashboardFor(role);
    return NextResponse.redirect(url);
  }

  // ── Proteger rutas de embarcador — solo rol "embarcador" ─────────────────
  if (path.startsWith("/app/embarcador") && role !== "embarcador") {
    const url = request.nextUrl.clone();
    url.pathname = dashboardFor(role);
    return NextResponse.redirect(url);
  }

  // ── Proteger rutas de transportista — solo rol "transportista" ───────────
  if (path.startsWith("/app/transportista") && role !== "transportista") {
    const url = request.nextUrl.clone();
    url.pathname = dashboardFor(role);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
