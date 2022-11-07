import {createProtectedUserRouter, createRouter} from "./context";
import {z} from "zod";
import {getToken} from "next-auth/jwt";

export const userRouter = createProtectedUserRouter()
    .mutation("changePassword", {
        input: z.object({password: z.string().min(8)}),
        async resolve({ctx, input}) {
            // console.log(ctx)
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
    }).query("getUserInfo", {
        async resolve({ctx}) {
            return await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
                select: {
                    accounts: true
                }
            });
        }
    }).query("getSession", {
        resolve({ ctx }) {
            return ctx.session;
        },
    })
    .query("getSecretMessage", {
        output: z.string(),
        resolve({ ctx }) {
            return "You are Authenticated as " + ctx.session.user.name;
        },
    });

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
