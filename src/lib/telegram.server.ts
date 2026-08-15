
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export type LeadNotification = {
  name: string;
  phone: string;
  email?: string | null;
  product?: string | null;
  company?: string | null;
  price?: number | null;
  message?: string | null;
  params?: Record<string, string>;
};

const productLabels: Record<string, string> = {
  auto: "Автоцивілка",
  green_card: "Зелена карта",
  travel: "Туристичне страхування",
  sport: "Спортивне страхування",
};

export function buildLeadMessage(lead: LeadNotification) {
  const lines = [
    "<b>🆕 Нова заявка з сайту</b>",
    `👤 <b>Ім'я:</b> ${escapeHtml(lead.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(lead.phone)}`,
  ];
  if (lead.email) lines.push(`✉️ <b>Email:</b> ${escapeHtml(lead.email)}`);
  if (lead.product)
    lines.push(`🛡 <b>Продукт:</b> ${escapeHtml(productLabels[lead.product] ?? lead.product)}`);
  if (lead.company) lines.push(`🏢 <b>Компанія:</b> ${escapeHtml(lead.company)}`);
  if (typeof lead.price === "number" && lead.price > 0)
    lines.push(`💰 <b>Ціна:</b> ${Math.round(lead.price).toLocaleString("uk-UA")} грн`);
  const params = Object.entries(lead.params ?? {}).filter(([, v]) => v);
  if (params.length)
    lines.push(
      `⚙️ <b>Параметри:</b>\n${params.map(([k, v]) => escapeHtml(`• ${k}: ${v}`)).join("\n")}`,
    );

  if (lead.message) lines.push(`💬 <b>Повідомлення:</b> ${escapeHtml(lead.message)}`);
  return lines.join("\n");
}

export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"];

  if (!token || !chatId) {
    console.warn("Telegram notification skipped: missing configuration");
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildLeadMessage(lead),
        parse_mode: "HTML",
      }),
    });
    if (!response.ok) {
      console.error(`Telegram sendMessage failed [${response.status}]: ${await response.text()}`);
      return;
    }
    const result = (await response.json()) as { ok: boolean; description?: string };
    if (!result.ok) console.error(`Telegram error: ${result.description ?? "unknown"}`);
  } catch (error) {
    console.error("Telegram notification error:", error);
  }
}
