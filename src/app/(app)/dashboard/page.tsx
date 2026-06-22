import Link from "next/link";
import { Sparkles, Users, Images } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button, Card, PageHeader, EmptyState } from "@/components/ui";
import { getFormatMeta } from "@/lib/formats";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [clientCount, genCount, recent] = await Promise.all([
    prisma.client.count(),
    prisma.generation.count({ where: { status: "DONE" } }),
    prisma.generation.findMany({
      where: { status: "DONE" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { client: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral e atalhos."
        action={
          <Link href="/generate">
            <Button>
              <Sparkles size={16} /> Gerar arte
            </Button>
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
            <Users className="text-brand" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{clientCount}</p>
            <p className="text-sm text-muted">Clientes</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
            <Images className="text-brand" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{genCount}</p>
            <p className="text-sm text-muted">Artes geradas</p>
          </div>
        </Card>
      </div>

      <h2 className="mb-3 font-semibold">Artes recentes</h2>
      {recent.length === 0 ? (
        <EmptyState
          title="Nenhuma arte ainda"
          description="Gere a primeira arte para um cliente."
          action={
            <Link href="/generate">
              <Button>
                <Sparkles size={16} /> Gerar arte
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recent.map((g) => {
            const meta = getFormatMeta(g.format);
            const thumb = g.composedImageUrl ?? g.rawImageUrl ?? "";
            return (
              <Link key={g.id} href={`/editor/${g.id}`}>
                <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
                  <div className="aspect-square bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium">{g.client.name}</p>
                    <p className="text-xs text-muted">{meta.label}</p>
                    <p className="mt-1 text-xs text-muted">{formatDate(g.createdAt)}</p>
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
