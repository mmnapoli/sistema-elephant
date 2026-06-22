import type { NextAuthConfig } from "next-auth";

/**
 * Configuração edge-safe (sem Prisma/bcrypt), usada pelo middleware.
 * Os providers são adicionados em `src/auth.ts` (runtime Node).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: "ADMIN" | "EQUIPE" }).role ?? "EQUIPE";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role as "ADMIN" | "EQUIPE") ?? "EQUIPE";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
