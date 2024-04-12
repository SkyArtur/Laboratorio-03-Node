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
