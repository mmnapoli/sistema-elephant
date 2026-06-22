"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { ImageUpload } from "@/components/image-upload";
import { FORMAT_LIST } from "@/lib/formats";
import type { Format } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

interface ClientLite {
  id: string;
  name: string;
  logoUrl: string | null;
  brandColors: string[];
}

export function GenerateWizard({
  clients,
  initialClientId,
}: {
  clients: ClientLite[];
  initialClientId?: string;
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState<string | undefined>(
    initialClientId && clients.some((c) => c.id === initialClientId)
      ? initialClientId
      : undefined,
  );
  const [format, setFormat] = useState<Format | undefined>();
  const [briefing, setBriefing] = useState("");
  const [mainText, setMainText] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [cta, setCta] = useState("");
  const [observations, setObservations] = useState("");
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!clientId || !format || briefing.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          format,
          briefing,
          mainText,
          secondaryText,
          cta,
          observations,
          referenceImageUrl: referenceImageUrl ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha na geração");
      router.push(`/editor/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Etapa 1 — Cliente */}
      <section>
        <StepTitle n={1} title="Cliente" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setClientId(c.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-surface p-3 text-left transition-colors",
                clientId === c.id
                  ? "border-brand ring-2 ring-ring"
                  : "border-border hover:bg-background",
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                {c.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.logoUrl} alt={c.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="font-bold text-muted">{c.name.charAt(0)}</span>
                )}
              </div>
              <span className="truncate text-sm font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Etapa 2 — Formato */}
      {clientId ? (
        <section>
          <StepTitle n={2} title="Formato" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {FORMAT_LIST.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFormat(f.key)}
                className={cn(
                  "rounded-xl border bg-surface p-4 text-left transition-colors",
                  format === f.key
                    ? "border-brand ring-2 ring-ring"
                    : "border-border hover:bg-background",
                )}
              >
                <div className="mb-2 flex items-center justify-center">
                  <div
                    className="rounded border border-border bg-background"
                    style={{
                      width: f.orientation === "portrait" ? 30 : 54,
                      height: f.orientation === "portrait" ? 54 : f.orientation === "landscape" ? 28 : 54,
                    }}
                  />
                </div>
                <p className="text-sm font-medium">{f.label}</p>
                <p className="text-xs text-muted">
                  {f.width}×{f.height}px
                </p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Etapa 3 — Briefing */}
      {clientId && format ? (
        <section>
          <StepTitle n={3} title="Briefing da peça" />
          <Card className="space-y-4">
            <Field
              label="Briefing"
              hint="O que a arte precisa comunicar? (tema, objetivo, clima)"
            >
              <Textarea
                value={briefing}
                onChange={(e) => setBriefing(e.target.value)}
                placeholder="Ex: post de lançamento da nova coleção de verão, clima leve e colorido."
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Texto principal (opcional)">
                <Input value={mainText} onChange={(e) => setMainText(e.target.value)} />
              </Field>
              <Field label="Texto secundário (opcional)">
                <Input
                  value={secondaryText}
                  onChange={(e) => setSecondaryText(e.target.value)}
                />
              </Field>
              <Field label="CTA (opcional)">
                <Input value={cta} onChange={(e) => setCta(e.target.value)} />
              </Field>
              <Field label="Imagem de referência (opcional)">
                <ImageUpload
                  value={referenceImageUrl}
                  onChange={setReferenceImageUrl}
                  label="Enviar referência"
                />
              </Field>
            </div>

            <Field label="Observações adicionais (opcional)">
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </Field>

            <p className="text-xs text-muted">
              Dica: os textos são opcionais e entrarão como camadas editáveis no editor. A
              IA gera apenas o visual e nunca inventa textos não informados.
            </p>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <Button onClick={generate} disabled={loading || briefing.trim().length < 3}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Gerando arte...
                </>
              ) : (
                "Gerar arte"
              )}
            </Button>
          </Card>
        </section>
      ) : null}

      {loading ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/40 text-white">
          <Loader2 size={40} className="animate-spin" />
          <p className="font-medium">Gerando a arte com a IA…</p>
          <p className="text-sm text-white/80">Isso pode levar alguns segundos.</p>
        </div>
      ) : null}
    </div>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-fg">
        {n}
      </span>
      <h2 className="font-semibold">{title}</h2>
      <Check className="text-muted" size={14} />
    </div>
  );
}
