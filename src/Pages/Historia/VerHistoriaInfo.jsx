// Dependencies
import {useCallback, useEffect, useState} from "react"
import {Outlet, useLocation, useNavigate, useOutletContext} from "react-router-dom"

//Icons
import { MdOutlinePictureAsPdf } from "react-icons/md"

// components
import EncabezadoForm from "../../Components/Forms/EncabezadoForm"
import PacienteForm from "../../Components/Forms/PacienteForm"
import AnamnesisForm from "../../Components/Forms/AnamnesisForm"
import ExamenForm from "../../Components/Forms/ExamenForm"
import SignosForm from "../../Components/Forms/SignosForm"

// Util components
import ScrollOptions from "../../Components/ScrollOptions"
import ComputeDate from "../../Utils/ComputeDate"

// Hooks
import useFormState from "../../Hooks/Form/FormHook"

// data
import { pacientes } from "../../../back-end/paciente"
import { anamnesis_list } from "../../../back-end/anamnesis"
import { examenes } from "../../../back-end/examen_fisico"
import { signos_list } from "../../../back-end/signos_vitales"

// Styles
import "../../Styles/LoadingStyle.css"
import "../../Styles/Register.css"

/**
 * Page to view historia data.
 * From here you can generate pdf file using the button with the pdf icon.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // state = paciente
    let {state} = useLocation()
    const [encabezado, setEncabezado] = useState({
        historia_clinica: state.id_pk,
        facultad: "",
        programa: "",
        codigo: "",
        eps: ""
    })
    const {
        paciente, setPaciente,
        anamnesis, setAnamnesis,
        signos, setSignos,
        examen, setExamen,
    } = useFormState()
    const [historia] = useState(state)

    // navigation system
    const navigate = useNavigate()
    
    // overall state
    const [status, setStatus] = useState("loading" | "completed")


    // get data from end-point server
    const fetch_data = useCallback(() => {
        setStatus("loading")
        try {
            if(historia.paciente_if_fk !== null) {
                const [res_paciente] = pacientes.filter(p => p.id_pk === Number.parseInt(historia.paciente_id_fk))
                setPaciente(res_paciente)
                setEncabezado(res_paciente)
            }
            if(historia.anamnesis_id_fk !== null) {
                const [res_anamnesis] = anamnesis_list.filter(a => a.id_pk === Number.parseInt(historia.anamnesis_id_fk))
                setAnamnesis(res_anamnesis)
            }
            if(historia.signos_vitales_id_fk !== null) {
                const [res_signos] = signos_list.filter(s => s.id_pk === Number.parseInt(historia.signos_vitales_id_fk))
                setSignos(res_signos)
            }
            if(historia.examen_fisico_id_fk !== null) {
                const [res_examen] = examenes.filter(e => e.id_pk === Number.parseInt(historia.examen_fisico_id_fk))
                setExamen(res_examen)
            }
            setStatus("completed")
        } catch(er) {
            setStatus("completed")
            console.error(er)
        }
    }, [historia.anamnesis_id_fk, historia.examen_fisico_id_fk, historia.paciente_id_fk, historia.paciente_if_fk, historia.signos_vitales_id_fk, setAnamnesis, setExamen, setPaciente, setSignos])

    useEffect(() => {
        fetch_data()
    }, [fetch_data])

    if(status === "loading") {
        return <div className="loader"></div>
    }
    return(
        <div className={`form-container-${isLightTheme ? 'light':'dark'} form-container`}>
            <ScrollOptions/>
            <button onClick={() => {
                navigate("/app/historia/pdf", {
                    state: [paciente, anamnesis, signos, examen]
                })
            }}>
                <MdOutlinePictureAsPdf/>
            </button>
            <form>
                { anamnesis.fecha_ingreso !== null && anamnesis.hora_ingreso !== null &&
                    <section className="atencion">
                        <h1>Atención</h1>
                        <label>
                            Fecha ingreso
                            <input
                                name="fecha_ingreso"
                                type="date"
                                placeholder="fecha_ingreso"
                                defaultValue={ComputeDate(anamnesis.fecha_ingreso)}
                                disabled={true}
                            />
                        </label>
                        <label>
                            Hora ingreso
                            <input
                                name="hora_ingreso"
                                type="time"
                                placeholder="hora_ingreso"
                                defaultValue={anamnesis.hora_ingreso}
                                disabled={true}
                            />
                        </label>
                    </section>
                }
                <EncabezadoForm encabezado={encabezado} isDisable={true}/>
                <PacienteForm paciente={paciente} isDisable={true}/>
                <AnamnesisForm 
                    anamnesis={anamnesis} isDisable={true} onChangeHandler={() => {}}
                />
                <SignosForm
                    signos={signos} isDisable={true} onChangeHandler={() => {}}
                />
                <ExamenForm
                    examen={examen} isDisable={true} onChangeHandler={() => {}}
                />
            </form>
            <Outlet/>
        </div>
    )
}
