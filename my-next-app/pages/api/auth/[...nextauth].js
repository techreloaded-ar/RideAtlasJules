import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // For production, generate a strong secret
  // Optional: Add session strategy if needed, e.g., database or jwt
  // session: {
  //   strategy: 'database', // or 'jwt'
  // },
  // Optional: Add callbacks for customizing behavior
  // callbacks: {
  //   async session({ session, user }) {
  //     // Send properties to the client, like an access_token and user.id from a provider.
  //     session.userId = user.id;
  //     return session;
  //   }
  // }
});
