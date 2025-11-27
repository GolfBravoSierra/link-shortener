const { createPoolFromEnv } = require("../../index");

describe("Integração: conexão com banco Postgres", () => {
  let pool;

  beforeAll(async () => {
    pool = createPoolFromEnv();
  });

  afterAll(async () => {
    await pool.end();
  });

  test("Conecta no banco e executa SELECT 1", async () => {
    const result = await pool.query("SELECT 1");
    expect(result.rows[0]["?column?"] || result.rows[0].select).toBe(1);
  });
});
