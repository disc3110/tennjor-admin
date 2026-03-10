import type { AdminQuoteRequestDetail } from "@/src/features/quotes/types/quote";

function encode(value: string) {
  return encodeURIComponent(value);
}

function normalizePhoneForWhatsApp(phone: string) {
  return phone.replace(/\D/g, "");
}

export function buildQuoteSummaryText(quote: AdminQuoteRequestDetail) {
  const itemsText =
    quote.items.length === 0
      ? "Sin artículos"
      : quote.items
          .map(
            (item) =>
              `- ${item.productNameSnapshot} (${item.size}/${item.color}) x${item.quantity}`,
          )
          .join("\n");

  return [
    `Cotización ${quote.id}`,
    `Cliente: ${quote.customerName}`,
    `Correo: ${quote.customerEmail || "-"}`,
    `Teléfono: ${quote.customerPhone || "-"}`,
    `Ciudad: ${quote.customerCity || "-"}`,
    `Estado: ${quote.status}`,
    "Artículos:",
    itemsText,
    quote.notes ? `Notas del cliente: ${quote.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildFollowUpMessageText(quote: AdminQuoteRequestDetail) {
  const firstItem = quote.items[0];
  const itemText = firstItem
    ? `${firstItem.productNameSnapshot}${
        quote.items.length > 1 ? ` y ${quote.items.length - 1} artículo(s) más` : ""
      }`
    : "los artículos solicitados";

  return [
    `Hola ${quote.customerName},`,
    "",
    `Somos el equipo de Tennjor dando seguimiento a tu solicitud de cotización (${quote.id}) para ${itemText}.`,
    "Por favor cuéntanos si deseas que continuemos con precios y disponibilidad.",
    "",
    "¡Gracias!",
  ].join("\n");
}

export function buildWhatsAppUrl(quote: AdminQuoteRequestDetail) {
  if (!quote.customerPhone) return null;

  const phone = normalizePhoneForWhatsApp(quote.customerPhone);
  if (!phone) return null;

  const text = buildFollowUpMessageText(quote);
  return `https://wa.me/${phone}?text=${encode(text)}`;
}

export function buildMailtoUrl(quote: AdminQuoteRequestDetail) {
  if (!quote.customerEmail) return null;

  const subject = `Seguimiento de cotización Tennjor (${quote.id})`;
  const body = buildFollowUpMessageText(quote);
  return `mailto:${quote.customerEmail}?subject=${encode(subject)}&body=${encode(body)}`;
}
