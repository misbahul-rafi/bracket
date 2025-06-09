import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
        const identifier = credentials?.email
        const password = credentials?.password

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier }
            ],
          },
        })

        if (!user || !password) return null

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        // (session.user as { id: string }).id = token.id as string
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}