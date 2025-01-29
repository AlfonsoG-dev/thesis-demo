// Dependencies
import { useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

// Components
import ModalRegister from "../../Components/Modals/ModalRegister.jsx"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"
import ModalBlocker from "../../Components/Modals/ModalBlocker.jsx"
import { HelpRegisterUser } from "../Help/usuario/HelpRegisterUser.jsx"

// Hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook.js"
import useStatusState from "../../Hooks/Form/StatusHook.js"

// data
import { delete_user } from "../../../back-end/user.js"

// Styles
import "../../Styles/Register.css"
import "../../Styles/LoadingStyle.css"

/**
 * Page to delete a user.
 * Only admin have access.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // usuario
    const {state} = useLocation()
    const [usuario] = useState({
        id_pk: state.id_pk,
        identificacion: state.identificacion,
        name: state.name,
        rol: state.rol,
        password: state.password
    })

    //
    const {
        loading, isCompleted,
        start_operation, complete_operation, end_operation
    } = useStatusState()

    const [retry, setRetry] = useState(0)

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


    // register modal handlers
    const handle_close_confirm = () => setShowConfirm(false)
    const handle_show_confirm = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            complete_operation()
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            show_notification()
        } else {
            setRetry(() => retry+1)
        }
    }

    const handle_submit = async(e) => {
        e.preventDefault()
        start_operation()
        try {
            const response = delete_user(usuario.identificacion, usuario.password)
            if(response.msg) {
                complete_operation()
                end_operation()
                setResponseMessage(response.msg)
                setNotificationType("msg")
                handle_close_confirm()
                show_notification()
            } else {
                throw new Error(response.error)
            } 
        } catch(er) {
            end_operation()
            validate_retry()
            setResponseMessage(er.toString())
            setNotificationType("error")
            handle_close_confirm()
            show_notification()
            console.error(er)
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
            handle_close={close_notification}
        />
    }
    return(
        <div className={`form-container-${isLightTheme ? 'light':'dark'} form-container`}>
            <h2>¡Continua solo si estas seguro de eliminar el usuario!</h2>
            <form onSubmit={handle_show_confirm}>
                <label>
                    Nombre
                    <input
                        type="text"
                        name="name"
                        value={usuario.name}
                        disabled={true}
                    />
                </label>
                <label>
                    Identificación
                    <input
                        type="number"
                        name="identificacion"
                        value={usuario.identificacion}
                        disabled={true}
                    />
                </label>
                <label>
                    Rol
                    <input
                        type="text"
                        name="rol"
                        value={usuario.rol}
                        disabled={true}
                    />
                </label>
                <section className="options">
                    <h1>Opciones</h1>
                    <button onClick={handle_show_confirm} disabled={isCompleted}>Eliminar</button>
                </section>
            </form >
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <ModalRegister
                show={showConfirm}
                message={"Estas por eliminar el usuario, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={handle_submit}
            />
            <ModalBlocker isCompleted={isCompleted}/>
            <HelpRegisterUser
                show={showHelp}
                type="delete"
                handle_close={handle_close_help}
            />
        </div>
    )
}
