// utils
import ComputeEdad from "../../Utils/ComputeEdad.js"
import ComputeDate from "../../Utils/ComputeDate.js"
import PropTypes from "prop-types"
export default function PacienteForm({paciente, isDisable, onChangeHandler}) {
    return (
        <section>
            <h1>Paciente</h1>
            <label>
                Identificación
                <input
                    type="number"
                    name="identificacion"
                    value={paciente.identificacion}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
            <label>
                Nombres
                <input
                    type="text"
                    name="nombres"
                    value={paciente.nombres}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Apellidos
                <input
                    type="text"
                    name="apellidos"
                    value={paciente.apellidos}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Fecha nacimiento
                <input
                    type="date"
                    name="fecha_nacimiento"
                    defaultValue={ComputeDate(paciente.fecha_nacimiento)}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
            {
                paciente.fecha_nacimiento !== "" && (
                    <label>
                        Edad
                        <input
                            type="number"
                            name="edad"
                            value={ComputeEdad(paciente.fecha_nacimiento)}
                            onChange={onChangeHandler}
                            disabled={isDisable}
                        />
                    </label>
                )
            }

            <label>
                Estado civil
                <input
                    type="text"
                    name="estado_civil"
                    value={paciente.estado_civil}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Genero
                <input
                    type="text"
                    name="genero"
                    value={paciente.genero}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Procedencia
                <input
                    type="text"
                    name="procedencia"
                    value={paciente.procedencia}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Residencia
                <input
                    type="text"
                    name="residencia"
                    value={paciente.residencia}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Acudiente
                <input
                    type="text"
                    name="acudiente"
                    value={paciente.acudiente}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Celular del Acudiente
                <input
                    type="number"
                    name="celular"
                    value={paciente.celular}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
            <label>
                Parentesco del Acudiente
                <input
                    type="text"
                    name="parentesco"
                    value={paciente.parentesco}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
        </section>
    )
}
PacienteForm.propTypes = {
    paciente: PropTypes.object,
    isDisable: PropTypes.bool,
    disable_handler: PropTypes.func,
    onChangeHandler: PropTypes.func
}
