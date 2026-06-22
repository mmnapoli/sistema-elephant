import type { Format } from "@/generated/prisma/enums";

export type OpenAISize = "1024x1024" | "1024x1536" | "1536x1024";

export interface FormatMeta {
  /** Valor do enum no banco */
  key: Format;
  /** Rótulo amigável exibido na UI */
  label: string;
  /** Onde a peça será publicada */
  channel: string;
  /** Dimensões reais da arte final (px) usadas no editor/exportação */
  width: number;
  height: number;
  /** Tamanho suportado pelo gpt-image-1 mais próximo do formato */
  openaiSize: OpenAISize;
  /** Orientação para orientar o prompt */
  orientation: "square" | "portrait" | "landscape";
}

export const FORMATS: Record<Format, FormatMeta> = {
  INSTAGRAM_FEED: {
    key: "INSTAGRAM_FEED",
    label: "Instagram Feed",
    channel: "Instagram",
    width: 1080,
    height: 1080,
    openaiSize: "1024x1024",
    orientation: "square",
  },
  INSTAGRAM_STORY: {
    key: "INSTAGRAM_STORY",
    label: "Instagram Story",
    channel: "Instagram",
    width: 1080,
    height: 1920,
    openaiSize: "1024x1536",
    orientation: "portrait",
  },
  FACEBOOK_FEED: {
    key: "FACEBOOK_FEED",
    label: "Facebook Feed",
    channel: "Facebook",
    width: 1200,
    height: 630,
    openaiSize: "1536x1024",
    orientation: "landscape",
  },
};

export const FORMAT_LIST: FormatMeta[] = Object.values(FORMATS);

export function getFormatMeta(format: Format): FormatMeta {
  return FORMATS[format];
}
