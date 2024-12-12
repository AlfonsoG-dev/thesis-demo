export const users = [
    {
        id_pk: 1,
        name: "Mario Mendoza",
        identificacion: 102030,
        password: "123",
        rol: "admin",
        time_limit: null,
        create_at: new Date("10-02-2024 10:30:00"),
        update_at: null
    },
    {
        id_pk: 2,
        name: "Lizet Velazquez",
        identificacion: 203040,
        password: "asd",
        rol: "personal",
        time_limit: null,
        create_at: new Date("05-02-2024 14:25:30"),
        update_at: null
    },
    {
        id_pk: 3,
        name: "Maritza Rodriguez",
        identificacion: 304050,
        password: "abc",
        rol: "transitorio",
        time_limit: new Date("12-12-2024 23:59:00"),
        create_at: new Date("05-02-2024 14:25:30"),
        update_at: null
    }
]

const current = new Date(Date.now())
const tomorrow = new Date(current.getDate() + 1)

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
