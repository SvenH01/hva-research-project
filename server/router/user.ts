import { createProtectedUserRouter, createRouter } from "./context";
import { z } from "zod";

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
});
