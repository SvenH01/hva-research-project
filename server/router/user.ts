import {createProtectedUserRouter, createRouter} from "./context";
import {z} from "zod";

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

export const newUserRouter = createRouter()
    .mutation("",{
        input: z.object({
                name: z.string(),
                email: z.string().email(),
                password: z.string().regex(new RegExp("(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$")),
                role: z.enum(["ADMIN", "USER"])
            }
        ),
        async resolve({ctx, input}) {

            return await ctx.prisma.user.create({
                    data: input
                }
            )
        }
})
