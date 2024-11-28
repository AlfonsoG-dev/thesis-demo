export default function ComputeDate(fecha) {
    if(fecha !== "") {
        const today = new Date(fecha);
        const year = today.getFullYear();
        const month = String(today.getMonth()+1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } else {
        return null
    }
}
