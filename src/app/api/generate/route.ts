import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-helpers";
import { generateSchema } from "@/lib/validation";
import { buildFinalPrompt } from "@/lib/prompt-builder";
import { getFormatMeta } from "@/lib/formats";
import { generateImage } from "@/lib/openai";
import { readStored, saveGenerationImage } from "@/lib/storage";

// Geração pode demorar; estende o tempo máximo da rota.
export const maxDuration = 120;

async function loadReference(url: string) {
  const prefix = "/api/files/";
  if (!url.startsWith(prefix)) return null;
  try {
    const buffer = await readStored(url.slice(prefix.length));
    return { buffer, filename: "reference.png" };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const client = await prisma.client.findUnique({ where: { id: input.clientId } });
  if (!client) {
    return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
  }

  const meta = getFormatMeta(input.format);
  const finalPrompt = buildFinalPrompt(client, input.format, input);

  // Cria registro já em PROCESSING (auditoria + base do histórico).
  const generation = await prisma.generation.create({
    data: {
      clientId: client.id,
      userId: user.id,
      format: input.format,
      briefing: input.briefing,
      mainText: input.mainText || null,
      secondaryText: input.secondaryText || null,
      cta: input.cta || null,
      observations: input.observations || null,
      referenceImageUrl: input.referenceImageUrl || null,
      finalPrompt,
      model: "gpt-image-1",
      sizeUsed: meta.openaiSize,
      status: "PROCESSING",
    },
  });

  try {
    const reference = input.referenceImageUrl
      ? await loadReference(input.referenceImageUrl)
      : null;

    const buffer = await generateImage({
      prompt: finalPrompt,
      size: meta.openaiSize,
      quality: "high",
      referenceImage: reference,
    });

    const rawImageUrl = await saveGenerationImage(
      client.id,
      generation.id,
      "raw",
      buffer,
      "png",
    );

    const updated = await prisma.generation.update({
      where: { id: generation.id },
      data: { rawImageUrl, status: "DONE" },
    });

    return NextResponse.json({ id: updated.id, rawImageUrl: updated.rawImageUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha na geração";
    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: "FAILED", error: message },
    });
    return NextResponse.json({ error: message, id: generation.id }, { status: 500 });
  }
}
