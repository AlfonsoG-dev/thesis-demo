//Dependencies
import { useCallback, useEffect, useState } from "react"
import { useOutletContext, useBeforeUnload } from "react-router-dom"

// components
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalBlocker from "../../Components/Modals/ModalBlocker"

// hooks
import { Post, Get } from "../../Hooks/Requests"
import useNotificationState from "../../Hooks/Modal/NotificationHook"

// styles
import "../../Styles/ErrorStyle.css"
import "../../Styles/LoadingStyle.css"
import "../../Styles/Register.css"

/**
 * Page to register the user.
 * Only admin has access.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // user to register
    const[usuario, setUsuario] = useState({
        name: "",
        identificacion: "",
        password: "",
        rol: "",
        time_limit: null,
    })
    //
    const [loading, setLoading] = useState(false)
    const [retry, setRetry] = useState(0)
    const [showPassword, setShowPassword] = useState(true)
    const [isCompleted, setIsCompleted] = useState(false)

    // Modals
    const [showConfirm, setShowConfirm] = useState(false)
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage
    } = useNotificationState()

    useBeforeUnload(useCallback(() => {
        localStorage.register_user = JSON.stringify(usuario)
    }, [usuario]))

    // when the user wants to see the password
    const handle_show_password = () => setShowPassword(!showPassword)

    // register modal handlers
    const handle_close_confirm = () => setShowConfirm(false)
    const handle_show_confirm = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }
    // notificación modal handlers
    const handle_notification_close = () => setNotification(false)

    // allow 3 attempts before block page
    const validate_retry = () => {
        if(retry === 3) {
            setIsCompleted(true)
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
        } else {
            setRetry(() => retry+1)
        }
    }

    const submit_handler= async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const cur_date = new Date(Date.now())
            if(usuario.time_limit !== null && new Date(usuario.time_limit).getTime() < cur_date.getTime()) {
                throw new Error("Fecha limite incorrecta")
            }
            const search_user = await Get(
                `/user/by-identificacion/${usuario.identificacion}`
            )
            if(search_user.error && usuario.rol !== '') {
                const response = await Post("/user/post-user", usuario)
                if(response.error === undefined) {
                    localStorage.removeItem("register_user")
                    setIsCompleted(true)
                    setLoading(false)
                    setResponseMessage(response.msg)
                    setNotificationType("msg")
                    handle_close_confirm()
                    setNotification(true)
                } else {
                    throw new Error(response.error)
                }
            } else {
                throw new Error("El usuario ya esta registrado.")
            }
        } catch(er) {
            setLoading(false)
            validate_retry()
            setResponseMessage(er.toString())
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
        }
    }
    useEffect(() => {
        if(!isCompleted && localStorage.getItem("register_user") !== null) {
            setUsuario(JSON.parse(localStorage.getItem("register_user")))
        }
    }, [isCompleted])

    const usuario_change_handler = (e) => {
        e.preventDefault()
        const{name, value} = e.target
        setUsuario((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    if(loading) {
        return <div className="loader"></div>
    }
    if(notification) {
        return (
            <ModalNotification
                show={notification}
                message={responseMessage}
                type={notificationType}
                handle_close={handle_notification_close}
            />
        )
    }
    return(
        <div className={`form-container-${isLightTheme ? 'light':'dark'}`}>
            <h1>Crear usuario</h1>
            <form onSubmit={handle_show_confirm}>
                <div className="usuario">
                    <label>
                        Nombre
                        <input
                            name="name"
                            type="text"
                            required={true}
                            placeholder="Nombre del usuario"
                            defaultValue={usuario.name}
                            onChange={usuario_change_handler}
                        />
                    </label>
                    <label>
                        Identificación
                        <input
                            name="identificacion"
                            type="number"
                            required={true}
                            placeholder="Identificación de usuario"
                            defaultValue={usuario.identificacion}
                            onChange={usuario_change_handler}
                        />
                    </label>

                    <label>
                        Mostrar Contraseña
                        <input
                            type="checkbox"
                            name="show_password"
                            value={showPassword}
                            onChange={handle_show_password}
                        />
                    </label>
                    <label>
                        <input
                            type={showPassword ? "password":"text"}
                            name="password"
                            required={true}
                            placeholder="Contraseña del usuario"
                            defaultValue={usuario.password}
                            onChange={usuario_change_handler}
                        />
                    </label>

                    <label>
                        Rol
                        <select name="rol" onChange={usuario_change_handler}>
                            <option>{usuario.rol !== "" ? usuario.rol : "select a rol..."}</option >
                            <option key={"admin"}>admin</option >
                            <option key={"personal"}>personal</option >
                            <option key={"transitorio"}>transitorio</option >
                        </select>
                        {
                            usuario.rol === "transitorio" && 
                                <label>
                                    Tiempo limite
                                    <input
                                        name="time_limit"
                                        type="datetime-local"
                                        onChange={usuario_change_handler}
                                    />
                                </label>
                        }
                    </label>
                </div>
                <div className="options">
                    <h1>Opciones</h1>
                    <button type="submit">
                        Registrar
                    </button>
                </div>
            </form >
            <ModalRegister
                show={showConfirm}
                message={"Estas por register un usuario, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={submit_handler}
            />
            {<ModalBlocker isCompleted={isCompleted}/>}
        </div>
    )
}
