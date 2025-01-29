import { useOutletContext } from "react-router-dom"
import { GoEyeClosed } from "react-icons/go"
import PropTypes from "prop-types"


// data

// nav bar
import nav_bar from "/docs/images/home/hav_bar.png"
import otro_nav_bar from "/docs/images/home/otro_nav_bar.png"
import thema_light from "/docs/images/home/thema_light.png"
import thema_dark from "/docs/images/home/thema_dark.png"

// home
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
        <footer className={show_hidden}>
            <section className="help-modal-main">
                <div className="content">
                    <span className="close" onClick={handle_close}>
                        <GoEyeClosed />
                    </span>
                    <h1>Ayuda página Home</h1>
                    <p>En esta sección se encuentran las opciones de navegación y opciones para el proceso de atención.</p>
                    <ul className="list">
                        <li>En la navegación se presentan las distintas páginas a las que se puede acceder</li>
                        <ol>
                            <li>Por ejemplo la página Home</li>
                            {
                                user.rol === "admin" ? (<img src={nav_bar}/>) : (<img src={otro_nav_bar}/>)
                            }
                            <li>Además también se presenta la opción para modificar el esquema de colores de la página.</li>
                            <ul>
                                <li>Tema claro</li>
                                <img src={thema_light}/>
                                <li>Tema oscuro</li>
                                <img src={thema_dark}/>
                            </ul>
                        </ol>
                        <h3>Lo siguiente corresponde a las opciones para el proceso de atención</h3>
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
        </footer>
    )
}

HelpHome.propTypes = {
    show: PropTypes.bool,
    handle_close: PropTypes.func
}
