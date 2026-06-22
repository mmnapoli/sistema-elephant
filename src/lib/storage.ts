import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

function storageRoot(): string {
  return path.resolve(process.env.STORAGE_DIR ?? "./storage");
}

/** Garante que um caminho relativo fica dentro do storage root (anti path traversal). */
function resolveSafe(relativePath: string): string {
  const root = storageRoot();
  const full = path.resolve(root, relativePath);
  if (full !== root && !full.startsWith(root + path.sep)) {
    throw new Error("Caminho de arquivo inválido");
  }
  return full;
}

/** Converte uma dataURL (data:image/png;base64,....) em Buffer + extensão. */
export function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; ext: string } {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!match) throw new Error("dataURL inválida");
  const mime = match[1];
  const ext = mime.split("/")[1].replace("jpeg", "jpg");
  return { buffer: Buffer.from(match[2], "base64"), ext };
}

/** Grava um buffer em STORAGE_ROOT/<relativePath> e devolve a URL servida pela app. */
export async function writeFile(
  relativePath: string,
  buffer: Buffer,
): Promise<string> {
  const full = resolveSafe(relativePath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buffer);
  return toPublicUrl(relativePath);
}

/** Salva a imagem de uma geração (raw = fundo da IA, composed = arte final). */
export async function saveGenerationImage(
  clientId: string,
  generationId: string,
  kind: "raw" | "composed",
  buffer: Buffer,
  ext = "png",
): Promise<string> {
  const rel = path.posix.join("clients", clientId, generationId, `${kind}.${ext}`);
  return writeFile(rel, buffer);
}

/** Salva um upload genérico (logo, imagem de referência) e devolve a URL. */
export async function saveUpload(
  buffer: Buffer,
  ext: string,
  subdir = "uploads",
): Promise<string> {
  const safeExt = ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  const rel = path.posix.join(subdir, `${randomUUID()}.${safeExt}`);
  return writeFile(rel, buffer);
}

/** Lê um arquivo armazenado a partir do caminho relativo (usado pela rota de serve). */
export async function readStored(relativePath: string): Promise<Buffer> {
  const full = resolveSafe(relativePath);
  return fs.readFile(full);
}

/** Converte caminho relativo no storage para a URL servida pela aplicação. */
export function toPublicUrl(relativePath: string): string {
  const clean = relativePath.split(path.sep).join("/").replace(/^\/+/, "");
  return `/api/files/${clean}`;
}

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export function mimeForExt(ext: string): string {
  return MIME_BY_EXT[ext.toLowerCase()] ?? "application/octet-stream";
}
