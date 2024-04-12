# Laboratório 03 - Conectando com o banco de dados usando Node JS.

<hr/>

No Laboratório 02, criamos uma conexão com o banco de dados que elaboramos no nosso primeiro laboratório. Utilizamos
a linguagem Python para isso. Falamos um pouco sobre orientação a objetos e usamos um padrão de projeto chamado Singleton 
como design do nosso Connector. 

Como já mencionei, em Python, tudo é um objeto, fazendo com que a OOP (Programação Orientada a Objetos) seja muito 
mais intuitiva e natural. Em JavaScript, por outro lado, tudo é uma função, mas isso não que dizer que não possamos 
trabalhar com objetos aqui também. 

Mesmo que até uma classe em Javascript seja uma função, nós podemos trabalhar com conceitos da OOP, como, métodos, 
atributos, etc:
```javascript
class Individuo {
    constructor(nome, sobrenome) {
        this.nome = nome
        this.sobrenome = sobrenome
    }
    getNomeCompleto () {
        return `${this.nome} ${this.sobrenome}`
    }
}
```
Se instanciarmos **Individuo**, teremos o seguinte:

Teste:
```javascript
test('Testando se duas instâncias de uma mesma classe geram objetos diferentes.', () => {
    const elemento1 = new Individuo('aline', 'santos')
    const elemento2 = new Individuo('maria', 'silva')
    expect(elemento1 === elemento2).toBeFalsy()
})

```
Saída:
```shell
> laboratorio-03-node@1.0.0 test
> npx jest

 PASS  __tests__/instancia.test.js
  √ Testando se duas instâncias de uma mesma classe geram objetos diferentes. (2 ms)

Test Suites: 1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Tests:       1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Snapshots:   0 total
Time:        0.301 s, estimated 1 s
Ran all test suites.

```
Note que temos dois objetos diferentes, criados a partir de um mesmo objeto base. Agora vamos criar objetos Singletons a 
partir de **Individuo**:
```javascript
const PessoaSingleton = (() => {
    let instance
    function criar_instancia (nome, sobrenome) {
        return new Individuo(nome, sobrenome)
    }
    return {
        instanciar: function (nome, sobrenome) {
            if (!instance) {
                instance = criar_instancia(nome, sobrenome)
            }
            return instance
        }
    }
})()
```
Se utilizarmos o nosso Singleton, teremos o seguinte comportamento:

Teste:
```javascript
test('Testando se duas instâncias de um objeto Singleton geram objetos iguais.', () => {
    const elemento1 = PessoaSingleton.instanciar('aline', 'santos')
    const elemento2 = PessoaSingleton.instanciar('maria', 'silva')
    expect(elemento1 === elemento2).toBeTruthy()
})
```
Saída:
```shell
> laboratorio-03-node@1.0.0 test
> npx jest

 PASS  __tests__/singleton.test.js
  √ Testando se duas instâncias de um objeto Singleton geram objetos iguais. (2 ms)

Test Suites: 1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Tests:       1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Snapshots:   0 total
Time:        0.417 s, estimated 1 s
#Ran all test suites.
```
Em Python, a segunda instância do objeto, sobrescreveu os dados da primeira. Mas nesse nosso exemplo, não houve sobrescrita.
A segunda instância, além de ser igual à primeira, simplesmente herdou os dados dela. Observe:

Teste:
```javascript
test('Testando se a segunda instância de um objeto Singleton, sobrescreveu os dados da primeira instância.', () => {
    const elemento1 = PessoaSingleton.instanciar('aline', 'santos')
    const elemento2 = PessoaSingleton.instanciar('maria', 'silva')
    expect(elemento2.getNomeCompleto()).toMatch(/aline/) // retorna true
    expect(elemento2.getNomeCompleto()).not.toMatch(/maria/) // retorna true se o nome completo de elemento2 não for 'maria'
})
```
Saída: 
```shell
> laboratorio-03-node@1.0.0 test
> npx jest

 PASS  __tests__/singleton.test.js
  √ Testando se a segunda instância de um objeto Singleton, sobrescreveu os dados da primeira instância. (2 ms)

Test Suites: 1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Tests:       1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Snapshots:   0 total
Time:        0.419 s, estimated 1 s
Ran all test suites.
```
Para explicar esse comportamento podemos dizer que isso se dá pela forma como nós escrevemos o nosso objeto Singleton. 
Em ambas as linguagens, um Singleton é um objeto único, gravado em memória, porém, em Python, fazemos isso por 
um método do próprio objeto ('.__ new __()'), mas, em Javascript, temos uma factory ('.criar_instancia()') dentro do objeto 
Singleton que gera uma instância da classe (**Individuo**), desta forma, as variáveis *elemento1* e *elemento2*, fazem 
referência à **Individuo** e não a **PessoaSingleton**. Uma vez que Individuo() foi instanciado, seus dados não podem ser 
alterados.

Interessante, não? :boom:

Vamos utilizar este padrão para construir nosso **Connector**.

## Criando o nosso Objeto Padrão

Primeiro, vamos definir que nosso **Connector** será um módulo. Portanto, teremos um diretório chamado *connector* e dois 
arquivos dentro dele. Um arquivo 'index.js' e um arquivo chamado 'object.js'. 

Segundo, vamos utilizar o padrão de exportação de módulos commonJS. Ele é baseado na função 'require()', o que pode ser
bem interessante para os nossos projetos futuros com este *connector*.

Começaremos instalando as dependências do nosso projeto que serão equivalentes as que utilizamos em python:
```shell
npm i pg dotenv
```
Assim como a biblioteca 'psycopg2', o node_module 'pg' ira nos fornecer os métodos específicos para banco de dados 
PostgreSQL. Utilizaremos 'dotenv' para carregarmos as nossas variáveis de ambiente dentro dos nossos módulos tal qual
'python-dotenv'.

Agora vamos começar editando o nosso arquivo 'object.js'. Note que utilizaremos o export para fazer com que o nosso módulo
'object.js' seja o próprio objeto de conexão.

```javascript
const { Client } = require('pg')


module.exports = class {
    constructor(parmas) {
        this.params = parmas
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
```
Nosso objeto possui dois atributos e dois métodos. O atributo *params*, deve fornecer os dados do banco de dados com o 
qual iremos nos conectar, já o atributo *query*, é um objeto que segue o padrão que o módulo 'pg' utiliza para realizar 
as consultas. Para manipular o atributo *query*, criamos um método '.setQuery()'. Nele utilizamos um ternário que nos 
permitirá passar o parâmetro 'values', em um array ou não. Isso porque queremos uma maior flexibilidade
em nosso método, assim, poderemos utilizá-lo tanto desta forma:
```javascript
db.setQuery('SELECT * FROM produtos WHERE id = $1;', 1)
```
como desta forma:
```javascript
db.setQuery('SELECT * FROM produtos WHERE id = $1;', [1])
```
Um detalhe, aparentemente sem importância, mas que deixa o nosso método mais dinâmico quando desejamos passar apenas um 
dado para a consulta. Múltiplos dados, ainda deveram ser passados em um array.


## Singleton Function

Agora, em nosso arquivo 'index.js', vamos de fato criar o nosso Singleton. Precisaremos importar o nosso 'object.js', 
atribuindo ele a uma variável. Também vamos utilizar o node module dotenv para recuperarmos a variável de ambiente que 
utilizaremos para a conexão com o banco de dados. Deixaremos como alternativa uma variável chamada *params*, para
definirmos os dados do banco de dados como um objeto Javascript desta forma:
```javascript
const params = {
    database: 'laboratorio',
    user: 'estudante',
    password: '212223',
    host: 'localhost',
    port: '5430'
}
```
Daremos preferência para um arquivo '.env', como já fizemos no laboratório anterior, mas, manteremos esta opção em aberto
conforme a preferência do utilizador.
```javascript
const Connection = require('./object')
require('dotenv').config()

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
```
Note que utilizamos uma IIFE (Immediately Invoked Function Expression), ou, função autoexecutável, para os íntimos. :grin:
Exportamos ela diretamente do nosso módulo 'index.js' de modo que todo o diretório 'connector' é agora um objeto.

Também vale a pena observar o uso do operador de coalescência nula (??). Podemos definir esta abordagem como: - uma coalescência
nula para a variável *params* com fallback para uma variável de ambiente chamada CONNECTION_STRING. Talvez!? :smile:

Vamos fazer um teste para observamos o comportamento. 

Teste:
```javascript
let params = null

const CONNECTION_STRING = 'postgresql://localhost:5432/laboratorio?user=estudante&password=212223'

class Simulado {
    constructor(params) {
        this.params = params
    }
}

test('Testando o operador de coalescência nula em params com fallback para CONNECTION_STRING.', () => {
    const simulado = new Simulado(params ?? CONNECTION_STRING)
    expect(simulado.params).toMatch(CONNECTION_STRING)
})
```
Saída:
```shell
> laboratorio-03-node@1.0.0 test
> npx jest

 PASS  __tests__/coalescencia.test.js
  √ Testando o operador de coalescência nula em params com fallback para CONNECTION_STRING.. (2 ms)

Test Suites: 1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Tests:       1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Snapshots:   0 total
Time:        0.287 s, estimated 1 s
Ran all test suites.

```
Os operadores ternário e de coalescência nula, na minha modesta opinião, além de oferecerem uma técnica mais apurada, 
deixam o código mais elegante.

## Assunto importante: Promise

Quando comecei a estudar Javascript, ouvi um termo chamado: - "callback hell :smiling_imp: ". Isso porque em Javascript, não é incomum
funções que invocam outras funções em seus parâmetros, como a nossa IIFE acima. Acontece que quando se trata de programação 
assíncrona, estas callbacks podem se tornarem um pesadelo. Para lidar com esse inferninho de funções, foram implementadas
as Promises a partir das especificações ECMAScript 6, também conhecida como ECMAScript 2015.

Basicamente, Promises são objetos que representam a eventual conclusão ou falha de uma operação assíncrona. Elas podem 
estar em um de três estados:

- Pendente (Pending): Estado inicial, quando a operação ainda não foi concluída ou rejeitada.
- Realizada (Fulfilled): Significa que a operação foi concluída com sucesso.
- Rejeitada (Rejected): Indica que a operação falhou.

Para lidar com o resultado de uma Promise, utilizamos os métodos '.then()' e '.catch()'. O primeiro é utilizado para 
manipular resultados e o segundo, os erros ou falhas, como a seguir: 

```javascript
const fs = require('fs')


const minhaPromise = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
            const texto = fs.readFileSync('./elemento.txt', 'utf-8')
            resolve(texto)
        } catch (e) {
            reject(e)
        }
    }, 1000)
})

minhaPromise()
    .then(result => result)
    .catch(error => error)
```
Saída:
```shell
> laboratorio-03-node@1.0.0 start
> node main.js

aconteceu um erro:
 Error: ENOENT: no such file or directory, open 'D:\GitHub\Laboratorio-03-Node\elemento.txt'
```
Embora o nosso objeto **Connector** não seja uma Promise, seu método '.execute()', é uma função assíncrona, que retorna 
implicitamente uma Promise.

Por isso trabalharemos com ele da seguinte maneira:

```javascript
const database = require('./connector').connect()


database.setQuery('SELECT * FROM selecionar_produto_em_estoque($1);', 'abacate')
database.execute()
    .then(console.log)
    .catch(console.error)
```
Saída:
```shell
> laboratorio-03-node@1.0.0 start
> node main.js

[
  {
    produto: 'abacate',
    quantidade: 279,
    custo: '455.00',
    lucro: '22',
    preco: '1.85'
  }
]
```
Perceba como utilizamos a função 'require()' para carregar nosso módulo, e como ele é basicamente um IIFE, podemos chamar
o método '.connect()' sobre ela, criando assim uma instância do nosso **Connector** de forma direta sobre a 
atribuição da variável *database*.

## Test Driven Development

A realização de testes é algo muito importante no desenvolvimento de software. A técnica de desenvolvimento guiado por 
testes (TDD) se baseia em produzir código que possa ser validado e posteriormente refatorado em um código final e com 
padrões aceitáveis. Neste nosso laboratório, procuramos abordar esta técnica. Note como testamos alguns conceitos
antes de implementarmos os nossos códigos finais. 

Utilizamos a ferramenta Jest &copy;, que é um poderoso framework de testes em JavaScript com foco na simplicidade. Você
poderá saber sobre esta ferramenta fundamental consultando a [documentação oficial.](https://jestjs.io/pt-BR/)

Acompanhe os testes realizados em nosso **Connector**:

Testes:
```javascript
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
```
Saída:
```shell
> laboratorio-03-node@1.0.0 test
> npx jest

 PASS  __tests__/connector.test.js
  √ Calculando o preço de revenda com a procedure calcular_preco(100, 100, 50) = 1.5;. (82 ms)
  √ Calculando o total de uma vena sem desconto calcular_valor_da_venda(1.5, 2) = 3;. (57 ms)
  √ Calculando o total de uma venda com 5% de desconto calcular_valor_da_venda(1.5, 2, 5) = 2.85;. (60 ms)
  √ Realizando uma busca e esperando receber um Object de dados. (12 ms)                                                                                                                                                                                                                                                                                          
  √ Procurando um produto pelo nome (abacate) (58 ms)                                                                                                                                                                                                                                                                                                             
  √ Inserindo um produto no estoque (mexerica, 150, 252.32, 25, 2024-03-11) (60 ms)                                                                                                                                                                                                                                                                               
  √ Selecionado todas as vendas de abacate (69 ms)                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                  
Test Suites: 1 passed, 1 total                                                                                                                                                                                                                                                                                                                                    
Tests:       7 passed, 7 total                                                                                                                                                                                                                                                                                                                                    
Snapshots:   0 total
Time:        0.872 s, estimated 1 s
Ran all test suites.
```

E chegamos ao fim de mais um laboratório, para o próximo, iremos continuar com o node, e criarmos uma API simples para 
realizar consultas e operações no nosso banco de dados. Utilizaremos o express JS para abordarmos os mais verbos HTTP mais
básicos: GET, POST, PUT, DELETE.

<hr/>

Laboratórios:

[Laboratório 01 - Trabalhando com PostgreSQL e PL/pgSQL.](https://github.com/SkyArtur/Laboratorio-01-PLpgSQL)

[Laboratório 02 - Conectando com o banco de dados com Python.](https://github.com/SkyArtur/Laboratorio-02-Python)

<hr/>

