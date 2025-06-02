// Dependencies
import { useNavigate, useOutletContext } from "react-router-dom"

// Hooks
import {useHelpState} from "../../Hooks/Modal/NotificationHook.js"

// components
import { HelpHome } from "../Help/HelpHome"

//Icons
import { FaUserPlus } from "react-icons/fa"
import { FaHospitalUser } from "react-icons/fa6"
import { FaUserLock } from "react-icons/fa6"
import { RiFolderUserFill } from "react-icons/ri"
import { FaUsersCog } from "react-icons/fa";
import { FaDownload } from "react-icons/fa"

// Styles
import "../../Styles/Home/HomeStyle.css"

/**
 * Home page that has the user functions like create user, list historia, etc.
*/
export function Component() {
    const navigate = useNavigate()
    const[usuario, isLightTheme] = useOutletContext()
    const {
        showHelp,
        handle_show_help,
        handle_close_help
    } = useHelpState()

    const handle_download_permission = () => {
        alert("¡ No implementado para esta demostración !")
    }
    return(
        <div className="card-container">
            <section className={`create-${isLightTheme ? 'light':'dark'} options`}>
                <h1>Opciones | <FaUsersCog/></h1>
                {
                    usuario.rol === "admin" &&
                        <button className="btn-option" onClick={() => {
                            navigate("/app/usuario/registro")
                        }}>
                            Crear usuario <FaUserPlus/>
                        </button>
                }
                <button className="btn-option" onClick={() => {
                    navigate("/app/historia/registro")
                }}>
                    Crear historia <FaHospitalUser/>
                </button>
                <button className="btn-option" onClick={() => {
                    navigate(`/app/usuario/historia/${usuario.id_pk}`, {
                        state: usuario
                    })
                }}>
                    Mis historias <RiFolderUserFill/>
                </button>
                {
                    usuario.rol === "admin" &&
                    <button className="btn-option" onClick={() => {
                        navigate("/app/change-password")
                    }}>
                        Cambiar contraseña <FaUserLock/>
                    </button>
                }
                <button className="btn-option" onClick={handle_download_permission}>
                    Descargar permiso <FaDownload/>
                </button>
                <button className="btn-option" onClick={handle_download_permission}>
                    Copia de seguridad <FaDownload/>
                </button>
            </section>
            <button className="help" onClick={handle_show_help}>
                help | ?
            </button>
            <HelpHome
                show={showHelp}
                handle_close={handle_close_help}
            />
        </div>
    )
}
