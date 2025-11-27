const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");
const { generateShortCode } = require("./generateShortCode");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

app.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL é obrigatória" });
    }

    const code = generateShortCode();

    await pool.query(
      "INSERT INTO urls (code, original_url) VALUES ($1, $2)",
      [code, url]
    );

    res.json({
      original: url,
      short: `http://localhost:3000/${code}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;

    const result = await pool.query(
      "SELECT original_url FROM urls WHERE code = $1",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("URL não encontrada");
    }

    await pool.query(
      "UPDATE urls SET clicks = clicks + 1 WHERE code = $1",
      [code]
    );

    res.redirect(result.rows[0].original_url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno");
  }
});

app.get("/stats/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "SELECT * FROM urls WHERE code = $1",
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Código não existe" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
