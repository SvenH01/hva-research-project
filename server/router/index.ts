// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedRouter } from "./protected-router";
import {newUserRouter, userRouter} from "./user";
import { adminRouter } from "./admin";
import {todoRouter} from "./todo";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("user.", userRouter)
    .merge("auth.", protectedRouter)
    .merge("admin.", adminRouter)
    .merge("todo.", todoRouter)
    .merge("user.new.", newUserRouter)
// export type definition of API
export type AppRouter = typeof appRouter;
