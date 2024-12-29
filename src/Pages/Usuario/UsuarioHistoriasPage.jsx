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

    //quantity of data to show
    const [offset, setOffset] = useState(0)
    const limit = 5

    // get the data from the end-point of server
    const fetch_data = useCallback((page) => {
        start_operation()
        const m_historias = get_historias_by_user(id_usuario, page, limit)
        if(m_historias.length > 0) {
            end_operation()
            setHistorias(m_historias)
        } else {
            setOffset(() => {
                if(offset >= limit) {
                    return offset-limit
                } else {
                    return 0
                }
            })
            setNotificationType("error")
            setResponseMessage("El usuario no tiene historias")
            show_notification()
            setTimeout(() => {
                end_operation()
            }, 2000)
        }
    }, [end_operation, id_usuario, offset, start_operation])

    useEffect(() => {
        fetch_data(offset)
    }, [offset, fetch_data])

    // show data using pagination offset
    const handle_pagination = (page) => {
        if(page > 0 || page == 0) {
            setOffset(page)
        }
    }

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
                    onClick={() => handle_pagination(offset-limit)}
                    disabled={offset==0}
                >
                    <GrFormPreviousLink/>
                </button>

                <button
                    onClick={() => handle_pagination(offset+limit)}
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
