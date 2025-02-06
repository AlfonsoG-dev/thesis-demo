// Dependencies
import { useCallback, useEffect, useState } from "react"
import { useOutletContext, useBeforeUnload } from "react-router-dom"

// components
import SignosForm from '../../Components/Forms/SignosForm.jsx'
import ExamenForm from '../../Components/Forms/ExamenForm.jsx'
import AnamnesisForm from '../../Components/Forms/AnamnesisForm.jsx'
import PacienteForm from '../Usuario/Components/PacienteForm.jsx'
import ScrollOptions from "../../Components/ScrollOptions.jsx"
import { HelpCrearHistoria } from "../Help/HelpCrearHistoria.jsx"

// modals
import ModalRegister from "../../Components/Modals/ModalRegister.jsx"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"
import ModalBlocker from "../../Components/Modals/ModalBlocker.jsx"

// hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook.js"
import useFormState from "../../Hooks/Form/FormHook.js"


// utils
import ComputeEdad from "../../Utils/ComputeEdad.js"
import ComputeDate from "../../Utils/ComputeDate.js"

// data
import { register_historia } from "../../../back-end/historia.js"
import { pacientes } from "../../../back-end/paciente.js"

// Styles
import "../../Styles/Register.css"

/**
 * Page to register historia using usuario.
 * This page is used when the paciente doesn't exists.
 * If the paciente is register from here and it already exists only the identificación field will be used.
*/
export function Component() {
    const [user, isLightTheme] = useOutletContext()
    // form data state
    const {
        paciente, setPaciente,
        anamnesis, setAnamnesis,
        signos, setSignos,
        examen, setExamen,
    } = useFormState()

    // over all state
    const [status, setStatus] = useState("loading" | "completed")
    const [retry, setRetry] = useState(0)

    // Modals
    const [showConfirm, setShowConfirm] = useState(false)
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
            paciente: {
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
        localStorage.register_historia = JSON.stringify(historia_object)
    }, [anamnesis, examen, paciente, signos]))

    // register modal handlers
    const handle_show_confirm = (e) => {
        e.preventDefault()
        setShowConfirm(true)
    }
    const handle_close_confirm = () => setShowConfirm(false)

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            setStatus("completed")
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            show_notification()
        } else {
            setRetry(() => retry+1)
        }
    }

    const handle_submit = async(e) => {
        e.preventDefault()
        setStatus("loading")
        try {
            if(paciente.genero === "otro") {
                paciente.genero = paciente.genero1
            }
            if(paciente.estado_civil === "otro") {
                paciente.estado_civil = paciente.estado_civil1
            }
            delete paciente.genero1
            delete paciente.estado_civil1
            if(paciente.facultad === "select...") {
                paciente.facultad = null
                paciente.programa = null
            }
            const exists_paciente = pacientes.filter(p => p.identificacion === Number.parseInt(paciente.identificacion))
            if(exists_paciente.length === 0 && ComputeEdad(paciente.fecha_nacimiento)) {
                const historia_object = {
                    paciente: {
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
                if(response.error) {
                    throw new Error(response.error)
                }
                alert("El paciente no existe, será registrado")
                setStatus("completed")
                setNotificationType("msg")
                setResponseMessage(response.msg)
                handle_close_confirm()
                show_notification()
                localStorage.removeItem('register_historia')
            } else {
                alert("El paciente ya existe, solo se registra la historia")
                const historia_object = {
                    paciente: {
                        id_pk: exists_paciente[0].id_pk
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
                const response = register_historia(historia_object)
                if(response.error) {
                    throw new Error(response.error)
                }
                setStatus("completed")
                setNotificationType("msg")
                setResponseMessage(response.msg)
                handle_close_confirm()
                show_notification()
                localStorage.removeItem('register_historia')
            }
        } catch(er) {
            setStatus("completed")
            validate_retry()
            setNotificationType("error")
            setResponseMessage(er.toString())
            handle_close_confirm()
            show_notification()
            console.error(er)
        }
    }
    useEffect(() => {
        if(status !== "completed" && localStorage.getItem("register_historia") !== null) {
            setPaciente(JSON.parse(localStorage.getItem("register_historia")).paciente)
            setAnamnesis(JSON.parse(localStorage.getItem("register_historia")).anamnesis)
            setSignos(JSON.parse(localStorage.getItem("register_historia")).signos_vitales)
            setExamen(JSON.parse(localStorage.getItem("register_historia")).examen_fisico)
        }
    }, [status, setAnamnesis, setExamen, setPaciente, setSignos])

    const handle_change_anamnesis = (e) => {
        const {name, value} = e.target
        setAnamnesis((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const handle_change_signos = (e) => {
        const {name, value} = e.target
        setSignos((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const handle_change_examen = (e) => {
        const {name, value} = e.target
        setExamen((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const handle_change_paciente = (e) => {
        const {name, value} = e.target
        setPaciente((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    if(status === "loading") {
        return <div className="loader"></div>
    }
    if(notification) {
        return <ModalNotification
            show={notification}
            message={responseMessage}
            type={notificationType}
            handle_close={close_notification}
            />
    }
    return(
        <div className={`form-container-${isLightTheme ? 'light':'dark'} form-container`}>
            <section>
                <button className="help" onClick={handle_show_help}>
                    help | ?
                </button>
                <ScrollOptions/>
            </section>
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
                            required={true}
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
                            required={true}
                        />
                    </label>
                </section>
                <PacienteForm
                    paciente={paciente}
                    onChangeHandler={handle_change_paciente}
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
            <ModalRegister
                show={showConfirm}
                message={"Estas por registrar una historia, Confirma está acción"}
                handle_close={handle_close_confirm}
                handle_confirm={handle_submit}
            />
            <ModalBlocker isCompleted={status}/>
            <HelpCrearHistoria 
                show={showHelp}
                type="historia"
                handle_close={handle_close_help}
            />
        </div>
    )
}
