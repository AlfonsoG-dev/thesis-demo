import { useState } from "react"
import { Link } from "react-router-dom"

//Icons
import { VscOpenPreview } from "react-icons/vsc"
import { VscGitPullRequestGoToChanges } from "react-icons/vsc"
import { PiFilePdfFill } from "react-icons/pi"

import ModalNotification from "../Modals/ModalNotification"

import PropTypes from "prop-types"

export default function HistoriaTableComponent({data, type, isLightTheme}) {
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
                    <th>Usuario</th>
                    <th>Paciente</th>
                    <th>Referencia</th>
                    <th>Actualizada por</th>
                    <th>Creado en</th>
                    <th>Actualizado en</th>
                    <th>
                        <table className="options-head">
                            <thead>
                                <tr>
                                    <th>Ver</th>
                                    <th>Actualizar</th>
                                    <th>PDF</th>
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
                            {
                                type === "paciente" ?
                                    <td>{item.user_name}</td>
                                    :
                                    <td>{item.usuario_id_fk}</td>
                            }
                            {
                                type === "paciente" ? 
                                    <td>{item.paciente_id_fk}</td>
                                    :
                                    <td>{item.paciente_name}</td>

                            }
                            <td>{item.referencia}</td>
                            <td>{item.update_by}</td>
                            <td>{new Date(item.create_at).toLocaleString()}</td>
                            <td>{item.update_at !== null && new Date(item.update_at).toLocaleString()}</td>
                            <td>
                                <table className="options">
                                    <OptionsTable historia={item}/>
                                </table>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
function OptionsTable({historia}) {
    return(
        <tbody>
            <tr>
                <td>

                    <Link
                        to={"/app/ver-historia"}
                        state={historia}
                    >
                        <VscOpenPreview />
                    </Link>
                </td>
                <td>
                    <Link
                        to={"/app/historia/update"}
                        state={historia}
                    >
                        <VscGitPullRequestGoToChanges />
                    </Link>
                </td>
                <td>
                    <Link to={"/app/historia/pdf"} state={historia}>
                        <PiFilePdfFill/>
                    </Link >
                </td>
            </tr>
        </tbody>
    )
}


HistoriaTableComponent.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    type: PropTypes.string,
    isLightTheme: PropTypes.bool
}
OptionsTable.propTypes = {historia: PropTypes.object}
