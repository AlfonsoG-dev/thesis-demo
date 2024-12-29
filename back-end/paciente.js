export const pacientes = [
    {
        id_pk: 1,
        identificacion: 1921687292,
        nombres: "Juan Pedro",
        apellidos: "Pupiales García",
        fecha_nacimiento: new Date("05-08-2000"),
        estado_civil: "soltero",
        genero: "hombre",
        procedencia: "cauca",
        residencia: "nariño",
        acudiente: "Pedro Pupiales",
        celular: 3221927262,
        parentesco: "Papá",
        facultad: "ingenieria",
        programa: "sistemas",
        eps: "sanitas",
        create_at: new Date("04-11-2024 16:22:50"),
        update_at: null
    },
    {
        id_pk: 2,
        identificacion: 1821627215,
        nombres: "Carlos",
        apellidos: "Benavidez Timana",
        fecha_nacimiento: new Date("10-04-2000"),
        estado_civil: "soltero",
        genero: "hombre",
        procedencia: "cauca",
        residencia: "nariño",
        acudiente: "Maria Timana",
        celular: 3161825264,
        parentesco: "Mamá",
        facultad: "humanidades",
        programa: "derecho",
        eps: "nuevaEPS",
        create_at: new Date("12-11-2024 12:00:30"),
        update_at: null
    }
]


export function get_pacientes(start=0, end=0) {
    let pagination = []
    if(end >= pacientes.length) {
        end = pacientes.length
    }
    for(let i=start; i<end; ++i) {
        pagination.push(pacientes[i])
    }
    return pagination
}

export function register_paciente(paciente) {
    const s = pacientes.filter(p => p.identificacion === Number.parseInt(paciente.identificacion))
    let error, msg = "", p
    if(s.length === 0) {
        const comp_paciente = {
            id_pk: pacientes.length + 1,
            ...paciente,
            create_at: new Date(Date.now()),
            update_at: null
        }
        p = comp_paciente
        pacientes.push(comp_paciente)
        msg = "Paciente registrado"
    } else {
        error = "No se pudo registrar paciente"
    }
    return {
        msg, 
        error,
        register: p
    }
}
export function update_paciente(identificacion, paciente) {
    const res = pacientes.filter(p => p.identificacion === Number.parseInt(identificacion))
    let error = ""
    if(res.length > 0) {
        res[0] = paciente
    } else {
        error = "No se pudo actualizar al paciente"
    }
    return {
        msg: "Paciente actualizado",
        error
    }
}
