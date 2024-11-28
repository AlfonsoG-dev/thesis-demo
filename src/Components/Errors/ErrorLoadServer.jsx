import {isRouteErrorResponse, useRouteError} from "react-router-dom"
import '../../Styles/ErrorStyle.css'
import '../../Styles/LoadingStyle.css'

export default function ErrorLoadServer() {
    const error = useRouteError()
    if(isRouteErrorResponse(error)) {
        return (
            <div className="error-container">
                <div className="text_group">
                    <p className="error_status">
                        {error.status}
                    </p >
                    <p className="error_text">
                        No se puede iniciar la aplicación, Servidor inactivo
                    </p>
                </div >
                <div className="loader"></div>
            </div>
        )
    }
}
