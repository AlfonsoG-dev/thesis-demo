import { useOutletContext } from "react-router-dom"
import { GoEyeClosed } from "react-icons/go"
import PropTypes from "prop-types"


// data
import crear_historia from "../../../public/docs/images/home/crear_historia.png"
import mis_historias from "../../../public/docs/images/home/mis_historias.png"
import descarga_permiso from "../../../public/docs/images/home/descarga_permiso.png"


// style
import "../../Styles/Modal.css"

export function HelpHome({show, handle_close}) {
    const show_hidden = show ? "modal display-block" : "modal display-none"
    const [user] = useOutletContext()

    return(
        <div className={show_hidden}>
            <section className="help-modal-main">
                <span className="close" onClick={handle_close}>
                    <GoEyeClosed />
                </span>
                <h1>Ayuda página Home</h1>
                <p>En esta sección encontraras las funcionalidades necesarias para el proceso de atención.</p>
                <ul className="list">
                    {
                        user.rol === "admin" && (
                            <li>Crear usuario</li>
                        )
                    }
                    <li>Crear historia: con esta opción se realiza el registro del pacinete y se abre historia clínica.</li>
                    <img src={crear_historia} alt="crear_historia_option"/>
                    <li>Mis historias: esta opción listas las historias que tu creaste</li>
                    <img src={mis_historias} alt="listar historias"/>
                    {
                        user.rol === "admin" && (
                            <li>Cambiar contraseña</li>
                        )
                    }
                    <li>Descargar permisos: permite descargar el consentimiento y/o disentimiento</li>
                    <img src={descarga_permiso} alt="descargar permisos"/>
                </ul>
            </section>
        </div>
    )
}

HelpHome.propTypes = {
    show: PropTypes.bool,
    handle_close: PropTypes.func
}
