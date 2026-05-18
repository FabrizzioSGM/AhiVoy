import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getResend } from "@/lib/resend";
import { buildWeeklyDigestHtml } from "@/lib/emails/weekly-digest";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getAdminClient();

  const { data: entries } = await admin
    .from("changelog_entries")
    .select("*")
    .is("sent_at", null)
    .order("created_at", { ascending: false });

  if (!entries || entries.length === 0) {
    return NextResponse.json({ message: "No pending entries", sent: 0 });
  }

  const { data: recipients } = await admin
    .from("profiles")
    .select("id, name")
    .or("email_notifications.is.null,email_notifications.eq.true");

  if (!recipients || recipients.length === 0) {
    return NextResponse.json({ message: "No recipients", sent: 0 });
  }

  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailMap = new Map<string, string>();
  authUsers?.users?.forEach((u) => {
    if (u.email) emailMap.set(u.id, u.email);
  });

  const validRecipients = recipients
    .map((r) => ({ id: r.id, name: r.name, email: emailMap.get(r.id) }))
    .filter((r) => r.email && !r.email.endsWith("@zzingrush.test"));

  if (validRecipients.length === 0) {
    return NextResponse.json({ message: "No valid recipients", sent: 0 });
  }

  const resend = getResend();
  let sentCount = 0;

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
      console.error("Cron digest batch error:", err);
    }
  }

  const entryIds = entries.map((e) => e.id);
  await admin.from("changelog_entries").update({ sent_at: new Date().toISOString() }).in("id", entryIds);
  await admin.from("email_digest_log").insert({ recipient_count: sentCount, entries_included: entryIds });

  return NextResponse.json({ success: true, sent: sentCount, entries: entries.length });
}
