export default function ComputeEdad(fecha_nacimiento) {
    const cur_date = new Date(Date.now())
    const n = new Date(fecha_nacimiento)
    const validate_age = cur_date.getFullYear() - n.getFullYear()
    if(validate_age >= 17) {
        return validate_age
    } else {
        throw new Error("Fecha de nacimiento no valida")
    }
}
