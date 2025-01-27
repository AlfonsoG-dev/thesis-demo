import { useState } from "react"
import { Link } from "react-router-dom"

import { MdFeaturedPlayList } from "react-icons/md"
import { AiOutlineUserSwitch } from "react-icons/ai"
import { VscNewFile } from "react-icons/vsc"

import ModalNotification from "../Modals/ModalNotification"

import PropTypes from "prop-types"

import "../../Styles/TableStyle.css"
export default function PacienteTableComponent({data, isLightTheme}) {
    const [notification, setNotification] = useState(true)
    const handle_close_notification = () => setNotification(false)
    if(data.length === 0) {
        return (
            <ModalNotification
                show={notification}
                message={"No hay más datos"}
                type={"error"}
                handle_close={handle_close_notification}
            />
        )
    }
    return(
        <table className={isLightTheme ? 'light':'dark'}>
            <thead>
                <tr>
                    <th>Identificación</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Acudiente</th>
                    <th>Celular</th>
                    <th>Facultad</th>
                    <th>Programa</th>
                    <th>EPS</th>
                    <th>
                        <table className="options-head">
                            <thead>
                                <tr>
                                    <th>Historias</th>
                                    <th>Actualizar</th>
                                    <th>Registrar Historia</th>
                                </tr>
                            </thead>
                        </table >
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((item) => (
                        <tr key={item.id_pk}>
                            <td>{item.identificacion}</td>
                            <td>{item.nombres}</td>
                            <td>{item.apellidos}</td>
                            <td>{item.acudiente}</td>
                            <td>{item.celular}</td>
                            <td>{item.facultad}</td>
                            <td>{item.programa}</td>
                            <td>{item.eps}</td>
                            <td>
                                <table className="options">
                                    <OptionsTable paciente={item}/>
                                </table >
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
function OptionsTable({paciente}) {
    return(
        <tbody>
            <tr>
                <td>
                    <Link
                        to={`/app/paciente/historia/${paciente.id_pk}`} state={paciente}>
                        <MdFeaturedPlayList />
                    </Link>

                </td>
                <td>
                    <Link
                        to={"/app/paciente/update"} state={paciente}
                    >
                        <AiOutlineUserSwitch />
                    </Link>
                </td>
                <td>
                    <Link
                        to={"/app/paciente/historia/registro"} state={paciente}
                    >
                        <VscNewFile/>
                    </Link>
                </td>
            </tr >
        </tbody>
    )
}
PacienteTableComponent.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    isLightTheme: PropTypes.bool
}
OptionsTable.propTypes = {paciente: PropTypes.object}
