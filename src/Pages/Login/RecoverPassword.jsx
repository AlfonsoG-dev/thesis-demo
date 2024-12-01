import { useNavigate } from "react-router-dom"
import { useState } from "react"

// hooks
import { Get } from "../../Hooks/Requests"

// styles
import "../../Styles/LoginStyle.css"
import "../../Styles/RecoverPage.css"

export function Component() {
    const navigate = useNavigate()
    const [isCompleted, setIsCompleted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [buscado, setBuscado] = useState({
        name: "",
        identificacion: 0
    })
    const [usuario, setUsuario] = useState({
        password: ""
    })

    const fetch_data = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await Get(`/recover-password/${buscado.name}/${buscado.identificacion}`)
            if(response.error === undefined) {
                setIsCompleted(true)
                setLoading(false)
                setUsuario(response[0])
            } else {
                throw new Error(response.error)
            }
        } catch(er) {
            setIsCompleted(true)
            setLoading(false)
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
                        setLoading(true)
                        setTimeout(() => {
                            setLoading(false)
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
