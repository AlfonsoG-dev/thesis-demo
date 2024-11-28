import { useState } from "react"
import { Link } from "react-router-dom"
import { MdFeaturedPlayList } from "react-icons/md"
import { VscGitPullRequestGoToChanges } from "react-icons/vsc"
import { MdDeleteSweep } from "react-icons/md"

import ModalNotification from "../Modals/ModalNotification"

import PropTypes from "prop-types"

import "../../Styles/TableStyle.css"

export default function UsuarioTableComponent({data, isLightTheme}) {
    const [notification, setNotification] = useState(true)
    const handle_notification_close = () => setNotification(false)
    if(data.error) {
        return(
            <ModalNotification
                show={notification}
                message={data.error}
                type={"error"}
                handle_close={handle_notification_close}
            />
        )
    }
    return(
        <table className={`${isLightTheme ? 'light':'dark'}`}>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Identificación</th>
                    <th>Rol</th>
                    <th>Tiempo limite</th>
                    <th>Creado en</th>
                    <th>Actualizado en</th>
                    <th>
                        <table className="options-head">
                            <thead>
                                <tr>
                                    <th>Historias</th>
                                    <th>Actualizar</th>
                                    <th>Eliminar</th>
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
                            <td>{item.name}</td>
                            <td>{item.identificacion}</td>
                            <td>{item.rol}</td>
                            <td>{item.time_limit !== null && new Date(item.time_limit).toLocaleString()}</td>
                            <td>{new Date(item.create_at).toLocaleDateString()}</td>
                            <td>{item.update_at !== null && new Date(item.update_at).toLocaleDateString()}</td>
                            <td>
                                <table className="options">
                                    <OptionsTable usuario={item}/>
                                </table >
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
function OptionsTable({usuario}) {
    return(
        <tbody>
            <tr>
                <td>
                    <Link
                        to={`/app/usuario/historia/${usuario.id_pk}`} state={usuario}> 
                        <MdFeaturedPlayList />
                    </Link>
                </td>
                <td>
                    <Link
                        to={"/app/usuario/update"} state={usuario}>
                        <VscGitPullRequestGoToChanges />
                    </Link>

                </td>
                <td>
                    <Link
                        to={"/app/usuario/delete"} state={usuario}>
                        <MdDeleteSweep />
                    </Link>

                </td>
            </tr>
        </tbody>
    )
}
UsuarioTableComponent.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    isLightTheme: PropTypes.bool
}
OptionsTable.propTypes = {usuario: PropTypes.object}
