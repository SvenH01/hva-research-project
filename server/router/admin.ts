import {createProtectedAdminRouter, createProtectedUserRouter, createRouter} from "./context";
import { z } from "zod";

export const adminRouter = createProtectedAdminRouter().query("getSuperSuperSecretMessage", {
    output: z.string(),
    resolve({ ctx }) {
        return "You are Authenticated as " + ctx.session.user.name;
    }
});
