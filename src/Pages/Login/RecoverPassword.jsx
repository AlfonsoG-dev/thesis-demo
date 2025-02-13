import { useNavigate } from "react-router-dom"
import { useState } from "react"

// modal
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"

// hooks
import useNotitificationState from "../../Hooks/Modal/NotificationHook.js"

// data
import { users } from "../../../back-end/user"

// styles
import "../../Styles/LoginStyle.css"
import "../../Styles/RecoverPage.css"

export function Component() {
    const navigate = useNavigate()

    const [status, setStatus] = useState("")

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
        setStatus("loading")
        try {
            if(buscado.identificacion === 0) {
                throw new Error("Selecciona una identificación")
            }
            const response = users.filter(u => u.identificacion === Number.parseInt(buscado.identificacion))
            if(response.length > 0) {
                setUsuario(response[0])
                setStatus("completed")
                setNotificationType("msg")
                setResponseMessage(`La contraseña del usuario "${usuario.name}" es "${usuario.password}"`)
                setNotification(true)
            } else {
                throw new Error("Usuario no encontrado")
            }
        } catch(er) {
            setStatus("completed")
            setNotificationType("error")
            setResponseMessage(er.toString())
            setNotification(true)
            console.error(er)
        }
    }

    const handle_login = (e) => {
        e.preventDefault()
        setStatus("loading")
        try {
            localStorage.setItem('log_user', JSON.stringify(usuario))
            setStatus("completed")
            setNotificationType("msg")
            setResponseMessage("! Bienvenido ¡")
            setNotification(true)
            setTimeout(() => {
                navigate("/app")
            }, 2000)
        } catch(er) {
            setStatus("completed")
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

        const [response] = users.filter(u => u[name] === Number.parseInt(value))
        setUsuario(response)
    }

    if(notification) {
        return <ModalNotification
                show={notification}
                message={responseMessage}
                type={notificationType}
                handle_close={handle_close_notification}
        />
    }
    if(status === "loading") {
        return <div className="loader"></div>
    }
    return (
        <div className="recover">
            <h1>Recuperar contraseña</h1>
            <form onSubmit={handle_login}>
                <label>
                    Usuario
                    <select name="identificacion" onChange={handle_recover_change} disabled={status === "completed"}>
                        {
                            usuario.identificacion !== undefined ? (
                                <option key={usuario.identificacion}>{usuario.identificacion} {usuario.rol}</option>
                            ):(
                                <option key={"selection"}>Selecciona el usuario...</option>
                            )
                        }
                        {
                            users
                                .filter((u) => u.identificacion !== Number.parseInt(usuario.identificacion))
                                .map((u) => (
                                    <option key={u.identificacion}>{u.identificacion} {u.rol}</option>
                                ))
                        }
                    </select>
                </label>
                <br/>
                <section className="options">
                    <button type="button" disabled={status === "completed"} onClick={fetch_data}>recuperar</button>
                    <button type="submit">
                        Login
                    </button>
                </section>
            </form>
        </div>
    )
}
