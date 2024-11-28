// Dependencies
import {useCallback, useEffect,useState} from "react"
import { useOutletContext } from "react-router-dom"

//Icons
import { GiPlayerNext, GiPlayerPrevious } from "react-icons/gi"
import { MdOutlinePersonSearch } from "react-icons/md"
import { FaUserInjured } from "react-icons/fa"

// Components
import PacienteTableComponent from "../../Components/Tables/PacienteTableComponent"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"

// hooks
import {Get} from "../../Hooks/Requests.jsx"
import useNotificationState from "../../Hooks/Modal/NotificationHook.js"

// style 
import "../../Styles/Paciente.css"
import "../../Styles/LoadingStyle.css"

/**
 * Page that list the pacientes in the system and some functions to perform.
*/
export function Component() {
    const [,isLightTheme] = useOutletContext()
    // form-state: paciente
    const [buscado, setBuscado] = useState({
        identificacion: 0
    })
    const [pacientes, setPacientes] = useState([])

    //
    const [loading, setLoading] = useState(true)

    // modals
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

    // get data from the end-point server
    const fetchData = useCallback( async(page) => {
        try {
            if(offset > 0) {
                const response = await Get(`/paciente/all/${limit}/${page}`)
                if(response.length > 0) {
                    setPacientes(response)
                    setLoading(false)
                } else {
                    setOffset(offset-limit)
                    throw new Error(response.error)
                }
            } else {
                const response = await Get(`/paciente/all/${limit}/${page}`)
                setPacientes(response)
                setLoading(false)
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
        fetchData(offset)
    }, [offset, fetchData])

    const handlePagination = (page) => {
        if(page > 0 || page == 0) {
            setOffset(page)
        }
    }

    // search paciente by identificación
    const paciente_search_handler = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await Get(`/paciente/${buscado.identificacion}`)
            if(response.length > 0) {
                setPacientes(response)
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

    const buscado_change_handler = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setBuscado(() => ({
            [name]: value
        }))
    }

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
            <div className={`search-${isLightTheme ? 'light' : 'dark'}`}>
                <form onSubmit={paciente_search_handler}>
                    <input
                        name="identificacion"
                        type="number"
                        placeholder="Identificación del paciente"
                        value={buscado.identificacion > 0 && buscado.identificacion}
                        onChange={buscado_change_handler}
                        autoFocus={true}
                    />
                    <button
                        type="submit" 
                        disabled={buscado.identificacion===0 && true}
                    >
                        <MdOutlinePersonSearch />
                    </button>
                </form>
            </div>
            <h1><FaUserInjured/> Pacientes</h1>
            <PacienteTableComponent data={pacientes} isLightTheme={isLightTheme}/>
            <div className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button
                    type="button"
                    onClick={() => handlePagination(offset-limit)}
                    disabled={offset==0}
                >
                    <GiPlayerPrevious/>
                </button>
                <button
                    type="button"
                    onClick={() => handlePagination(offset+limit)}
                    disabled={pacientes.error}
                >
                    <GiPlayerNext/>
                </button>
            </div>
        </div>
    )
}
