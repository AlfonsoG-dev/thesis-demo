// Dependencies
import { useEffect, useReducer, useState } from "react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"

// Icons
import { FaHome } from "react-icons/fa"
import { FaUserInjured } from "react-icons/fa"
import { FaUserMd } from "react-icons/fa"
import { MdLightMode } from "react-icons/md"
import { MdDarkMode } from "react-icons/md"
import { PiFolderSimpleUserFill } from "react-icons/pi"
import { WiTime10 } from "react-icons/wi"

// compoenents
import LogOut from "./Components/LogOut.jsx"

// hooks
import activeLinkReducer from "./Hooks/activeLinkHook.js"

// data
import {users} from "../back-end/user.js"

// styles
import "./App.css"
import "./Styles/ErrorStyle.css"
import "./Styles/LoginStyle.css"

/**
 * main app that represents the navigation bar with options.
 * it has home as default page
*/
export default function App() {
    const usuario = JSON.parse(localStorage.getItem('log_user')) || users[1]
    const navigate = useNavigate()
    const get_initial_theme = () => localStorage.getItem('theme') || 'light'
    const [isLightTheme, setIsLightTheme] = useState(get_initial_theme() === 'light')

    const location = useLocation()

    const get_initial_active = () => localStorage.getItem('activeLink') || "/app"
    const [activeState, dispatch] = useReducer(activeLinkReducer, {
        activeHome: get_initial_active() === '/app',
        activePaciente: get_initial_active() === '/app/paciente',
        activeUsuario: get_initial_active() === '/app/usuario',
        activeHistorias: get_initial_active() === '/app/historias'
    })

    const handle_change_theme = () => {
        setIsLightTheme((prev) => {
            const new_theme = !prev
            localStorage.setItem('theme', new_theme ? 'light' : 'dark')
            document.body.className = new_theme ? 'light' : 'dark'
            return new_theme
        })
    }
    const link_theme_name = `links-${isLightTheme ? 'light' : 'dark'} links`


    useEffect(() => {
        document.body.className = isLightTheme ? 'light':'dark'
        dispatch({type: location.pathname})
    }, [isLightTheme, location.pathname])

    return(
        <div className="app-container">
            <div className="navbar">
                <div className={link_theme_name}>
                    <span onClick={handle_change_theme} className="theme-changer">
                        {isLightTheme ? <MdDarkMode/> : <MdLightMode/>}
                    </span>
                    <button className={activeState.activeHome ? 'link-active':'link'} onClick={() => {
                        navigate("/app")
                    }}>
                        Home | <FaHome />
                    </button>
                    <button className={activeState.activePaciente ? 'link-active':'link'} onClick={() => {
                        navigate("/app/paciente")
                    }}>
                        Pacientes | <FaUserInjured />
                    </button>
                    {
                        usuario.rol === "admin" && 
                        (
                            <button className={activeState.activeUsuario ? 'link-active':'link'} onClick={() => {
                                navigate("/app/usuario")
                            }}>
                                Usuarios | <FaUserMd />
                            </button>
                        )
                    }
                    <button className={activeState.activeHistorias ? 'link-active':'link'} onClick={() => {
                        navigate("/app/historias")
                    }}>
                        Historias | <PiFolderSimpleUserFill/>
                    </button>
                    {
                        usuario.rol === "transitorio" && (
                            <span className={`time-${isLightTheme ? 'light':'dark'} time-frame`}>
                                <WiTime10 className="time-icon"/>
                                <p>{new Date(usuario.time_limit).toLocaleString()}</p>
                            </span>
                        )
                    }
                </div>
                <LogOut
                    isLightTheme={isLightTheme}
                />
            </div>
            <Outlet context={[usuario, isLightTheme]} />
        </div>
    )
}
