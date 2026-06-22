import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button, Card, EmptyState, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { generations: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Perfis visuais usados para gerar artes com consistência."
        action={
          <Link href="/clients/new">
            <Button>
              <Plus size={16} /> Novo cliente
            </Button>
          </Link>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          title="Nenhum cliente ainda"
          description="Cadastre o primeiro cliente com o perfil visual da marca."
          action={
            <Link href="/clients/new">
              <Button>
                <Plus size={16} /> Novo cliente
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => {
            const colors = Array.isArray(c.brandColors)
              ? (c.brandColors as string[])
              : [];
            return (
              <Card key={c.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                    {c.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logoUrl} alt={c.name} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-lg font-bold text-muted">
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-xs text-muted">{c._count.generations} arte(s)</p>
                  </div>
                </div>

                {colors.length > 0 ? (
                  <div className="flex gap-1">
                    {colors.slice(0, 6).map((color, i) => (
                      <span
                        key={i}
                        className="h-5 w-5 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                ) : null}

                <div className="mt-auto flex gap-2">
                  <Link href={`/clients/${c.id}/edit`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      <Pencil size={14} /> Editar
                    </Button>
                  </Link>
                  <Link href={`/generate?clientId=${c.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Gerar arte
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
