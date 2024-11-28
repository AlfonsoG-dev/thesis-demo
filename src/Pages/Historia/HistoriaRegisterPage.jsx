// Dependencies
import { useCallback, useEffect, useState } from "react"
import { useOutletContext, useBeforeUnload } from "react-router-dom"

// components
import SignosForm from '../../Components/Forms/SignosForm.jsx'
import ExamenForm from '../../Components/Forms/ExamenForm.jsx'
import AnamnesisForm from '../../Components/Forms/AnamnesisForm.jsx'
import PacienteForm from '../Usuario/Components/PacienteForm.jsx'
import ScrollOptions from "../../Components/ScrollOptions.jsx"

// modals
import ModalRegister from "../../Components/Modals/ModalRegister.jsx"
import ModalNotification from "../../Components/Modals/ModalNotification.jsx"
import ModalBlocker from "../../Components/Modals/ModalBlocker.jsx"

// hooks
import useNotificationState from "../../Hooks/Modal/NotificationHook.js"
import useFormState from "../../Hooks/Form/FormHook.js"
import { Post, Get } from "../../Hooks/Requests.jsx"

// utils
import ComputeEdad from "../../Utils/ComputeEdad.js"
import ComputeDate from "../../Utils/ComputeDate.js"

// Styles
import "../../Styles/Register.css"

/**
 * Page to register historia using usuario.
 * This page is used when the paciente doesn't exists.
 * If the paciente is register from here and it already exists only the identificación field will be used.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // form data state
    const {
        paciente, setPaciente,
        anamnesis, setAnamnesis,
        signos, setSignos,
        examen, setExamen,
        isCompleted, setIsCompleted
    } = useFormState()

    // over all state
    const [loading, setLoading] = useState(false)
    const [retry, setRetry] = useState(0)

    // Modals
    const [showModal, setShowModal] = useState(false)
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage
    } = useNotificationState()

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
    const show_modal = (e) => {
        e.preventDefault()
        setShowModal(true)
    }
    const hide_modal = () => setShowModal(false)

    // notificación modal handlers
    const handle_close_notification = () => setNotification(false)

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            setIsCompleted(true)
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            hide_modal()
            setNotification(true)
        } else {
            setRetry(() => retry+1)
        }
    }

    const historia_submit_handler = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if(paciente.genero === "otro") {
                paciente.genero = paciente.genero1
            }
            if(paciente.estado_civil === "otr@") {
                paciente.estado_civil = paciente.estado_civil1
            }
            delete paciente.genero1
            delete paciente.estado_civil1
            if(paciente.facultad === "select...") {
                paciente.facultad = null
                paciente.programa = null
            }
            const exists_paciente = await Get(`/paciente/${paciente.identificacion}`)
            if(exists_paciente.error && ComputeEdad(paciente.fecha_nacimiento)) {
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
                const response = await Post("/historia/post-without-paciente", historia_object)
                if(response.msg !== undefined) {
                    alert("El paciente no existe, será registrado")
                    setIsCompleted(true)
                    setLoading(false)
                    setNotificationType("msg")
                    setResponseMessage(response.msg)
                    hide_modal()
                    setNotification(true)
                } else {
                    throw new Error(response.error)
                }
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
                const response = await Post("/historia/post-with-paciente", historia_object)
                if(response.msg !== undefined) {
                    setIsCompleted(true)
                    setLoading(false)
                    setNotificationType("msg")
                    setResponseMessage(response.msg)
                    hide_modal()
                    setNotification(true)
                } else {
                    throw new Error(response.error)
                }
            }
        } catch(er) {
            setIsCompleted(false)
            setLoading(false)
            validate_retry()
            setNotificationType("error")
            setResponseMessage(er.toString())
            hide_modal()
            setNotification(true)
            console.error(er)
        }
    }
    useEffect(() => {
        if(!isCompleted && localStorage.getItem("register_historia") !== null) {
            setPaciente(JSON.parse(localStorage.getItem("register_historia")).paciente)
            setAnamnesis(JSON.parse(localStorage.getItem("register_historia")).anamnesis)
            setSignos(JSON.parse(localStorage.getItem("register_historia")).signos_vitales)
            setExamen(JSON.parse(localStorage.getItem("register_historia")).examen_fisico)
        }
    }, [isCompleted, setAnamnesis, setExamen, setPaciente, setSignos])
    const anamnesis_change_handler = (e) => {
        const {name, value} = e.target
        setAnamnesis((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const signos_change_handler = (e) => {
        const {name, value} = e.target
        setSignos((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const examen_change_handler = (e) => {
        const {name, value} = e.target
        setExamen((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const paciente_change_handler = (e) => {
        const {name, value} = e.target
        setPaciente((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    if(loading) {
        return <div className="loader"></div>
    }
    if(notification) {
        return <ModalNotification
            show={notification}
            message={responseMessage}
            type={notificationType}
            handle_close={handle_close_notification}
            />
    }
    return(
        <div className={`form-container-${isLightTheme ? 'light':'dark'}`}>
            <ScrollOptions/>
            <form onSubmit={show_modal}>
                <div className="atencion">
                    <h1>Atención</h1>
                    <label>
                        Fecha ingreso
                        <input
                            name="fecha_ingreso"
                            type="date"
                            placeholder="fecha_ingreso"
                            defaultValue={anamnesis.fecha_ingreso !== null ? ComputeDate(anamnesis.fecha_ingreso) : ""}
                            onChange={anamnesis_change_handler}
                        />
                    </label>
                    <label>
                        Hora ingreso
                        <input
                            name="hora_ingreso"
                            type="time"
                            placeholder="hora_ingreso"
                            defaultValue={anamnesis.hora_ingreso}
                            onChange={anamnesis_change_handler}
                        />
                    </label>
                </div>
                <h1>Paciente</h1>
                <PacienteForm
                    paciente={paciente}
                    onChangeHandler={paciente_change_handler}
                />
                <h1>Anamnesis</h1>
                <AnamnesisForm 
                    anamnesis={anamnesis}
                    isDisable={false}
                    onChangeHandler={anamnesis_change_handler}
                />
                <h1>Signos vitales</h1>
                <SignosForm
                    signos={signos}
                    isDisable={false}
                    onChangeHandler={signos_change_handler}
                />
                <h1>Examen Físico</h1>
                <ExamenForm
                    examen={examen}
                    isDisable={false}
                    onChangeHandler={examen_change_handler}
                />
                <div className="options">
                    <h1>Opciones</h1>
                    <button 
                        type="submit" disabled={isCompleted}
                    >
                        Registrar
                    </button>
                </div>
            </form>
            <ModalRegister
                show={showModal}
                message={"Estas por registrar una historia, Confirma está acción"}
                handle_close={hide_modal}
                handle_confirm={historia_submit_handler}
            />
            <ModalBlocker isCompleted={isCompleted}/>
        </div>
    )
}
