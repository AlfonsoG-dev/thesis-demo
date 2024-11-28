import {useNavigate, isRouteErrorResponse, useRouteError} from "react-router-dom"
import '../../Styles/ErrorStyle.css'
import '../../Styles/LoadingStyle.css'

export default function ErrorAuthentication() {
    const error = useRouteError()
    const navigate = useNavigate()
    if(isRouteErrorResponse(error) && error.status === 400) {
        return (
            <div className="error-container">
                <button onClick={() => {
                    navigate("/", {
                        replace: true
                    })
                }}>
                    Iniciar sesión
                </button>
                <div className="text_group">
                    <p className="error_status">{error.status}</p>
                    <p className="error_text">Usuario no autorizado</p>
                    <div className="loader"></div>
                </div>
            </div>
        )
    }
}
