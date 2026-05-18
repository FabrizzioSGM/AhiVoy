interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  feature: "Nueva función",
  fix: "Corrección",
  improvement: "Mejora",
};

const categoryColors: Record<string, string> = {
  feature: "#0EA5E9",
  fix: "#10B981",
  improvement: "#8B5CF6",
};

export function buildWeeklyDigestHtml(entries: ChangelogEntry[], userName?: string): string {
  const greeting = userName ? `Hola ${userName}` : "Hola";

  const entriesHtml = entries
    .map((entry) => {
      const color = categoryColors[entry.category] ?? "#6B7280";
      const label = categoryLabels[entry.category] ?? entry.category;
      return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #F3F4F6;">
            <span style="display: inline-block; background: ${color}15; color: ${color}; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 9999px; margin-bottom: 6px;">${label}</span>
            <p style="margin: 4px 0 2px; font-size: 15px; font-weight: 600; color: #111827;">${entry.title}</p>
            <p style="margin: 0; font-size: 13px; color: #6B7280; line-height: 1.5;">${entry.description}</p>
          </td>
        </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #F9FAFB; padding: 40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #0EA5E9, #0284C7); padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700;">⚡ ZzingRush</h1>
            <p style="margin: 8px 0 0; color: #E0F2FE; font-size: 13px;">Resumen semanal de novedades</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding: 28px 24px;">
            <p style="margin: 0 0 20px; font-size: 14px; color: #374151;">${greeting}, aquí van las novedades de esta semana en ZzingRush:</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${entriesHtml}
            </table>
            <div style="text-align: center; margin-top: 28px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://zzingrush.com"}/app" style="display: inline-block; background: #0EA5E9; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 8px;">Ir a ZzingRush</a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding: 20px 24px; background: #F9FAFB; border-top: 1px solid #F3F4F6; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #9CA3AF;">Recibes este correo porque tienes una cuenta en ZzingRush.<br/>Para desactivar estos correos, actualiza tus preferencias en tu perfil.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
