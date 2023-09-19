import NextAuth from 'next-auth';
import { CredentialsProvider } from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
// import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'sign in',
      credentials: {
        email: {
          lable: '',
          type: 'email',
          placeholder: '',
        },
        password: {
          label: 'password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.pass) {
          return null;
        }
        const dbUser = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });
        if(dbUser){
            return  dbUser as User;
        }
        return null
      },
    }),
    DiscordProvider({
      clientId: String(process.env.DISCORD_CLIENT_ID),
      clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
    }),
    // ...add more providers here
    // GoogleProvider({
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   }),
  ],
};

export default NextAuth(authOptions);
