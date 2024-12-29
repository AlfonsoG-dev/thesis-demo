import { useState } from "react"
export default function usePaginationState(default_limit_value) {

    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(default_limit_value)

    const handle_pagination = (new_offset, new_limit) => {
        if(new_offset >= 0 && new_limit >= 0) {
            setOffset(new_offset)
            setLimit(new_limit)
        }
    }

    return {
        offset, setOffset,
        limit, setLimit,
        handle_pagination
    }

}
