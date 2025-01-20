import { useState } from "react"
export default function useConstantState() {
    const [facultadProgramas] = useState({
        [`select...`]: [''],
        ingenieria: ['select...', 'mecatronica', 'sistemas', 'civil', 'ambiental', 'procesos'],
        ciencias_salud: ['select...', 'enfermeria', 'terapia_ocupacional', 'fisioterapia', 'nutricion_dietetica'],
        humanidades: ['select...', 'derecho', 'trabajo_social', 'comunicacion_social', 'psicologia'],
        educacion: ['select...', 'teologia', 'matematicas', 'educacion_infantil', 'educacion_primaria'],
        ciencias_contables: ['select...', 'mercadeo', 'contaduria', 'administracion']
    })
    const [listRol] = useState(['select...', 'admin', 'personal', 'transitorio'])
    const [listGenero] = useState(['select...', 'hombre', 'mujer', 'otro'])
    const [listEstadoCivil] = useState(['select...', 'solter@', 'casad@', 'viud@', 'divorciad@', 'otro'])

    return {
        facultadProgramas,
        listRol,
        listGenero,
        listEstadoCivil
    }
}
