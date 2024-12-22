import { GoEyeClosed } from "react-icons/go"
import PropTypes from "prop-types";

// data
import ingreso from "/docs/images/login/ingreso.png"
import saltar_login from "/docs/images/login/saltar_login.png"
import recuperar_password from "/docs/images/login/recuperar_password.png"
import credenciales_recuperar from "/docs/images/login/credenciales_recuperar.png"
import mostrar_contraseña from "/docs/images/login/mostrar_contraseña.png"
import regresar_login from "/docs/images/login/regresar_login.png"

// style
import "../../Styles/HelpModal.css"
export function HelpLogin({show, handle_close}) {

    const show_hidden = show ? "modal display-block" : "modal display-none"

    return(
        <div className={show_hidden}>
            <section className="help-modal-main">
                <div className="content">
                    <span className="close" onClick={handle_close}>
                        <GoEyeClosed />
                    </span>
                    <h1>Ayuda</h1>
                    <p>En esta sección se muestran como realizar el inicio de sesión</p>
                    <ul className="list">
                        <li>Login: ingresar con la identificación y contraseña</li>
                        <img src={ingreso} alt="Login"/>
                        <li>Ingreso: si tienes una sesión iniciada previamente puedes saltar el *login*</li>
                        <img src={saltar_login} alt="Ingreso"/>
                        <li>Recuperar contraseña: te envía a una página donde puedes recuperar tu contraseña</li>
                        <img src={recuperar_password} alt="Recuperar contraseña"/>
                        <ul>
                            <li>Debes ingresar los credenciales del usuario para recuperar tu contraseña</li>
                            <img src={credenciales_recuperar} alt="Credenciales del usuario"/>
                            <li>Da click en recuperar para tener la constraseña</li>
                            <img src={mostrar_contraseña} alt="Recuperada"/>
                            <li>Da click en login para regresar al inicio de sesión</li>
                            <img src={regresar_login} alt="To login"/>
                        </ul>
                    </ul>
                </div>
            </section>
        </div>
    )
}

HelpLogin.propTypes = {
    show: PropTypes.bool,
    handle_close: PropTypes.func
}
