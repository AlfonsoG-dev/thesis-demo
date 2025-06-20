// Dependencies
import PropTypes from "prop-types"
import { useOutletContext, Link, useNavigate } from "react-router-dom"
import {useState, useRef} from "react"

// Components
import ModalNotification from "../../Components/Modals/ModalNotification"
import HelpPaciente from "../Help/HelpPaciente"

// Icons
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"
import { VscOpenPreview } from "react-icons/vsc"
import { PiFilePdfFill } from "react-icons/pi"
import { MdOutlinePersonSearch } from "react-icons/md"
import { FaBookMedical } from "react-icons/fa"
import { VscNewFile } from "react-icons/vsc"

// Hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook"
import useDataState from "../../Hooks/DataHook"

// data
import { historias } from "../../../back-end/historia"

// Style
import "../../Styles/TableStyle.css"
import "../../Styles/Paciente.css"
import "../../Styles/LoadingStyle.css"

export function Component() {
    const navigate = useNavigate()
    const [, isLightTheme] = useOutletContext()

    const [status, setStatus] = useState("")

    const search_ref = useRef(null);
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

    const {
        setElements, getElements, limit, offset, handleNext, handlePrev
    } = useDataState(historias)

    const elements = getElements(offset, limit)

    const handle_search_historia = (e) => {
        e.preventDefault()
        setStatus("loading")
        try {
            if(search_ref.current === null || search_ref.current.id_pk === undefined) {
                throw new Error("Digita el número de ID de la historia clínica")
            }
            const response = historias.filter(h => h.id_pk === Number.parseInt(search_ref.current.id_pk))
            if(response.length > 0) {
                setStatus("completed")
                setElements(response)
            } else {
                throw new Error("Historia no encontrada")
            }
        } catch(er) {
            setStatus("completed")
            setResponseMessage(er.toString())
            setNotificationType("error")
            show_notification()
            console.error(er)
        }
    }

    const handle_search_ref = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        search_ref.current = {[name]: value}
    }

    if(status === "loading") {
        return <div className="loader"> </div>
    }

    if(notification) {
        return <ModalNotification 
            show={notification}
            message={responseMessage}
            type={notificationType}
            handle_close={close_notification}
        />
    }
    return (
        <div className="table-page">
            <br/>
            <section className={`search-${isLightTheme ? 'light':'dark'}`}>
                <form onSubmit={handle_search_historia}>
                    <input
                        ref={search_ref}
                        name="id_pk"
                        type="number"
                        defaultValue={search_ref.current !== null}
                        placeholder="ID"
                        onChange={handle_search_ref}
                        autoFocus={true}
                    />
                    <button
                        type="submit"
                    >
                        <MdOutlinePersonSearch/>
                    </button>
                </form >
            </section>
            <button className="opt-registro" onClick={() => {navigate("/app/historia/registro")}}>
                Crear historia | <VscNewFile/>
            </button>
            <h1>Historias clínicas | <FaBookMedical/></h1>
            <HistoriasTableComponent
                historias={elements}
                isLightTheme={isLightTheme}
            />
            <div className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={offset===0}
                >
                    <GrFormPreviousLink/>
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={elements.length === 0}
                >
                    <GrFormNextLink/>
                </button>
            </div>
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <HelpPaciente
                show={showHelp}
                type="historias_page"
                handle_close={handle_close_help}
            />
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
