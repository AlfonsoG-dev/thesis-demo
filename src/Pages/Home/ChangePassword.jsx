import { useCallback, useEffect, useState } from "react"
import { useOutletContext, useBeforeUnload } from "react-router-dom"

//Components
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalBlocker from "../../Components/Modals/ModalBlocker"

// Hooks
import useNotificationState from "../../Hooks/Modal/NotificationHook"

// data
import { users, change_password } from "../../../back-end/user"

// Style
import "../../Styles/Register.css"
import "../../Styles/LoadingStyle.css"
export function Component() {
    const [, isLightTheme] = useOutletContext()
    const [usuario, setUsuario] = useState({
        id_pk: 0,
        name: "",
        identificacion: 0,
        password: ""
    })

    const [editionBorder, setEditionBorder] = useState(false)
    const [disableEdition, setDisableEdition] = useState(true)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)


    const [showConfirm, setShowConfirm] = useState(false)
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
    } = useNotificationState()

    useBeforeUnload(useCallback(() => {
        localStorage.change_password = JSON.stringify(usuario)
    }, [usuario]))

    const handle_disable_edition = () => {
        setEditionBorder(false)
        setDisableEdition(!disableEdition)
    }
    const handle_show_password = () => setShowPassword(!showPassword)

    // modal register
    const handle_close_confirm = () => setShowConfirm(false)
    
    const handle_show_confirm = (e) => {
        e.preventDefault()
        if(disableEdition === false) {
            setShowConfirm(true)
        } else {
            setNotificationType("error")
            setResponseMessage("Habilitar edición para continuar")
            setNotification(true)
            setEditionBorder(true)
        }
    }

    // modal notificación
    const handle_close_notification = () => setNotification(false)

    // user change field handler
    const handle_change_user = (e) => {
        const {name, value} = e.target
        setUsuario((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const handle_submit = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = users.filter(u => u.identificacion === Number.parseInt(usuario.identificacion))
            if(response.length > 0) {
                const change_password_response = change_password(usuario.identificacion, usuario.password)
                if(change_password_response !== "") {
                    localStorage.removeItem('change_password')
                    setIsCompleted(true)
                    setLoading(false)
                    setResponseMessage(change_password_response)
                    setNotificationType("msg")
                    handle_close_confirm()
                    setNotification(true)
                } else {
                    throw new Error("No se pudo cambiar la contraseña")
                }
            } else {
                throw new Error("El usuario no existe")
            }
        } catch(er) {
            setIsCompleted(false)
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
            console.error(er)
        }
    }
    useEffect(() => {
        if(!isCompleted && localStorage.getItem("change_password") !== null) {
            setUsuario(JSON.parse(localStorage.getItem("change_password")))
        }
    }, [isCompleted])
    if(loading) {
        return <div className="loader"></div>
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
        <div className={`form-container-${isLightTheme ? 'light':'dark'} form-container`}>
            <form onSubmit={handle_show_confirm}>
                <h2>Cambiar de contraseña</h2>
                <label className={editionBorder === true ? "chk_enable":""}>
                    Habilitar edición
                    <input
                        type="checkbox"
                        name="enable_edition"
                        value={disableEdition}
                        checked={!disableEdition}
                        onChange={handle_disable_edition}
                    />
                    <span>
                        {editionBorder && "<- selecciona esta opción"}
                    </span>
                </label>
                <br/>
                <label>
                    Usuario
                    <input
                        type="text"
                        name="name"
                        value={usuario.name}
                        placeholder="nombre usuario"
                        onChange={handle_change_user}
                        required={true}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Identificación
                    <input
                        type="number"
                        name="identificacion"
                        value={usuario.identificacion}
                        placeholder="Identificación del usuario"
                        onChange={handle_change_user}
                        required={true}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Mostrar contraseña
                    <input
                        type="checkbox"
                        name="show-password"
                        value={showPassword}
                        onChange={handle_show_password}
                    />
                </label>
                <label>
                    <input
                        type={showPassword === true ? "text":"password"}
                        name="password"
                        value={usuario.password}
                        placeholder="contraseña"
                        onChange={handle_change_user}
                        required={true}
                        disabled={disableEdition}
                    />
                </label>
                <div className="options">
                    <h1>Opciones</h1>
                    <button type="submit" disabled={isCompleted}>
                        Actualizar
                    </button>
                </div>
            </form>
            <ModalRegister
                show={showConfirm}
                message={"Estas por modificar la contraseña, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={handle_submit}
            />
            <ModalBlocker isCompleted={isCompleted}/>
        </div>
    )
}
