// Dependencies
import { useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

// Components
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalBlocker from "../../Components/Modals/ModalBlocker"

//Hooks
import { Post } from "../../Hooks/Requests"
import useNotificationState from "../../Hooks/Modal/NotificationHook"

//style
import "../../Styles/LoadingStyle.css"
import "../../Styles/Register.css"

/**
 * Page to update the user.
 * Only admin have access and its not possible to modify password.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // usuario
    const {state} = useLocation()
    const [roles] = useState(['admin', 'personal', 'transitorio'])
    const [usuario] = useState(state)
    const [modifiedUser, setModifiedUser] = useState({
        id_pk: usuario.id_pk,
        identificacion: usuario.identificacion,
        time_limit: null,
    })

    // 
    const [editionBorder, setEditionBorder] = useState(false)
    const [loading, setLoading] = useState(false)
    const [retry, setRetry] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [disableEdition, setDisableEdition] = useState(true)

    // Modals
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage
    } = useNotificationState()

    // using state to change the style of the page.
    const chk_name = editionBorder === false ? "chk_disable" : "chk_enable"

    // register modal confirm
    const handle_close_confirm = () => setShowConfirmModal(false)
    const handle_show_confirm = (e) => {
        e.preventDefault()
        if(disableEdition === false) {
            setShowConfirmModal(true)
        } else {
            setNotificationType("error")
            setResponseMessage("Habilitar edición para continuar")
            setNotification(true)
            setEditionBorder(true)
        }
    }

    // notification modal
    const handle_close_notification = () => setNotification(false)

    // enable/disable checkbox
    const handle_change_enable_edition = () => {
        setEditionBorder(false)
        setDisableEdition(!disableEdition)
    }

    // allow 3 attempts before block page
    const validate_retry = () => {
        if(retry === 3) {
            setIsComplete(true)
            setResponseMessage("Intentos agotados, intenta recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
        } else {
            setRetry(() => retry+1)
        }
    }

    // user field value change handler
    const handle_change_modified_user = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setModifiedUser((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // user submit handler
    const handle_submit = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await Post("/user/put-user", modifiedUser)
            if(response.msg !== undefined) {
                setIsComplete(true)
                setLoading(false) 
                setResponseMessage(response.msg)
                setNotificationType("msg")
                handle_close_confirm()
                setNotification(true)
            } else {
                throw new Error(response.error)
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
    const show_time_limit = () => {
        if(modifiedUser !== null && modifiedUser.rol === "transitorio") {
            return <label>
                Tiempo limite
                <input
                    type="datetime-local"
                    name="time_limit"
                    required={true}
                    onChange={handle_change_modified_user}
                    disabled={disableEdition}
                />
            </label>
        } else if(usuario.rol === "transitorio" && modifiedUser.rol === undefined) {
            return <label>
                Tiempo limite
                <input
                    type="datetime-local"
                    name="time_limit"
                    required={true}
                    onChange={handle_change_modified_user}
                    disabled={disableEdition}
                />
            </label>
        }
    }
    return(
        <div className={`form-container-${isLightTheme ? 'light':'dark'}`}>
            <h1>Actualizar usuario</h1>
            <form onSubmit={handle_show_confirm}>
                <label className={chk_name}>
                    Habilitar edición
                    <input
                        type="checkbox"
                        name="enable_edition"
                        defaultValue={disableEdition}
                        checked={!disableEdition}
                        onChange={handle_change_enable_edition}

                    />
                    <span>
                        {editionBorder && "<- selecciona esta opción"}
                    </span>
                </label >
                <br/>
                <label>
                    Nombre
                    <input
                        type="text"
                        name="name"
                        defaultValue={usuario.name}
                        required={true}
                        onChange={handle_change_modified_user}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Identificación
                    <input
                        type="number"
                        name="identificacion"
                        defaultValue={usuario.identificacion}
                        required={true}
                        onChange={handle_change_modified_user}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Rol
                    {
                        usuario.rol &&
                            <select name="rol" onChange={handle_change_modified_user} disabled={disableEdition}>
                                <option key={usuario.rol}>{usuario.rol}</option>
                                {
                                    roles.map((r) => (
                                    r !== usuario.rol &&
                                        <option key={r}>{r}</option>
                                    ))
                                }
                            </select>
                    }
                    {show_time_limit()}
                </label>
                <div className="options">
                    <h1>Opciones</h1>
                    <button type="submit" disabled={isComplete}>Actualizar</button>
                </div>
            </form>
            <ModalRegister 
                show={showConfirmModal}
                message={"Estas por actualizar los datos del usuario, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={handle_submit}
            />
            <ModalBlocker isCompleted={isComplete}/>
        </div>
    )
}
