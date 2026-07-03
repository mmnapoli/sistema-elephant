import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

// Next 16: convenção "proxy" (substitui o antigo middleware).
export default auth;

export const config = {
  // Protege tudo, exceto rotas de API (guardadas individualmente),
  // assets do Next e arquivos estáticos.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|presentation-assets).*)"],
};
