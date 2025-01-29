import PropTypes from "prop-types"
export default function AnamnesisForm({anamnesis, isDisable, onChangeHandler}) {
    return(
        <section>
            <h1>Anamnesis</h1>
            <label>
                Motivo consulta
                <textarea
                    name="motivo_consulta"
                    required={true}
                    defaultValue={anamnesis.motivo_consulta}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Enfermedad actual
                <textarea
                    name="enfermedad_actual"
                    required={true}
                    defaultValue={anamnesis.enfermedad_actual}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Antecedentes familiares 
                <textarea
                    name="antecedentes_familiares"
                    required={true}
                    defaultValue={anamnesis.antecedentes_familiares}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />

            </label>
            <label>
                Antecedentes personales
                <textarea
                    name="antecedentes_personales"
                    required={true}
                    defaultValue={anamnesis.antecedentes_personales}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Hábitos
                <textarea
                    name="habitos"
                    required={true}
                    defaultValue={anamnesis.habitos}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>

            <label>
                Antecedentes ginecólogos
                <textarea
                    name="antecedentes_ginecologicos"
                    required={true}
                    defaultValue={anamnesis.antecedentes_ginecologicos}
                    onChange={onChangeHandler}
                    disabled={isDisable}
                />
            </label>
        </section>
    )
}
AnamnesisForm.propTypes = {
    anamnesis: PropTypes.object,
    isDisable: PropTypes.bool,
    onChangeHandler: PropTypes.func
}
