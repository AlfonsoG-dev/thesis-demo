// Dependencies
import {useRef, useState} from "react"
import { useOutletContext } from "react-router-dom"

//Icons
import { GiPlayerNext, GiPlayerPrevious } from "react-icons/gi"
import { MdOutlinePersonSearch } from "react-icons/md"
import { FaUserInjured } from "react-icons/fa"

// Components
import PacienteTableComponent from "../../Components/Tables/PacienteTableComponent"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"
import HelpPaciente from "../Help/HelpPaciente"

// hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook.js"
import useDataState from "../../Hooks/DataHook"

// data
import { pacientes } from "../../../back-end/paciente"

// style 
import "../../Styles/Paciente.css"
import "../../Styles/LoadingStyle.css"

/**
 * Page that list the pacientes in the system and some functions to perform.
*/
export function Component() {

    const [,isLightTheme] = useOutletContext()

    // form-state: paciente
    const search_ref = useRef(null)

    const {
        setElements, getElements, limit, offset, handleNext, handlePrev
    } = useDataState(pacientes)

    // init the data
    const elements = getElements(offset, limit)

    //
    const [status, setStatus] = useState("")

    // modals
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

    // search paciente by identificación
    const handle_search_paciente = async(e) => {
        e.preventDefault()
        setStatus("loading")
        try {
            if(search_ref.current === null || search_ref.current.identificacion === undefined) {
                throw new Error("Digita el número de identificación del paciente")
            }
            const response = pacientes.filter(p => p.identificacion === Number.parseInt(search_ref.current.identificacion))
            if(response.length === 0) {
                throw new Error("Paciente no encontrado")
            }
            setStatus("completed")
            setElements(response)
        } catch(er) {
            setStatus("completed")
            setResponseMessage(er.toString())
            setNotificationType("error")
            show_notification()
            console.error(er)
        }
    }

    const handle_change_searched = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        search_ref.current = {[name]: value}
    }

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
            <section className={`search-${isLightTheme ? 'light' : 'dark'}`}>
                <form onSubmit={handle_search_paciente}>
                    <input
                        ref={search_ref}
                        name="identificacion"
                        type="number"
                        placeholder="Identificación del paciente"
                        defaultValue={search_ref.current !== null}
                        onChange={handle_change_searched}
                        autoFocus={true}
                    />
                    <button
                        type="submit" 
                    >
                        <MdOutlinePersonSearch />
                    </button>
                </form>
            </section>
            <h1><FaUserInjured/> Pacientes</h1>
            <PacienteTableComponent data={elements} isLightTheme={isLightTheme}/>
            <section className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={offset===0}
                >
                    <GiPlayerPrevious/>
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={elements.length === 0}
                >
                    <GiPlayerNext/>
                </button>
            </section>
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <HelpPaciente
                show={showHelp}
                type="paciente"
                handle_close={handle_close_help}
            />
        </div>
    )
}
