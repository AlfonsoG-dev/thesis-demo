// Dependencies
import { useCallback, useEffect, useReducer, useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

//Components
import PacienteForm from "../../Components/Forms/PacienteForm"
import EncabezadoForm from "../../Components/Forms/EncabezadoForm"
import AnamnesisForm from "../../Components/Forms/AnamnesisForm"
import SignosForm from "../../Components/Forms/SignosForm"
import ExamenForm from "../../Components/Forms/ExamenForm"

// Util components
import ScrollOptions from "../../Components/ScrollOptions"
import ComputeDate from "../../Utils/ComputeDate"
import { HelpUpdateHistoria } from "../Help/Historia/HelpUpdateHistoria"

// Modal Component
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalBlocker from "../../Components/Modals/ModalBlocker"

// Hooks
import useFormState from "../../Hooks/Form/FormHook"
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook"
import enableEditionReducer from "../../Hooks/Form/updateHook"

//styles
import "../../Styles/Register.css"
import "../../Styles/LoadingStyle.css"

// data
import {pacientes} from "../../../back-end/paciente.js"
import {anamnesis_list} from "../../../back-end/anamnesis.js"
import {signos_list} from "../../../back-end/signos_vitales.js"
import {examenes} from "../../../back-end/examen_fisico.js"
import { update_historia } from "../../../back-end/historia"
export function Component() {
    const [user, isLightTheme] = useOutletContext()
    // data state
    const {state} = useLocation()
    const {
        paciente_id_fk, anamnesis_id_fk,
        examen_fisico_id_fk, signos_vitales_id_fk
    } = state
    const {
        paciente, setPaciente,
        anamnesis, setAnamnesis,
        signos, setSignos,
        examen, setExamen
    } = useFormState()

    const [status, setStatus] = useState("")

    // over all state
    const [isUpdateData, setIsUpdateData] = useState(false)
    const [retry, setRetry] = useState(0)
    const [editionBorder, setEditionBorder] = useState(false)
    const [myState, dispatch] = useReducer(enableEditionReducer, {
        enableAnamnesis: false,
        enableSignos: false,
        enableExamen: false
    })

    // using state to change the style of the page.
    const chk_name = editionBorder === true ? "chk_enable" : "enable-label"

    // modals
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const{
        notification, notificationType, setNotificationType,
        responseMessage, setResponseMessage,
        show_notification, close_notification
    } = useNotificationState()

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()


    // register modal handlers
    const handle_show_confirm = (e) => {
        e.preventDefault()
        const edition =  {
            anamnesis: myState.enableAnamnesis,
            signos: myState.enableSignos,
            examen: myState.enableExamen
        }
        if(edition.anamnesis === false && edition.signos === false && edition.examen === false) {
            setEditionBorder(true)
            setResponseMessage("Habilita la edición")
            setNotificationType("error")
            show_notification()
        } else {
            setShowConfirmModal(true)
        }
    }
    const handle_close_confirm = () => setShowConfirmModal(false)

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

    // get data from end-point server
    const fetch_data = useCallback(async () => {
        setStatus("loading")
        try {
            if(state.update_at === null) {
                const [res_paciente] = pacientes.filter(p => p.id_pk === Number.parseInt(paciente_id_fk))
                setPaciente(res_paciente)
                const [res_anamnesis] = anamnesis_list.filter(a => a.id_pk === Number.parseInt(anamnesis_id_fk))
                setAnamnesis(res_anamnesis)
                const [res_signos] = signos_list.filter(s => s.id_pk === Number.parseInt(signos_vitales_id_fk))
                setSignos(res_signos)
                const [res_examen] = examenes.filter(e => e.id_pk === Number.parseInt(examen_fisico_id_fk))
                setExamen(res_examen)
                setStatus("completed")
            } else {
                setStatus("completed")
                setIsUpdateData(true)
            }
        } catch(er) {
            setStatus("completed")
            console.error(er)
        }
    }, [anamnesis_id_fk, examen_fisico_id_fk, paciente_id_fk, setAnamnesis, setExamen, setPaciente, setSignos, signos_vitales_id_fk, state.update_at])

    useEffect(() => {
        fetch_data()
    }, [fetch_data])

    const handle_submit = async(e) => {
        e.preventDefault()
        setStatus("loading")
        try {
            anamnesis.fecha_ingreso = ComputeDate(new Date(anamnesis.fecha_ingreso))
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
            const response = update_historia(historia_object, user, state.id_pk)
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
        const {name, value} = e.target
        setAnamnesis((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handle_change_signos = (e) => {
        const {name, value} = e.target
        setSignos((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handle_change_examen = (e) => {
        const {name, value} = e.target
        setExamen((prev) => ({
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
    if(!isUpdateData) {
        return(
            <div className={`form-container-${isLightTheme ? 'light':'dark'} form-container`}>
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
                                disabled={true}
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
                                disabled={true}
                                onChange={handle_change_anamnesis}
                            />
                        </label>
                    </section>
                    <EncabezadoForm
                        encabezado={paciente}
                        isDisable={true}
                        onChangeHandler={() => {}}
                    />
                    <PacienteForm 
                        paciente={paciente}
                        isDisable={true}
                        onChangeHandler={() => {}}
                    />
                    <section className="enable-options">
                        <br/>
                        <label className={chk_name}>
                            Habilitar anamnesis
                            <input
                                type="checkbox"
                                name="enable_anamnesis"
                                defaultValue={myState.enableAnamnesis}
                                checked={myState.enableAnamnesis}
                                onChange={() => {
                                    dispatch({type: "anamnesis"})
                                    setEditionBorder(false)
                                }}
                            />
                        </label>
                        {/* enable anamnesis component */}
                        {
                            myState.enableAnamnesis && <>
                                <AnamnesisForm
                                    anamnesis={anamnesis}
                                    isDisable={!myState.enableAnamnesis}
                                    onChangeHandler={handle_change_anamnesis}
                                />
                            </>
                        }
                        <label className={chk_name}>
                            Habilitar signos vitales
                            <input
                                type="checkbox"
                                name="enable_signos"
                                defaultValue={myState.enableSignos}
                                checked={myState.enableSignos}
                                onChange={() => {
                                    dispatch({type: "signos"})
                                    setEditionBorder(false)
                                }}
                            />
                        </label>
                        {/* enable signos component */}
                        {
                            myState.enableSignos && <>
                                <SignosForm
                                    signos={signos}
                                    isDisable={!myState.enableSignos}
                                    onChangeHandler={handle_change_signos}
                                />
                            </>
                        }
                        <label className={chk_name}>
                            Habilitar examen físico
                            <input
                                name="enable_examen"
                                type="checkbox"
                                defaultValue={myState.enableExamen}
                                checked={myState.enableExamen}
                                onChange={() => {
                                    dispatch({type: "examen"})
                                    setEditionBorder(false)
                                }}
                            />
                        </label>
                        {/* enable examen físico component */}
                        {
                            myState.enableExamen && <>
                                <ExamenForm
                                    examen={examen}
                                    isDisable={!myState.enableExamen}
                                    onChangeHandler={handle_change_examen}
                                />
                            </>
                        }
                    </section>

                    <section className="options">
                        <h1>Opciones</h1>
                        <button type="submit" disabled={status === "completed"}>
                            Actualizar
                        </button>
                    </section>
                </form>
                <button className="help" onClick={handle_show_help}>
                    help | ?
                </button>
                <ModalRegister
                    show={showConfirmModal}
                    message={"Estas por actualizar la historia, Confirma esta acción"}
                    handle_close={handle_close_confirm}
                    handle_confirm={handle_submit}
                />
                <ModalBlocker isCompleted={status}/>
                <HelpUpdateHistoria
                    show={showHelp}
                    handle_close={handle_close_help}
                />
            </div>
        )
    } else {
        return (
            <section className="">
                <h1>No se puede actualizar esta historia</h1>
            </section>
        )
    }
}
