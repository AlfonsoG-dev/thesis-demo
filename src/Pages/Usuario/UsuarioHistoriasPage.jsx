// Dependencies
import { useCallback, useEffect, useState } from "react"
import { useParams, useLocation, useOutletContext } from "react-router-dom"

//Icons
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"
import { FaHospitalUser } from "react-icons/fa"

// components
import HistoriaTableComponent from "../../Components/Tables/HistoriaTableComponent"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"

// hooks
import {Get} from "../../Hooks/Requests.jsx"
import useNotificationState from "../../Hooks/Modal/NotificationHook.js"

// utils
import TitleFormat from "../../Utils/Formats/Title"

// style
import "../../Styles/TableStyle.css"
import "../../Styles/Paciente.css"
import "../../Styles/LoadingStyle.css"

/**
 * Page with the list of historias by usuario.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // state: usuario
    const { id_usuario } = useParams()
    const {state} = useLocation()
    const user_name = TitleFormat(state.name)

    // list of historias
    const [historias, setHistorias] = useState([])

    const [loading, setLoading] = useState(true)

    // modals
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage
    } = useNotificationState()

    //quantity of data to show
    const [offset, setOffset] = useState(0)
    const limit = 5

    // notificación modal handlers
    const handle_close_notification = () => setNotification(false)

    // get the data from the end-point of server
    const fetchData = useCallback( async(page) => {
        try {
            if(offset > 0) {
                const response = await Get(`/historia/usuario/${id_usuario}/${limit}/${page}`)
                if(response.length > 0) {
                    setHistorias(response)
                    setLoading(false)
                } else {
                    setOffset(offset-limit)
                    throw new Error(response.error)
                }
            } else {
                const response = await Get(`/historia/usuario/${id_usuario}/${limit}/${page}`)
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
    }, [offset, fetchData])

    // show data using pagination offset
    const handlePagination = (page) => {
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
                handle_close={handle_close_notification}
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
        </div>
    )

}
