export const historias = [
    {
        id_pk: 1,
        user_name: "Mario Mendoza",
        usuario_id_fk: 1,
        paciente_id_fk: 1,
        paciente_name: "",
        referencia: null,
        update_by: null,
        create_at: new Date("04-12-2024 03:44:20"),
        update_at: null
    },
    {
        id_pk: 2,
        user_name: "Mario Mendoza",
        usuario_id_fk: 1,
        paciente_id_fk: 1,
        paciente_name: "",
        referencia: null,
        update_by: null,
        create_at: new Date("04-22-2024 14:03:30"),
        update_at: null
    },
    {
        id_pk: 3,
        user_name: "Lizet Velazquez",
        usuario_id_fk: 2,
        paciente_id_fk: 1,
        paciente_name: "",
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
