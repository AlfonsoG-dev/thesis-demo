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
    const [usuario, setUsuario] = useState({})
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
            if(buscado.identificacion === 0) {
                throw new Error("Selecciona una identificación")
            }
            const response = users.filter(u => u.identificacion === Number.parseInt(buscado.identificacion))
            if(response.length > 0) {
                setUsuario(response[0])
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

    const handle_login = (e) => {
        e.preventDefault()
        start_operation()
        try {
            localStorage.setItem('log_user', JSON.stringify(usuario))
            complete_operation()
            setNotificationType("msg")
            setResponseMessage("! Bienvenido ¡")
            end_operation()
            setNotification(true)
            setTimeout(() => {
                navigate("/app")
            }, 2000)
        } catch(er) {
            end_operation()
            setNotificationType("error")
            setResponseMessage(er.toString())
            setNotification(false)
            setTimeout(() => {
                navigate("/", {
                    replace: true
                })
            }, 2000)
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

    if(notification) {
        return <ModalNotification
                show={notification}
                message={responseMessage}
                type={notificationType}
                handle_close={handle_close_notification}
        />
    }
    if(loading) {
        return <div className="loader"></div>
    }
    return (
        <div className="recover">
            <h1>Recuperar contraseña</h1>
            <form onSubmit={handle_login}>
                <label>
                    Usuario
                    <select name="identificacion" onChange={handle_recover_change} disabled={isCompleted}>
                        <option key={"selection"}>Selecciona el usuario...</option>
                        {
                            users.map((u) => (
                                <option key={u.identificacion}>{u.identificacion} {u.rol}</option>
                            ))
                        }
                    </select>
                </label>
                <div className="options">
                    <br/>
                    <button type="button" disabled={isCompleted} onClick={fetch_data}>recuperar</button>
                    <button type="submit">
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}
