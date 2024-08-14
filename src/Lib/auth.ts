import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Username and Password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) {
          throw new Error("Username and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { username: username },
        });

        if (!user) {
          throw new Error("Username not found.");
        }

        if (user && bcrypt.compareSync(password, user.password)) {
          return {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
          };
        }

        throw new Error("Invalid password.");
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.username = user.username;
        token.userRole = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId!;
        session.user.username = token.username!;
        session.user.role = token.userRole!;
      }
      return session;
    },
  },
});
