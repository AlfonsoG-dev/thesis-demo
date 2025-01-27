import { useState } from "react"
const DEFAULT_LIMIT = 2
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
        const c = [...elements]
        c.push(element)
        setElements(c)
        return elements.length
    }
    return  {
        elements, setElements, getElements, limit, offset, handleNext, handlePrev, addElement
    }
}
