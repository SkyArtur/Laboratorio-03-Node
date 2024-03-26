const express = require('express')
const database = require('../connector')
const router = express.Router()

router.get('/', (req, res, next) => {
    database.setQuery('SELECT * FROM selecionar_produto_em_estoque();')
    database.execute()
        .then(result => res.json(result))
})

router.get('/:nome', (req, res, next) => {
    database.setQuery('SELECT * FROM selecionar_produto_em_estoque($1);', [req.params.nome])
    database.execute()
        .then(result => res.json(result))
})

router.post('/', (req, res, next) => {
    database.setQuery(
        'SELECT * FROM registrar_produto_no_estoque($1, $2, $3, $4, $5);',
        [req.body.produto, req.body.quantidade, req.body.custo, req.body.lucro]
    )
    database.execute()
        .then(result => res.json(result))
})
router.put('/:nome', (req, res, next) => {
    database.setQuery(
        'SELECT * FROM atualizar_dados_estoque_e_produto($1, $2, $3, $4);',
        [req.params.nome, req.body.quantidade, req.body.custo, req.body.lucro]
    )
    database.execute()
        .then(result => res.json(result))
})

router.delete('/:nome', (req, res, next) => {
    database.setQuery('SELECT * FROM deletar_produto($1);', [req.params.nome])
    database.execute()
        .then(result => res.json(result))
})

module.exports = router