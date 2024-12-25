import PropTypes from "prop-types";
import { GoEyeClosed } from "react-icons/go"

// data
import  update_paciente from "/docs/images/paciente/update_paciente.png";
import  change_genero_estado from "/docs/images/paciente/change_genero_estado.png";
import  seleccion_programa from "/docs/images/paciente/seleccion_programa.png";

// style
import "../../../Styles/HelpModal.css"
export function HelpUpdatePaciente({show, type, handle_close}) {
    const show_hidden = show ? "modal display-block" : "modal display-none"

    const user_register_content = () => {
        switch(type) {
            case "update":
                return<>
                    <p>Es esta sección se actualiza un paciente.</p>
                    <li>Para actualizar el paciente primero se debe habilitar la edición.</li>
                    <img src={update_paciente}/>
                    <li>Al modificar el género o el estado civil cuando el valor es otro se despliega una casilla para que el usuario digite el valor.</li>
                    <img src={change_genero_estado}/>
                    <li>Al modificar la facultad se debe reasignar el programa.</li>
                    <img src={seleccion_programa}/>
                </>
        }
    }
    return(
        <div className={show_hidden}>
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
        </div>
    )
}

HelpUpdatePaciente.propTypes = {
    show: PropTypes.bool,
    type: PropTypes.string,
    handle_close: PropTypes.func
}
