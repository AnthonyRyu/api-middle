const production = {
    PORT :5000,
    DB:{
        host:"localhost",
        user:'root',
        database:'soc',
        password:'root',
        port:"3306",
        connectionLimit:20,
        connectTimeout: 5000,
    },
}
const development = {
    PORT :6000,
    DB:{
        host:"localhost",
        user:'root',
        database:'soc',
        password:'root',
        port:"3306",
        connectionLimit:20,
        connectTimeout: 5000,
    },
}

module.exports = { production, development}