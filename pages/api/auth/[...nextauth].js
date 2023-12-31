import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "./../../../lib/mongodb";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session,token,user}) => {
        return session;
    },
  },
};

export default NextAuth(authOptions);

