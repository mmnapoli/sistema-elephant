"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { clientSchema, type ClientInput } from "@/lib/validation";
import { slugify } from "@/lib/utils";

async function uniqueSlug(name: string, ignoreId?: string): Promise<string> {
  const base = slugify(name) || "cliente";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.client.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${++n}`;
  }
}

function normalize(input: ClientInput) {
  return {
    name: input.name.trim(),
    logoUrl: input.logoUrl?.trim() || null,
    brandColors: input.brandColors ?? [],
    fonts: input.fonts ?? [],
    styleDescription: input.styleDescription?.trim() || null,
    visualRules: input.visualRules?.trim() || null,
    restrictions: input.restrictions?.trim() || null,
    basePrompt: input.basePrompt?.trim() || null,
    referenceImages: input.referenceImages ?? [],
  };
}

export type ActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function createClient(raw: ClientInput): Promise<ActionResult> {
  await requireUser();
  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const data = normalize(parsed.data);
  const slug = await uniqueSlug(data.name);

  const created = await prisma.client.create({
    data: { ...data, slug },
  });

  revalidatePath("/clients");
  return { ok: true, id: created.id };
}

export async function updateClient(
  id: string,
  raw: ClientInput,
): Promise<ActionResult> {
  await requireUser();
  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }
  const data = normalize(parsed.data);
  const slug = await uniqueSlug(data.name, id);

  await prisma.client.update({
    where: { id },
    data: { ...data, slug },
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}/edit`);
  return { ok: true, id };
}

export async function deleteClient(id: string): Promise<void> {
  await requireUser();
  await prisma.client.delete({ where: { id } });
  revalidatePath("/clients");
  redirect("/clients");
}
