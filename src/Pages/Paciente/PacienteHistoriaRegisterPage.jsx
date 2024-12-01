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

// hooks
import { Post, Get } from "../../Hooks/Requests"
import useNotificationState from "../../Hooks/Modal/NotificationHook"
import useFormState from "../../Hooks/Form/FormHook"

// styles
import "../../Styles/Register.css"
import ComputeDate from "../../Utils/ComputeDate"

/**
 * Page to register historia using paciente.
*/
export function Component() {
    // state = paciente_id
    let {state} = useLocation()
    const [, isLIghtTheme] = useOutletContext()
    const {
        paciente, setPaciente,
        anamnesis, setAnamnesis,
        signos, setSignos,
        examen, setExamen,
        isCompleted, setIsCompleted
    } = useFormState()

    //
    const[loading, setLoading] = useState(false)
    const [retry, setRetry] = useState(0)

    // modals
    const[showConfirm, setShowConfirm] = useState(false)
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
    } = useNotificationState()

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

    // notificación modal handlers
    const handle_close_notification = () => setNotification(false)

    // get the paciente data using state.id_pk
    const fetch_data = useCallback(async() => {
        try {
            if(state.paciente_id_fk !== undefined) {
                const [res_paciente] = await Promise.all([
                    Get(`/paciente/by-id/${state.paciente_id_fk}`),
                ])
                setPaciente(res_paciente[0])
            } else {
                setPaciente(state)
            }
        } catch(er) {
            console.error(er)
        }
    }, [setPaciente, state])

    useEffect(() => {
        fetch_data()
        if(!isCompleted && localStorage.getItem("paciente_register_historia") !== null) {
            setAnamnesis(JSON.parse(localStorage.getItem("paciente_register_historia")).anamnesis)
            setSignos(JSON.parse(localStorage.getItem("paciente_register_historia")).signos_vitales)
            setExamen(JSON.parse(localStorage.getItem("paciente_register_historia")).examen_fisico)
        }
    }, [fetch_data, isCompleted, setAnamnesis, setExamen, setSignos])

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            setIsCompleted(true)
            setResponseMessage("Se acabaron los intentos intenta recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
        } else {
            setIsCompleted(false)
            setRetry(() => retry+1)
        }
    }
    /**
     * post anamnesis, examen, signos at the same time and uses the id_pk of the response as the values
     * for the historias fields
    */
    const historia_submit_handler = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
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
            const response = await Post("/historia/post-with-paciente", historia_object)
            if(response.msg !== undefined) {
                setIsCompleted(true)
                setLoading(false)
                setResponseMessage(response.msg)
                setNotificationType("msg")
                handle_close_confirm()
                setNotification(true)
            } else {
                throw new Error(response.error)
            }
        } catch(er) {
            setLoading(false)
            validate_retry()
            setResponseMessage(er.toString())
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
        }
    }

    const anamnesis_change_handler = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setAnamnesis((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const signos_change_handler = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setSignos((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    const examen_change_handler = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setExamen((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    if(loading) {
        return <div className="loader"></div >
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
        <div className={`form-container-${isLIghtTheme ? 'light': 'dark'}`}>
            <ScrollOptions/>
            <form onSubmit={handle_show_confirm}>
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
                <h1>Encabezado</h1>
                <EncabezadoForm
                    encabezado={paciente} isDisable={true}
                />
                <h1>Paciente</h1>
                    <PacienteForm
                        paciente={paciente}
                        isDisable={true} onChangeHandler={() => {}}
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
                show={showConfirm}
                message={"Estas por registrar una historia para el paciente, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={historia_submit_handler}
            />
            <ModalBlocker isCompleted={isCompleted}/>
        </div>
    )
}
