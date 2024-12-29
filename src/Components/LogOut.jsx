// Dependencies
import PropTypes from "prop-types"
import {useState} from "react"
import { useNavigate } from "react-router-dom"

// icons
import { IoIosLogOut } from "react-icons/io"

// Hooks
import useStatusState from "../Hooks/Form/StatusHook"

// modal Component
import ModalRegister from "./Modals/ModalRegister"
import ModalNotification from "./Modals/ModalNotification"

// Hooks
import useNotificationState from "../Hooks/Modal/NotificationHook"


export default function LogOut({isLightTheme}) {

    const navigate = useNavigate()

    const {
        loading, start_operation, end_operation
    } = useStatusState()
    const [showConfirm, setShowConfirm] = useState(false)
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const handle_close_confirm = () => setShowConfirm(false)
    const handle_show_confirm = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }

    const log_out_handler = () => {
        start_operation()

        if(localStorage.getItem('activeLink') !== null) {
            localStorage.removeItem('activeLink')
        }
        // delete the log user in the local storage
        if(localStorage.getItem('log_user') !== null) {
            localStorage.removeItem('log_user')
        }
        end_operation()
        setResponseMessage("Cerrando sesión")
        setNotificationType("msg")
        handle_close_confirm()
        show_notification()
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
            handle_close={close_notification}
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
