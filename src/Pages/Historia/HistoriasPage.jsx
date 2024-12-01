// Dependencies
import PropTypes from "prop-types"
import { useOutletContext, Link } from "react-router-dom"
import {useCallback, useEffect, useState} from "react"

// Components
import ModalNotification from "../../Components/Modals/ModalNotification"

// Icons
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"
import { VscOpenPreview } from "react-icons/vsc"
import { PiFilePdfFill } from "react-icons/pi"
import { MdOutlinePersonSearch } from "react-icons/md"
import { FaBookMedical } from "react-icons/fa"

// Hooks
import { Get } from "../../Hooks/Requests"
import useNotificationState from "../../Hooks/Modal/NotificationHook"

// Style
import "../../Styles/TableStyle.css"
import "../../Styles/Paciente.css"
import "../../Styles/LoadingStyle.css"

export function Component() {
    const [, isLightTheme] = useOutletContext()
    const [loading, setLoading] = useState(false)
    const [historias, setHistorias] = useState([])
    const [buscado, setBuscado] = useState({
        id_pk: 0
    })
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
    } = useNotificationState()
    const [offset, setOffset] = useState(0)


    const limit = 10

    const handle_close_notification = () => setNotification(false)

    const fetch_data = useCallback(async(page) => {
        setLoading(true)
        try {
            if(offset > 0) {
                const response = await Get(`/historia/all/${limit}/${page}`)
                if(response.error === undefined) {
                    setLoading(false)
                    setHistorias(response)
                } else {
                    setOffset(offset-limit)
                    throw new Error(response.error)
                }
            } else {
                const response = await Get(`/historia/all/${limit}/${page}`)
                if(response.error === undefined) {
                    setLoading(false)
                    setHistorias(response)
                } else {
                    setLoading(false)
                }
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
            console.error(er)
        }
    }, [offset])

    const handle_search_historia = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await Get(`/historia/by-id/${buscado.id_pk}`)
            if(response.error === undefined) {
                setLoading(false)
                setHistorias(response)
            } else {
                throw new Error(response.error)
            }
        } catch(er) {
            setLoading(false)
            setResponseMessage(er.toString())
            setNotificationType("error")
            setNotification(true)
            console.error(er)
        }
    }

    const handle_pagination = (page) => {
        if(page > 0 || page === 0) {
            setOffset(page)
        }
    }
    const buscado_change_handler = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setBuscado((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        fetch_data(offset)
    }, [fetch_data, offset])

    if(loading) {
        return <div className="loader"> </div>
    }

    if(notification) {
        return <ModalNotification 
            show={notification}
            message={responseMessage}
            type={notificationType}
            handle_close={handle_close_notification}
        />
    }

    return (
        <div className="table-page">
            <br/>
            <div className={`search-${isLightTheme ? 'light':'dark'}`}>
                <form onSubmit={handle_search_historia}>
                    <input
                        name="id_pk"
                        type="number"
                        defaultValue={buscado.id_pk > 0 && buscado.id_pk}
                        placeholder="ID"
                        onChange={buscado_change_handler}
                        autoFocus={true}
                    />
                    <button
                        type="submit"
                        disabled={buscado.id_pk === 0 && true}
                    >
                        <MdOutlinePersonSearch/>
                    </button>
                </form >
            </div>
            <h1>Historias clínicas | <FaBookMedical/></h1>
            <HistoriasTableComponent
                historias={historias}
                isLightTheme={isLightTheme}
            />
            <div className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button
                    type="button"
                    onClick={() => handle_pagination(offset-limit)}
                    disabled={offset==0}
                >
                    <GrFormPreviousLink/>
                </button>
                <button
                    type="button"
                    onClick={() => handle_pagination(offset+limit)}
                    disabled={historias.error}
                >
                    <GrFormNextLink/>
                </button>
            </div>
        </div>
    )
}

function HistoriasTableComponent({historias, isLightTheme}) {
    const [notification, setNotification ] = useState(true)
    const handle_close_notification = () => setNotification(false)
    if(historias.length === 0) {
        return <ModalNotification
            show={notification}
            message={"Error: Vacío"}
            type={"msg"}
            handle_close={handle_close_notification}
        />
    }
    return (
        <table className={`${isLightTheme ? 'light':'dark'}`}>
            <thead>
                <tr>
                    <td>ID</td>
                    <th>Usuario</th>
                    <th>Paciente</th>
                    <th>Referencia</th>
                    <th>Actualizada por</th>
                    <th>Creado en</th>
                    <th>Actualizado en</th>
                    <th>Ver</th>
                    <th>PDF</th>
                </tr>
            </thead>
            <tbody>
                {
                    historias.length > 0 && historias.map((i) => (
                        <tr key={i.id_pk}>
                            <td>{i.id_pk}</td>
                            <td>{i.usuario_id_fk}</td>
                            <td>{i.paciente_id_fk}</td>
                            <td>{i.referencia}</td>
                            <td>{i.update_by}</td>
                            <td>{new Date(i.create_at).toLocaleString()}</td>
                            <td>{i.update_at !== null && new Date(i.update_at).toLocaleString()}</td>
                            <td >
                                <Link
                                    to={"/app/ver-historia"}
                                    state={i}
                                >
                                    <VscOpenPreview />
                                </Link>
                            </td>
                            <td>
                                <Link to={"/app/historia/pdf"} state={i}>
                                    <PiFilePdfFill/>
                                </Link >
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

HistoriasTableComponent.propTypes = {
    historias: PropTypes.array,
    isLightTheme: PropTypes.bool
}
