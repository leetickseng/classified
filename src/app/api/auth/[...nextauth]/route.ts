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
        console.log("Authorize attempt:", credentials?.email, "Type:", credentials?.type);
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password");
          throw new Error("Invalid credentials");
        }

        const isUser = credentials.type === "user";

        if (isUser) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.error("User not found:", credentials.email);
            throw new Error("Invalid email or password");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.error("Invalid password for user:", credentials.email);
            throw new Error("Invalid email or password");
          }

          if (user.status === "disabled") {
            console.error("User account disabled:", credentials.email);
            throw new Error("Your account has been disabled");
          }

          console.log("User authorized successfully:", user.email);
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
            console.error("Invalid admin credentials:", credentials.email);
            throw new Error("Invalid email or password");
          }

          console.log("Admin authorized successfully:", admin.email);
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
