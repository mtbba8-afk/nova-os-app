import type { NextAuthConfig } from "next-auth";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const authConfig = {
  basePath: "/api/auth",
  trustHost: true,
  pages: {
    signIn: `${base}/login`,
    newUser: `${base}/`,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage =
        nextUrl.pathname.startsWith(`${base}/login`) ||
        nextUrl.pathname.startsWith(`${base}/register`);
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

      if (isApiAuthRoute) return true;
      if (isAuthPage) return isLoggedIn ? Response.redirect(new URL(`${base}/`, nextUrl)) : true;
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
