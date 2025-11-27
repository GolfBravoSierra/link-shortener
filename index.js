require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const PORT = process.env.PORT || 3000;

// ------------------------------
// FUNÇÕES DE LÓGICA PURO
// ------------------------------

function validarUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function montarUrlCurta(base, code) {
  if (base.endsWith("/")) {
    base = base.slice(0, -1);
  }
  return `${base}/${code}`;
}

// ------------------------------
// BANCO DE DADOS
// ------------------------------

function createPoolFromEnv() {
  return new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  });
}

async function salvarUrl(pool, code, longUrl) {
  const result = await pool.query(
    "INSERT INTO urls (code, url) VALUES ($1, $2) RETURNING code",
    [code, longUrl]
  );
  return result.rows[0].code;
}

async function buscarOriginal(pool, code) {
  const result = await pool.query(
    "SELECT url FROM urls WHERE code = $1",
    [code]
  );
  return result.rowCount > 0 ? result.rows[0].url : null;
}

// ------------------------------
// APP EXPRESS
// ------------------------------

function createApp(pool) {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.post("/encurtar", async (req, res) => {
    const { longUrl } = req.body;

    if (!validarUrl(longUrl)) {
      return res.status(400).json({ error: "URL inválida" });
    }

    const code = Math.random().toString(36).substring(2, 8);
    const saved = await salvarUrl(pool, code, longUrl);

    const finalUrl = montarUrlCurta(process.env.BASE_URL, saved);
    return res.status(201).json({ shortUrl: finalUrl });
  });

  app.get("/:code", async (req, res) => {
    const original = await buscarOriginal(pool, req.params.code);

    if (!original) {
      return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
    }

    res.redirect(original);
  });

  return app;
}

// ------------------------------
// INICIAR SERVIDOR (APENAS QUANDO RODADO DIRETO)
// ------------------------------

async function startServer() {
  const pool = createPoolFromEnv();

  const app = createApp(pool);
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

// ------------------------------
// EXPORTS PARA TESTES
// ------------------------------

module.exports = {
  validarUrl,
  montarUrlCurta,
  createApp,
  startServer,
  createPoolFromEnv,
};