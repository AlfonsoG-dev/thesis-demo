import { useState } from "react"
export default function useStatusState() {
    const [loading, setLoading] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const start_operation = () => setLoading(true)
    const complete_operation = () => setIsCompleted(true)
    const end_operation = () => setLoading(false)

    return {
        loading, isCompleted,
        start_operation, complete_operation, end_operation
    }
}
