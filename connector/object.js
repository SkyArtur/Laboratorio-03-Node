const { Client } = require('pg')


module.exports = class {
    constructor(params) {
        this.params = params
        this.query = {text: '', values: [], rowMode: 'object'}
    }
    setQuery(query = '', data = [] || ''){
        this.query.text = query
        this.query.values = typeof data === 'object' ? data : [data]
    }
    async execute() {
        const client = new Client(this.params)
        try {
            await client.connect()
            const response = await client.query(this.query)
            return new Promise((resolve, reject) => {
                resolve(response.rows)
            })
        } catch (e) {
            return e
        } finally {
            await client.end()
        }
    }
}