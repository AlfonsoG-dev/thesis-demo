/**
 * reducer state for update page in historia page.
 * when the user wants to update the historia he must enable edition using a checkbox.
 * the checkbox indicates the Component to enable edition, if the component edition is disable it doesn't count in the update end-point request.
 * @param myState indicates the current state of the checked value.
 * @param action indicates the component to enable/disable edition.
*/
export default function enableEditionReducer(myState, action) {
    switch(action.type) {
        case "anamnesis": {
            return {
                ...myState,
                enableAnamnesis: !myState.enableAnamnesis
            }
        } 
        case "signos": {
            return {
                ...myState,
                enableSignos: !myState.enableSignos
            } 
        }
        case "examen": {
            return {
                ...myState,
                enableExamen: !myState.enableExamen
            } 
        }
    }
}
