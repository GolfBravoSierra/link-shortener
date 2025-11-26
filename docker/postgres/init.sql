-- Inicialização do banco usada pelo entrypoint do Postgres
-- Cria tabela `links` se ainda não existir

CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
