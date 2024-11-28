import PropTypes from "prop-types"
export default function ExamenForm({examen, isDisable, onChangeHandler}) {
    return(
        <>
            <label>
                Piel
                <input
                    type="text"
                    name="piel"
                    required={true}
                    defaultValue={examen.piel}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Cabeza
                <input
                    type="text"
                    name="cabeza"
                    required={true}
                    defaultValue={examen.cabeza}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Nariz
                <input
                    type="text"
                    name="nariz"
                    required={true}
                    defaultValue={examen.nariz}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Ojos
                <input
                    type="text"
                    name="ojos"
                    required={true}
                    defaultValue={examen.ojos}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Oídos
                <input
                    type="text"
                    name="oidos"
                    required={true}
                    defaultValue={examen.oidos}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Boca
                <input
                    type="text"
                    name="boca"
                    required={true}
                    defaultValue={examen.boca}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Cuello
                <input
                    type="text"
                    name="cuello"
                    required={true}
                    defaultValue={examen.cuello}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Tórax
                <input
                    type="text"
                    name="torax"
                    required={true}
                    defaultValue={examen.torax}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Corazón
                <input
                    type="text"
                    name="corazon"
                    required={true}
                    defaultValue={examen.corazon}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Pulmones
                <input
                    type="text"
                    name="pulmones"
                    required={true}
                    defaultValue={examen.pulmones}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Abdomen
                <textarea
                    name="abdomen"
                    required={true}
                    defaultValue={examen.abdomen}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Extremidades
                <textarea
                    name="extremidades"
                    required={true}
                    defaultValue={examen.extremidades}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Genitourinario
                <textarea
                    name="genitourinario"
                    required={true}
                    defaultValue={examen.genitourinario}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Neurológico elemental
                <textarea
                    name="neurologico_elemental"
                    required={true}
                    defaultValue={examen.neurologico_elemental}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Impresión diagnóstica
                <textarea
                    name="impresion_diagnostica"
                    required={true}
                    defaultValue={examen.impresion_diagnostica}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Tratamiento
                <textarea
                    name="tratamiento"
                    required={true}
                    defaultValue={examen.tratamiento}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
        </>
    )
}
ExamenForm.propTypes = {
    examen: PropTypes.object,
    isDisable: PropTypes.bool,
    onChangeHandler: PropTypes.func
}
