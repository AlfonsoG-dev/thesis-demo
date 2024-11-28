import useCarreraState from "../../../Hooks/Form/CarreraHook"

import ComputeDate from "../../../Utils/ComputeDate"

import PropTypes from "prop-types"
export default function PacienteForm({paciente, onChangeHandler}) {
    const {
        facultadProgramas
    } = useCarreraState()
    return(
        <>
            <label>
                Identificación
                <input
                    name="identificacion"
                    type="number"
                    required={true}
                    placeholder="Numero identificación"
                    defaultValue={paciente.identificacion > 0 ? paciente.identificacion : ""}
                    onChange={onChangeHandler}
                />
            </label>
            <label>
                Nombres
                <input
                    name="nombres"
                    type="text"
                    required={true}
                    placeholder="Nombres paciente"
                    defaultValue={paciente.nombres}
                    onChange={onChangeHandler}
                />
            </label>

            <label>
                Apellidos
                <input
                    name="apellidos"
                    type="text"
                    required={true}
                    placeholder="Apellidos paciente"
                    defaultValue={paciente.apellidos}
                    onChange={onChangeHandler}
                />
            </label>
            <label>
                Fecha nacimiento
                <input
                    name="fecha_nacimiento"
                    type="date"
                    required={true}
                    defaultValue={ComputeDate(paciente.fecha_nacimiento)}
                    onChange={onChangeHandler}
                />
            </label>
            <label>
                Estado civil
                <select name="estado_civil" onChange={onChangeHandler}>
                    <option>select...</option>
                    <option key={"solter@"}>solter@</option>
                    <option key={"casad@"}>casad@</option>
                    <option key={"viud@"}>viud@</option>
                    <option key={"divorciad@"}>divorciad@</option>
                    <option key={"otr@"}>otr@</option>
                </select>
            </label>
            { /* input for genero when is otro*/}
            {
                paciente.estado_civil === "otr@" &&
                    <label>
                        Ingresa el estado civil
                        <input
                            type="text"
                            name="estado_civil1"
                            onChange={onChangeHandler}
                        />
                    </label>
            }
            <label>
                Genero
                <select name="genero" onChange={onChangeHandler}>
                    <option>select...</option>
                    <option key={"hombre"}>hombre</option>
                    <option key={"mujer"}>mujer</option>
                    <option key={"otro"}>otro</option>
                </select>
            </label>
            { /* input for genero when is otro*/}
                {
                    paciente.genero === "otro" &&
                    <label>
                        Ingresa el género
                        <input
                            type="text"
                            name="genero1"
                            onChange={onChangeHandler}
                        />
                    </label>
                }
            <label>
                Procedencia(Departamento)
                <input
                    name="procedencia"
                    type="text"
                    required={true}
                    placeholder="Dirección de procedencia"
                    defaultValue={paciente.procedencia}
                    onChange={onChangeHandler}
                />
            </label>
            <label>
                Residencia(Departamento)
                <input
                    name="residencia"
                    type="text"
                    required={true}
                    placeholder="Dirección de residencia"
                    defaultValue={paciente.residencia}
                    onChange={onChangeHandler}
                />
            </label>
            <label>
                Nombre del Acudiente
                <input
                    name="acudiente"
                    type="text"
                    required={true}
                    placeholder="Acudiente"
                    defaultValue={paciente.acudiente}
                    onChange={onChangeHandler}
                />
            </label>
            <label>
                Celular del Acudiente
                <input
                    name="celular"
                    type="number"
                    required={true}
                    placeholder="Numero celular"
                    defaultValue={paciente.celular > 0 ? paciente.celular : ""}
                    onChange={onChangeHandler}
                />
            </label>
            <label>
                Parentesco Acudiente
                <input 
                    name="parentesco"
                    type="text"
                    required={true}
                    placeholder="parentesco del Acudiente con el paciente"
                    defaultValue={paciente.parentesco}
                    onChange={onChangeHandler}
                />
            </label>
            <label>
                Facultad
                <select name='facultad' onChange={onChangeHandler}>
                    {
                        Object.keys(facultadProgramas).map((i) => (
                            <option key={i}>{i}</option>
                        ))
                    }
                </select >
            </label>
                {
                    paciente.facultad !== "" && paciente.facultad !== "select..." &&
                        <label>
                            Programa
                            <select name="programa" onChange={onChangeHandler}>
                                {
                                    facultadProgramas[`${paciente.facultad}`].map((i) => (
                                        <option key={i}>{i}</option>
                                    ))
                                }
                            </select>
                        </label>
                }
            <label>
                EPS
                <input
                    name="eps"
                    type="text"
                    required={true}
                    placeholder="EPS del paciente"
                    defaultValue={paciente.eps}
                    onChange={onChangeHandler}
                />
            </label>
        </>
    )
}

PacienteForm.propTypes = {
    paciente: PropTypes.object,
    setPacienteData: PropTypes.object,
    onChangeHandler: PropTypes.func
}
