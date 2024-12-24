export default function activeLinkReducer(state, action) {
    switch(action.type) {
        case "/app":
            saveLink('/app')
            return {
                activeHome: true
            }
        case "/app/paciente":
            saveLink('/app/paciente')
            return {
                activePaciente: true
            }
        case "/app/usuario":
            saveLink('/app/usuario')
            return {
                activeUsuario: true
            }
        case "/app/historias":
            saveLink('/app/historias')
            return {
                activeHistorias: true
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
