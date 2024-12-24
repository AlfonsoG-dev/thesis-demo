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
import useNotificationState from "../../Hooks/Modal/NotificationHook.js"

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
    const [loginData, setLoginData] = useState({
        identificacion: 0,
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    // modal register
    const [showConfirm, setShowConfirm] = useState(false)
    // modal notificación
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
    } = useNotificationState()
    const [showHelp, setShowHelp] = useState(false)
    // navigate system
    const navigate = useNavigate()

    // confirm modal
    const handle_show_confirm = (e) =>{
        e.preventDefault()
        setShowConfirm(true)
    }
    const handle_close_confirm = () => setShowConfirm(false)

    const handle_close_help = () => setShowHelp(false)

    // notificación modal
    const handle_close_notification = () => {
        setNotification(false)
    }
    const fetch_data = () => {
        setLoading(true)
        // validate previous session on localstorage
        const prev_log_user = localStorage.getItem('log_user')
        const init_url = localStorage.getItem('activeLink') || "/app"
        if(prev_log_user !== null && isCompleted === false) {
            setIsCompleted(true)
            setLoading(false)
            handle_close_confirm()
            setNotificationType("msg")
            setResponseMessage("¡ Bienvenido !")
            setNotification(true)
            setTimeout(() => {
                navigate(init_url, {
                    state: JSON.parse(prev_log_user)
                })
            }, 2000)
        } else {
            setIsCompleted(false)
            handle_close_confirm()
            setNotificationType("msg")
            setResponseMessage("No hay sesión previa")
            setNotification(true)
            setTimeout(() => {
                setLoading(false)
            }, 2000)
        }
    }

    // submit handler action
    const handle_submit = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const user = login(loginData)
            if(user.length === 0) {
                throw new Error("User not found")
            }
            localStorage.setItem('log_user', JSON.stringify(user[0]))
            handle_close_confirm()
            setIsCompleted(true)
            setTimeout(() => {
                setLoading(false)
                navigate("/app")
            }, 2000)
        } catch(er) {
            setLoading(false)
            setIsCompleted(false)
            setNotificationType("error")
            setResponseMessage(er.toString())
            handle_close_confirm()
            setNotification(true)
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
        setLoading(true)
        try {
            setIsCompleted(true)
            setTimeout(() => {
                setLoading(false)
                navigate('/password-recover', {
                    replace: true
                })
            }, 2000)
        } catch(er) {
            setLoading(false)
            setIsCompleted(false)
            console.error(er)
        }
    }

    const show_content = () => {
        if(!isCompleted) {
            return(
                <div className="container">
                    <button className="help" onClick={() => setShowHelp(true)}>
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
                        <button onClick={fetch_data} disabled={!(loginData.identificacion === 0 && loginData.password === "")}>
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
            handle_close={handle_close_notification}
        />
    }
    return show_content()
}
