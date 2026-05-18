import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function verifyAdmin(supabase: Awaited<ReturnType<typeof createServerClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = getAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user;
}

export async function GET() {
  const supabase = await createServerClient();
  const user = await verifyAdmin(supabase);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("changelog_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entries: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const user = await verifyAdmin(supabase);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const { title, description, category } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Título y descripción requeridos" }, { status: 400 });
  }

  const admin = getAdminClient();
  const { data, error } = await admin
    .from("changelog_entries")
    .insert({ title, description, category: category || "feature" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServerClient();
  const user = await verifyAdmin(supabase);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const admin = getAdminClient();
  const { error } = await admin.from("changelog_entries").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
