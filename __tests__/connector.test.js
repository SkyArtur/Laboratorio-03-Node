const db = require('../connector').connect()



test('Calculando o preço de revenda com a procedure calcular_preco(100, 100, 50) = 1.5;.', async () => {
    db.setQuery('SELECT * FROM calcular_preco(quantidade := $1, custo := $2, lucro := $3);', [100, 100, 50])
    const data = await db.execute()
    expect(Number(data[0]['calcular_preco'])).toEqual(1.5)
})

test('Calculando o total de uma vena sem desconto calcular_valor_da_venda(1.5, 2) = 3;.', async () => {
    db.setQuery('SELECT * FROM calcular_valor_da_venda(preco := $1, quantidade := $2);', [1.5, 2])
    const data = await db.execute()
    expect(Number(data[0]['calcular_valor_da_venda'])).toEqual(3)
})

test('Calculando o total de uma venda com 5% de desconto calcular_valor_da_venda(1.5, 2, 5) = 2.85;.', async () => {
    db.setQuery('SELECT * FROM calcular_valor_da_venda(preco := $1, quantidade := $2, desconto := $3);', [1.5, 2, 5])
    const data = await db.execute()
    expect(Number(data[0]['calcular_valor_da_venda'])).toEqual(2.85)
})

test('Realizando uma busca e esperando receber um Object de dados.', async () => {
    db.setQuery('SELECT * FROM selecionar_produto_em_estoque();')
    const data = await db.execute()
    expect(typeof data === 'object').toBe(true)
})

test('Procurando um produto pelo nome (abacate)', async () => {
    db.setQuery('SELECT * FROM selecionar_produto_em_estoque(_produto := $1);', ['abacate'])
    const data = await db.execute()
    expect(data[0]['produto']).toMatch(/abacate/)
})

test('Inserindo um produto no estoque (mexerica, 150, 252.32, 25, 2024-03-11)', async () => {
    db.setQuery(
        'SELECT * FROM registrar_produto_no_estoque(_produto := $1, _quantidade := $2, _custo := $3, _lucro := $4, _data := $5);',
        ['mexerica', 150, 252.32, 25,'2024-03-11']
    )
    const data = await db.execute()
    expect(data).toBeTruthy()
})

test('Selecionado todas as vendas de abacate', async () => {
    db.setQuery('SELECT * FROM selecionar_vendas(_produto := $1);', ['abacate'])
    const data = await db.execute()
    expect(typeof data === 'object').toBeTruthy()
})