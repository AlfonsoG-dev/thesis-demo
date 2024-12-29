// Dependencies
import { useCallback, useEffect, useState } from "react"
import { useParams, useLocation, useOutletContext } from "react-router-dom"

//Icons
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"
import { FaHospitalUser } from "react-icons/fa"

// components
import HistoriaTableComponent from "../../Components/Tables/HistoriaTableComponent"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"
import HelpPaciente from "../Help/HelpPaciente"

// hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook.js"
import useStatusState from "../../Hooks/Form/StatusHook"
import usePaginationState from "../../Hooks/Form/PaginationHook"

// utils
import TitleFormat from "../../Utils/Formats/Title"

// data
import { get_historias_by_user } from "../../../back-end/historia"

// style
import "../../Styles/TableStyle.css"
import "../../Styles/Paciente.css"
import "../../Styles/LoadingStyle.css"

/**
 * Page with the list of historias by usuario.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    const {id_usuario} = useParams()
    // state: usuario
    const {state} = useLocation()
    const user_name = TitleFormat(state.name)

    // list of historias
    const [historias, setHistorias] = useState([])

    const {
        loading, start_operation, end_operation
    } = useStatusState()

    // modals
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

    const default_limit_value = 2
    //quantity of data to show
    const {
        offset, setOffset,
        limit, setLimit,
        handle_pagination
    } = usePaginationState(default_limit_value)

    // get the data from the end-point of server
    const fetch_data = useCallback((page) => {
        start_operation()
        const m_historias = get_historias_by_user(id_usuario, page, limit)
        if(m_historias.length > 0) {
            end_operation()
            setHistorias(m_historias)
        } else {
            setNotificationType("error")
            setResponseMessage("El usuario no tiene historias")
            show_notification()
            setOffset((prev) => prev-default_limit_value)
            setLimit((prev) => prev-default_limit_value)
            setTimeout(() => {
                end_operation()
            }, 2000)
        }
    }, [end_operation, id_usuario, limit, setLimit, setNotificationType, setOffset, setResponseMessage, show_notification, start_operation])

    useEffect(() => {
        fetch_data(offset)
    }, [offset, fetch_data])

    if(loading) {
        return <div className="loader"></div>
    }
    if(notification) {
        return(
            <ModalNotification
                show={notification}
                message={responseMessage}
                type={notificationType}
                handle_close={close_notification}
            />
        )
    }
    return(
        <div className="table-page">
            <br/>
            <h1>Historia clínica | <FaHospitalUser/></h1>
            <h2>{user_name}</h2>
            <br/>
            <HistoriaTableComponent data={historias} type={"usuario"} isLightTheme={isLightTheme}/>
            <div className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button 
                    onClick={() => handle_pagination(offset-default_limit_value, limit-default_limit_value)}
                    disabled={offset==0}
                >
                    <GrFormPreviousLink/>
                </button>

                <button
                    onClick={() => handle_pagination(offset+default_limit_value, limit+default_limit_value)}
                    disabled={historias.error}
                >
                    <GrFormNextLink/>
                </button>
            </div>
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <HelpPaciente
                show={showHelp}
                type="historias_usuario"
                handle_close={handle_close_help}
            />
        </div>
    )

}
