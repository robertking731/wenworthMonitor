// app/api/auth/[...nextauth]/route.ts

import bcrypt from 'bcrypt';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuthOptions, { Session, SessionStrategy } from 'next-auth';

import clientPromise from '../../../../lib/mongodb';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            authorize: async (credentials) => {
                const { email, password } = credentials as { email: string; password: string }
                const user = await authCheck(email, password);
                if (user) {
                    console.log(user);
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name,
                    };
                }
                return null;
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt' as SessionStrategy,
        maxAge: 24 * 60 * 60 // ** 1 day
    },
    callbacks: {
        async session({ session, token, user }: {
            session: Session,
            token: JWT,
            user: AdapterUser // change this from Adapter to AdapterUser
        }) {
            console.log('callback-token', token);
            console.log('callback-session', session);
            console.log('callback-user', user);
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
            }
            console.log('callback-session', session);
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};

const handler = NextAuthOptions(authOptions);

export { handler as GET, handler as POST };

async function authCheck(email: string, password: string) {
    const client = await clientPromise;
    const db = client.db('aleksey-portfolio');
    const user = await db.collection('users').findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
        return { id: user._id, email: user.email, name: user.name };
    }
    return null;
}