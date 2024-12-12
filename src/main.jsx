import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements
} from 'react-router-dom'
import './index.css'

// components
import App from "./App"
import LoginPage from './Pages/Login/LoginPage.jsx'

// client routes
const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route
                path='/'
                element={<LoginPage/>}
            />
            <Route
                path='/password-recover'
                lazy={() => import('./Pages/Login/RecoverPassword')}
            />
            <Route
                path='/app'
                element={<App/>}
            >
                { /* home pages */}
                <Route index lazy={() => import('./Pages/Home/Home')} />
                <Route path='/app/change-password' lazy={() => import('./Pages/Home/ChangePassword')} />

                { /* user pages */}
                <Route path='/app/usuario' lazy={() => import('./Pages/Usuario/UsuarioPage')}/>
                <Route
                    path='/app/usuario/registro'
                    lazy={() => import('./Pages/Usuario/UsuarioRegisterPage')}
                />
                <Route
                    path='/app/usuario/historia/:id_usuario'
                    lazy={() => import('./Pages/Usuario/UsuarioHistoriasPage')}
                />
                <Route
                    path='/app/usuario/update'
                    lazy={() => import('./Pages/Usuario/UsuarioUpdatePage')}
                />
                <Route
                    path='/app/usuario/delete'
                    lazy={() => import('./Pages/Usuario/UsuarioDeletePage')}
                />

                { /* paciente pages */}
                <Route path='/app/paciente' lazy={() => import('./Pages/Paciente/PacientePage')}/>
                <Route
                    path='/app/paciente/historia/:id_paciente'
                    lazy={() => import('./Pages/Paciente/PacienteHistoriasPage')}
                />
                <Route
                    path='/app/paciente/historia/registro'
                    lazy={() => import('./Pages/Paciente/PacienteHistoriaRegisterPage')}
                />
                <Route
                    path='/app/paciente/update'
                    lazy={() => import('./Pages/Paciente/PacienteUpdatePage')}
                />
                <Route
                    path='/app/paciente/copy-pdf'
                    lazy={() => import('./Pages/Paciente/GeneratePDF')}
                />

                { /* historia pages */}
                <Route 
                    path='/app/historias'
                    lazy={() => import('./Pages/Historia/HistoriasPage')}
                />
                <Route
                    path='/app/ver-historia'
                    lazy={() => import('./Pages/Historia/VerHistoriaInfo')}
                />
                <Route
                    path='/app/historia/registro'
                    lazy={() => import('./Pages/Historia/HistoriaRegisterPage')}
                />
                <Route
                    path='/app/historia/update'
                    lazy={() => import('./Pages/Historia/HistoriaUpdatePage')}
                />
                <Route
                    path='/app/historia/pdf'
                    lazy={() => import('./Pages/Historia/PdfPage')}
                />
            </Route>
        </>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)

