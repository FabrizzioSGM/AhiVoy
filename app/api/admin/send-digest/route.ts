import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getResend } from "@/lib/resend";
import { buildWeeklyDigestHtml } from "@/lib/emails/weekly-digest";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const admin = getAdminClient();

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Get unsent changelog entries
  const { data: entries } = await admin
    .from("changelog_entries")
    .select("*")
    .is("sent_at", null)
    .order("created_at", { ascending: false });

  if (!entries || entries.length === 0) {
    return NextResponse.json({ error: "No hay entradas pendientes de enviar" }, { status: 400 });
  }

  // Get all users with notifications enabled
  const { data: recipients } = await admin
    .from("profiles")
    .select("id, name, email:id")
    .or("email_notifications.is.null,email_notifications.eq.true");

  if (!recipients || recipients.length === 0) {
    return NextResponse.json({ error: "No hay destinatarios" }, { status: 400 });
  }

  // Get actual emails from auth.users
  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = new Map<string, string>();
  authUsers?.users?.forEach((u) => {
    if (u.email) emailMap.set(u.id, u.email);
  });

  const validRecipients = recipients
    .map((r) => ({ id: r.id, name: r.name, email: emailMap.get(r.id) }))
    .filter((r) => r.email && !r.email.endsWith("@zzingrush.test"));

  const resend = getResend();
  let sentCount = 0;

  // Send in batches of 50 (Resend batch limit)
  const batchSize = 50;
  for (let i = 0; i < validRecipients.length; i += batchSize) {
    const batch = validRecipients.slice(i, i + batchSize);
    const emails = batch.map((recipient) => ({
      from: "ZzingRush <onboarding@resend.dev>",
      to: recipient.email!,
      subject: `⚡ Novedades de ZzingRush — ${entries.length} actualización${entries.length > 1 ? "es" : ""}`,
      html: buildWeeklyDigestHtml(entries, recipient.name ?? undefined),
    }));

    try {
      await resend.batch.send(emails);
      sentCount += batch.length;
    } catch (err) {
      console.error("Error sending batch:", err);
    }
  }

  // Mark entries as sent
  const entryIds = entries.map((e) => e.id);
  await admin
    .from("changelog_entries")
    .update({ sent_at: new Date().toISOString() })
    .in("id", entryIds);

  // Log the digest send
  await admin.from("email_digest_log").insert({
    recipient_count: sentCount,
    entries_included: entryIds,
  });

  return NextResponse.json({
    success: true,
    sent_to: sentCount,
    entries_sent: entries.length,
  });
}
