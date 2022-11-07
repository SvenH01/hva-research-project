import {createRouter} from "./context";
import {z} from "zod";

export const publicRouter = createRouter().query("getPublicMessage", {
    output: z.string(),
    resolve() {
        return "Hello World";
    }
})
