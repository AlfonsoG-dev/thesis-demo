// depencies
import PropTypes from "prop-types";
import { GoEyeClosed } from "react-icons/go"

// data

// paciente
import buscar_paciente from "/docs/images/list_pages/paciente/buscar_paciente_2.png"
import listar_historias from "/docs/images/list_pages/paciente/listar_historias.png"
import actualizar_paciente from "/docs/images/list_pages/paciente/actualizar_paciente.png"
import registrar_historia_paciente from "/docs/images/list_pages/paciente/registrar_historia_paciente.png"

// usuario
import buscar_usuario from "/docs/images/list_pages/usuario/buscar_usuario.png"
import listar_historias_usuario from "/docs/images/list_pages/usuario/listar_historias_usuario.png"
import actualizar_usuario from "/docs/images/list_pages/usuario/actualizar_usuario.png"
import eliminar_usuario from "/docs/images/list_pages/usuario/eliminar_usuario.png"

// historias

import buscar_historia from "/docs/images/list_pages/historias/buscar_historia.png"
import registrar_historia_control from "/docs/images/list_pages/historias/registrar_historia_control.png"
import generar_pdf from "/docs/images/list_pages/historias/generar_pdf.png"
import ver_historia from "/docs/images/list_pages/historias/ver_historia.png"
import actualizar_historia from "/docs/images/list_pages/historias/actualizar_historia.png"
import generar_pdf_individual from "/docs/images/list_pages/historias/generar_pdf_individual.png"


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
                    <li>Buscar usuario por identificación</li>
                    <img src={buscar_usuario} alt="Buscar usuario"/>
                    <li>Listar historias del usuario, las historias del usuario administrador solo se muestran en la página Home</li>
                    <img src={listar_historias_usuario} alt="Historias del usuario"/>
                    <li>Actualizar información usuario</li>
                    <img src={actualizar_usuario} alt="Actualizar usuario"/>
                    <li>Eliminar usuario</li>
                    <img src={eliminar_usuario} alt="Eliminar usuario"/>
                </ul>
            </>
        )
    }
        const show_historias = () => {
        return(
            <>
                {
                    type !== "historias" ? 
                        <h3>Se reutiliza la ayuda proporcionada en la página de historias de un paciente.</h3>
                        :
                        <p>En esta sección se encuentra la descripción de las opciones presentes en la página historias.</p>
                }
                <ul className="list">
                    {
                        type === "historias_page" && (
                            <>
                                <li>Buscar historia por ID</li>
                                <img src={buscar_historia} alt="Buscar por ID"/>
                            </>
                        )
                    }
                    {
                        type === "historias" && (
                            <>
                                <li>Registrar historia clínica cita de control</li>
                                <img src={registrar_historia_control} alt="Registrar hoja control"/>

                                <li>Generar PDF - para cuando el paciente tiene más de una historia clínica</li>
                                <img src={generar_pdf} alt="Generar pdf"/>
                            </>
                        )
                    }
                    <li>Ver el contenido de la historia clínica</li>
                    <img src={ver_historia} alt="Ver historia"/>
                    {
                        type === "historias" || type === "historias_usuario" && (
                            <>
                                <li>Actualizar historia clínica</li>
                                <img src={actualizar_historia} alt="Actualizar historia"/>
                            </>
                        )
                    }
                    <li>Generar PDF de la historia individual, es decir, de cada una</li>
                    <img src={generar_pdf_individual} alt="Generar pdf individual"/>
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
            case "historias_usuario":
            case "historias_page":
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
