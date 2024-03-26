const express = require('express')
const database = require('../connector')
const router = express.Router()

router.get('/', (req, res, next) => {
    database.setQuery('SELECT * FROM selecionar_produto_para_venda();')
    database.execute()
        .then(result => res.json(result))
})

router.get('/:nome', (req, res, next) => {
    database.setQuery('SELECT * FROM selecionar_produto_para_venda($1);', [req.params.nome])
    database.execute()
        .then(result => res.json(result))
})


module.exports = router