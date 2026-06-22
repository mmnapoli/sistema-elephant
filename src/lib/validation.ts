import { z } from "zod";

export const formatEnum = z.enum([
  "INSTAGRAM_FEED",
  "INSTAGRAM_STORY",
  "FACEBOOK_FEED",
]);

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Cor inválida (use #RRGGBB)");

export const fontSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
});

/** Perfil visual do cliente (criar/editar). */
export const clientSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(120),
  logoUrl: z.string().url().optional().or(z.literal("")).nullable(),
  brandColors: z.array(hexColor).max(12).optional().default([]),
  fonts: z.array(fontSchema).max(8).optional().default([]),
  styleDescription: z.string().max(4000).optional().or(z.literal("")),
  visualRules: z.string().max(4000).optional().or(z.literal("")),
  restrictions: z.string().max(4000).optional().or(z.literal("")),
  basePrompt: z.string().max(6000).optional().or(z.literal("")),
  referenceImages: z.array(z.string().url()).max(12).optional().default([]),
});

export type ClientInput = z.infer<typeof clientSchema>;

/** Briefing da peça enviado para gerar a arte. */
export const generateSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  format: formatEnum,
  briefing: z.string().min(3, "Descreva o briefing da peça").max(4000),
  mainText: z.string().max(300).optional().or(z.literal("")),
  secondaryText: z.string().max(300).optional().or(z.literal("")),
  cta: z.string().max(120).optional().or(z.literal("")),
  observations: z.string().max(2000).optional().or(z.literal("")),
  referenceImageUrl: z.string().url().optional().or(z.literal("")),
});

export type GenerateInput = z.infer<typeof generateSchema>;

/** Camadas editáveis salvas pelo editor. */
export const layerSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "logo", "image"]),
  // campos de texto
  text: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  fontStyle: z.string().optional(),
  fill: z.string().optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  // campos de imagem/logo
  src: z.string().optional(),
  // transform comum
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  rotation: z.number().optional(),
  scaleX: z.number().optional(),
  scaleY: z.number().optional(),
});

export type LayerData = z.infer<typeof layerSchema>;

export const saveCompositionSchema = z.object({
  generationId: z.string().min(1),
  layers: z.array(layerSchema),
  /** PNG final em dataURL (base64) exportado pelo canvas */
  composedImageDataUrl: z.string().startsWith("data:image/"),
});
