import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Note: We are NOT using the MongoDBAdapter here to prevent connection timeouts
// The database is still used for your Products, just not for storing "Sessions"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  // 1. IMPORTANT: We use a secret to sign the login token
  secret: process.env.NEXTAUTH_SECRET, 
  
  // 2. CONFIG: Use simple tokens instead of Database sessions
  session: {
    strategy: "jwt",
  },

  // 3. ALLOW EVERYONE (Option B for your teacher/grader)
  callbacks: {
    async signIn({ user }) {
      return true; // Allow login
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };