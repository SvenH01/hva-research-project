import {createRouter} from "./context";
import {z} from "zod";
import { getToken } from "next-auth/jwt"
import * as trpc from "@trpc/server";

export const publicRouter = createRouter().middleware(async ({ctx, next}) => {
    return next({
        ctx: {
            ...ctx,
        }
    })
}).query("getPublicMessage", {
    output: z.string(),
    resolve() {
        return "Hello World";
    }
})
