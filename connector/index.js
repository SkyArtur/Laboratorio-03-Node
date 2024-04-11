const Connection = require('./object')
require('dotenv').config()

/*
* O módulo 'connector' é um objeto Singleton que possibilita uma conexão com um banco de dados PostgreSQL.
* para que ele funcione, você deverá disponibilizar um arquivo '.env', com a variável de ambiente:
*
* CONNECTION_STRING=postgresql://localhost/nome_banco_de_dados?user=nome_usuario&password=senha_do_usuario.
*
* ou, você poderá declarar a variável 'params' com um objeto como:
*
* params = {
    database: 'laboratorio',
    user: 'estudante',
    password: '212223',
    host: 'localhost',
    port: '5432'
* }
* */

const params = null

module.exports = (() => {
    let instance
    function create_instance() {
        return new Connection(params ?? {connectionString: process.env.CONNECTION_STRING})
    }
    return {
        connect: function () {
            if (!instance) {
                instance = create_instance()
            }
            return instance
        }
    }
})()

