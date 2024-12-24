// depencies
import PropTypes from "prop-types";
import { GoEyeClosed } from "react-icons/go"

// data

import buscar_paciente from "/docs/images/list_pages/paciente/buscar_paciente_2.png"
import listar_historias from "/docs/images/list_pages/paciente/listar_historias.png"
import actualizar_paciente from "/docs/images/list_pages/paciente/actualizar_paciente.png"
import registrar_historia_paciente from "/docs/images/list_pages/paciente/registrar_historia_paciente.png"

// style
import "../../Styles/HelpModal.css"


// @param type it can be paciente, usuario or historias
export default function HelpPaciente({show, type, handle_close}) {

    const show_hidden = show ? "modal display-block" : "modal display-none"

    const show_paciente = () => {
        return(
            <>
                <p>En esta sección se encuentra la descripción de las opciones presentes en la página Paciente.</p>
                <ul className="list">
                    <li>Buscar paciente por identificación</li>
                    <img src={buscar_paciente} alt="Buscar paciente"/>
                    <li>Listar las historias del paciente</li>
                    <img src={listar_historias} alt="Listar historias"/>
                    <li>Actualizar la información del paciente</li>
                    <img src={actualizar_paciente} alt="Actualizar paciente"/>
                    <li>Registrar historia clínica a un paciente</li>
                    <img src={registrar_historia_paciente} alt="Registrar historia a paciente"/>
                </ul>
            </>
        )
    }

    const show_usuario = () => {
        return(
            <>
                <p>En esta sección se encuentra la descripción de las opciones presentes en la página usuarios.</p>
                <ul className="list">
                </ul>
            </>
        )
    }
        const show_historias = () => {
        return(
            <>
                <p>En esta sección se encuentra la descripción de las opciones presentes en la página historias.</p>
                <ul className="list">
                </ul>
            </>
        )
    }


    const type_union = () => {
        switch(type) {
            case "paciente":
                return show_paciente()
            case "usuario":
                return show_usuario()
            case "historias":
                return show_historias()
        } 
    }

    return(
        <div className={show_hidden}>
            <section className="help-modal-main">
                <div className="content">
                    <span className="close" onClick={handle_close}>
                        <GoEyeClosed />
                    </span>
                    <h1>Ayuda</h1>
                    {type_union()}
                </div>
            </section>
        </div>
    )
}

HelpPaciente.propTypes = {
    show: PropTypes.bool,
    type: PropTypes.string,
    handle_close: PropTypes.func
}
