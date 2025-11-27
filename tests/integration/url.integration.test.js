const request = require("supertest");
const { createApp, createPoolFromEnv } = require("../../index");

describe("Integração: criação e redirecionamento de URL curta", () => {
  let app, pool;

  beforeAll(async () => {
    pool = createPoolFromEnv();
    app = createApp(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  test("Deve criar uma URL curta e redirecionar corretamente", async () => {
    const originalUrl = "https://google.com";

    const create = await request(app).post("/encurtar").send({ url: originalUrl });
    expect(create.status).toBe(201);
    expect(create.body.shortUrl).toBeDefined();

    const code = create.body.shortUrl.split("/").pop();

    const redirect = await request(app).get(`/${code}`).redirects(0);
    expect(redirect.status).toBe(302);
    expect(redirect.headers.location).toBe(originalUrl);
  });
});
