import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-helpers";
import { saveCompositionSchema } from "@/lib/validation";
import { dataUrlToBuffer, saveGenerationImage } from "@/lib/storage";

export const maxDuration = 60;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = saveCompositionSchema.safeParse({ ...body, generationId: id });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }

  const generation = await prisma.generation.findUnique({ where: { id } });
  if (!generation) {
    return NextResponse.json({ error: "Geração não encontrada" }, { status: 404 });
  }

  const { buffer } = dataUrlToBuffer(parsed.data.composedImageDataUrl);
  const composedImageUrl = await saveGenerationImage(
    generation.clientId,
    generation.id,
    "composed",
    buffer,
    "png",
  );

  await prisma.generation.update({
    where: { id },
    data: {
      composedImageUrl,
      layers: parsed.data.layers,
    },
  });

  return NextResponse.json({ ok: true, composedImageUrl });
}
