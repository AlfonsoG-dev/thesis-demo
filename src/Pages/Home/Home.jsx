// Dependencies
import { useNavigate, useOutletContext } from "react-router-dom"

//Icons
import { FaUserPlus } from "react-icons/fa"
import { FaHospitalUser } from "react-icons/fa6"
import { FaUserLock } from "react-icons/fa6"
import { RiFolderUserFill } from "react-icons/ri"
import { FaUsersCog } from "react-icons/fa";
import { FaDownload } from "react-icons/fa"

// Styles
import "../../Styles/Home/HomeStyle.css"

// docs
import consentimiento from "/docs/CONSENTIMIENTO_Y_DISENTIMIENTO.pdf"


/**
 * Home page that has the user functions like create user, list historia, etc.
*/
export function Component() {
    const navigate = useNavigate()
    const[usuario, isLightTheme] = useOutletContext()
    return(
        <div className="card-container">
            <div className={`create-${isLightTheme ? 'light':'dark'}`}>
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
                <button className="btn-option">
                    <a href={consentimiento} download>
                        Descargar permiso <FaDownload/>
                    </a>
                </button>
            </div>
        </div >
    )
}
