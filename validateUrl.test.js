const { validarUrl } = require('./index');

describe('Função validarUrl', () => {
  test('aceita URL válida com http', () => {
    expect(validarUrl('http://google.com')).toBe(true);
  });

  test('aceita URL válida com https', () => {
    expect(validarUrl('https://github.com')).toBe(true);
  });

  test('recusa strings inválidas', () => {
    expect(validarUrl('banana')).toBe(false);
    expect(validarUrl('htp:/errado')).toBe(false);
    expect(validarUrl('')).toBe(false);
  });
});
