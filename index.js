function validarCartao(numeroCartao) {
    // Remove quaisquer espaços ou caracteres não numéricos
    const numeroSanitizado = numeroCartao.replace(/\D/g, '');

    const bandeiras = {
        'MasterCard': /^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/,
        'Visa 12 Dígitos': /^4[0-9]{11}$/,
        'Visa 16 Dígitos': /^4[0-9]{15}$/,
        'American Express': /^3[47][0-9]{13}$/,
        'Diners Club': /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        'Discover': /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        'enRoute': /^(2014|2149)[0-9]{11}$/,
        'JCB': /^(?:2131|1800|35\d{3})\d{11}$/,
        'Voyager': /^8699[0-9]{11}$/,
        'HiperCard': /^(606282\d{10}(\d{3})?|3841\d{15})$/,
        'Aura': /^50[0-9]{14}$/,
    };

    let bandeiraDetectada = null;

    for (const [bandeira, regex] of Object.entries(bandeiras)) {
        if (regex.test(numeroSanitizado)) {
            bandeiraDetectada = bandeira;
            break;
        }
    }

    if (!bandeiraDetectada) {
        return { valido: false, bandeira: null, mensagem: 'Bandeira não identificada ou inválida.' };
    }

    // Validação pelo algoritmo de Luhn
    const valido = verificarLuhn(numeroSanitizado);

    return {
        valido: valido,
        bandeira: bandeiraDetectada,
        mensagem: valido ? 'Cartão válido.' : 'Cartão inválido.',
    };
}

// Implementação do algoritmo de Luhn
function verificarLuhn(numeroCartao) {
    let soma = 0;
    let dobrarProximo = false;

    for (let i = numeroCartao.length - 1; i >= 0; i--) {
        let digito = parseInt(numeroCartao[i], 10);

        if (dobrarProximo) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }

        soma += digito;
        dobrarProximo = !dobrarProximo;
    }

    return soma % 10 === 0;
}

// Exemplos de uso
const exemplos = [
    '4111111111111111', // Visa 16 Dígitos - Válido
    '4012888888881881', // Visa 16 Dígitos - Válido
    '378282246310005',  // American Express - Válido
    '6011111111111117', // Discover - Válido
    '5555555555554444', // MasterCard - Válido
    '30569309025904',   // Diners Club - Válido
    '1234567890123456', // Cartão inválido
];

exemplos.forEach(numero => {
    const resultado = validarCartao(numero);
    console.log(`Número: ${numero} -> Resultado:`, resultado);
});