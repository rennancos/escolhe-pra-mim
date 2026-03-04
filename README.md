# 🎬 Escolhe Pra Mim

**Escolhe Pra Mim** é uma aplicação Fullstack desenvolvida para resolver o dilema de "o que assistir hoje?". O sistema ajuda usuários a escolherem filmes e séries com base em seus gostos, oferecendo recomendações aleatórias filtradas por gênero e plataforma de streaming.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Funcionalidades

### 🎯 Principal
*   **Sorteio Inteligente**: Recomendação aleatória de filmes e séries baseada em filtros.
*   **Filtros Avançados**:
    *   **Tipo**: Filmes, Séries ou Ambos.
    *   **Gêneros**: Ação, Comédia, Terror, Drama, Sci-Fi, etc.
    *   **Streaming**: Netflix, Prime Video, Disney+, HBO Max, Globoplay, etc.

### 👤 Usuário
*   **Autenticação Segura**: Cadastro e Login com criptografia de senha e JWT.
*   **Minha Lista (Watchlist)**: Salve títulos para assistir depois.
*   **Histórico (Watched)**: Marque o que você já assistiu para não ser recomendado novamente.

### 🎨 Interface
*   **Design Moderno**: Interface limpa e responsiva construída com Tailwind CSS e Radix UI.
*   **Dark Mode**: Suporte nativo a tema claro e escuro.

---

## 🚀 Tecnologias Utilizadas

### Frontend (`/app`)
*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Linguagem**: TypeScript
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
*   **Componentes**: [Radix UI](https://www.radix-ui.com/) / [Shadcn UI](https://ui.shadcn.com/)
*   **Ícones**: [Lucide React](https://lucide.dev/)
*   **Roteamento**: React Router DOM
*   **Gerenciamento de Estado**: React Context API

### Backend (`/server`)
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express](https://expressjs.com/)
*   **Banco de Dados**: MySQL 8
*   **Driver**: mysql2 (com Connection Pool)
*   **Segurança**:
    *   `bcryptjs`: Hash de senhas.
    *   `jsonwebtoken`: Autenticação via Token.
    *   `helmet`: Headers de segurança HTTP.
    *   `cors`: Controle de acesso de origem cruzada.
    *   `express-rate-limit`: Proteção contra força bruta.

---

## 📂 Estrutura do Projeto

```text
escolhe-pra-mim/
├── app/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/   # Componentes Reutilizáveis (UI e Custom)
│   │   ├── context/      # Estado Global (Auth, Theme, App)
│   │   ├── pages/        # Páginas (Home, Login, Results, etc.)
│   │   ├── services/     # Comunicação com API
│   │   └── types/        # Definições TypeScript
│   └── ...
│
├── server/               # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/       # Configuração de Banco e Env
│   │   ├── controllers/  # Lógica de Negócio
│   │   ├── middlewares/  # Autenticação e Tratamento de Erros
│   │   └── routes/       # Definição de Rotas da API
│   ├── populate_db.js    # Script para popular o banco de dados
│   └── ...
│
└── start_mysql.ps1       # Script auxiliar para iniciar MySQL local
```

---

## 🛠️ Instalação e Configuração

### Pré-requisitos
*   Node.js (v18+)
*   MySQL (v8+)
*   Git

### 1. Configuração do Banco de Dados
Certifique-se de que o serviço MySQL está rodando. Se estiver usando a estrutura local fornecida:

```powershell
.\start_mysql.ps1
```

O banco de dados deve se chamar `escolhe_pra_mim`. As tabelas são criadas automaticamente pelos scripts de migração (se disponíveis) ou via SQL manual (`app/banco/mybank.sql`).

Para popular o banco com dados iniciais:
```bash
cd server
node populate_db.js
```

### 2. Configuração do Backend
```bash
cd server
npm install
```

Crie um arquivo `.env` na pasta `server/` (se não existir):
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=escolhe_pra_mim
JWT_SECRET=seu_segredo_super_seguro
NODE_ENV=development
```

Inicie o servidor:
```bash
npm run dev
```

### 3. Configuração do Frontend
```bash
cd app
npm install
```

Inicie a aplicação:
```bash
npm run dev
```

Acesse em seu navegador: `http://localhost:5173`

---

## 🛣️ Rotas da API

### Auth
*   `POST /api/users` - Registrar novo usuário
*   `POST /api/login` - Login de usuário
*   `GET /api/me` - Obter dados do usuário logado (Requer Token)

### Contents
*   `GET /api/contents` - Listar todos os conteúdos (suporta filtros `?type=movie&genres=Ação`)
*   `GET /api/contents/:id` - Detalhes de um conteúdo específico

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1.  Faça um Fork do projeto
2.  Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`)
3.  Faça o Commit (`git commit -m 'Adicionando nova feature'`)
4.  Faça o Push (`git push origin feature/MinhaFeature`)
5.  Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido por **@rennancos**
