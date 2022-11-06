import {createProtectedUserRouter} from "./context";
import {z} from "zod";
import * as trpc from "@trpc/server";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

export const todoRouter = createProtectedUserRouter().mutation("addOne", {
    input: z.object({name: z.string().min(1), description: z.string().min(1)}),
    async resolve({ctx, input}) {
        try {
            await limiter.check(ctx.res, 10, 'CACHE_TOKEN') // 10 requests per minute

            return await ctx.prisma.post.create({data: input});
        } catch {
            throw new trpc.TRPCError({code: "TIMEOUT", message: "Rate limit exceeded"});
        }
    },
}).mutation("clearAll", {
    async resolve({ctx}) {
        try {
            await limiter.check(ctx.res, 10, 'CACHE_TOKEN') // 10 requests per minute

            await ctx.prisma.post.deleteMany()
        } catch {
            throw new trpc.TRPCError({code: "TIMEOUT", message: "Rate limit exceeded"});
        }

        return ctx.prisma.post.findMany()
    }
}).query("getAll", {
    async resolve({ctx}) {
        return await ctx.prisma.post.findMany();
    },
});