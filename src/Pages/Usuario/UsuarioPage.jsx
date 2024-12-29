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
import HelpPaciente from "../Help/HelpPaciente.jsx"

// Hooks
import useNotificationState from "../../Hooks/Modal/NotificationHook.js"
import usePaginationState from "../../Hooks/Form/PaginationHook.js"

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

    const [showHelp, setShowHelp] = useState(false)

    const default_limit_value = 2
    // quantity of data to show
    const {
        offset, setOffset,
        limit, setLimit,
        handle_pagination
    } = usePaginationState(default_limit_value)

    // modal notificación handlers
    const handle_close_notification = () => setNotification(false)

    const handle_close_help = () => setShowHelp(false)

    // get the users from the end-point in server
    const fetch_data = useCallback((page) => {
        try {
            const response = get_users(page, limit)
            if(response.length > 0) {
                setUsuarios(response)
                setLoading(false)
            } else {
                throw new Error("No hay usuarios")
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
            // in case of an error reset pagination to default values
            setOffset((prev) => prev-default_limit_value)
            setLimit((prev) => prev-default_limit_value)
            console.error(er)
        }
    }, [limit, setLimit, setNotification, setNotificationType, setOffset, setResponseMessage])

    // activate the fetchData between renders
    useEffect(() => {
        fetch_data(offset)
    }, [offset, fetch_data])

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
                    onClick={() => handle_pagination(offset-default_limit_value, limit-default_limit_value)}
                    disabled={offset==0}
                >
                    <GiPlayerPrevious />
                </button >
                <button
                    type="button"
                    onClick={() => handle_pagination(offset+default_limit_value, limit+default_limit_value)}
                    disabled={usuarios.error}
                >
                    <GiPlayerNext />
                </button>
            </div >
            <button className="help" onClick={() => setShowHelp(true)}>
                help | ?
            </button>
            <HelpPaciente
                show={showHelp}
                type="usuario"
                handle_close={handle_close_help}
            />
        </div >
    )
}
