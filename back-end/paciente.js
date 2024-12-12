export const pacientes = [
    {
        id_pk: 1,
        identificacion: 1921687292,
        nombres: "Juan Pedro",
        apellidos: "Pupiales García",
        fecha_nacimiento: new Date("05-08-2000"),
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
    const m = pacientes.slice(start, end)
    return m
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
