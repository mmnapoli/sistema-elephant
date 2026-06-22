import { NextResponse } from "next/server";
import path from "node:path";
import { getSessionUser } from "@/lib/auth-helpers";
import { readStored, mimeForExt } from "@/lib/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { path: segments } = await params;
  const relativePath = segments.join("/");

  try {
    const buffer = await readStored(relativePath);
    const ext = path.extname(relativePath).replace(".", "");
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeForExt(ext),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
  }
}
