const bodyParser = require('body-parser')
const http = require('http')
const express = require('express')

const app = express()
const normalize = (value) => {
    let port = value
    if (isNaN(port)) return value
    if (port >= 0) return port
    return false
}
const port = normalize(process.env.PORT || 3000)

app.set('port', port)
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const indexRouter = require('./routes/index')
const estoqueRouter = require('./routes/estoques')
const produtoRouter = require('./routes/produtos')
const vendasRouter = require('./routes/vendas')

app.use('/', indexRouter)
app.use('/estoque', estoqueRouter)
app.use('/produtos', produtoRouter)
app.use('/vendas', vendasRouter)

const server = http.createServer(app)
server.listen(port)