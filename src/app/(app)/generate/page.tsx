import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState, Button } from "@/components/ui";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GenerateWizard } from "@/components/generate-wizard";

export const dynamic = "force-dynamic";

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, logoUrl: true, brandColors: true },
  });

  return (
    <div>
      <PageHeader
        title="Gerar arte"
        description="Escolha o cliente, o formato e descreva a peça."
      />
      {clients.length === 0 ? (
        <EmptyState
          title="Cadastre um cliente primeiro"
          description="A geração usa o perfil visual do cliente."
          action={
            <Link href="/clients/new">
              <Button>
                <Plus size={16} /> Novo cliente
              </Button>
            </Link>
          }
        />
      ) : (
        <GenerateWizard
          clients={clients.map((c) => ({
            id: c.id,
            name: c.name,
            logoUrl: c.logoUrl,
            brandColors: (c.brandColors as string[]) ?? [],
          }))}
          initialClientId={clientId}
        />
      )}
    </div>
  );
}
