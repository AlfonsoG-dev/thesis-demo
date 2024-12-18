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

// hooks
import useNotificationState from "../../Hooks/Modal/NotificationHook"

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
    const [loading, setLoading] = useState(true)

    // Modals
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage
    } = useNotificationState()

    // state for quantity of data to show
    const [offset, setOffset] = useState(0)
    const limit = 5

    // notificación modal handlers
    const handle_close_notification = () => setNotification(false)

    // get the data from the end-point server
    const fetch_data = useCallback((page) => {
        setLoading(true)
        try {
            const response = get_historias_by_paciente(id_paciente, page, limit)
            if(response.length > 0) {
                setLoading(false)
                setHistorias(response)
            } else {
                setOffset(() => {
                    if(offset >= limit) {
                        return offset-limit
                    } else {
                        return 0
                    }
                })
                throw new Error("El paciente no tiene más historias")
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
            console.error(er)
        }
    }, [offset])

    useEffect(() => {
        fetch_data(offset)
    }, [offset, fetch_data, id_paciente])

    const handle_pagination = (page) => {
        if(page > 0 || page == 0) {
            setOffset(page)
        }
    }
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
                handle_close={handle_close_notification}
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
            </div >
        </div >
    )
}
