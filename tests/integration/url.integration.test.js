const request = require("supertest");
const { createApp, createPoolFromEnv } = require("../../index");

describe("Integração: criação e redirecionamento de URL curta", () => {
  let app;
  let pool;

  beforeAll(() => {
    pool = createPoolFromEnv();
    app = createApp(pool);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM urls WHERE url LIKE 'https://test-case.com/%'");
    await pool.end();
  });

  test("Deve criar uma URL curta e redirecionar corretamente", async () => {
    const originalUrl = "https://test-case.com/example";

    const create = await request(app)
      .post("/encurtar")
      .send({ longUrl: originalUrl });

    expect(create.status).toBe(201);
    expect(create.body.shortUrl).toBeDefined();

    const code = create.body.shortUrl.split("/").pop();

    const redirect = await request(app).get(`/${code}`);

    expect(redirect.status).toBe(302);
    expect(redirect.headers.location).toBe(originalUrl);
  });
});
