class Individuo {
    constructor(nome, sobrenome) {
        this.nome = nome
        this.sobrenome = sobrenome
    }
    getNomeCompleto () {
        return `${this.nome} ${this.sobrenome}`
    }
}

test('Testando se duas instâncias de uma mesma classe geram objetos diferentes.', () => {
    const elemento1 = new Individuo('aline', 'santos')
    const elemento2 = new Individuo('maria', 'silva')
    expect(elemento1 === elemento2).toBeFalsy()
})

module.exports = { Individuo }