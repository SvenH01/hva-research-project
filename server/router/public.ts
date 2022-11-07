import {createRouter} from "./context";
import {z} from "zod";

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
