import { Get } from "./Requests"
/**
 * validates the server authorization
*/
export default async function AuthLoader() {
    try {
        const response = await Get("/get-auth")
        if(response.length === 0 || response.error) {
            throw new Response("unauthorized user", {status: 400})
        }
        return response[0]
    } catch(er) {
        throw new Response(er, {status: 400})
    }
}
