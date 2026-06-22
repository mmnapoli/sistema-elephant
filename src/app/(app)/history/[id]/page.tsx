import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button, Card, PageHeader, Badge } from "@/components/ui";
import { getFormatMeta } from "@/lib/formats";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-32 shrink-0 text-muted">{label}</span>
      <span className="flex-1 whitespace-pre-wrap">{value}</span>
    </div>
  );
}

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const g = await prisma.generation.findUnique({
    where: { id },
    include: { client: true },
  });
  if (!g) notFound();

  const meta = getFormatMeta(g.format);
  const image = g.composedImageUrl ?? g.rawImageUrl ?? "";

  return (
    <div>
      <PageHeader
        title={g.client.name}
        description={`${meta.label} · ${formatDate(g.createdAt)}`}
        action={
          <div className="flex gap-2">
            <Link href={`/editor/${g.id}`}>
              <Button>
                <Pencil size={16} /> Abrir no editor
              </Button>
            </Link>
            {image ? (
              <a href={image} download={`arte-${g.id}.png`}>
                <Button variant="secondary">
                  <Download size={16} /> Baixar
                </Button>
              </a>
            ) : null}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-3">
          <div className="bg-background">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="mx-auto max-h-[70vh] object-contain" />
            ) : (
              <p className="p-10 text-center text-sm text-muted">Sem imagem.</p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Detalhes</h3>
              <Badge className="bg-gray-100 text-gray-600">{g.status}</Badge>
            </div>
            <Row label="Cliente" value={g.client.name} />
            <Row label="Formato" value={`${meta.label} (${meta.width}×${meta.height})`} />
            <Row label="Modelo" value={`${g.model} · ${g.sizeUsed}`} />
            <Row label="Briefing" value={g.briefing} />
            <Row label="Texto principal" value={g.mainText} />
            <Row label="Texto secundário" value={g.secondaryText} />
            <Row label="CTA" value={g.cta} />
            <Row label="Observações" value={g.observations} />
            {g.error ? <Row label="Erro" value={g.error} /> : null}
          </Card>

          <Card>
            <details>
              <summary className="cursor-pointer font-semibold">Prompt final usado</summary>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-background p-3 text-xs text-foreground">
                {g.finalPrompt}
              </pre>
            </details>
          </Card>
        </div>
      </div>
    </div>
  );
}
