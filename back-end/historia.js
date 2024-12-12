import {users} from "./user.js"
import {pacientes} from "./paciente.js"
export const historias = [
    {
        id_pk: 1,
        user_name: users[0].name,
        usuario_id_fk: users[0].id_pk,
        paciente_id_fk: pacientes[0].id_pk,
        paciente_name: pacientes[0].nombres,
        referencia: null,
        update_by: null,
        create_at: new Date("04-12-2024 03:44:20"),
        update_at: null
    },
    {
        id_pk: 2,
        user_name: users[0].name,
        usuario_id_fk: users[0].id_pk,
        paciente_id_fk: pacientes[1].id_pk,
        paciente_name: pacientes[1].nombres,
        referencia: null,
        update_by: null,
        create_at: new Date("04-22-2024 14:03:30"),
        update_at: null
    },
    {
        id_pk: 3,
        user_name: users[1].name,
        usuario_id_fk: users[1].id_pk,
        paciente_id_fk: pacientes[0].id_pk,
        paciente_name: pacientes[0].nombres,
        referencia: null,
        update_by: null,
        create_at: new Date("05-01-2024 10:30:55"),
        update_at: null
    }
]

export function get_historias(id_usuario=0, limit=0, offset=0) {
    const m = historias.filter(h => h.usuario_id_fk === Number.parseInt(id_usuario)).slice(limit, offset)
    return m
}
