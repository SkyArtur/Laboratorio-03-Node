const { Individuo } = require('./instancia.test')

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


test('Testando se duas instâncias de um objeto Singleton geram objetos iguais.', () => {
    const elemento1 = PessoaSingleton.instanciar('aline', 'santos')
    const elemento2 = PessoaSingleton.instanciar('maria', 'silva')
    expect(elemento1 === elemento2).toBeTruthy()
})

test('Testando se a segunda instância de um objeto Singleton, sobrescreveu os dados da primeira instância.', () => {
    const elemento1 = PessoaSingleton.instanciar('aline', 'santos')
    const elemento2 = PessoaSingleton.instanciar('maria', 'silva')
    expect(elemento2.getNomeCompleto()).toMatch(/aline/)
    expect(elemento2.getNomeCompleto()).not.toMatch(/maria/)
})
