export default function activeLinkReducer(state, action) {
    switch(action.type) {
        case "/app":
            return {
                activeHome: !state.activeHome
            }
        case "/app/paciente":
            return {
                activePaciente: !state.activePaciente
            }
        case "/app/usuario":
            return {
                activeUsuario: !state.activeUsuario
            }
        case "/app/historias":
            return {
                activeHistorias: !state.activeHistorias
            }
        default: 
            return {
                ...state
            }
    }
}
