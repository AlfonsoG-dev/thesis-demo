import PropTypes from "prop-types";
import { GoEyeClosed } from "react-icons/go"

// images
import crear from "/docs/images/usuario/crear.png"
import mostrar_contraseña from "/docs/images/usuario/mostrar_contraseña.png"
import rol_transitorio from "/docs/images/usuario/rol_transitorio.png"

// modificar constraseña
import habilitar_edicion_password from "/docs/images/usuario/habilitar_edicion_password.png"
import mostrar_edicion_password from "/docs/images/usuario/mostrar_edicion_password.png"

// modificar usuario
import actualizar_usuario from "/docs/images/usuario/actualizar_usuario.png"
import update_rol from "/docs/images/usuario/update_rol.png"

// eilimnar
import eliminar_usuario from "/docs/images/usuario/eliminar_usuario.png"

// style
import "../../../Styles/HelpModal.css"

export function HelpRegisterUser({show, type, handle_close}) {
    const show_hidden = show ? "modal display-block" : "modal display-none"

    const user_register_content = () => {
        switch(type) {
            case "register":
                return <>
                    <p>En esta sección se realiza el registro del usuario.</p>
                    <img src={crear} alt="Registrar contraseña"/>
                    <li>Al digitar la contraseña puedes observar su valor</li>
                    <img src={mostrar_contraseña} alt="Mostrar contraseña"/>
                    <li>Si el rol del usuario es transitorio asignar la fecha o tiempo limite de acceso.</li>
                    <img src={rol_transitorio} alt="Selección rol transitorio"/>
                </>
            case "update_password":
                return <>
                    <p>En esta sección se realiza la modificación o cambio de contraseña.</p>
                    <li>Para modificar la contraseña se debe habilitar la edición.</li>
                    <img src={habilitar_edicion_password} alt="Habilidat edición"/>
                    <li>Al digitar la contraseña puedes observar su valor</li>
                    <img src={mostrar_edicion_password} alt="Mostrar contraseña"/>
                </>
            case "update":
                return <>
                    <p>En esta sección se realiza la modificación del usuario.</p>
                    <li>Para modificar al usuario se debe habilitar la edición.</li>
                    <img src={actualizar_usuario} alt="Actualizar usuario"/>
                    <li>Si el rol cambia a transitorio asingar fecha o tiempo limite de acceso.</li>
                    <img src={update_rol} alt="Actualizar rol"/>
                </>
            case "delete":
                return<>
                    <p>Es esta sección se elimina un usuario.</p>
                    <li>Para eliminar un usuario hay que verificar los credenciales.</li>
                    <img src={eliminar_usuario} alt="Eliminar usuario"/>
                </>
        }
    }
    return(
        <footer className={show_hidden}>
            <section className="help-modal-main">
                <span className="close" onClick={handle_close}>
                    <GoEyeClosed />
                </span>
                <div className="content">
                    <h1>Ayuda</h1>
                    <ul className="list">
                        {user_register_content()}
                    </ul>
                </div>
            </section>
        </footer>
    )
}

HelpRegisterUser.propTypes = {
    show: PropTypes.bool,
    type: PropTypes.string,
    handle_close: PropTypes.func
}
