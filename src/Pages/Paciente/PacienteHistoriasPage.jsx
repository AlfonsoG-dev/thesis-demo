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
import { Get } from "../../Hooks/Requests"
import useNotificationState from "../../Hooks/Modal/NotificationHook"

// Utils
import TitleFormat from "../../Utils/Formats/Title"

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
    const handle_notification_close = () => setNotification(false)

    // get the data from the end-point server
    const fetchData = useCallback( async (page) => {
        try {
            if(offset > 0) {
                const response = await Get(
                    `/historia/paciente/${id_paciente}/${limit}/${page}`
                )
                if(response.length > 0) {
                    setHistorias(response)
                    setLoading(false)
                } else {
                    setOffset(offset-limit)
                    throw new Error(response.error)
                }
            } else {
                const response = await Get(
                    `/historia/paciente/${id_paciente}/${limit}/${page}`
                )
                setHistorias(response)
                setLoading(false)
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
        }
    }, [offset])

    useEffect(() => {
        fetchData(offset)
    }, [offset, fetchData, id_paciente])

    const handlePagination = (page) => {
        if(page > 0 || page == 0) {
            setOffset(page)
        }
    }
    const handle_copy_HCE = () => {
        navigate("/app/paciente/copy-pdf", {
            state: id_paciente
        })
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
                handle_close={handle_notification_close}
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
                    onClick={() => handlePagination(offset-limit)}
                    disabled={offset==0}
                >
                    <GrFormPreviousLink/>

                </button>

                <button
                    onClick={() => handlePagination(offset+limit)}
                    disabled={historias.error}
                >
                    <GrFormNextLink/>
                </button>
            </div >
        </div >
    )
}
