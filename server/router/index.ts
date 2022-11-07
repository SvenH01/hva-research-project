// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import {newUserRouter, userRouter} from "./user";
import { adminRouter } from "./admin";
import {todoRouter} from "./todo";
import {publicRouter} from "./public";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("user.", userRouter)
    .merge("admin.", adminRouter)
    .merge("todo.", todoRouter)
    .merge("user.new", newUserRouter)
    .merge("public.", publicRouter)
// export type definition of API
export type AppRouter = typeof appRouter;
