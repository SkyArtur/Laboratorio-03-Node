<hr/>

Laboratórios:

[Laboratório 01 - Trabalhando com PostgreSQL e PL/pgSQL.](https://github.com/SkyArtur/Laboratorio-01-PLpgSQL)

[Laboratório 02 - Conectando com o banco de dados com Python.](https://github.com/SkyArtur/Laboratorio-02-Python)

<hr/>

# Laboratório 03 - Conectando com o banco de dados com Node JS.

No Laboratório 02, criamos uma conexão com o banco de dados que elaboramos no nosso primeiro laboratório. Utilizamos
a linguagem Python para isso. Falamos um pouco sobre orientação a objetos e usamos um padrão de projeto chamado Singleton 
como design do nosso Connector. 

Como já mencionei, em Python, tudo é um objeto, fazendo com que a OOP (Programação Orientada a Objetos) seja muito 
mais intuitiva e natural. Em JavaScript, por outro lado, tudo é uma função, mas isso não que dizer que não podemos 
trabalhar com objetos aqui também. 

Mesmo que até uma classe em Javascript seja uma função, nós podemos trabalhar com conceitos da OOP, por exemplo, podemos 
ter métodos, atributos, etc, como a seguir:

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
Se instanciarmos Individuo(), teremos o seguinte:
```javascript
const elemento1 = new Individuo('aline', 'santos')
const elemento2 = new Individuo('maria', 'silva')

console.log(`
Nome da pessoa1: ${elemento1.getNomeCompleto()}
Nome da pessoa2: ${elemento2.getNomeCompleto()}
`)
```
Saída:
```shell
Nome da pessoa1: aline santos
Nome da pessoa2: maria silva
```
Agora vamos criar um objeto Singleton a partir de Individuo():
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
```javascript
const elemento1 = PessoaSingleton.instanciar('aline', 'santos')
const elemento2 = PessoaSingleton.instanciar('maria', 'silva')

console.log(`
Nome da pessoa1: ${elemento1.getNomeCompleto()}
Nome da pessoa2: ${elemento2.getNomeCompleto()}
`)
```
Saída:
```shell
Nome da pessoa1: aline santos
Nome da pessoa2: aline santos
```
Em Python, a segunda instância do objeto, sobrescreveu os dados da primeira. Mas nesse nosso exemplo, não houve sobrescrita.
a segunda instância, simplesmente herdou os dados da primeira. 

Para explicar esse comportamento podemos dizer que isso se dá pela forma como nós escrevemos o nosso objeto Singleton. 
Em ambas as linguagens, um Singleton é um objeto único, gravado em memória, porém, em Python, fazemos isso por 
um método do próprio objeto (__ new __), mas, em Javascript, temos uma factory (criar_instancia) dentro do objeto 
Singleton que gera uma instância da classe (Individuo), desta forma, as variáveis *elemento1* e *elemento2*, fazem 
referência à Individuo() e não a PessoaSingleton(). Uma vez que Individuo() foi instanciado, seus dados não podem ser 
alterados.

Interessante, não?

Vamos utilizar este padrão para construir nosso Connector.

## Criando o nosso Objeto Padrão

Primeiro, vamos definir que nosso conector será um módulo. Portanto, teremos um diretório chamado 'connector' e dois 
arquivos dentro dele. Um arquivo 'index.js' e um arquivo chamado 'object.js'. 

Segundo, vamos utilizar o padrão de exportação de módulos commonJS. Ele é baseado na função *require()*, o que pode ser
bem interessante para os nossos projetos futuros com este "connector".

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
as consultar. Para manipular o atributo *query*, criamos um método 'setQuery()'. Nele utilizamos um ternário que nos 
permite passar os dados que serão utilizados na consulta, em um array ou não. Isso porque queremos uma maior flexibilidade
em nosso método, pois poderemos utilizá-lo tanto desta forma:
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

Agora, no nosso arquivo 'index.js', vamos de fato criar o nosso Singleton. Precisaremos importar o nosso 'object.js', 
atribuindo ele a uma variável. Também vamos utilizar o node module dotenv para recuperarmos a variável de ambiente que 
utilizaremos para a conexão com o banco de dados. Deixaremos como alternativa uma variável chamada *params*, para
definirmos os dados do banco de dados como um objeto Javascript como:
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
Note que utilizamos uma IIFE (Immediately Invoked Function Expression), ou, função autoexecutável, para os íntimos.
Exportamos ela diretamente do nosso arquivo 'index.js' de modo que todo o diretório 'connector' é agora um objeto.

Também vale a pena observar o uso do operador de coalescência nula (??). Podemos definir esta abordagem como uma coalescência
nula para a variável *params* com fallback para uma variável de ambiente chamada CONNECTION_STRING. Talvez? :smile:

Os operadores ternário e de coalescência nula, na minha modesta opinião, além de oferecerem uma técnica mais apurada para
verificação e padronização de dados, deixam o código mais elegante.

E terminamos!

## Assunto importante: Promise

Quando comecei a estudar Javascript, ouvi um termo chamado: - "callback hell". Isso porque em Javascript, não é incomum
funções que invocam outras funções em seus atributos, como a nossa IIFE acima. Acontece que quando se trata de programação 
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
const path = require("path");
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
    .then(result => console.log(`conteudo do arquivo: ${result}`))
    .catch(error => console.error(`aconteceu um erro:\n ${error}`))
```
Saída:
```shell
> laboratorio-03-node@1.0.0 start
> node main.js

aconteceu um erro:
 Error: ENOENT: no such file or directory, open 'D:\GitHub\Laboratorio-03-Node\elemento.txt'
```
Embora o nosso objeto 'Connector' não seja uma Promise, seu método '.execute()', é uma função assíncrona, que retorna 
implicitamente uma Promise.

Por isso trabalharemos com nosso objeto da seguinte maneira:

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
Note como utilizamos a função 'require()' para carregar nosso módulo, e como ele é basicamente um IIFE, podemos chamar
o método '.connect()' sobre ela, criando assim uma instância do nosso 'Connector' referenciado pela variável *database*.

## Testes Unitários

