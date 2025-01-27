import { useState } from "react"
import {users} from "../../back-end/user"
const DEFAULT_LIMIT = 5
export default function useDataState(listData=[]) {
    const [elements, setElements] = useState(listData)
    const [limit, setLimit] = useState(DEFAULT_LIMIT)
    const [offset, setOffset] = useState(0)

    function getElements(offset, limit) {
        let pagination = []
        if(limit >= elements.length) {
            limit = elements.length
        }
        for(let i=offset; i<limit; ++i) {
            pagination.push(elements[i])
        }
        return pagination
    }

    function handleNext() {
        if(getElements(offset, limit).length > 0 && limit <= elements.length) {
            setLimit(limit + DEFAULT_LIMIT)
            setOffset(offset + DEFAULT_LIMIT)
        }
    }
    function handlePrev() {
        if(limit > 0 && offset > 0) {
            setLimit(limit - DEFAULT_LIMIT)
            setOffset(offset - DEFAULT_LIMIT)
        }
    }
    function addElement(element) {
        const now = new Date(Date.now())
        const tomorrow = new Date(now.getDate()+1)

        const m_time_limit = element.rol === 'transitorio' ? tomorrow : null
        const comp_user = {
            id_pk: elements.length + 1,
            ...element,
            time_limit: m_time_limit,
            create_at: new Date(Date.now()),
            update_at: null
        }
        setElements(elements.push(comp_user))
        return elements.length
    }
    return  {
        elements, setElements, getElements, limit, offset, handleNext, handlePrev, addElement
    }
}
