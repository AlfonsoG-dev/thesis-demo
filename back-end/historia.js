import {users} from "./user.js"
import {pacientes, register_paciente} from "./paciente.js"
import { anamnesis_list, register_anamnesis } from "./anamnesis.js"
import { examenes, register_exam } from "./examen_fisico.js"
import {signos_list, register_signos} from "./signos_vitales.js"
export const historias = [
    {
        id_pk: 1,
        paciente_id_fk: pacientes[0].id_pk,
        paciente_name: pacientes[0].nombres,
        usuario_id_fk: users[0].id_pk,
        user_name: users[0].name,
        anamnesis_id_fk: anamnesis_list[0].id_pk,
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
        anamnesis_id_fk: anamnesis_list[1].id_pk,
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
        anamnesis_id_fk: anamnesis_list[2].id_pk,
        examen_fisico_id_fk: examenes[2].id_pk,
        signos_vitales_id_fk: signos_list[2].id_pk,
        referencia: null,
        update_by: null,
        create_at: new Date("05-01-2024 10:30:55"),
        update_at: null
    }
]

export function get_historias_by_user(id_usuario=0, start=0, end=0) {
    const m = historias.filter(h => h.usuario_id_fk === Number.parseInt(id_usuario))
    let pagination = []
    if(end > m.length) {
        end = m.length
    }
    for(let i=start; i<end; ++i) {
        pagination.push(m[i])
    }
    return pagination
}
export function get_historias_by_paciente(id_paciente=0, start=0, end=0) {
    const m = historias.filter(h => h.paciente_id_fk === Number.parseInt(id_paciente))
    let pagination = []
    if(end > m.length) {
        end = m.length
    }
    for(let i=start; i<end; ++i) {
        pagination.push(m[i])
    }
    return pagination
}
export function get_historias(start=0, end=0) {
    let pagination = []
    if(end > historias.length) {
        end = historias.length
    }
    for(let i=start; i<end; ++i) {
        pagination.push(historias[i])
    }
    return pagination
}

export function register_historia(historia, usuario) {
    const {paciente, anamnesis, examen_fisico, signos_vitales} = historia
    const res_paciente = register_paciente(paciente).register
    const res_anamnesis = register_anamnesis(anamnesis).register
    const res_examen = register_exam(examen_fisico).register
    const res_signos = register_signos(signos_vitales).register

    const comp_historia = {
        id_pk: historias.length + 1,
        paciente_id_fk: res_paciente.id_pk,
        paciente_name: res_paciente.nombres,
        usuario_id_fk: usuario.id_pk,
        user_name: usuario.name,
        anamnesis_id_fk: res_anamnesis.id_pk,
        examen_fisico_id_fk: res_examen.id_pk,
        signos_vitales_id_fk: res_signos.id_pk,
        referencia: 0,
        update_by: 0,
        create_at: new Date(Date.now()),
        update_at: null
    }
    historias.push(comp_historia)
    return {
        msg: "Historia registrada",
        register: comp_historia
    }
}
export function update_historia(historia, usuario, prev_historia=0) {
    const {paciente, anamnesis, examen_fisico, signos_vitales} = historia
    const res_anamnesis = register_anamnesis(anamnesis).register
    const res_examen = register_exam(examen_fisico).register
    const res_signos = register_signos(signos_vitales).register


    const comp_historia = {
        id_pk: historias.length + 1,
        paciente_id_fk: paciente.id_pk,
        paciente_name: paciente.nombres,
        usuario_id_fk: usuario.id_pk,
        user_name: usuario.name,
        anamnesis_id_fk: res_anamnesis.id_pk,
        examen_fisico_id_fk: res_examen.id_pk,
        signos_vitales_id_fk: res_signos.id_pk,
        referencia: null,
        update_by: null,
        create_at: new Date(Date.now()),
        update_at: null
    }
    const [prev] = historias.filter(h => h.id_pk === Number.parseInt(prev_historia))
    prev.referencia = comp_historia.id_pk
    prev.update_by = usuario.id_pk
    prev.update_at = new Date(Date.now())
    historias.push(comp_historia)
    return {
        msg: "Historia actualizada",
        register: comp_historia
    }
}
