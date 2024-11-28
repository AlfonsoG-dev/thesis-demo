export default function activeLinkReducer(activeState, action) {
    switch(action.type) {
        case "/app":
            return {
                activeHome: true
            }
        case "/app/paciente":
            return {
                activePaciente: true
            }
        case "/app/usuario":
            return {
                activeUsuario: true
            }
        case "/app/historias":
            return {
                activeHistorias: true
            }
    }
}
