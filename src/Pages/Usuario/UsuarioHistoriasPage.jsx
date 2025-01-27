// Dependencies
import { useParams, useLocation, useOutletContext } from "react-router-dom"

//Icons
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"
import { FaHospitalUser } from "react-icons/fa"

// components
import HistoriaTableComponent from "../../Components/Tables/HistoriaTableComponent"
import HelpPaciente from "../Help/HelpPaciente"

// hooks
import  {useHelpState} from "../../Hooks/Modal/NotificationHook.js"
import useDataState from "../../Hooks/DataHook"

// utils
import TitleFormat from "../../Utils/Formats/Title"

// data
import { historias } from "../../../back-end/historia"

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


    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

    const {
        getElements, limit, offset, handleNext, handlePrev
    } = useDataState(historias)

    const elements = getElements(offset, limit).filter(h => h.usuario_id_fk === Number.parseInt(id_usuario))

    return(
        <div className="table-page">
            <br/>
            <h1>Historia clínica | <FaHospitalUser/></h1>
            <h2>{user_name}</h2>
            <br/>
            <HistoriaTableComponent data={elements} type={"usuario"} isLightTheme={isLightTheme}/>
            <div className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button 
                    onClick={handlePrev}
                    disabled={offset===0}
                >
                    <GrFormPreviousLink/>
                </button>

                <button
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
                type="historias_usuario"
                handle_close={handle_close_help}
            />
        </div>
    )

}
