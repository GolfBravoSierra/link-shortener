const { generateShortCode } = require('../../generateShortCode');

describe('Gerador de Códigos Curtos', () => {


  // Teste 1: Verifica o comportamento padrão
  test('Deve gerar um código com exatamente 7 caracteres por padrão', () => {
    const codigo = generateShortCode();
    expect(codigo.length).toBe(7);
  });

  // Teste 2: Verifica o tamanho personalizado
  test('Deve gerar um código com o tamanho solicitado (ex: 10)', () => {
    const tamanho = 10;
    const codigo = generateShortCode(tamanho);
    expect(codigo.length).toBe(tamanho);
  });

  // Teste 3: Verifica caracteres permitidos
  test('Deve conter apenas caracteres alfanuméricos', () => {
    const codigo = generateShortCode(20); 
    // Regex: Apenas letras (maíusculas/minúsculas) e números
    const regexAlfanumerico = /^[a-zA-Z0-9]+$/;
    expect(regexAlfanumerico.test(codigo)).toBe(true);
  });

  // Teste 4: Caso de Borda (Limite Mínimo)
  // Objetivo: Garantir que o loop não quebra e retorna vazio se o tamanho for 0
  test('Deve retornar uma string vazia se o tamanho solicitado for 0', () => {
    const codigo = generateShortCode(0);
    expect(codigo).toBe('');
    expect(codigo.length).toBe(0);
  });

  // Teste 5: Verificação de Tipo
  // Objetivo: Garantir que a função nunca retorna undefined, null ou número
  test('Deve garantir que o retorno é sempre do tipo string', () => {
    const codigo = generateShortCode();
    expect(typeof codigo).toBe('string');
  });

});