const request = require("supertest");
const { createApp, createPoolFromEnv } = require("../../index");

describe("Integração: comportamento do encurtador", () => {
  let app, pool;

  beforeAll(async () => {
    pool = createPoolFromEnv();
    app = createApp(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  test("Não deve aceitar URL inválida", async () => {
    const res = await request(app).post("/encurtar").send({ url: "aaaaaaa" });
    expect(res.status).toBe(400);
  });

  test("Encurtar a mesma URL retorna códigos diferentes", async () => {
    const url = "https://youtube.com";

    const r1 = await request(app).post("/encurtar").send({ url });
    const r2 = await request(app).post("/encurtar").send({ url });

    expect(r1.body.shortUrl).not.toBe(r2.body.shortUrl);
  });
});