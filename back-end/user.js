export const users = [
    {
        id_pk: 1,
        name: "user admin",
        identificacion: 102030,
        password: "123",
        rol: "admin",
        time_limit: null,
        create_at: new Date("10-02-2024 10:30:00"),
        update_at: null
    },
    {
        id_pk: 2,
        name: "user personal",
        identificacion: 203040,
        password: "asd",
        rol: "personal",
        time_limit: null,
        create_at: new Date("05-02-2024 14:25:30"),
        update_at: null
    },
    {
        id_pk: 3,
        name: "user transitorio",
        identificacion: 304050,
        password: "abc",
        rol: "transitorio",
        time_limit: new Date("18-12-2024 23:59:00"),
        create_at: new Date("05-02-2024 14:25:30"),
        update_at: null
    }
]

const current = new Date(Date.now())
const tomorrow = new Date(current.getDate() + 1)


export function get_users(start=0, end=0) {
    return users.filter(u => u.rol !== 'admin').slice(start, end)
}
export function login(log_user={identificacion:0, password:""}) {
    return users.filter(u => u.identificacion === Number.parseInt(log_user.identificacion) && u.password === log_user.password)
}
export function register(user) {
    if(!(user instanceof Object)) {
        throw new Error("Non object provided")
    }
    const m_time_limit = user.rol === 'transitorio' ? tomorrow : null
    const comp_user = {
        id_pk: users.length + 1,
        ...user,
        time_limit: m_time_limit,
        create_at: new Date(Date.now()),
        update_at: null
    }
    return users.push(comp_user)
}
export function change_password(identificacion=0, password="") {
    let msg = ""
    users
        .filter(u => u.identificacion === Number.parseInt(identificacion))
        .forEach(u => {
            msg += " original [" + u.password + "]"
            u.password = password
        })
    return "Se cambio la contraseña" + msg + "\t a " + "[" + password + "]"
}
export function update(identificacion=0, usuario) {
    const user = users.filter(u => u.identificacion === Number.parseInt(identificacion))
    let error, msg = ""
    if(user.length > 0) {
        user[0] = usuario
        msg = "Usuario actualizado"
    } else {
        error = "No se pudo actualizar el usuario"
    }
    return {
        msg,
        error
    }
}
export function delete_user(identificacion=0, password) {
    const user = users.filter(u => u.identificacion === Number.parseInt(identificacion) && u.password === password)
    let error, msg = ""
    if(user.length > 0) {
        users.pop(user[0])
        msg = "Usuario eliminado"
    } else {
        error = "El usuario no se pudo eliminar"
    }
    return {
        msg,
        error
    }
}
