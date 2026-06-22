import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getFormatMeta } from "@/lib/formats";
import { PageHeader } from "@/components/ui";
import { EditorLoader } from "@/components/editor/editor-loader";
import type { LayerData } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const generation = await prisma.generation.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!generation) notFound();

  if (!generation.rawImageUrl || generation.status !== "DONE") {
    return (
      <div>
        <PageHeader title="Arte indisponível" />
        <p className="text-sm text-muted">
          {generation.status === "FAILED"
            ? `A geração falhou: ${generation.error ?? "erro desconhecido"}`
            : "A imagem ainda não foi gerada para esta peça."}
        </p>
      </div>
    );
  }

  const meta = getFormatMeta(generation.format);

  return (
    <div>
      <PageHeader
        title="Editor de arte"
        description={`${generation.client.name} · ${meta.label}`}
      />
      <EditorLoader
        data={{
          generationId: generation.id,
          format: meta,
          rawImageUrl: generation.rawImageUrl,
          composedImageUrl: generation.composedImageUrl,
          savedLayers: (generation.layers as LayerData[] | null) ?? null,
          texts: {
            mainText: generation.mainText,
            secondaryText: generation.secondaryText,
            cta: generation.cta,
          },
          client: {
            logoUrl: generation.client.logoUrl,
            brandColors: (generation.client.brandColors as string[]) ?? [],
            fonts: (generation.client.fonts as { name: string; url?: string }[]) ?? [],
          },
        }}
      />
    </div>
  );
}
