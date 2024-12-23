// depencies
import PropTypes from "prop-types";
import { GoEyeClosed } from "react-icons/go"

// data
// TODO: incude images.

// style
import "../../Styles/HelpModal.css"
export default function HelpPaciente({show, handle_close}) {

    const show_hidden = show ? "modal display-block" : "modal display-none"

    return(
        <div className={show_hidden}>
            <section className="help-modal-main">
                <div className="content">
                    <span className="close" onClick={handle_close}>
                        <GoEyeClosed />
                    </span>
                    <h1>Ayuda</h1>
                    <p>En esta sección se encuentra la descripción de las opciones presentes en la página Paciente.</p>
                    <ul className="list">
                    </ul>
                </div>
            </section>
        </div>
    )
}

HelpPaciente.propTypes = {
    show: PropTypes.bool,
    handle_close: PropTypes.func
}
