import { GoEyeClosed } from "react-icons/go"
import PropTypes from "prop-types";
// data
import historia_update_options from "/docs/images/historia/historia_update_options.png"
import edicion_anamnesis from "/docs/images/historia/edicion_anamnesis.png"
import edicion_examen from "/docs/images/historia/edicion_examen.png"
import modificar_oidos_examen from "/docs/images/historia/modificar_oidos_examen.png"
import historia_actualizada from "/docs/images/historia/historia_actualizada.png"

// style
import "../../../Styles/HelpModal.css"

export function HelpUpdateHistoria({show, handle_close}) {
    const show_hidden = show ? "modal display-block" : "modal display-none"

    return(
        <div className={show_hidden}>
            <section className="help-modal-main">
                <span className="close" onClick={handle_close}>
                    <GoEyeClosed />
                </span>
                <div className="content">
                    <h1>Ayuda</h1>
                    <p>En esta sección se realiza la modificación de la historia clínica.</p>
                    <ul className="list">
                        <li>Para modificar la historia clínica tienes 3 opciones que corresponden a.</li>
                        <img src={historia_update_options}/>
                        <li>Solo debes modificar los campos que necesites. Así solo habilita los componentes necesarios.</li>
                        <li>Por ejemplo: para modificar anamnesis habilitar edición</li>
                        <img src={edicion_anamnesis}/>
                        <li>O para modificar examen físico habilitar edición.</li>
                        <img src={edicion_examen}/>
                        <li>Al actualizar la historia esto creará una nueva y a la original se le asigna el ID de la nueva en la casilla de referencia.</li>
                        <img src={modificar_oidos_examen}/>
                        <ol>
                            <li>Modificar la historia según los cambios anteriores.</li>
                            <li>Revisión de la historia modificada.</li>
                            <img src={historia_actualizada}/>
                        </ol>
                    </ul>
                </div>
            </section>
        </div>
    )
}

HelpUpdateHistoria.propTypes = {
    show: PropTypes.bool,
    type: PropTypes.string,
    handle_close: PropTypes.func
}
