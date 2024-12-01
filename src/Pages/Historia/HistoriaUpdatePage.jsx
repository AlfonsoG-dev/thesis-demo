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

// Modal Component
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalBlocker from "../../Components/Modals/ModalBlocker"

// Hooks
import useFormState from "../../Hooks/Form/FormHook"
import useNotificationState from "../../Hooks/Modal/NotificationHook"
import { Get, Post } from "../../Hooks/Requests"
import enableEditionReducer from "../../Hooks/Form/updateHook"

//styles
import "../../Styles/Register.css"
import "../../Styles/LoadingStyle.css"


/**
 * Page for update the historia registers.
 * when updating historia registers this will create another historia with only the updated data.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
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
        examen, setExamen,
        isCompleted, setIsCompleted
    } = useFormState()

    // over all state
    const [isUpdateData, setIsUpdateData] = useState(false)
    const [loading, setLoading] = useState(false)
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
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage,
    } = useNotificationState()


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
            setNotification(true)
        } else {
            setShowConfirmModal(true)
        }
    }
    const handle_close_confirm = () => setShowConfirmModal(false)

    // notificación modal handlers
    const handle_close_notification = () => setNotification(false)

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            setIsCompleted(true)
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
        } else {
            setRetry(() => retry+1)
        }
    }

    // get data from end-point server
    const fetch_data = useCallback(async () => {
        setLoading(true)
        try {
            if(state.update_at === null) {
                const [res_paciente, res_anamnesis, res_examen, res_signos] = await Promise.all([
                    Get(`/paciente/by-id/${paciente_id_fk}`),
                    Get(`/anamnesis/${anamnesis_id_fk}`),
                    Get(`/examen/${examen_fisico_id_fk}`),
                    Get(`/signos/${signos_vitales_id_fk}`)
                ])
                setPaciente(res_paciente[0])
                setAnamnesis(res_anamnesis[0])
                setSignos(res_signos[0])
                setExamen(res_examen[0])
                setLoading(false)
            } else {
                setLoading(false)
                setIsUpdateData(true)
            }
        } catch(er) {
            setLoading(false)
            console.error(er)
        }
    }, [anamnesis_id_fk, examen_fisico_id_fk, paciente_id_fk, setAnamnesis, setExamen, setPaciente, setSignos, signos_vitales_id_fk, state.update_at])

    useEffect(() => {
        fetch_data()
    }, [fetch_data])

    const handle_submit = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            anamnesis.fecha_ingreso = ComputeDate(new Date(anamnesis.fecha_ingreso))
            const historia_object = {
                historia: {
                    id_pk: state.id_pk
                },
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
            const response = await Post("/historia/put-historia", historia_object)
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
    if(!isUpdateData) {
        return(
            <div className={`form-container-${isLightTheme ? 'light':'dark'}`}>
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
                    </div>
                    <h1>Encabezado</h1>
                    <EncabezadoForm
                        encabezado={paciente}
                        isDisable={true}
                        onChangeHandler={() => {}}
                    />
                    <h1>Paciente</h1>
                    <PacienteForm 
                        paciente={paciente}
                        isDisable={true}
                        onChangeHandler={() => {}}
                    />
                    <div className="enable-options">
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
                                <h1>Anamnesis</h1>
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
                                <h1>Signos vitales</h1>
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
                                <h1>Examen Físico</h1>
                                <ExamenForm
                                    examen={examen}
                                    isDisable={!myState.enableExamen}
                                    onChangeHandler={handle_change_examen}
                                />
                            </>
                        }
                    </div>

                    <div className="options">
                        <h1>Opciones</h1>
                        <button type="submit" disabled={isCompleted}>
                            Actualizar
                        </button>
                    </div>
                </form>
                <ModalRegister
                    show={showConfirmModal}
                    message={"Estas por actualizar la historia, Confirma esta acción"}
                    handle_close={handle_close_confirm}
                    handle_confirm={handle_submit}
                />
                <ModalBlocker isCompleted={isCompleted}/>
            </div>
        )
    } else {
        return (
            <div className="">
                <h1>No se puede actualizar esta historia</h1>
            </div>
        )
    }
}
