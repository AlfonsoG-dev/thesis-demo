import { GoEyeClosed } from "react-icons/go"
import PropTypes from "prop-types";
// data
import crear_historia_paciente from "/docs/images/historia_registro/crear_historia_paciente.png"
import paciente_estado_genero from "/docs/images/historia_registro/paciente_estado_genero.png"
import paciente_facultad_programa from "/docs/images/historia_registro/paciente_facultad_programa.png"
import registrar from "/docs/images/historia_registro/registrar_button.png"

// style
import "../../Styles/HelpModal.css"

export function HelpCrearHistoria ({show, handle_close}) {
    const show_hidden = show ? "modal display-block" : "modal display-none"

    return(
        <div className={show_hidden}>
            <section className="help-modal-main">
                <span className="close" onClick={handle_close}>
                    <GoEyeClosed />
                </span>
                <div className="content">
                    <h1>Ayuda</h1>
                    <p>En esta sección se realiza el registro del paciente y se abre la historia clínica.</p>
                    <ul className="list">
                        <li>Atención: indica la fecha y hora de ingreso del paciente.</li>
                        <img src={crear_historia_paciente} alt="Registro historia y paciente"/>
                        <li>Paciente: indica el registro de los datos para el paciente.</li>
                        <ul>
                            <li>Estado civil y genero tiene una opción adicional *otro*.</li>
                            <img src={paciente_estado_genero} alt="Registro estado civil y genero"/>
                            <li>Al seleccionar facultad despliega adicional el programa.</li>
                            <img src={paciente_facultad_programa} alt="Registro facultad y programa"/>
                        </ul>
                        <li>Anamnesis: registro de los datos esenciales en la consulta.</li>
                        <li>Signos Vitales tomados al paciente al momento de ingresar.</li>
                        <li>Examen físico tomado al paciente al momento de ingresar.</li>
                        <li>Para registrar dar click en el botón de *registro*.</li>
                        <img src={registrar} alt="Registrar button"/>
                    </ul>
                </div>
            </section>
        </div>
    )
}

HelpCrearHistoria.propTypes = {
    show: PropTypes.bool,
    handle_close: PropTypes.func
}