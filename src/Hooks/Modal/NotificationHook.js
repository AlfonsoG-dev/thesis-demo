import {useState} from "react"
export default function useNotificationState() {
    const [notification, setNotification] = useState(false)
    const [notificationType, setNotificationType] = useState("")
    const [responseMessage, setResponseMessage] = useState("")

    const handle_close_notification = () => setNotification(false)
    const handle_show_notification = () => setNotification(true)

    return {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        handle_close_notification, handle_show_notification
    }
}

export function useHelpState() {
    const [showHelp, setShowHelp] = useState(false)

    const handle_show_help = () => setShowHelp(true)
    const handle_close_help = () => setShowHelp(false)

    return {
        showHelp,
        handle_show_help,
        handle_close_help
    }
}
