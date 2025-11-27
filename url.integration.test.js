const request = require("supertest");
const { createApp, createPoolFromEnv } = require("../../index");

describe("Integração: encurtador de URLs", () => {
  let app;
  let pool;

  beforeAll(() => {
    pool = createPoolFromEnv();
    app = createApp(pool);
  });

  afterAll(async () => {
    // Limpar banco de teste e fechar conexão
    await pool.query("DELETE FROM urls WHERE url LIKE 'https://test.com/%'");
    await pool.end();
  });

  it("deve salvar uma URL válida no banco", async () => {
    const longUrl = "https://test.com/integration";

    // 1️⃣ Fazer POST para encurtar
    const response = await request(app)
      .post("/encurtar")
      .send({ longUrl })
      .expect(201);

    expect(response.body).toHaveProperty("shortUrl");

    // 2️⃣ Extrair o código gerado da URL curta
    const code = response.body.shortUrl.split("/").pop();

    // 3️⃣ Verificar diretamente no banco
    const result = await pool.query("SELECT url FROM urls WHERE code = $1", [code]);
    expect(result.rowCount).toBe(1);
    expect(result.rows[0].url).toBe(longUrl);
  });

  it("não deve salvar uma URL inválida", async () => {
    const invalidUrl = "ftp://invalid-url.com";

    const response = await request(app)
      .post("/encurtar")
      .send({ longUrl: invalidUrl })
      .expect(400);

    expect(response.body).toHaveProperty("error", "URL inválida");

    // Confirmar que nada foi salvo
    const result = await pool.query("SELECT * FROM urls WHERE url = $1", [invalidUrl]);
    expect(result.rowCount).toBe(0);
  });
});
