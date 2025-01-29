import PropTypes from "prop-types"
export default function EncabezadoForm({encabezado: paciente, isDisable, onChangeHandler}) {
    return(
        <section>
            <h1>Encabezado</h1>
            <label>
                Facultad
                <input
                    type="text"
                    name="facultad"
                    value={paciente.facultad}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
            <label>
                Programa
                <input
                    type="text"
                    name="programa"
                    value={paciente.programa}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />

            </label>
            <label>
                EPS
                <input
                    type="text"
                    name="eps"
                    value={paciente.eps}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
        </section>
    )
}

EncabezadoForm.propTypes = {
    encabezado: PropTypes.object,
    isDisable: PropTypes.bool,
    onChangeHandler: PropTypes.func
}
