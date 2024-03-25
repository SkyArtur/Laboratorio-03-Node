const { Client } = require('pg')
require('dotenv').config()


module.exports = new class {
    constructor() {
        this.query = {text: '', values: [], rowMode: 'object'}
    }
    setQuery(query = '', data = [] || ''){
        this.query.text = query
        this.query.values = typeof data === 'object' ? data : [data]
    }
    async execute() {
        const client = new Client({connectionString: process.env.CONNECTION_STRING})
        try {
            await client.connect()
            const response = await client.query(this.query)
            return response.rows
        } catch (e) {
            return e
        } finally {
            await client.end()
        }
    }
}