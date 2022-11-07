import {createProtectedAdminRouter} from "./context";
import { z } from "zod";

export const adminRouter = createProtectedAdminRouter().query("getSecretMessage", {
    output: z.string(),
    resolve({ ctx }) {
        return "You are a super user " + ctx.session.user.name + " and you are an admin!";
    }
});
