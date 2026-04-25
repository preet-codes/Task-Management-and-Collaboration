import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Extend NextAuth types
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

/**
 * NextAuth config
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("USER:", user);

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log("PASSWORD VALID:", isValid);

        if (!isValid) {
          return null;
        }

        // ✅ IMPORTANT: return clean object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role ?? "USER",
        };
      },
    }),
  ],

  callbacks: {
    // 🔐 store data in JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    // 🔐 expose in session
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt", // ✅ IMPORTANT (fixes your session issue)
  },

  secret: env.NEXTAUTH_SECRET,
};

/**
 * Helper for server-side session
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};