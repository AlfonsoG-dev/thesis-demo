// Dependencies
import {useCallback, useEffect, useState} from "react"
import { useParams, useLocation, useNavigate, useOutletContext } from "react-router-dom"

// Icons
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"
import { VscNewFile } from "react-icons/vsc"
import { FaHospitalUser } from "react-icons/fa"
import { MdOutlinePictureAsPdf } from "react-icons/md"

// Components
import HistoriaTableComponent from "../../Components/Tables/HistoriaTableComponent"
import ModalNotification from "../../Components/Modals/ModalNotification"
import HelpPaciente from "../Help/HelpPaciente"

// hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook"
import useStatusState from "../../Hooks/Form/StatusHook"
import usePaginationState from "../../Hooks/Form/PaginationHook"

// Utils
import TitleFormat from "../../Utils/Formats/Title"

// data
import {get_historias_by_paciente} from "../../../back-end/historia.js"

// styles
import "../../Styles/TableStyle.css"
import "../../Styles/Paciente.css"
import "../../Styles/LoadingStyle.css"

/**
 * List the historias by paciente.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // State
    let { id_paciente } = useParams()
    const {state} = useLocation()
    const [historias, setHistorias] = useState([])
    const h1_text = TitleFormat(state.nombres + " " + state.apellidos)

    // navigate system
    const navigate = useNavigate()
    //
    const {
        loading, start_operation, end_operation
    } = useStatusState()

    // Modals
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

    const default_limit_value = 2
    // state for quantity of data to show
    const {
        offset, setOffset,
        limit, setLimit,
        handle_pagination
    } = usePaginationState(default_limit_value)

    // get the data from the end-point server
    const fetch_data = useCallback((page) => {
        start_operation()
        try {
            const response = get_historias_by_paciente(id_paciente, page, limit)
            if(response.length > 0) {
                end_operation()
                setHistorias(response)
            } else {
                throw new Error("El paciente no tiene más historias")
            }
        } catch(er) {
            end_operation()
            setResponseMessage(er.toString())
            setNotificationType("error")
            show_notification()
            setOffset((prev) => prev-default_limit_value)
            setLimit((prev) => prev-default_limit_value)
            console.error(er)
        }
    }, [end_operation, id_paciente, limit, setLimit, setNotificationType, setOffset, setResponseMessage, show_notification, start_operation])

    useEffect(() => {
        fetch_data(offset)
    }, [offset, fetch_data, id_paciente])

    const handle_copy_HCE = () => {
        alert("No implementado para esta ¡ demostración !")
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
        <div className="">
            <br/>
            <div className="table-page">
                <button className="button-option" onClick={() => {
                    navigate("/app/paciente/historia/registro", {
                        state: state
                    })
                }}>
                    Hoja de Control | <VscNewFile/>
                </button>
                {
                    (historias.length !== undefined && historias.length > 1) &&
                    <button className="button-option" onClick={handle_copy_HCE}>
                        Generar HCE | <MdOutlinePictureAsPdf/>
                    </button>
                }
                <h1>Historia clínica | <FaHospitalUser/></h1>
                <h2>{h1_text}</h2>
            </div>
            <HistoriaTableComponent data={historias} type={"paciente"} isLightTheme={isLightTheme}/>
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
                type="historias"
                handle_close={handle_close_help}
            />
        </div >
    )
}
