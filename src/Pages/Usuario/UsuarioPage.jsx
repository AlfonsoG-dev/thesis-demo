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
    const handle_notification_close = () => setNotification(false)

    // get the users from the end-point in server
    const fetchData = useCallback( async(page) => {
        try {
            if(offset > 0) {
                const response = await Get(`/user/all/${limit}/${page}`)
                if(response.length > 0) {
                    setUsuarios(response)
                    setLoading(false)
                } else {
                    setOffset(offset-limit)
                    throw new Error(response.error)
                }
            } else {
                const response = await Get(`/user/all/${limit}/${page}`)
                setUsuarios(response)
                setLoading(false)
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
        }
    }, [offset])

    // activate the fetchData between renders
    useEffect(() => {
        fetchData(offset)
    }, [offset, fetchData])

    // use pagination with offset to control the quantity of users to show
    const handlePagination = (page) => {
        if(page > 0 || page == 0) {
            setOffset(page)
        }
    }
    
    // search user by identificación
    const usuario_search_handler = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await Get(`/user/by-identificacion/${buscado.identificacion}`)
            if(response.length > 0) {
                setUsuarios(response)
                setLoading(false)
            } else {
                throw new Error(response.error)
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
        }
    }

    // form handler for user data from
    const buscado_change_handler = (e) => {
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
                handle_close={handle_notification_close}
            />
        )
    }
    return (
        <div className="table-page">
            <br/>
            <div className={`search-${isLightTheme ? 'light':'dark'}`}>
                <form onSubmit={usuario_search_handler}>
                    <input
                        name="identificacion"
                        type="number"
                        value={buscado.identificacion > 0 && buscado.identificacion}
                        placeholder="Identificación del usuario"
                        onChange={buscado_change_handler}
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
                    onClick={() => handlePagination(offset-limit)}
                    disabled={offset==0}
                >
                    <GiPlayerPrevious />
                </button >
                <button
                    type="button"
                    onClick={() => handlePagination(offset+limit)}
                    disabled={usuarios.error}
                >
                    <GiPlayerNext />
                </button>
            </div >
        </div >
    )
}
