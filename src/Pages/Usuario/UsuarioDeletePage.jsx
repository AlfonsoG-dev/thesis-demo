// Dependencies
import { useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

// Components
import ModalRegister from "../../Components/Modals/ModalRegister.jsx"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"
import ModalBlocker from "../../Components/Modals/ModalBlocker.jsx"

// Hooks
import { Delete } from "../../Hooks/Requests.jsx"
import useNotificationState from "../../Hooks/Modal/NotificationHook.js"

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
    const [loading, setLoading] = useState(false)
    const [retry, setRetry] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)

    // Modals
    const [showConfirm, setShowConfirm] = useState(false)
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
    } = useNotificationState()


    // register modal handlers
    const hidden_modal = () => setShowConfirm(false)
    const handle_show_confirm = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }

    // Notificación modal handlers
    const handle_close_notification = () => setNotification(false)

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            setIsCompleted(true)
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            hidden_modal()
            setNotification(true)
        } else {
            setRetry(() => retry+1)
        }
    }

    const submit_handler = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await Delete("/user/delete-user", usuario)
            if(response.msg) {
                setLoading(false)
                setIsCompleted(true)
                setResponseMessage(response.msg)
                setNotificationType("msg")
                hidden_modal()
                setNotification(true)
            } else {
                throw new Error(response.error)
            } 
        } catch(er) {
            setLoading(false)
            validate_retry()
            setResponseMessage(er.toString())
            setNotificationType("error")
            hidden_modal()
            setNotification(true)
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
            handle_close={handle_close_notification}
        />
    }
    return(
        <div className={`form-container-${isLightTheme ? 'light':'dark'}`}>
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
                <div className="options">
                    <h1>Opciones</h1>
                    <button onClick={handle_show_confirm} disabled={isCompleted}>Eliminar</button>
                </div>
            </form >
            <ModalRegister
                show={showConfirm}
                message={"Estas por eliminar el usuario, Confirma esta acción"}
                handle_close={hidden_modal}
                handle_confirm={submit_handler}
            />
            <ModalBlocker isCompleted={isCompleted}/>
        </div>
    )
}
