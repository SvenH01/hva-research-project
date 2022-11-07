import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "utils/prisma/client";
import { env } from "env/server.mjs";
import { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";
import Cookies from "cookies";
import { decode, encode } from "next-auth/jwt";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = requestWrapper(req, res);
    return await NextAuth(...data);
};

export default handler;

export function requestWrapper(
    req: NextApiRequest,
    res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
    const generateSessionToken = () => randomUUID();

    const fromDate = (time: number, date = Date.now()) =>
        new Date(date + time * 1000);

    const adapter = PrismaAdapter(prisma);

    const opts: NextAuthOptions = {
        // Include user.id on session
        session: {
            strategy: "jwt",
            maxAge: 30 * 24 * 60 * 60,
            updateAge: 24 * 60 * 60
        },
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
                    console.log(credentials);
                    console.log("HHAHAHAHAHAHAHAAHHAAHHA")

                    // verifying if credential email exists on db
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials?.email,
                        },
                    });

                    if (!user) {
                        console.log('user not found')
                        return null
                    }


                    if (user.password === null) {
                        console.log('user has no password')
                        return null
                    }

                    if (user.password !== credentials?.password) {
                        console.log('passwords do not match')
                        return null
                    }
                    console.log('user found')
                    console.log(user)
                    return user;
                },
            }),
            EmailProvider({
                server: process.env.EMAIL_SERVER,
                from: process.env.EMAIL_FROM
            })
        ],
        pages: {
            signIn: "/auth/login",
        }
    };

    return [req, res, opts];
}
