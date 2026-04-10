import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { approveCarrier, rejectCarrier } from "@/lib/supabase/admin-queries";

export async function POST(req: NextRequest) {
  // Segunda capa de verificación — confirmar que quien llama es admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  // Procesar la acción
  const body = await req.json();
  const { carrierId, action } = body as { carrierId?: string; action?: "approve" | "reject" };

  if (!carrierId || !action || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  try {
    if (action === "approve") {
      await approveCarrier(carrierId);
    } else {
      await rejectCarrier(carrierId);
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
