import { useNavigate } from "react-router-dom"
import { useState } from "react"

// hooks
import useStatusState from "../../Hooks/Form/StatusHook"

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
        name: "",
        identificacion: 0
    })
    const [usuario, setUsuario] = useState({
        password: ""
    })

    const fetch_data = (e) => {
        e.preventDefault()
        start_operation()
        try {
            const response = users.filter(u => u.name === buscado.name && u.identificacion === Number.parseInt(buscado.identificacion))
            if(response.length > 0) {
                complete_operation()
                end_operation()
                setUsuario(response[0])
            } else {
                throw new Error("Usuario no encontrado")
            }
        } catch(er) {
            end_operation()
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
                    Nombre
                    <input
                        type="text"
                        name="name"
                        defaultValue={buscado.name}
                        required={true}
                        disabled={isCompleted}
                        onChange={handle_recover_change}
                    />
                </label>
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
                <label>
                    Password
                    <input
                        type="text"
                        name="password"
                        value={usuario.password}
                        disabled={true}
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
        </div>
    )
}
