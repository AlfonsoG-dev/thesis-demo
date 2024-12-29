// Dependencies
import { useState} from "react"
import { useLocation, useOutletContext } from "react-router-dom"

// Modal components
import ModalRegister from "../../Components/Modals/ModalRegister"
import ModalNotification from "../../Components/Modals/ModalNotification"
import ModalBlocker from "../../Components/Modals/ModalBlocker"

// Util components
import ScrollOptions from "../../Components/ScrollOptions"
import { HelpUpdatePaciente } from "../Help/Paciente/HelpUpdatePaciente"

// hooks
import useNotificationState, {useHelpState} from "../../Hooks/Modal/NotificationHook"
import useCarreraState from "../../Hooks/Form/CarreraHook"
import useStatusState from "../../Hooks/Form/StatusHook"

// Utils
import ComputeDate from "../../Utils/ComputeDate"

// data
import { update_paciente } from "../../../back-end/paciente"

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
    const [listEstadoCivil] = useState(['solter@', 'casad@', 'viud@', 'divorciad@', 'otro'])
    const { facultadProgramas } = useCarreraState()
    const [modifiedPaciente, setModifiedPaciente] = useState({
        id_pk: paciente.id_pk,
        identificacion: paciente.identificacion
    })


    const {
        loading, isCompleted,
        start_operation, complete_operation, end_operation
    } = useStatusState()

    // overall status
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

    const {
        showHelp, handle_show_help, handle_close_help
    } = useHelpState()

    // using enable/disable to change form style
    const enable_name = enableBorder === true ? "chk_enable":"chk_disable"

    // data form handler
    const handle_change_modified_paciente = (e) => {
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

    // notification modal
    const handle_close_notification = () => setNotification(false)

    // disable edition change handler
    const handle_change_disable_edition = () => {
        setDisableEdition(!disableEdition)
        setEnableBorder(false)
    }

    // allow 3 attempts before blocking the page
    const validate_retry = () => {
        if(retry === 3) {
            complete_operation()
            setResponseMessage("Intentos agotados, prueba recargando la página")
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
        } else {
            setRetry(() => retry+1)
        }
    }

    const handle_submit = async(e) => {
        e.preventDefault()
        start_operation()
        try {
            paciente.fecha_nacimiento = ComputeDate(paciente.fecha_nacimiento)
            if(modifiedPaciente.genero !== undefined && modifiedPaciente.genero === "otro") {
                modifiedPaciente.genero = modifiedPaciente.genero1
                delete modifiedPaciente.genero1
            }
            const response = update_paciente(state.identificacion,modifiedPaciente)
            if(response.msg !== undefined) {
                complete_operation()
                end_operation()
                setResponseMessage(response.msg)
                setNotificationType("msg")
                handle_close_confirm()
                setNotification(true)
            } else {
                throw new Error(response.error)
            }
        } catch(er) {
            end_operation()
            validate_retry()
            setResponseMessage(er.toString())
            setNotificationType("error")
            handle_close_confirm()
            setNotification(true)
            console.error(er)
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
            handle_close={handle_close_notification}
        />
    }
    return (
        <div className={`form-container-${isLightTheme ? 'light':'dark'} form-container`}>
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
                        onChange={handle_change_modified_paciente}
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
                        onChange={handle_change_modified_paciente}
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
                        onChange={handle_change_modified_paciente}
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
                        onChange={handle_change_modified_paciente}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Genero
                    {
                        paciente.genero &&
                            <select name="genero"
                                onChange={handle_change_modified_paciente}
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
                                disabled={disableEdition}
                                onChange={handle_change_modified_paciente}
                            />
                        </label>
                }
                <label>
                    Estado civil
                    {
                        paciente.estado_civil && (
                            <select name="estado_civil" onChange={handle_change_modified_paciente} disabled={disableEdition}>
                                <option key={paciente.estado_civil}>{paciente.estado_civil}</option>
                                {
                                    listEstadoCivil.map((i) => (
                                        i !== paciente.estado_civil && (
                                            <option key={i}>{i}</option>
                                        )
                                    ))
                                }
                            </select>
                        )
                    }
                </label>
                {
                    modifiedPaciente.estado_civil !== undefined && modifiedPaciente.estado_civil === "otro" && (
                        <label>
                            Ingrese el valor para el estado civil
                            <input
                                type="text"
                                name="estado_civil1"
                                placeholder="Estado civil"
                                required={true}
                                disabled={disableEdition}
                                onChange={handle_change_modified_paciente}
                            />
                        </label>
                    )
                }
                <label>
                    Procedencia(departamento)
                    <input
                        type="text"
                        name="procedencia"
                        defaultValue={paciente.procedencia}
                        required={true}
                        onChange={handle_change_modified_paciente}
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
                        onChange={handle_change_modified_paciente}
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
                        onChange={handle_change_modified_paciente}
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
                        onChange={handle_change_modified_paciente}
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
                        onChange={handle_change_modified_paciente}
                        disabled={disableEdition}
                    />
                </label>
                <label>
                    Facultad
                    {
                        paciente.facultad && 
                            <select name='facultad'
                                onChange={handle_change_modified_paciente}
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
                                onChange={handle_change_modified_paciente}
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
                        onChange={handle_change_modified_paciente}
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
                    <button type="submit" disabled={isCompleted}>Actualizar</button>
                </div>
            </form>
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <ModalRegister
                show={confirmModal}
                message={"Estas apunto de actualizar paciente, Confirma esta acción"}
                handle_close={handle_close_confirm}
                handle_confirm={handle_submit}
            />
            <ModalBlocker isCompleted={isCompleted}/>
            <HelpUpdatePaciente
                show={showHelp}
                type="update"
                handle_close={handle_close_help}
            />
        </div>
    )
}
