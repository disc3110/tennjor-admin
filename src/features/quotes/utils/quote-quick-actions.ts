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
      ? "No items"
      : quote.items
          .map(
            (item) =>
              `- ${item.productNameSnapshot} (${item.size}/${item.color}) x${item.quantity}`,
          )
          .join("\n");

  return [
    `Quote ${quote.id}`,
    `Customer: ${quote.customerName}`,
    `Email: ${quote.customerEmail || "-"}`,
    `Phone: ${quote.customerPhone || "-"}`,
    `City: ${quote.customerCity || "-"}`,
    `Status: ${quote.status}`,
    "Items:",
    itemsText,
    quote.notes ? `Customer notes: ${quote.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildFollowUpMessageText(quote: AdminQuoteRequestDetail) {
  const firstItem = quote.items[0];
  const itemText = firstItem
    ? `${firstItem.productNameSnapshot}${
        quote.items.length > 1 ? ` and ${quote.items.length - 1} more item(s)` : ""
      }`
    : "your requested items";

  return [
    `Hi ${quote.customerName},`,
    "",
    `This is the Tennjor team following up on your quote request (${quote.id}) for ${itemText}.`,
    "Please let us know if you want us to proceed with pricing and availability details.",
    "",
    "Thank you!",
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

  const subject = `Tennjor quote follow-up (${quote.id})`;
  const body = buildFollowUpMessageText(quote);
  return `mailto:${quote.customerEmail}?subject=${encode(subject)}&body=${encode(body)}`;
}
