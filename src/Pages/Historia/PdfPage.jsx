// Dependencies
import { useCallback, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {
    Page, Text, Document, StyleSheet,
    PDFViewer, PDFDownloadLink
} from "@react-pdf/renderer"

// Hooks
import useFormState from "../../Hooks/Form/FormHook"

// utils
import ComputeEdad from "../../Utils/ComputeEdad.js"

// data
import { pacientes } from "../../../back-end/paciente"
import { anamnesis_list } from "../../../back-end/anamnesis"
import { signos_list } from "../../../back-end/signos_vitales"
import { examenes } from "../../../back-end/examen_fisico"

export function Component() {
    // data state
    const {state} = useLocation()
    const [encabezado, setEncabezado] = useState({
        codigo: 0,
        facultad: "",
        programa: "",
        eps: ""
    })
    const {
        paciente, setPaciente,
        anamnesis, setAnamnesis,
        signos, setSignos,
        examen, setExamen,
    } = useFormState()

    // pdf Components style
    const styles = StyleSheet.create({
        title: {
            paddingBottom: 20,
            paddingTop: 20,
            fontSize: 30,
            textAlign: "center"
        },
        text: {
            padding: 5,
            textAlign: "justify",
            fontSize: 25
        },
        textEncabezado: {
            padding: 5,
            textAlign: "right",
            fontSize: 25
        },
        footNote: {
            paddingTop: 300,
            textAlign: "center",
            fontSize: 30,
            borderBottomStyle: "solid",
            borderBottom: 5
        },
        escudo: {
            padding: '10px',
            width: '200px',
            height: '200px'
        }
    })

    // get the data from end-point server
    const fetch_data = useCallback(() => {
        try {
            if(state.id_pk !== undefined) {
                if(state.paciente_if_fk !== null) {
                    const [res_paciente] = pacientes.filter(p => p.id_pk === Number.parseInt(state.paciente_id_fk))
                    setPaciente(res_paciente)
                    setEncabezado(() => ({
                        codigo: res_paciente.identificacion,
                        facultad: res_paciente.facultad,
                        programa: res_paciente.programa,
                        eps: res_paciente.eps
                    }))
                }
                if(state.anamnesis_id_fk !== null) {
                    const [res_anamnesis] = anamnesis_list.filter(a => a.id_pk === Number.parseInt(state.anamnesis_id_fk))
                    setAnamnesis(res_anamnesis)
                }
                if(state.signos_vitales_id_fk !== null) {
                    const [res_signos] = signos_list.filter(s => s.id_pk === Number.parseInt(state.signos_vitales_id_fk))
                    setSignos(res_signos)
                }
                if(state.examen_fisico_id_fk !== null) {
                    const [res_examen] = examenes.filter(e => e.id_pk === Number.parseInt(state.examen_fisico_id_fk))
                    setExamen(res_examen)
                }
            } else {
                setPaciente(state[0])
                setAnamnesis(state[1])
                setSignos(state[2])
                setExamen(state[3])
                setEncabezado(() => ({
                    codigo: state[0].identificacion,
                    facultad: state[0].facultad,
                    programa: state[0].programa,
                    epd: state[0].eps
                }))
            }
        } catch(er) {
            console.error(er)
        }
    }, [state, setPaciente, setAnamnesis, setSignos, setExamen])

    useEffect(() => {
        fetch_data()
    }, [fetch_data])

    // dynamic get the object values using object[key]
    const show_data_paciente  = () => {
        const keys = Object.keys(paciente)
        const ignore = [
            'id_pk', 'create_at', 'update_at', 'identificacion',
            'facultad', 'programa', 'eps', 'nombres', 'apellidos', 'fecha_nacimiento'
        ]
        return (
            keys.filter((k) => !ignore.includes(k)).map((k) => (
                <Text key={k} style={styles.text}>
                    {k.toUpperCase()}: {paciente[k]}
                </Text>
            ))
        )
    }
    const show_encabezado_data = () => {
        const keys = Object.keys(encabezado)
        return (
            keys.map((k) => (
                <Text key={k} style={styles.textEncabezado}>
                    {k.toUpperCase()}: {encabezado[k]}
                </Text>
            ))
        )
    }

    const show_anamnesis_data = () => {
        const keys = Object.keys(anamnesis)
        const ignore = ['id_pk', 'fecha_ingreso', 'hora_ingreso']
        return (
            keys.filter((k) => !ignore.includes(k)).map((k) => (
                <Text key={k} style={styles.text}>
                    {k.toUpperCase()}: {anamnesis[k]}
                </Text>
            ))
        )
    }
    const show_signos_data = () => {
        const keys = Object.keys(signos)
        return (
            keys.filter((k) => k !== "id_pk").map((k) => (
                <Text key={k} style={styles.text}>
                    {k.toUpperCase()}: {signos[k]}
                </Text>
            ))
        )
    }

    const show_examen_data = () => {
        const keys = Object.keys(examen)
        return (
            keys.filter((k) => k !== "id_pk").map((k) => (
                <Text key={k} style={styles.text}>
                    {k.toUpperCase()}: {examen[k]}
                </Text>
            ))
        )
    }

    // construct the pdf with pdf-components
    const MyDocument = () => (
        <Document>
            <Page size="A3" >
                {/* paciente, encabezado data */}
                <Text
                    style={styles.title}
                >
                    Historia clínica
                </Text>
                {show_encabezado_data()}
                {
                    paciente.fecha_nacimiento !== "" && (
                        <>
                            <Text style={styles.text}>
                                EDAD: {ComputeEdad(paciente.fecha_nacimiento)}
                            </Text>
                            <Text style={styles.text}>
                                FECHA_NACIMIENTO: {new Date(paciente.fecha_nacimiento).toLocaleDateString()}
                            </Text>
                        </>
                    )
                }
                {show_data_paciente()}
                <Text style={styles.text}>
                    FECHA_INGRESO: {new Date(anamnesis.fecha_ingreso).toLocaleDateString()}
                </Text>
                <Text style={styles.text}>
                    HORA_INGRESO: {anamnesis.hora_ingreso}
                </Text>
                {/* anamnesis page */}
                <Text break style={styles.title}>
                    Anamnesis
                </Text>
                {show_anamnesis_data()}
                <Text style={styles.title}>
                    Signos Vitales
                </Text>
                {show_signos_data()}
                {/* signos and examen page */}
                <Text break style={styles.title}>
                    Examen Físico
                </Text>
                {show_examen_data()}
                <Text style={styles.footNote}>
                    Firma profesional médico con registro
                </Text>
            </Page>
        </Document>
    )

    return (
        <>

            <div style={{textAlign: "center"}}>
                <PDFViewer>
                    <MyDocument/>
                </PDFViewer >
                <br/>
                <PDFDownloadLink document={<MyDocument/>} style={{fontSize: 30}} fileName="ejm.pdf">
                    !Descargar PDF¡
                </PDFDownloadLink>
            </div>
        </>
    )

}
