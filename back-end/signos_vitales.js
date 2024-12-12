export const signos_list = [
    {
        id_pk: 1,
        ta: 30.0,
        fc: 40.0,
        p: 60.0,
        r: 30.0,
        t: 36.5,
        peso: 80.6,
        talla: 120.0
    },
    {
        id_pk: 2,
        ta: 35.0,
        fc: 35.0,
        p: 57.0,
        r: 33.0,
        t: 35.7,
        peso: 67.0,
        talla: 80.0
    },
    {
        id_pk: 3,
        ta: 33.2,
        fc: 30.0,
        p: 32.0,
        r: 60.0,
        t: 35.6,
        peso: 72.0,
        talla: 80.0
    }
]

export function register_signos(signos) {
    const comp_signos = {
        id_pk: signos_list.length + 1,
        ...signos
    }
    signos_list.push(comp_signos)
    return {
        msg: "Signos vitales registrados",
        register: comp_signos
    }
}
