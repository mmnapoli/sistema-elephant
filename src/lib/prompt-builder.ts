import type { Client } from "@/generated/prisma/client";
import type { Format } from "@/generated/prisma/enums";
import { getFormatMeta } from "@/lib/formats";

export interface BriefingInput {
  briefing: string;
  mainText?: string | null;
  secondaryText?: string | null;
  cta?: string | null;
  observations?: string | null;
}

const ORIENTATION_HINT: Record<string, string> = {
  square: "composição quadrada (1:1), equilibrada para feed",
  portrait:
    "composição vertical (9:16) para stories; mantenha elementos importantes longe das bordas superior e inferior",
  landscape: "composição horizontal para feed do Facebook",
};

function bullet(label: string, value?: string | null): string | null {
  const v = value?.trim();
  return v ? `- ${label}: ${v}` : null;
}

/**
 * Monta o prompt final enviado ao gpt-image-1.
 *
 * Regras de ouro:
 * 1. A IA gera APENAS o visual/fundo — o texto e o logo entram depois como
 *    camadas editáveis no editor. Por isso pedimos para NÃO desenhar texto.
 * 2. NUNCA inventar textos/dados que não foram fornecidos no briefing.
 * 3. Respeitar estilo, cores e restrições da marca.
 */
export function buildFinalPrompt(
  client: Client,
  format: Format,
  input: BriefingInput,
): string {
  const meta = getFormatMeta(format);
  const colors = Array.isArray(client.brandColors)
    ? (client.brandColors as string[])
    : [];

  // Quais áreas de texto reservar (espaço limpo) — sem renderizar o texto em si.
  const reserveAreas: string[] = [];
  if (input.mainText?.trim()) reserveAreas.push("título principal");
  if (input.secondaryText?.trim()) reserveAreas.push("subtítulo");
  if (input.cta?.trim()) reserveAreas.push("chamada para ação (CTA)");
  const hasLogo = !!client.logoUrl;
  if (hasLogo) reserveAreas.push("logo da marca");

  const sections: Array<string | null> = [
    `Crie uma arte profissional de social media para ${meta.channel} no formato ${meta.label}.`,
    `Formato/orientação: ${ORIENTATION_HINT[meta.orientation]} (${meta.width}x${meta.height}px).`,
    "",
    `MARCA: ${client.name}`,
    client.basePrompt?.trim()
      ? `Direção criativa da marca: ${client.basePrompt.trim()}`
      : null,
    bullet("Estilo visual", client.styleDescription),
    bullet("Regras visuais", client.visualRules),
    colors.length ? `- Paleta de cores (use predominantemente): ${colors.join(", ")}` : null,
    "",
    "BRIEFING DA PEÇA:",
    input.briefing.trim(),
    bullet("Observações adicionais", input.observations),
    "",
    "REGRAS OBRIGATÓRIAS:",
    "- Gere APENAS o visual/fundo da arte. NÃO escreva nenhum texto, palavra, letra ou número na imagem.",
    reserveAreas.length
      ? `- Deixe áreas limpas e equilibradas (espaço negativo) para inserir depois: ${reserveAreas.join(", ")}.`
      : "- Pode usar toda a composição livremente, mantendo respiro visual.",
    "- NÃO invente logotipos, marcas d'água, textos fictícios ou dados que não foram fornecidos.",
    client.restrictions?.trim()
      ? `- Restrições da marca (NUNCA fazer): ${client.restrictions.trim()}`
      : null,
    "- Alta qualidade, iluminação coerente e composição pronta para publicação.",
  ];

  return sections.filter((s) => s !== null).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
