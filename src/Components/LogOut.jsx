// Dependencies
import PropTypes from "prop-types"
import {useState} from "react"
import { useNavigate } from "react-router-dom"

// icons
import { IoIosLogOut } from "react-icons/io"

// modal Component
import ModalRegister from "./Modals/ModalRegister"
import ModalNotification from "./Modals/ModalNotification"

// Hooks
import useNotificationState from "../Hooks/Modal/NotificationHook"


export default function LogOut({isLightTheme}) {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,

    } = useNotificationState()

    const handle_close_confirm = () => setShowConfirm(false)
    const handle_show_confirm = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }

    const handle_close_notification = () => setNotification(false)

    const log_out_handler = () => {
        setLoading(true)

        if(localStorage.getItem('activeLink') !== null) {
            localStorage.removeItem('activeLink')
        }
        // delete the log user in the local storage
        if(localStorage.getItem('log_user') !== null) {
            localStorage.removeItem('log_user')
        }
        setLoading(false)
        setResponseMessage("Cerrando sesión")
        setNotificationType("msg")
        handle_close_confirm()
        setNotification(true)
        setTimeout(() => {
            navigate("/", {
                replace: true
            })
        }, 2000)
    }

    if (loading) {
        return <div className="loader"></div>
    }
    if(showConfirm) {
        return <ModalRegister
            show={showConfirm}
            message={"Estas por cerrar sesión, Confirma esta acción"}
            handle_close={handle_close_confirm}
            handle_confirm={log_out_handler}
        />
    }
    if(notification) {
        return <ModalNotification
            show={notification}
            message={responseMessage}
            type={notificationType}
            handle_close={handle_close_notification}
        />
    }
    return (
        <>
            <form onSubmit={handle_show_confirm}>
                <button 
                    type="submit"
                    className={`log-out-${isLightTheme ? 'light' : 'dark'} logout`}
                >
                    Salir | <IoIosLogOut />
                </button>
            </form>
        </>
    )
}

LogOut.propTypes = {
    isLightTheme: PropTypes.bool
}
