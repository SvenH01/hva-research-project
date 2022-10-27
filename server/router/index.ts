// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedRouter } from "./protected-router";
import { userRouter } from "./user";
import {adminRouter} from "./admin";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("example.", exampleRouter)
    .merge("user.", userRouter)
    .merge("auth.", protectedRouter)
    .merge("admin.", adminRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
