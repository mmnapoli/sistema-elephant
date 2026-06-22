import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-helpers";
import { saveUpload } from "@/lib/storage";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Formato não suportado (use PNG, JPG, WEBP ou SVG)" },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Arquivo muito grande (máx. 8MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split("/")[1].replace("jpeg", "jpg").replace("svg+xml", "svg");
  const url = await saveUpload(buffer, ext);

  return NextResponse.json({ url });
}
