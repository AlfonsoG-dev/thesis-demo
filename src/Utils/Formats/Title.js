export default function TitleFormat(title = "") {
    const spaces = title.split(" ")
    let upper_case = ""
    for(let s of spaces) {
        upper_case += s.charAt(0).toUpperCase() + s.slice(1) + " "
    }
    return upper_case
}
