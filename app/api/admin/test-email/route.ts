import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";
import { buildWeeklyDigestHtml } from "@/lib/emails/weekly-digest";

export async function POST() {
  const sampleEntries = [
    {
      id: "1",
      title: "Chat en tiempo real entre partes",
      description: "Comunícate directamente con tu transportista o embarcador dentro de cada envío.",
      category: "feature",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Sistema de calificaciones",
      description: "Califica a tu contraparte al finalizar un envío. Las calificaciones construyen reputación verificable.",
      category: "feature",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Mejor manejo de errores en IA",
      description: "Mensajes claros cuando el parser de envíos no puede procesar tu solicitud.",
      category: "fix",
      created_at: new Date().toISOString(),
    },
  ];

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: "ZzingRush <onboarding@resend.dev>",
      to: "guajardofabrizzio@gmail.com",
      subject: "⚡ Novedades de ZzingRush — 3 actualizaciones",
      html: buildWeeklyDigestHtml(sampleEntries, "Fabrizzio"),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
