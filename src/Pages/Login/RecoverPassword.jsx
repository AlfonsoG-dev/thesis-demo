import { useNavigate } from "react-router-dom"
import { useState } from "react"

// modal
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"

// hooks
import useStatusState from "../../Hooks/Form/StatusHook"
import useNotitificationState from "../../Hooks/Modal/NotificationHook.js"

// data
import { users } from "../../../back-end/user"

// styles
import "../../Styles/LoginStyle.css"
import "../../Styles/RecoverPage.css"

export function Component() {
    const navigate = useNavigate()

    const {
        loading, isCompleted,
        start_operation, complete_operation, end_operation
    } = useStatusState()

    const [buscado, setBuscado] = useState({
        identificacion: 0
    })
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage
    } = useNotitificationState();

    const handle_close_notification = () => setNotification(false)

    const fetch_data = (e) => {
        e.preventDefault()
        start_operation()
        try {
            const response = users.filter(u => u.identificacion === Number.parseInt(buscado.identificacion))
            if(response.length > 0) {
                complete_operation()
                end_operation()
                setNotificationType("msg")
                setResponseMessage(`La contraseña del usuario "${response[0].name}" es "${response[0].password}"`)
                setNotification(true)
            } else {
                throw new Error("Usuario no encontrado")
            }
        } catch(er) {
            end_operation()
            setNotificationType("error")
            setResponseMessage(er.toString())
            setNotification(true)
            console.error(er)
        }
    }


    const handle_recover_change = (e) => {
        const {name, value} = e.target
        setBuscado((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    if(loading) {
        return <div className="loader"></div>
    }
    return (
        <div className="recover">
            <h1>Recuperar contraseña</h1>
            <form onSubmit={fetch_data}>
                <label>
                    Identificación
                    <input
                        type="number"
                        name="identificacion"
                        defaultValue={buscado.identificacion > 0 && buscado.identificacion}
                        required={true}
                        disabled={isCompleted}
                        onChange={handle_recover_change}
                    />
                </label>
                <div className="options">
                    <br/>
                    <button type="submit" disabled={isCompleted}>recuperar</button>
                    <button onClick={(e) => {
                        e.preventDefault()
                        start_operation()
                        setTimeout(() => {
                            end_operation()
                            navigate("/", {
                                replace: true
                            })
                        }, 2000)
                    }}>
                        Login
                    </button>
                </div>
            </form>
            <ModalNotification
                show={notification}
                message={responseMessage}
                type={notificationType}
                handle_close={handle_close_notification}
            />
        </div>
    )
}
