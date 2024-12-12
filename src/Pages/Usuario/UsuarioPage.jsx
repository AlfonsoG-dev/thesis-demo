// Dependencies
import {useCallback, useEffect, useState} from "react"
import { useOutletContext } from "react-router-dom"

//Icons
import { GiPlayerNext, GiPlayerPrevious } from "react-icons/gi"
import { MdOutlinePersonSearch } from "react-icons/md"
import { FaUserMd } from "react-icons/fa"

// Modal components
import UsuarioTableComponent from "../../Components/Tables/UsuarioTableComponent.jsx"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"

// Hooks
import { Get } from "../../Hooks/Requests.jsx"
import useNotificationState from "../../Hooks/Modal/NotificationHook.js"

// data
import { get_users } from "../../../back-end/user.js"

// style
import '../../Styles/Paciente.css'
import '../../Styles/LoadingStyle.css'

/**
 * User page that has the list of users, and some functions to perform.
 * the admin doesn't show in this list.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // list of users, and searched user
    const [usuarios, setUsuarios] = useState([])
    const [buscado, setBuscado] = useState({ identificacion: 0 })

    const [loading, setLoading] = useState(true)

    // modal notificación
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage
    } = useNotificationState()

    // quantity to show
    const [offset, setOffset] = useState(0)
    const limit = 5

    // modal notificación handlers
    const handle_close_notification = () => setNotification(false)

    // get the users from the end-point in server
    const fetch_data = useCallback((page) => {
        try {
            const response = get_users(page, limit)
            if(response.length > 0) {
                setUsuarios(response)
                setLoading(false)
            } else {
                setOffset(() => {
                    if(offset >= limit) {
                        return offset-limit
                    } else {
                        return 0
                    }
                })
                throw new Error("No hay usuarios")
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
            console.error(er)
        }
    }, [offset])

    // activate the fetchData between renders
    useEffect(() => {
        fetch_data(offset)
    }, [offset, fetch_data])

    // use pagination with offset to control the quantity of users to show
    const handle_pagination = (page) => {
        if(page > 0 || page == 0) {
            setOffset(page)
        }
    }
    // search user by identificación
    const handle_search_user = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = usuarios.filter(u => u.rol !== "admin" && u.identificacion === Number.parseInt(buscado.identificacion))
            if(response.length > 0) {
                setUsuarios(response)
                setLoading(false)
            } else {
                throw new Error("Usuario no encontrado")
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
            console.error(er)
        }
    }

    // form handler for user data from
    const handle_change_searched = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setBuscado(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // state between renders
    if(loading) {
        return <div className="loader"></div>
    }
    if(notification) {
        return (
            <ModalNotification
                show={notification}
                message={responseMessage}
                type={notificationType}
                handle_close={handle_close_notification}
            />
        )
    }
    return (
        <div className="table-page">
            <br/>
            <div className={`search-${isLightTheme ? 'light':'dark'}`}>
                <form onSubmit={handle_search_user}>
                    <input
                        name="identificacion"
                        type="number"
                        value={buscado.identificacion > 0 && buscado.identificacion}
                        placeholder="Identificación del usuario"
                        onChange={handle_change_searched}
                        autoFocus={true}
                    />
                    <button
                        type="submit"
                        disabled={buscado.identificacion === 0 && true}
                    >
                        <MdOutlinePersonSearch/>
                    </button>
                </form >
            </div>
            <h1><FaUserMd/> Usuarios</h1>
            <UsuarioTableComponent data={usuarios} isLightTheme={isLightTheme}/>
            <div className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button
                    type="button"
                    onClick={() => handle_pagination(offset-limit)}
                    disabled={offset==0}
                >
                    <GiPlayerPrevious />
                </button >
                <button
                    type="button"
                    onClick={() => handle_pagination(offset+limit)}
                    disabled={usuarios.error}
                >
                    <GiPlayerNext />
                </button>
            </div >
        </div >
    )
}
