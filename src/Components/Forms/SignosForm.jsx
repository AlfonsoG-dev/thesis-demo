import PropTypes from "prop-types"
export default function SignosForm({signos, isDisable, onChangeHandler}) {
    return(
        <section>
            <h1>Signos vitales</h1>
            <label>
                Tensión arterial
                <input
                    name="ta"
                    type="text"
                    required={true}
                    placeholder="sistólica/diastólica"
                    defaultValue={signos.ta}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Frecuencia cardíaca
                <input
                    name="fc"
                    type="number"
                    required={true}
                    placeholder="Latidos por minuto"
                    defaultValue={signos.fc > 0 ? signos.fc : ""}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Pulso
                <input
                    name="p"
                    type="number"
                    required={true}
                    placeholder="Latidos por minuto"
                    defaultValue={signos.p > 0 ? signos.p : ""}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Frecuencia respiratoria
                <input
                    name="r"
                    type="number"
                    required={true}
                    placeholder="Respiraciones por minuto"
                    defaultValue={signos.r > 0 ? signos.r : ""}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Temperatura
                <input
                    name="t"
                    type="number"
                    required={true}
                    placeholder="°C"
                    defaultValue={signos.t > 0 ? signos.t : ""}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Peso
                <input
                    name="peso"
                    type="number"
                    required={true}
                    placeholder="KG"
                    defaultValue={signos.peso > 0 ? signos.peso : ""}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Talla
                <input
                    name="talla"
                    type="number"
                    required={true}
                    placeholder="CM"
                    defaultValue={signos.talla > 0 ? signos.talla : ""}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
        </section>
    )
}
SignosForm.propTypes = {
    signos: PropTypes.object,
    isDisable: PropTypes.bool,
    onChangeHandler: PropTypes.func
}
