// Dependencies
import {useState} from "react"
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
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook.js"
import useDataState from "../../Hooks/DataHook.js"

// data
import { users } from "../../../back-end/user.js"

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
    const [buscado, setBuscado] = useState({ identificacion: 0 })

    const [status, setStatus] = useState("loading" | "completed")

    const {
        setElements, getElements, limit, offset, handleNext, handlePrev
    } = useDataState(users)

    const elements = getElements(offset, limit)

    // modal notificación
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification,
    } = useNotificationState()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()


    // search user by identificación
    const handle_search_user = async(e) => {
        e.preventDefault()
        setStatus("loading")
        try {
            const response = users.filter(u => u.rol !== "admin" && u.identificacion === Number.parseInt(buscado.identificacion))
            if(response.length > 0) {
                setElements(response)
                setStatus("completed")
            } else {
                throw new Error("Usuario no encontrado")
            }
        } catch(er) {
            setStatus("completed")
            setResponseMessage(er.toString())
            setNotificationType("error")
            show_notification()
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
    if(status === "loading") {
        return <div className="loader"></div>
    }
    if(notification) {
        return (
            <ModalNotification
                show={notification}
                message={responseMessage}
                type={notificationType}
                handle_close={close_notification}
            />
        )
    }
    return (
        <div className="table-page">
            <br/>
            <section className={`search-${isLightTheme ? 'light':'dark'}`}>
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
            </section>
            <section>
                <h1><FaUserMd/> Usuarios</h1>
                <UsuarioTableComponent data={elements} isLightTheme={isLightTheme}/>
            </section>
            <section className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={offset===0}
                >
                    <GiPlayerPrevious />
                </button >
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={elements.length === 0}
                >
                    <GiPlayerNext />
                </button>
            </section >
            <section>
                <button className="help" onClick={handle_show_help}>
                    help | ?
                </button>
                <HelpPaciente
                    show={showHelp}
                    type="usuario"
                    handle_close={handle_close_help}
                />
            </section>
        </div>
    )
}
