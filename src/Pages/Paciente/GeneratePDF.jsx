// Dependencies
import { useCallback, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {
    Page, Text, Document, StyleSheet,
    PDFViewer, PDFDownloadLink
} from "@react-pdf/renderer"

// Hooks
import { Get } from "../../Hooks/Requests"

// Utils
import {
    paciente_model_1,
    anamnesis_model,
    signos_model,
    examen_model
}from "../../Utils/Formats/Models"
import ComputeEdad from "../../Utils/ComputeEdad"

export function Component() {
    const {state} = useLocation()
    const [paciente, setPaciente] = useState(paciente_model_1)
    const [encabezado, setEncabezado] = useState({})
    const [anamnesis, setAnamnesis] = useState([anamnesis_model])
    const [signos, setSignos] = useState([signos_model])
    const [examen, setExamen] = useState([examen_model])


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

    const fetch_data = useCallback(async() => {
        try {
            const res_paciente = await Get(`/paciente/by-id/${state}`)
            setPaciente(res_paciente[0])
            setEncabezado(() => ({
                codigo: res_paciente[0].identificacion,
                facultad: res_paciente[0].facultad,
                programa: res_paciente[0].programa,
                eps: res_paciente[0].eps
            }))
            const res_anemnesis = await Get(`/anamnesis/by-paciente/${state}`)
            setAnamnesis(res_anemnesis)
            const res_signos = await Get(`/signos/by-paciente/${state}`)
            setSignos(res_signos)
            const res_examen = await Get(`/examen/by-paciente/${state}`)
            setExamen(res_examen)
        } catch(err) {
            console.error(err)
        }
    }, [state, setPaciente])

    useEffect(() => {
        fetch_data()
    }, [fetch_data])

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
    const show_component_data = () => {
        const d = []
        let i = 0;
        while(i < anamnesis.length && i < signos.length && i <examen.length) {
            const anamnesis_k = Object.keys(anamnesis[i])
            const ignore = ['id_pk', 'fecha_ingreso', 'hora_ingreso']
            d.push(
                <Text key={`anamnesis_${i}`} break style={styles.title}>
                    Anamnesis
                </Text>,
                anamnesis_k.filter((k) => !ignore.includes(k)).map((k) => (
                    <Text key={k} style={styles.text}>
                        {k.toUpperCase()}: {anamnesis[i][k]}
                    </Text>
                )),
                <Text key={`fecha_ingreso_${i}`} style={styles.text}>
                    FECHA_INGRESO: {new Date(anamnesis[i].fecha_ingreso).toLocaleDateString()}
                </Text>,
                <Text key={`hora_ingreso_${i}`} style={styles.text}>
                    HORA_INGRESO: {anamnesis[i].hora_ingreso}
                </Text>
            )
            const signos_k = Object.keys(signos[i])
            d.push(
                <Text key={`signos_${i}`} style={styles.title}>
                    Signos Vitales
                </Text>,
                signos_k.filter((k) => k !== "id_pk").map((k) => (
                    <Text key={k} style={styles.text}>
                        {k.toUpperCase()}: {signos[i][k]}
                    </Text>
                ))
            )
            const examen_k = Object.keys(examen[i])
            d.push(
                <Text key={`examen_${i}`} break style={styles.title}>
                    Examen Físico
                </Text>,
                examen_k.filter((k) => k !== "id_pk").map((k) => (
                    <Text key={k} style={styles.text}>
                        {k.toUpperCase()}: {examen[i][k]}
                    </Text>
                ))
            )
            ++i;
        }
        return d
    }

    const MyDocument = () => (
        <Document>
            <Page size="A3">
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
                {show_component_data()}
                <Text style={styles.footNote}>
                    Firma profesional médico con registro
                </Text>
            </Page>
        </Document>
    )
    return (
        <div style={{textAlign: "center"}}>
            <PDFViewer>
                <MyDocument/>
            </PDFViewer >
            <br/>
            <PDFDownloadLink document={<MyDocument/>} style={{fontSize: 30}} fileName="ejm.pdf">
                !Descargar PDF¡
            </PDFDownloadLink>
        </div>
    )
}
