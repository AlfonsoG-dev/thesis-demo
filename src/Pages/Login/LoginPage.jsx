// Dependencies
import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

// Icons
import { IoIosLogIn } from "react-icons/io"

// Modal components
import ModalRegister from "../../Components/Modals/ModalRegister.jsx"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"
import { HelpLogin } from "../Help/HelpLogin.jsx"

// hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook.js"
import useStatusState from "../../Hooks/Form/StatusHook.js"

// data
import {login} from "../../../back-end/user.js"


// styles
import "../../Styles/LoadingStyle.css"
import "../../Styles/LoginStyle.css"
import "../../Styles/ErrorStyle.css"

/**
 * login page.
 * have a loader that validates the activity of the server.
 * if the server is inactive redirects to an error page
*/
export default function LoginPage() {
    // navigate system
    const navigate = useNavigate()


    const [loginData, setLoginData] = useState({
        identificacion: 0,
        password: ""
    })

    const {
        loading, isCompleted,
        start_operation, complete_operation, end_operation
    } = useStatusState()

    // modal register
    const [showConfirm, setShowConfirm] = useState(false)

    // modal notificación
    const {
        notification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp,
        handle_show_help,
        handle_close_help
    } = useHelpState()

    // confirm modal
    const handle_show_confirm = (e) =>{
        e.preventDefault()
        setShowConfirm(true)
    }
    const handle_close_confirm = () => setShowConfirm(false)

    const fetch_data = () => {
        start_operation()
        // validate previous session on local storage
        const prev_log_user = localStorage.getItem('log_user')
        const init_url = localStorage.getItem('activeLink') || "/app"
        if(prev_log_user !== null && !isCompleted) {
            complete_operation()
            end_operation()
            handle_close_confirm()
            setNotificationType("msg")
            setResponseMessage("¡ Bienvenido !")
            show_notification()
            setTimeout(() => {
                navigate(init_url, {
                    state: JSON.parse(prev_log_user)
                })
            }, 2000)
        } else {
            handle_close_confirm()
            setNotificationType("msg")
            setResponseMessage("No hay sesión previa")
            show_notification()
            setTimeout(() => {
                end_operation()
            }, 2000)
        }
    }

    // submit handler action
    const handle_submit = async(e) => {
        e.preventDefault()
        start_operation()
        try {
            const user = login(loginData)
            if(user.length === 0) {
                throw new Error("User not found")
            }
            localStorage.setItem('log_user', JSON.stringify(user[0]))
            handle_close_confirm()
            complete_operation()
            setNotificationType("msg")
            setResponseMessage("! Bienvenido ¡")
            show_notification()
            end_operation()
            setTimeout(() => {
                navigate("/app")
            }, 2000)
        } catch(er) {
            end_operation()
            setNotificationType("error")
            setResponseMessage(er.toString())
            handle_close_confirm()
            show_notification()
            setTimeout(() => {
                navigate("/", {
                    replace: true
                })
            }, 2000)
            console.error(er)
        }
    }
    // handle the login data form
    const handle_change = (e) => {
        const {name, value} = e.target
        setLoginData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handle_recover_password = () => {
        start_operation()
        try {
            complete_operation()
            setTimeout(() => {
                end_operation()
                navigate('/password-recover', {
                    replace: true
                })
            }, 2000)
        } catch(er) {
            end_operation()
            console.error(er)
        }
    }

    const show_content = () => {
        if(!isCompleted) {
            return(
                <div className="container">
                    <button className="help" onClick={handle_show_help}>
                        help | ?
                    </button>
                    <form onSubmit={handle_show_confirm}>
                        <h1>Iniciar sesión</h1 >
                        <label>
                            <input
                                name="identificacion"
                                placeholder="Identificación usuario"
                                onChange={handle_change}
                            />
                        </label>
                        <label>
                            <input
                                name="password"
                                type="password"
                                placeholder="password"
                                onChange={handle_change}
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={loginData.identificacion === 0 && loginData.password === ""}
                        >
                            Iniciar sesión
                        </button>
                        <button onClick={fetch_data} disabled={!(localStorage.getItem('log_user'))}>
                            Ingresar | <IoIosLogIn />
                        </button>
                        {
                            import.meta.env.VITE_NODE_ENV === "development" && (
                                <button className="recover-password" onClick={handle_recover_password}>
                                    Recuperar contraseña
                                </button >
                            )
                        }
                    </form >
                    <ModalRegister
                        show={showConfirm}
                        message={"Estas iniciando sesión"}
                        handle_close={handle_close_confirm}
                        handle_confirm={handle_submit}
                    />
                    <HelpLogin
                        show={showHelp}
                        handle_close={handle_close_help}
                    />
                    <Outlet/>
                </div>
            )
        }
    }


    // status component between renders
    if(loading) {
        return<div className="loader"></div>
    }
    if(notification) {
        return <ModalNotification
            show={notification}
            message={responseMessage}
            type={notificationType}
            handle_close={close_notification}
        />
    }
    return show_content()
}
