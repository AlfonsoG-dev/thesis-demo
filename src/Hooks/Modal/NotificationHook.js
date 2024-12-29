import {useState} from "react"
export default function useNotificationState() {
    const [notification, setNotification] = useState(false)
    const [notificationType, setNotificationType] = useState("")
    const [responseMessage, setResponseMessage] = useState("")

    const close_notification = () => setNotification(false)
    const show_notification = () => setNotification(true)

    return {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        close_notification, show_notification
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
