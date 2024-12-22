import { useOutletContext } from "react-router-dom"
import { GoEyeClosed } from "react-icons/go"
import PropTypes from "prop-types"


// data
import crear_usuario from "/docs/images/home/crear_usuario.png"
import cambiar_contraseña from "/docs/images/home/cambiar_contraseña.png"
import crear_historia from "/docs/images/home/crear_historia.png"
import mis_historias from "/docs/images/home/mis_historias.png"
import descarga_permiso from "/docs/images/home/descarga_permiso.png"


// style
import "../../Styles/HelpModal.css"

export function HelpHome({show, handle_close}) {
    const show_hidden = show ? "modal display-block" : "modal display-none"
    const [user] = useOutletContext()

    return(
        <div className={show_hidden}>
            <section className="help-modal-main">
                <div className="content">
                    <span className="close" onClick={handle_close}>
                        <GoEyeClosed />
                    </span>
                    <h1>Ayuda página Home</h1>
                    <p>En esta sección encontraras las funcionalidades necesarias para el proceso de atención.</p>
                    <ul className="list">
                        {
                            user.rol === "admin" && (
                                <>
                                    <li>Crear usuario</li>
                                    <img src={crear_usuario} alt="crear usuario"/>
                                </>
                            )
                        }
                        <li>Crear historia: con esta opción se realiza el registro del paciente y se abre historia clínica.</li>
                        <img src={crear_historia} alt="crear_historia_option"/>
                        <li>Mis historias: esta opción listas las historias que tu creaste</li>
                        <img src={mis_historias} alt="listar historias"/>
                        {
                            user.rol === "admin" && (
                                <>
                                    <li>Cambiar contraseña</li>
                                    <img src={cambiar_contraseña} alt="Cambiar contraseña"/>
                                </>
                            )
                        }
                        <li>Descargar permisos: permite descargar el consentimiento y/o disentimiento</li>
                        <img src={descarga_permiso} alt="descargar permisos"/>
                    </ul>
                </div>
            </section>
        </div>
    )
}

HelpHome.propTypes = {
    show: PropTypes.bool,
    handle_close: PropTypes.func
}
