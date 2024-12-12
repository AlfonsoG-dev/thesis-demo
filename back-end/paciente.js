export const pacientes = [
    {
        id_pk: 1,
        identificacion: 1921687292,
        nombres: "Juan Pedro",
        apellidos: "Pupiales García",
        acudiente: "Pedro Pupiales",
        celular: 3221927262,
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
        acudiente: "Maria Timana",
        celular: 3161825264,
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
