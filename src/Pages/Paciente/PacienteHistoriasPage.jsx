// Dependencies
import { useParams, useLocation, useNavigate, useOutletContext } from "react-router-dom"

// Icons
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr"
import { VscNewFile } from "react-icons/vsc"
import { FaHospitalUser } from "react-icons/fa"
import { MdOutlinePictureAsPdf } from "react-icons/md"

// Components
import HistoriaTableComponent from "../../Components/Tables/HistoriaTableComponent"
import HelpPaciente from "../Help/HelpPaciente"

// hooks
import {useHelpState} from "../../Hooks/Modal/NotificationHook"
import useDataState from "../../Hooks/DataHook"


// Utils
import TitleFormat from "../../Utils/Formats/Title"

// data
import {historias} from "../../../back-end/historia.js"

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
    const { id_paciente } = useParams()
    const {state} = useLocation()
    const h1_text = TitleFormat(state.nombres + " " + state.apellidos)

    // navigate system
    const navigate = useNavigate()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

    const {
        getElements, limit, offset, handleNext, handlePrev
    } = useDataState(historias.filter(h => h.paciente_id_fk === Number.parseInt(id_paciente)))

    const elements = getElements(offset, limit)


    const handle_copy_HCE = () => {
        alert("No implementado para esta ¡ demostración !")
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
            <HistoriaTableComponent data={elements} type={"paciente"} isLightTheme={isLightTheme}/>
            <div className={`pagination-${isLightTheme ? 'light':'dark'}`}>
                <button 
                    onClick={handlePrev}
                    disabled={offset === 0}
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
                type="historias"
                handle_close={handle_close_help}
            />
        </div >
    )
}
