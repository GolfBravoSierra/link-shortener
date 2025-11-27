const { montarUrlCurta } = require('./index');

describe('Função montarUrlCurta', () => {
  test('monta corretamente a URL curta', () => {
    const base = "http://localhost:3000";
    const code = "abc123";

    const resultado = montarUrlCurta(base, code);

    expect(resultado).toBe("http://localhost:3000/abc123");
  });

  test('remove / extra do final da base, se existir', () => {
    const base = "http://localhost:3000/";
    const code = "xyz999";

    const resultado = montarUrlCurta(base, code);

    expect(resultado).toBe("http://localhost:3000/xyz999");
  });
});
