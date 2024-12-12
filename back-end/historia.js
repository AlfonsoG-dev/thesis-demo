import {users} from "./user.js"
import {pacientes} from "./paciente.js"
import { anamnesis_list as anamnesis } from "./anamnesis.js"
import { examenes } from "./examen_fisico.js"
import {signos_list} from "./signos_vitales.js"
export const historias = [
    {
        id_pk: 1,
        paciente_id_fk: pacientes[0].id_pk,
        paciente_name: pacientes[0].nombres,
        usuario_id_fk: users[0].id_pk,
        user_name: users[0].name,
        anamnesis_id_fk: anamnesis[0].id_pk,
        examen_fisico_id_fk: examenes[0].id_pk,
        signos_vitales_id_fk: signos_list[0].id_pk,
        referencia: null,
        update_by: null,
        create_at: new Date("04-12-2024 03:44:20"),
        update_at: null
    },
    {
        id_pk: 2,
        paciente_id_fk: pacientes[1].id_pk,
        paciente_name: pacientes[1].nombres,
        usuario_id_fk: users[0].id_pk,
        user_name: users[0].name,
        anamnesis_id_fk: anamnesis[1].id_pk,
        examen_fisico_id_fk: examenes[1].id_pk,
        signos_vitales_id_fk: signos_list[1].id_pk,
        referencia: null,
        update_by: null,
        create_at: new Date("04-22-2024 14:03:30"),
        update_at: null
    },
    {
        id_pk: 3,
        paciente_id_fk: pacientes[0].id_pk,
        paciente_name: pacientes[0].nombres,
        usuario_id_fk: users[1].id_pk,
        user_name: users[1].name,
        anamnesis_id_fk: anamnesis[2].id_pk,
        examen_fisico_id_fk: examenes[2].id_pk,
        signos_vitales_id_fk: signos_list[2].id_pk,
        referencia: null,
        update_by: null,
        create_at: new Date("05-01-2024 10:30:55"),
        update_at: null
    }
]

export function get_historias_by_user(id_usuario=0, start=0, end=0) {
    const m = historias.filter(h => h.usuario_id_fk === Number.parseInt(id_usuario)).slice(start, end)
    return m
}
export function get_historias_by_paciente(id_paciente=0, start=0, end=0) {
    const m = historias.filter(h => h.paciente_id_fk === Number.parseInt(id_paciente)).slice(start, end)
    return m
}
export function get_historias(start=0, end=0) {
    return historias.slice(start, end)
}
