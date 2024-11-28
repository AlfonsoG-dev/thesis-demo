import { Get } from "./Requests"
export default async function ServerLoader() {
    try {
        const response = await Get("")
        if(response === undefined) {
            throw new Response("cannot load server", {status: 400})
        }
        return response
    } catch(er) {
        throw new Response(er, {status: 400})
    }
}
