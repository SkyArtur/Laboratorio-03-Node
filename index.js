const db = require('./connector')

db.setQuery('SELECT * FROM selecionar_produto_em_estoque();')
db.execute()
    .then(response => console.log(response))

