import { useState } from "react"

import {
    paciente_model_2,
    anamnesis_model,
    signos_model,
    examen_model
} from "../../Utils/Formats/Models"
// default values
const default_paciente = paciente_model_2;
const default_anamnesis = anamnesis_model;
const default_signos = signos_model;
const default_examen = examen_model;
const useFormState = () => {
    const [paciente, setPaciente] = useState(default_paciente)
    const [anamnesis, setAnamnesis] = useState(default_anamnesis)
    const [signos, setSignos] = useState(default_signos)
    const [examen, setExamen] = useState(default_examen)
    const [isCompleted, setIsCompleted] = useState(false)

    return {
        paciente, setPaciente,
        anamnesis, setAnamnesis,
        signos, setSignos,
        examen, setExamen,
        isCompleted, setIsCompleted
    }
}

export default useFormState
