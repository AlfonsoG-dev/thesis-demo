// Dependencies
import {useState, useEffect, useCallback} from "react"
import {useOutletContext, useLocation, useBeforeUnload} from "react-router-dom"

// components
import EncabezadoForm from "../../Components/Forms/EncabezadoForm"
import PacienteForm from "../../Components/Forms/PacienteForm"
import AnamnesisForm from "../../Components/Forms/AnamnesisForm"
import SignosForm from "../../Components/Forms/SignosForm"
import ExamenForm from "../../Components/Forms/ExamenForm"

// Util components
import ScrollOptions from "../../Components/ScrollOptions"

// Modal components
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalBlocker from "../../Components/Modals/ModalBlocker"
import { HelpCrearHistoria } from "../Help/HelpCrearHistoria"

// hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook"
import useFormState from "../../Hooks/Form/FormHook"

// data
import { register_historia } from "../../../back-end/historia"
import { pacientes } from "../../../back-end/paciente"

// styles
import "../../Styles/Register.css"
import ComputeDate from "../../Utils/ComputeDate"

/**
 * Page to register historia using paciente.
*/
export function Component() {
    // state = historias
    let {state} = useLocation()
    const [user, isLIghtTheme] = useOutletContext()
    const {
        paciente, setPaciente,
        anamnesis, setAnamnesis,
        signos, setSignos,
        examen, setExamen
    } = useFormState()

    //
    const [status, setStatus] = useState("")
    const [retry, setRetry] = useState(0)

    // modals
    const[showConfirm, setShowConfirm] = useState(false)
    const {
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

    useBeforeUnload(useCallback(() => {
        const historia_object = {
            anamnesis: {
                ...anamnesis
            },
            examen_fisico: {
                ...examen
            },
            signos_vitales: {
                ...signos
            }
        }
        localStorage.paciente_register_historia = JSON.stringify(historia_object)
    }, [anamnesis, examen, signos]))

    // register modal handlers
    const handle_show_confirm = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }
    const handle_close_confirm = () => setShowConfirm(false)

    // get the paciente data using state.id_pk
    const fetch_data = useCallback(async() => {
        try {
            if(state.paciente_id_fk !== undefined) {
                const [res_paciente] = pacientes.filter(p => p.id_pk === Number.parseInt(state.paciente_id_fk))
                setPaciente(res_paciente)
            } else {
                setPaciente(state)
            }
        } catch(er) {
            console.error(er)
        }
    }, [setPaciente, state])

    useEffect(() => {
        fetch_data()
        if(status !== "completed" && localStorage.getItem("paciente_register_historia") !== null) {
            setAnamnesis(JSON.parse(localStorage.getItem("paciente_register_historia")).anamnesis)
            setSignos(JSON.parse(localStorage.getItem("paciente_register_historia")).signos_vitales)
            setExamen(JSON.parse(localStorage.getItem("paciente_register_historia")).examen_fisico)
        }
    }, [status, fetch_data, setAnamnesis, setExamen, setSignos])

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            setStatus("completed")
            setResponseMessage("Se acabaron los intentos intenta recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            show_notification()
        } else {
            setRetry(() => retry+1)
        }
    }
    /**
     * post anamnesis, examen, signos at the same time and uses the id_pk of the response as the values
     * for the historias fields
    */
    const handle_submit = async(e) => {
        e.preventDefault()
        setStatus("loading")
        try {
            const historia_object = {
                paciente: {
                    id_pk: state.paciente_id_fk,
                    ...paciente
                },
                anamnesis: {
                    ...anamnesis
                },
                examen_fisico: {
                    ...examen
                },
                signos_vitales: {
                    ...signos
                }
            }
            const response = register_historia(historia_object, user)
            if(response.msg !== undefined) {
                setStatus("completed")
                setResponseMessage(response.msg)
                setNotificationType("msg")
                handle_close_confirm()
                show_notification()
            } else {
                throw new Error(response.error)
            }
        } catch(er) {
            setStatus("completed")
            validate_retry()
            setResponseMessage(er.toString())
            setNotificationType("error")
            handle_close_confirm()
            show_notification()
            console.error(er)
        }
    }

    const handle_change_anamnesis = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setAnamnesis((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const handle_change_signos = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setSignos((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const handle_change_examen = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setExamen((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    if(status === "loading") {
        return <div className="loader"></div >
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
        <div className={`form-container-${isLIghtTheme ? 'light': 'dark'} form-container`}>
            <ScrollOptions/>
            <form onSubmit={handle_show_confirm}>
                <section className="atencion">
                    <h1>Atención</h1>
                    <label>
                        Fecha ingreso
                        <input
                            name="fecha_ingreso"
                            type="date"
                            placeholder="fecha_ingreso"
                            defaultValue={anamnesis.fecha_ingreso !== null ? ComputeDate(anamnesis.fecha_ingreso) : ""}
                            onChange={handle_change_anamnesis}
                        />
                    </label>
                    <label>
                        Hora ingreso
                        <input
                            name="hora_ingreso"
                            type="time"
                            placeholder="hora_ingreso"
                            defaultValue={anamnesis.hora_ingreso}
                            onChange={handle_change_anamnesis}
                        />
                    </label>
                </section>
                <EncabezadoForm
                    encabezado={paciente} isDisable={true}
                />
                <PacienteForm
                    paciente={paciente}
                    isDisable={true} onChangeHandler={() => {}}
                />
                <AnamnesisForm
                    anamnesis={anamnesis}
                    isDisable={false}
                    onChangeHandler={handle_change_anamnesis}
                />
                <SignosForm
                    signos={signos}
                    isDisable={false}
                    onChangeHandler={handle_change_signos}
                />
                <ExamenForm
                    examen={examen}
                    isDisable={false}
                    onChangeHandler={handle_change_examen}
                />
                <section className="options">
                    <h1>Opciones</h1>
                    <button 
                        type="submit" disabled={status === "completed"}
                    >
                        Registrar
                    </button>
                </section>
            </form>
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <ModalRegister
                show={showConfirm}
                message={"Estas por registrar una historia para el paciente, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={handle_submit}
            />
            <ModalBlocker isCompleted={status}/>
            <HelpCrearHistoria
                show={showHelp}
                type="paciente"
                handle_close={handle_close_help}
            />
        </div>
    )
}
