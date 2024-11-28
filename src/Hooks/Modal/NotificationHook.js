import {useState} from "react"
const useNotificationState = () => {
    const [notification, setNotification] = useState(false)
    const [notificationType, setNotificationType] = useState("")
    const [responseMessage, setResponseMessage] = useState("")

    return {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
    }
}

export default useNotificationState
