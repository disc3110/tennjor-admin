"use client";

import { useRef, useState } from "react";
import { ExternalLink, Mail, MessageCircle, Copy } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import type { AdminQuoteRequestDetail } from "@/src/features/quotes/types/quote";
import {
  buildFollowUpMessageText,
  buildMailtoUrl,
  buildQuoteSummaryText,
  buildWhatsAppUrl,
} from "@/src/features/quotes/utils/quote-quick-actions";

type QuoteQuickActionsCardProps = {
  quote: AdminQuoteRequestDetail;
};

export function QuoteQuickActionsCard({ quote }: QuoteQuickActionsCardProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const whatsappUrl = buildWhatsAppUrl(quote);
  const mailtoUrl = buildMailtoUrl(quote);
  const summaryText = buildQuoteSummaryText(quote);
  const followUpText = buildFollowUpMessageText(quote);

  const showFeedback = (message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setFeedback(message);
    timeoutRef.current = setTimeout(() => setFeedback(null), 1800);
  };

  const copyText = async (value: string, message: string) => {
    if (!navigator.clipboard) {
      showFeedback("Portapapeles no disponible.");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      showFeedback(message);
    } catch {
      showFeedback("No se pudo copiar.");
    }
  };

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Acciones rápidas</h2>

      <div className="grid gap-2">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-between rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="size-4" />
              Abrir WhatsApp
            </span>
            <ExternalLink className="size-4" />
          </a>
        ) : (
          <Button variant="secondary" className="justify-start" disabled>
            <MessageCircle className="size-4" />
            Abrir WhatsApp
          </Button>
        )}

        {mailtoUrl ? (
          <a
            href={mailtoUrl}
            className="inline-flex h-10 items-center justify-between rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4" />
              Enviar correo
            </span>
            <ExternalLink className="size-4" />
          </a>
        ) : (
          <Button variant="secondary" className="justify-start" disabled>
            <Mail className="size-4" />
            Enviar correo
          </Button>
        )}

        <Button
          variant="secondary"
          className="justify-start"
          disabled={!quote.customerPhone}
          iconLeft={<Copy className="size-4" />}
          onClick={() => void copyText(quote.customerPhone, "Teléfono copiado.")}
        >
          Copiar teléfono
        </Button>

        <Button
          variant="secondary"
          className="justify-start"
          disabled={!quote.customerEmail}
          iconLeft={<Copy className="size-4" />}
          onClick={() => void copyText(quote.customerEmail, "Correo copiado.")}
        >
          Copiar correo
        </Button>

        <Button
          variant="secondary"
          className="justify-start"
          iconLeft={<Copy className="size-4" />}
          onClick={() => void copyText(summaryText, "Resumen de cotización copiado.")}
        >
          Copiar resumen de cotización
        </Button>

        <Button
          variant="secondary"
          className="justify-start"
          iconLeft={<Copy className="size-4" />}
          onClick={() => void copyText(followUpText, "Mensaje de seguimiento copiado.")}
        >
          Copiar mensaje de seguimiento
        </Button>
      </div>

      <p className="text-xs text-slate-500">
        {feedback ?? "Las acciones se generan a partir del detalle actual de la cotización."}
      </p>
    </Card>
  );
}
