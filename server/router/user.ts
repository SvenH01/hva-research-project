import { createProtectedUserRouter, createRouter } from "./context";
import { z } from "zod";
import rateLimit from "utils/rate-limit";
import * as trpc from "@trpc/server";

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

export const userRouter = createProtectedUserRouter().mutation("changePassword", {
    input: z.object({ password: z.string().min(8) }),
    async resolve({ ctx, input }) {
        return await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                password: input.password,
            },
        });
    },
}).query("getSuperSecretMessage", {
    output: z.string(),
    resolve({ ctx }) {
        return "You are Authenticated as " + ctx.session.user.name;
    }
})    .query("hello", {
    input: z
        .object({
            text: z.string().nullish(),
        })
        .nullish(),
    resolve({ input }) {
        return {
            greeting: `Hello ${input?.text ?? "world"}`,
        };
    },
})
    .query("getAll", {
        async resolve({ ctx }) {
            return await ctx.prisma.post.findMany();
        },
    })
    .mutation("addTodo", {
        input: z.object({ name: z.string(), description: z.string() }),
        async resolve({ ctx, input }) {
            try {
                await limiter.check(ctx.res, 10, 'CACHE_TOKEN') // 10 requests per minute

                return await ctx.prisma.post.create({ data: input });
            } catch {
                throw new trpc.TRPCError({ code: "TIMEOUT", message: "Rate limit exceeded"});
            }
        },
    });
