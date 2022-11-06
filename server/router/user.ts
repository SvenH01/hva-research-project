import {createProtectedUserRouter, createRouter} from "./context";
import {z} from "zod";
import rateLimit from "utils/rate-limit";
import * as trpc from "@trpc/server";

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

export const userRouter = createProtectedUserRouter()
    .mutation("changePassword", {
        input: z.object({password: z.string().min(8)}),
        async resolve({ctx, input}) {
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
        resolve({ctx}) {
            return "You are Authenticated as " + ctx.session.user.name;
        }
    })
