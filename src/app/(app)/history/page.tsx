import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, EmptyState, Badge } from "@/components/ui";
import { FORMAT_LIST, getFormatMeta } from "@/lib/formats";
import { formatDate } from "@/lib/utils";
import type { Format } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  DONE: "bg-green-100 text-green-700",
  PROCESSING: "bg-amber-100 text-amber-700",
  FAILED: "bg-red-100 text-red-700",
  PENDING: "bg-gray-100 text-gray-600",
};

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; format?: string }>;
}) {
  const sp = await searchParams;
  const clientId = sp.clientId || undefined;
  const format = (FORMAT_LIST.some((f) => f.key === sp.format) ? sp.format : undefined) as
    | Format
    | undefined;

  const [clients, generations] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.generation.findMany({
      where: { clientId, format },
      orderBy: { createdAt: "desc" },
      include: { client: true },
      take: 100,
    }),
  ]);

  return (
    <div>
      <PageHeader title="Histórico" description="Todas as artes geradas." />

      <form className="mb-5 flex flex-wrap gap-3" method="GET">
        <select
          name="clientId"
          defaultValue={clientId ?? ""}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
        >
          <option value="">Todos os clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="format"
          defaultValue={format ?? ""}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm"
        >
          <option value="">Todos os formatos</option>
          {FORMAT_LIST.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg bg-brand px-4 text-sm font-medium text-brand-fg"
        >
          Filtrar
        </button>
      </form>

      {generations.length === 0 ? (
        <EmptyState title="Nenhuma arte encontrada" description="Ajuste os filtros ou gere uma nova arte." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {generations.map((g) => {
            const meta = getFormatMeta(g.format);
            const thumb = g.composedImageUrl ?? g.rawImageUrl ?? "";
            return (
              <Link key={g.id} href={`/history/${g.id}`}>
                <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
                  <div className="aspect-square bg-background">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="truncate text-sm font-medium">{g.client.name}</p>
                    <p className="text-xs text-muted">{meta.label}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">{formatDate(g.createdAt)}</span>
                      <Badge className={STATUS_STYLE[g.status]}>{g.status}</Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
