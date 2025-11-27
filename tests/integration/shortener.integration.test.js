const request = require("supertest");
const { createApp, createPoolFromEnv } = require("../../index");

describe("Integração: comportamento do encurtador", () => {
  let app;
  let pool;

  beforeAll(() => {
    pool = createPoolFromEnv();
    app = createApp(pool);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM urls WHERE url LIKE 'https://test.com/%'");
    await pool.end();
  });

  test("Encurtar a mesma URL retorna códigos diferentes", async () => {
    const url = "https://test.com/repeated";

    const r1 = await request(app).post("/encurtar").send({ longUrl: url });
    const r2 = await request(app).post("/encurtar").send({ longUrl: url });

    expect(r1.body.shortUrl).not.toBe(r2.body.shortUrl);
  });
});
