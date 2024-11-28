// Dependencies
import { useEffect, useState } from "react"
import { Link, Outlet, useLoaderData } from "react-router-dom"

// Icons
import { FaHome } from "react-icons/fa"
import { FaUserInjured } from "react-icons/fa"
import { FaUserMd } from "react-icons/fa"
import { MdLightMode } from "react-icons/md"
import { MdDarkMode } from "react-icons/md"
import { PiFolderSimpleUserFill } from "react-icons/pi"
import { WiTime10 } from "react-icons/wi"

import LogOut from "./Components/LogOut.jsx"

// styles
import "./App.css"
import "./Styles/ErrorStyle.css"
import "./Styles/LoginStyle.css"

// Images
import light_escudo from "/universidad_excudo_light.jpg"

/**
 * main app that represents the navigation bar with options.
 * it has home as default page
*/
export default function App() {
    const usuario = useLoaderData()
    const getInitialTheme = () => localStorage.getItem('theme') || 'light'
    const [isLightTheme, setIsLightTheme] = useState(getInitialTheme() === 'light')

    const handleToggleTheme = () => {
        setIsLightTheme((prev) => {
            const newTheme = !prev
            localStorage.setItem('theme', newTheme ? 'light' : 'dark')
            document.body.className = newTheme ? 'light' : 'dark'
            return newTheme
        })
    }
    const linkTheme = `links-${isLightTheme ? 'light' : 'dark'}`


    useEffect(() => {
        document.body.className = isLightTheme ? 'light':'dark'
    }, [isLightTheme])


    const header_escudo = () => {
        if(isLightTheme) {
            return(
                <img src={light_escudo} alt="escudo"/>
            )
        }
    }

    return (
        <div className="app-container">
            <div className="navbar">
                <div className={linkTheme}>
                    {header_escudo()}
                    <span onClick={handleToggleTheme} className="theme-changer">
                        {isLightTheme ? <MdDarkMode/> : <MdLightMode/>}
                    </span>
                    <Link className="link" to="/app">
                        Home | <FaHome />
                    </Link>
                    <Link className="link" to="/app/paciente">
                        Pacientes | <FaUserInjured />
                    </Link>
                    {
                        usuario.rol === "admin" && 
                        (
                            <Link className="link" to="/app/usuario">
                                Usuarios | <FaUserMd />
                            </Link>
                        )
                    }
                    <Link className="link" to={"/app/historias"}>
                        Historias | <PiFolderSimpleUserFill/>
                    </Link>
                    {
                        usuario.rol === "transitorio" && (
                            <span className={`time-${isLightTheme ? 'light':'dark'}`}>
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
