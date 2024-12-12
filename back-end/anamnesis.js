export const anamnesis_list = [
    {
        id_pk: 1,
        motivo_consulta: "dolor de cabeza",
        enfermedad_actual: "diabetes",
        antecedentes_familiares: "na",
        antecedentes_personales: "diabetes",
        habitos: "hace ejercicio con regularidad",
        antecedentes_ginecologicos: "na",
        fecha_ingreso: new Date("04-12-2024"),
        hora_ingreso: "03:44:20"
    },
    {
        id_pk: 2,
        motivo_consulta: "dolor de estomago",
        enfermedad_actual: "na",
        antecedentes_familiares: "na",
        antecedentes_personales: "na",
        habitos: "hace ejercicio con regularidad\ntiene una dieta sana",
        antecedentes_ginecologicos: "na",
        fecha_ingreso: new Date("04-22-2024"),
        hora_ingreso: "14:03:30"
    },
    {
        id_pk: 3,
        motivo_consulta: "dolor de estomago y vomito",
        enfermedad_actual: "na",
        antecedentes_familiares: "na",
        antecedentes_personales: "na",
        habitos: "no toma ni fuma",
        antecedentes_ginecologicos: "na",
        fecha_ingreso: new Date("05-01-2024"),
        hora_ingreso: "10:30:55"
    }
]

export function register_anamnesis(anamnesis) {
    const comp_anamnesis = {
        id_pk: anamnesis_list.length + 1,
        ...anamnesis
    }
    anamnesis_list.push(comp_anamnesis)
    return {
        msg: "Anamnesis registrada",
        register: comp_anamnesis
    }
}
