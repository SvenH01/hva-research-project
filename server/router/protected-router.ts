import { createProtectedUserRouter } from "./context";
import z from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedRouter = createProtectedUserRouter()
    .query("getSession", {
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
