// Dependencies
import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

// Icons
import { IoIosLogIn } from "react-icons/io"

// Modal components
import ModalRegister from "../../Components/Modals/ModalRegister.jsx"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"

// hooks
import { Post, Get } from "../../Hooks/Requests"
import useNotificationState from "../../Hooks/Modal/NotificationHook.js"


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
    // navigate system
    const navigate = useNavigate()

    // confirm modal
    const handle_show_confirm = (e) =>{
        e.preventDefault()
        setShowConfirm(true)
    }
    const handle_close_confirm = () => setShowConfirm(false)

    // notificación modal
    const handle_close_notification = () => {
        setNotification(false)
    }
    const fetch_data = async() => {
        setLoading(true)
        try {
            const prev_session = await Get("/get-auth")
            if(prev_session.error !== undefined) {
                throw new Error("Sesión no iniciada")
            }
            handle_close_confirm()
            if(localStorage.getItem('activeLink') !== null) {
                setTimeout(() => {
                    setLoading(false)
                    navigate(localStorage.getItem('activeLink'))
                }, 2000)
            } else {
                setTimeout(() => {
                    setLoading(false)
                    navigate("/app")
                }, 2000)
            }
        } catch(er) {
            setLoading(false)
            setNotificationType("error")
            setResponseMessage("Sesión no iniciada")
            handle_close_confirm()
            setNotification(true)
            console.error(er)
        }
    }

    // submit handler action
    const login_submit_handler = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await Post("/login", loginData)
            if(response.error === undefined) {
                handle_close_confirm()
                setIsCompleted(true)
                setTimeout(() => {
                    setLoading(false)
                    navigate("/app")
                }, 2000)
            } else {
                throw new Error(response.error)
            }
        } catch(er) {
            setLoading(false)
            setIsCompleted(false)
            setNotificationType("error")
            setResponseMessage(er.toString())
            handle_close_confirm()
            setNotification(true)
            console.error(er)
            setTimeout(() => {
                navigate("/", {
                    replace: true
                })
            }, 2000)
        }
    }
    // handle the login data form
    const handleChange = (e) => {
        const {name, value} = e.target
        setLoginData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handle_recover_password = (e) => {
        e.preventDefault()
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
    const validate_ent = () => {
        if(!isCompleted) {
            return (
                <div className="container">
                    <h1>Iniciar sesión</h1 >
                    <form onSubmit={handle_show_confirm}>
                        <label>
                            <input
                                name="identificacion"
                                placeholder="Identificación usuario"
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            <input
                                name="password"
                                type="password"
                                placeholder="password"
                                onChange={handleChange}
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
                        handle_confirm={login_submit_handler}
                    />
                    <Outlet/>
                </div>
            )
        }
    }
    return validate_ent()
}
