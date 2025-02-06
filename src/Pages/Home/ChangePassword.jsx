import { useCallback, useEffect, useState } from "react"
import { useOutletContext, useBeforeUnload } from "react-router-dom"

//Components
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalBlocker from "../../Components/Modals/ModalBlocker"
import { HelpRegisterUser } from "../Help/usuario/HelpRegisterUser"

// Hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook"

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

    const [status, setStatus] = useState("loading" | "completed")

    const [editionBorder, setEditionBorder] = useState(false)
    const [disableEdition, setDisableEdition] = useState(true)
    const [showPassword, setShowPassword] = useState(false)


    const [showConfirm, setShowConfirm] = useState(false)
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp,
        handle_show_help, handle_close_help
    } = useHelpState()

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
            show_notification()
            setEditionBorder(true)
        }
    }

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
        setStatus("loading")
        try {
            const response = users.filter(u => u.identificacion === Number.parseInt(usuario.identificacion))
            if(response.length > 0) {
                const change_password_response = change_password(usuario.identificacion, usuario.password)
                if(change_password_response !== "") {
                    localStorage.removeItem('change_password')
                    setStatus("completed")
                    setResponseMessage(change_password_response)
                    setNotificationType("msg")
                    handle_close_confirm()
                    show_notification()
                } else {
                    throw new Error("No se pudo cambiar la contraseña")
                }
            } else {
                throw new Error("El usuario no existe")
            }
        } catch(er) {
            setStatus("completed")
            setResponseMessage(er.toString())
            setNotificationType("error")
            handle_close_confirm()
            show_notification()
            console.error(er)
        }
    }
    useEffect(() => {
        if(status !== "completed" && localStorage.getItem("change_password") !== null) {
            setUsuario(JSON.parse(localStorage.getItem("change_password")))
        }
    }, [status])
    if(status === "loading") {
        return <div className="loader"></div>
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
        <div className={`form-container-${isLightTheme ? 'light':'dark'} form-container`}>
            <form onSubmit={handle_show_confirm}>
                <section>
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
                </section>
                <label>
                    Identificación
                    <input
                        type="number"
                        name="identificacion"
                        defaultValue={usuario.identificacion > 0 ? usuario.identificacion : null}
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
                        defaultValue={usuario.password}
                        placeholder="contraseña"
                        onChange={handle_change_user}
                        required={true}
                        disabled={disableEdition}
                    />
                </label>
                <section className="options">
                    <h1>Opciones</h1>
                    <button type="submit" disabled={status === "completed"}>
                        Actualizar
                    </button>
                </section>
            </form>
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <ModalRegister
                show={showConfirm}
                message={"Estas por modificar la contraseña, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={handle_submit}
            />
            <ModalBlocker isCompleted={status}/>
            <HelpRegisterUser
                show={showHelp}
                type="update_password"
                handle_close={handle_close_help}
            />
        </div>
    )
}
