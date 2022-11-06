import {createRouter} from "./context";

export const helloRouter = createRouter()
    .query("test" ,{
        resolve() {
            return "WORLD"
    }
})