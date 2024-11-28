const baseurl = import.meta.env.VITE_APP_API
/**
 * used for POST content to the server API 
 * @param url server API end point
 * @param body_req content to post
 * @return end-point response
 */
export async function Post(url, body_req) {
    try {
        const response = await fetch(`${baseurl}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body_req),
            credentials: "include"
        })
        return response.json()
    } catch(er) {
        console.error(er)
    }
}

/**
 * used to get content of the server API
 * @param url server API end-point
 * @return end-point response
*/
export async function Get(url) {
    try {
        const response = await fetch(`${baseurl}${url}`, {
            signal: AbortSignal.timeout(5000),
            method: "GET",
            credentials: "include"
        })
        return response.json()
    } catch(er) {
        console.error(er)
    }
}
/**
 * used to delete or perform delete http requests
*/
export async function Delete(url, body) {
    try {
        const response = await fetch(`${baseurl}${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            credentials: "include"
        })
        return response.json()
    } catch(er) {
        console.error(er)
    }
}
