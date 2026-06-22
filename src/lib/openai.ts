import OpenAI, { toFile } from "openai";
import type { OpenAISize } from "@/lib/formats";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada no ambiente (.env)");
  }
  client ??= new OpenAI({ apiKey });
  return client;
}

export interface GenerateImageParams {
  prompt: string;
  size: OpenAISize;
  /** "low" | "medium" | "high" (gpt-image-1) */
  quality?: "low" | "medium" | "high";
  /** Buffer de uma imagem de referência opcional (usa o endpoint de edição). */
  referenceImage?: { buffer: Buffer; filename: string } | null;
}

/**
 * Gera uma imagem com gpt-image-1 e devolve o PNG como Buffer.
 * Se houver imagem de referência, usa o endpoint de edição (image-to-image).
 */
export async function generateImage({
  prompt,
  size,
  quality = "high",
  referenceImage,
}: GenerateImageParams): Promise<Buffer> {
  const openai = getClient();

  const result = referenceImage
    ? await openai.images.edit({
        model: "gpt-image-1",
        prompt,
        size,
        quality,
        image: await toFile(referenceImage.buffer, referenceImage.filename, {
          type: "image/png",
        }),
      })
    : await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        size,
        quality,
      });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("A OpenAI não retornou imagem (b64_json vazio)");
  }
  return Buffer.from(b64, "base64");
}
