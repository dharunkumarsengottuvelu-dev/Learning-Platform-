import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// IMPORTANT for Vercel/Render deployment:
// Set AUTH_URL (or NEXTAUTH_URL) in your hosting environment variables to your
// exact deployment URL, e.g. https://training-compiler.vercel.app
// Without this, NextAuth cannot correctly bind cookies to the right domain.
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  // trustHost is required on Vercel/Render — they use reverse proxies and
  // NextAuth must trust the X-Forwarded-Host header to derive the correct URL.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.photo = (user as any).photo;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).photo = token.photo;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            photo: user.photo,
          };
        } catch (error: any) {
          console.error("[AUTH] Error:", error?.message ?? error);
          return null;
        }
      },
    }),
  ],
});


