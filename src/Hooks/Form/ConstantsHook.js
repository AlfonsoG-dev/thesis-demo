import { useState } from "react"
export default function useConstantState() {
    const [facultadProgramas] = useState({
        [`select...`]: [''],
        'Ingeniería': [
            'select...', 'Mecatrónica', 'Sistemas', 'Civil', 'Ambiental', 'Procesos',
            'E.Sistemas integrados de gestión', 'M.Diseno, gestión y optimización de procesos', 'M.Ciencias ambientales'
        ],
        'Ciencias de la salud': [
            'select...', 'Enfermería', 'Terapia ocupacional', 'Fisioterapia', 'Nutricion y dietética', 'E.Enfermería oncológica',
            'E.Enfermería materno perinatal', 'E.Enfermería para cuidado del paciente en estado crítico', 'M.Administración en salud'
        ],
        'Humanidades': [
            'select...', 'Derecho', 'Trabajo social', 'comunicación social', 'Psicología', 'E.Familia',
            'M.Derecho público y privado', 'M.Governanza y políticas públicas', 'M.Salud mental'
        ],
        'Educación': [
            'select...', 'Teologia', 'Literatura', 'Matemáticas', 'Educación infantil', 'Educación primaria',
            'M.Gestión educativa y liderazgo', 'M.Pedagogía', 'M.Pedagogía modalidad virtual', 'D.Pedagogía'
        ],
        'Ciencias contables': ['select...', 'Mercadeó', 'Contaduría pública', 'Administración de negocios',
            'E.Gerencia de marketing estratégico', 'E.Alta gerencia', 'E.Gerencia tributaria',
            'M.Gerencia financiera', 'M.Gerencia y auditoría tributaria', 'M.Administración'
        ]
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
