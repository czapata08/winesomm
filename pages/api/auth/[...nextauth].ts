import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  // pages: {
  //   signIn: "/login",
  //   verifyRequest: "/login",
  //   error: "/login", //error code passed in query string as ?error=
  // },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(
        "User: ",
        user,
        "Account: ",
        account,
        "Email: ",
        email,
        "Profile: ",
        profile,
        "Credentials: ",
        credentials
      );

      const getUser: object | null = await prisma.user.findUnique({
        where: {
          email: user.email as string,
        },
        select: {
          email: true,
          name: true,
          id: true,
        },
      });

      if (!getUser) {
        return false;
      } else {
        return true;
      }
    },
  },
});
