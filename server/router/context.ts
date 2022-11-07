// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import { getServerAuthSession } from "server/common/get-server-auth-session";
import { prisma } from "utils/prisma/client";
import {NextApiRequest, NextApiResponse} from "next";


type CreateContextOptions = {
    session: Session | null;
    req: NextApiRequest,
    res: NextApiResponse
};

export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        req: opts.req,
        res: opts.res,
        session: opts.session,
        prisma,
    };
};

export const createContext = async (
    opts: trpcNext.CreateNextContextOptions,
) => {
    const { req, res } = opts;

    // Get the session from the server using the unstable_getServerSession wrapper function
    const session = await getServerAuthSession({ req, res });

    return await createContextInner({
        session,
        req,
        res
    });
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 **/
export function createProtectedUserRouter() {
    return createRouter().middleware(({ ctx, next }) => {
        if (!ctx.session || !ctx.session.user) {
            throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
        }
        return next({
            ctx: {
                ...ctx,
                session: { ...ctx.session, user: ctx.session.user },
            },
        });
    });
}

export function createProtectedAdminRouter(){
    return createRouter().middleware( async({ ctx, next }) => {
        if (!ctx.session || !ctx.session.user) {
            throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
        }
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            }
        });

        if(user === null || user.role !== "ADMIN"){
            throw new trpc.TRPCError({ code: "UNAUTHORIZED" , message: "You are not an admin"});
        }
        return next({
            ctx: {
                ...ctx,
                session: { ...ctx.session, user: ctx.session.user },
            },
        });
    });
}
