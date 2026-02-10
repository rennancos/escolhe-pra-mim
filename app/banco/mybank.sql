-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS escolher_pra_mim;
USE escolher_pra_mim;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255), -- Em produção, use hash!
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Configurações do Usuário
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT PRIMARY KEY,
    include_watched_in_draw BOOLEAN DEFAULT FALSE,
    dark_mode BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Conteúdos (Filmes/Séries)
-- Armazena os dados do conteúdo para evitar dependência constante da API externa
CREATE TABLE IF NOT EXISTS contents (
    id INT PRIMARY KEY, -- ID original do TMDB ou fonte de dados
    title VARCHAR(255) NOT NULL,
    type ENUM('movie', 'series') NOT NULL,
    overview TEXT,
    poster_path VARCHAR(255),
    rating DECIMAL(3, 1),
    year INT,
    genres JSON, -- Armazena array de strings: ["Ação", "Comédia"]
    streaming JSON, -- Armazena array de strings: ["Netflix", "Prime Video"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Listas do Usuário (Relacionamento N:N entre Users e Contents)
CREATE TABLE IF NOT EXISTS user_lists (
    user_id INT,
    content_id INT,
    list_type ENUM('watchlist', 'watched') NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, content_id, list_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

-- Inserir um usuário de teste
INSERT INTO users (name, email, password) VALUES ('Usuário Teste', 'teste@exemplo.com', '123456')
ON DUPLICATE KEY UPDATE name=name;

-- Inicializar configurações do usuário de teste
INSERT INTO user_settings (user_id, include_watched_in_draw, dark_mode) 
SELECT id, FALSE, FALSE FROM users WHERE email = 'teste@exemplo.com'
ON DUPLICATE KEY UPDATE user_id=user_id;
