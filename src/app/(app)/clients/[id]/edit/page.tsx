import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import { ClientForm } from "@/components/client-form";
import { DeleteClientButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <div>
      <PageHeader
        title={`Editar: ${client.name}`}
        description="Atualize o perfil visual do cliente."
        action={<DeleteClientButton id={client.id} />}
      />
      <ClientForm
        initial={{
          id: client.id,
          name: client.name,
          logoUrl: client.logoUrl,
          brandColors: (client.brandColors as string[]) ?? [],
          fonts: (client.fonts as { name: string; url?: string }[]) ?? [],
          styleDescription: client.styleDescription,
          visualRules: client.visualRules,
          restrictions: client.restrictions,
          basePrompt: client.basePrompt,
          referenceImages: (client.referenceImages as string[]) ?? [],
        }}
      />
    </div>
  );
}
