import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Garante usuário autenticado (server components / route handlers). */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

/** Garante usuário ADMIN; caso contrário volta ao dashboard. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

/** Versão para API: devolve o usuário ou null (sem redirect). */
export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}
