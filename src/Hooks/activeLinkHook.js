export default function activeLinkReducer(state, action) {
    switch(action.type) {
        case "/app":
            saveLink('/app')
            return {
                activeHome: !state.activeHome
            }
        case "/app/paciente":
            saveLink('/app/paciente')
            return {
                activePaciente: !state.activePaciente
            }
        case "/app/usuario":
            saveLink('/app/usuario')
            return {
                activeUsuario: !state.activeUsuario
            }
        case "/app/historias":
            saveLink('/app/historias')
            return {
                activeHistorias: !state.activeHistorias
            }
        default: 
            return {
                ...state
            }
    }
}

function saveLink(path="") {
    localStorage.setItem('activeLink', path)
}
