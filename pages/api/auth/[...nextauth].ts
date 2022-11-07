import NextAuth, {NextAuthOptions, Session, User} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "utils/prisma/client";
import { env } from "env/server.mjs";
import { NextApiRequest, NextApiResponse } from "next";
import {JWT} from "next-auth/jwt";
import {unknown} from "zod";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = requestWrapper(req, res);
    return await NextAuth(...data);
};

export default handler;

export function requestWrapper(
    req: NextApiRequest,
    res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
    const adapter = PrismaAdapter(prisma);

    const opts: NextAuthOptions = {
        adapter: adapter,
        // Configure one or more authentication providers
        secret: env.NEXTAUTH_SECRET,
        debug: true,
        providers: [
            GithubProvider({
                clientId: env.GITHUB_ID,
                clientSecret: env.GITHUB_SECRET,
            }),
            CredentialProvider({
                name: "CredentialProvider",
                credentials: {
                    email: { label: "Email", type: "text"},
                    password: { label: "Password", type: "password" },
                },
                async authorize(credentials, req) {
                    // verifying if credential email exists on db
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials?.email,
                        },
                    });

                    if (!user || user.password !== credentials?.password || user.password === null) {
                        return null
                    }

                    return user;
                },
            }),
            EmailProvider({
                server: process.env.EMAIL_SERVER,
                from: process.env.EMAIL_FROM
            })
        ],
        callbacks: {
            async jwt({token,user}){
                if(user){
                    token.id = user.id
                }
                return token
            },
            async session({session, token}: {session: Session, token: any}){
                if (session){
                    session.user.id = token.id
                }

                return session
            }
        },
        session: {
            strategy: "jwt",
            maxAge: 30 * 24 * 60 * 60,
            updateAge: 24 * 60 * 60
        },
        pages: {
            signIn: "/auth/login",
        }
    };

    return [req, res, opts];
}
