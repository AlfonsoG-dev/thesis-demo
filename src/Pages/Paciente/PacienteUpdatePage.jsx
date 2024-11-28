// Dependencies
import { useState} from "react"
import { useLocation, useOutletContext } from "react-router-dom"

// Modal components
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalBlocker from "../../Components/Modals/ModalBlocker"

// Util components
import ScrollOptions from "../../Components/ScrollOptions"

// hooks
import { Post } from "../../Hooks/Requests"
import useNotificationState from "../../Hooks/Modal/NotificationHook"
import useCarreraState from "../../Hooks/Form/CarreraHook"

// Utils
import ComputeDate from "../../Utils/ComputeDate"

// styles
import '../../Styles/Register.css'
import '../../Styles/LoadingStyle.css'
import '../../Styles/Modal.css'

/**
 * Page to update paciente.
*/
export function Component() {
    const [, isLightTheme] = useOutletContext()
    // data state
    const {state} = useLocation()
    const [paciente] = useState(state)
    const [listGenero] = useState(['hombre', 'mujer', 'otro'])
    const { facultadProgramas } = useCarreraState()
    const [modifiedPaciente, setModifiedPaciente] = useState({
        id_pk: paciente.id_pk,
        identificacion: paciente.identificacion
    })

    // overall status
    const [isComplete, setIsComplete] = useState(false)
    const [loading, setLoading] = useState(false)
    const [retry, setRetry] = useState(0)
    const [disableEdition, setDisableEdition] = useState(true)
    const [enableBorder, setEnableBorder] = useState(false)

    // Modals
    const [confirmModal, setConfirmModal] = useState(false)
    const {
        notification, setNotification,
        notificationType, setNotificationType,
        responseMessage, setResponseMessage
    } = useNotificationState()

    // using enable/disable to change form style
    const enable_name = enableBorder === true ? "chk_enable":"chk_disable"

    // data form handler
    const modified_paciente_change_handler = (e) => {
        const {name, value} = e.target
        setModifiedPaciente((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // confirm modal
    const handle_show_confirm = (e) => {
        e.preventDefault()
        if(disableEdition === false) {
            setConfirmModal(true)
        } else {
            setNotificationType("error")
            setResponseMessage("Habilita edición para continuar")
            setNotification(true)
            setEnableBorder(true)
        }
    }
    const handle_close_confirm = () => setConfirmModal(false)

    // notificar modal
    const handle_close_notificar = () => setNotification(false)

    // disable edition change handler
    const handle_change_disable_edition = () => {
        setDisableEdition(!disableEdition)
        setEnableBorder(false)
    }

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            setIsComplete(true)
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
        } else {
            setRetry(() => retry+1)
        }
    }

    const submit_handler = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            paciente.fecha_nacimiento = ComputeDate(paciente.fecha_nacimiento)
            if(modifiedPaciente.genero !== undefined && modifiedPaciente.genero === "otro") {
                modifiedPaciente.genero = modifiedPaciente.genero1
                delete modifiedPaciente.genero1
            }
            const response = await Post("/paciente/put-paciente", modifiedPaciente)
            if(response.msg !== undefined) {
                setLoading(false)
                setIsComplete(true)
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
    if(loading) {
        return <div className="loader"></div>
    }
    if(notification) {
        return <ModalNotification
            show={notification}
            message={responseMessage}
            type={notificationType}
            handle_close={handle_close_notificar}
        />
    }
    return (
        <div className={`form-container-${isLightTheme ? 'light':'dark'}`}>
            <ScrollOptions/>
            <h1>Actualizar paciente</h1>
            <form onSubmit={handle_show_confirm}>
                <label className={enable_name}>
                    Habilitar edición
                    <input
                        type="checkbox"
                        name="disable_edition"
                        defaultValue={disableEdition}
                        checked={!disableEdition}
                        onChange={handle_change_disable_edition}
                    />
                    <span>
                        {enableBorder && "<- selecciona esta opción"}
                    </span>
                </label>
                <br/>
                <label>
                    Identificación
                    <input
                        type="number"
                        name="identificacion"
                        defaultValue={paciente.identificacion}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Nombres
                    <input
                        type="text"
                        name="nombres"
                        defaultValue={paciente.nombres}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Apellidos
                    <input
                        type="text"
                        name="apellidos"
                        defaultValue={paciente.apellidos}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Fecha nacimiento
                    <input
                        type="date"
                        name="fecha_nacimiento"
                        defaultValue={ComputeDate(paciente.fecha_nacimiento)}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Genero
                    {
                        paciente.genero &&
                            <select name="genero"
                                onChange={modified_paciente_change_handler}
                                disabled={disableEdition}
                            >
                                <option key={paciente.genero}>{paciente.genero}</option>
                                {
                                    listGenero.map((i) => (
                                    i !== paciente.genero &&
                                        <option key={i}>{i}</option>
                                    ))
                                }
                            </select>
                    }
                </label>
                {
                    modifiedPaciente.genero !== undefined && modifiedPaciente.genero === "otro" &&
                        <label>
                            Ingrese el valor para el genero:
                            <input
                                type="text"
                                name="genero1"
                                placeholder="Genero paciente"
                                required={true}
                                onChange={modified_paciente_change_handler}
                            />
                        </label>
                }
                <label>
                    Procedencia(departamento)
                    <input
                        type="text"
                        name="procedencia"
                        defaultValue={paciente.procedencia}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Residencia(departamento)
                    <input
                        type="text"
                        name="residencia"
                        defaultValue={paciente.residencia}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Nombre Acudiente
                    <input
                        type="text"
                        name="acudiente"
                        defaultValue={paciente.acudiente}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Celular Acudiente
                    <input
                        type="number"
                        name="celular"
                        defaultValue={paciente.celular}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Acudiente parentesco
                    <input
                        type="text"
                        name="parentesco"
                        defaultValue={paciente.parentesco}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Facultad
                    {
                        paciente.facultad && 
                            <select name='facultad'
                                onChange={modified_paciente_change_handler}
                                disabled={disableEdition}
                            >
                                <option key={paciente.facultad}>{paciente.facultad}</option>
                                {
                                    Object.keys(facultadProgramas).map((i) => (
                                        i !== paciente.facultad && i !== "select..." &&
                                            <option key={i}>{i}</option>
                                    ))
                                }
                            </select >
                    }
                </label>
                <label>
                    Programa
                    {
                        paciente.programa &&
                            <select name="programa"
                                onChange={modified_paciente_change_handler}
                                disabled={disableEdition}
                            >
                                {
                                    modifiedPaciente.facultad === undefined &&
                                        <option key={paciente.programa}>{paciente.programa}</option>
                                }
                                {
                                    modifiedPaciente.facultad === undefined &&
                                        facultadProgramas[`${paciente.facultad}`].map((i) => (
                                    i !== paciente.programa && i !== "select..." &&
                                        <option key={i}>{i}</option>
                                    ))
                                }
                                {
                                    modifiedPaciente.facultad && facultadProgramas[`${modifiedPaciente.facultad}`]
                                        .map((i) => (
                                            i !== paciente.programa &&
                                                <option key={i}>{i}</option>
                                        ))
                                }
                            </select>
                    }
                </label>
                <label>
                    EPS
                    <input
                        type="text"
                        name="eps"
                        defaultValue={paciente.eps}
                        required={true}
                        onChange={modified_paciente_change_handler}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Creado en
                    <input
                        type="text"
                        name="create_at"
                        defaultValue={new Date(paciente.create_at).toLocaleString()}
                        required={true}
                        disabled={true}
                    />
                </label>
                {
                    paciente.update_at !== null && 
                        <label>
                            Actualizado en
                            <input
                                type="text"
                                name="update_at"
                                defaultValue={new Date(paciente.update_at).toLocaleString()}
                                required={true}
                                disabled={true}
                            />
                        </label>
                }
                <div className="options">
                    <h1>Opciones</h1>
                    <button type="submit" disabled={isComplete}>Actualizar</button>
                </div>
            </form>
            <ModalRegister
                show={confirmModal}
                message={"Estas apunto de actualizar paciente, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={submit_handler}
            />
            <ModalBlocker isCompleted={isComplete}/>
        </div>
    )
}
