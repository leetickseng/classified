import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        type: { label: "Type", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const isUser = credentials.type === "user";

        if (isUser) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new Error("Invalid email or password");
          }

          if (user.status === "disabled") {
            throw new Error("Your account has been disabled");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: "user",
          };
        } else {
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email },
          });

          if (!admin || !(await bcrypt.compare(credentials.password, admin.password))) {
            throw new Error("Invalid email or password");
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: "admin",
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
