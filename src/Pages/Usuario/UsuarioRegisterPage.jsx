//Dependencies
import { useCallback, useEffect, useState } from "react"
import { useOutletContext, useBeforeUnload } from "react-router-dom"

// components
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalBlocker from "../../Components/Modals/ModalBlocker"
import { HelpRegisterUser } from "../Help/usuario/HelpRegisterUser"

// hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook"
import useConstantState from "../../Hooks/Form/ConstantsHook"
import useDataState from "../../Hooks/DataHook"

// data
import {users} from "../../../back-end/user.js"

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
    const {listRol} = useConstantState()
    const {
        elements, addElement
    } = useDataState(users)
    //
    const [status, setStatus] = useState("")

    const [retry, setRetry] = useState(0)
    const [showPassword, setShowPassword] = useState(true)

    // Modals
    const [showConfirm, setShowConfirm] = useState(false)
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

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

    // allow 3 attempts before block page
    const validate_retry = () => {
        if(retry === 3) {
            setStatus("completed")
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            show_notification()
        } else {
            setRetry(() => retry+1)
        }
    }

    const handle_submit= (e) => {
        e.preventDefault()
        setStatus("loading")
        try {
            const cur_date = new Date(Date.now())
            if(usuario.time_limit !== null && new Date(usuario.time_limit).getTime() < cur_date.getTime()) {
                throw new Error("Fecha limite incorrecta")
            }
            // FIXME: search don't work, it allows to add the same user with the same *identificacion*
            const search_user = elements.filter(u => u.identificacion === Number.parseInt(usuario.identificacion))
            if(search_user.length > 0) {
                throw new Error("El usuario ya se encuentra registrado")
            }
            const result = addElement(usuario)
            if(result === 0) {
                throw new Error("No se pudo registrar el usuario")
            }
            localStorage.removeItem('register_user')
            setStatus("completed")
            handle_close_confirm()
            setNotificationType("message")
            setResponseMessage("Usuario registrado")
            show_notification()
        } catch(er) {
            setStatus("completed")
            validate_retry()
            setResponseMessage(er.toString())
            setNotificationType("error")
            handle_close_confirm()
            show_notification()
            console.error(er)
        }
    }
    useEffect(() => {
        if(status !== "completed" && localStorage.getItem("register_user") !== null) {
            setUsuario(JSON.parse(localStorage.getItem("register_user")))
        }
    }, [status])

    const handle_change_user = (e) => {
        e.preventDefault()
        const{name, value} = e.target
        setUsuario((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    if(status === "loading") {
        return <div className="loader"></div>
    }
    if(notification) {
        return (
            <ModalNotification
                show={notification}
                message={responseMessage}
                type={notificationType}
                handle_close={close_notification}
            />
        )
    }
    return(
        <div className={`form-container-${isLightTheme ? 'light':'dark'} form-container`}>
            <h1>Crear usuario</h1>
            <form onSubmit={handle_show_confirm}>
                <section className="usuario">
                    <label>
                        Nombre
                        <input
                            name="name"
                            type="text"
                            required={true}
                            placeholder="Nombre del usuario"
                            defaultValue={usuario.name}
                            onChange={handle_change_user}
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
                            onChange={handle_change_user}
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
                            onChange={handle_change_user}
                        />
                    </label>

                    <label>
                        Rol
                        <select name="rol" onChange={handle_change_user}>
                            {
                                usuario.rol === "" ? (
                                    listRol
                                    .map((r) => (
                                        <option key={r}>{r}</option>
                                    ))
                                ):(
                                    <>
                                        <option key={usuario.rol}>{usuario.rol}</option>
                                        {
                                            listRol
                                                .filter(r => r !== usuario.rol && r !== "select...")
                                                .map((r) => (
                                                    <option key={r}>{r}</option>
                                                ))
                                        }
                                    </>
                                )
                            }
                        </select>
                        {
                            usuario.rol === "transitorio" && 
                                <label>
                                    Tiempo limite
                                    <input
                                        name="time_limit"
                                        type="datetime-local"
                                        onChange={handle_change_user}
                                    />
                                </label>
                        }
                    </label>
                </section>
                <section className="options">
                    <h1>Opciones</h1>
                    <button type="submit" disabled={status === "completed"}>
                        Registrar
                    </button>
                </section>
            </form >
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <ModalRegister
                show={showConfirm}
                message={"Estas por register un usuario, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={handle_submit}
            />
            {<ModalBlocker isCompleted={status}/>}
            <HelpRegisterUser
                show={showHelp}
                type="register"
                handle_close={handle_close_help}
            />
        </div>
    )
}
