const database1 = require('./connector').connect()


database1.setQuery('SELECT * FROM selecionar_produto_em_estoque($1);', 'abacate')
database1.execute()
    .then(console.log)
    .catch(console.error)