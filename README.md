# 🎲 Escolhe Pra Mim

> **Indeciso hoje? Deixe a sorte decidir!**

**Escolhe Pra Mim** é uma aplicação web moderna desenvolvida para ajudar aquelas pessoas que gastam mais tempo escolhendo o que assistir do que realmente assistindo. Com base em suas preferências de gênero e serviços de streaming, a aplicação sugere aleatoriamente um filme ou série perfeita para o seu momento.

![Project Preview](public/file.svg)

## ✨ Funcionalidades

- **🎯 Recomendações Aleatórias**: Sugestões baseadas em filtros inteligentes.
- **🎬 Filmes e Séries**: Escolha entre longas-metragens ou maratonas de séries.
- **🎭 Filtro por Gênero**: Ação, Comédia, Drama, Terror e muito mais.
- **📺 Filtro por Streaming**: Selecione apenas os serviços que você assina (Netflix, Prime Video, Disney+, etc.).
- **📝 Histórico de Sugestões**: Não perca aquela recomendação legal que passou.
- **🔖 Lista de Salvos**: Salve títulos para assistir depois.
- **🌗 Modo Escuro/Claro**: Interface adaptável à sua preferência.

## 🚀 Tecnologias

Este projeto foi construído com as melhores tecnologias do ecossistema React/Next.js:

- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router e Server Actions.
- **[React 19](https://react.dev/)** - Biblioteca para construção de interfaces.
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utility-first moderna e responsiva.
- **[TMDB API](https://www.themoviedb.org/documentation/api)** - Fonte de dados rica e atualizada sobre filmes e séries.
- **[Lucide React](https://lucide.dev/)** & **[Phosphor Icons](https://phosphoricons.com/)** - Ícones belos e consistentes.

## 📦 Instalação e Uso

### Pré-requisitos

- Node.js 18+ instalado.
- Uma chave de API do [TMDB](https://www.themoviedb.org/).

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/rennancos/escolhe-pra-mim.git
   cd escolhe-pra-mim
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave da API do TMDB:
   ```env
   TMDB_API_KEY=sua_chave_aqui
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse o projeto**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

- `app/`: Páginas e rotas da aplicação (Next.js App Router).
- `components/`: Componentes React reutilizáveis (Header, FilterForm, ResultCard, etc.).
- `services/`: Integração com APIs externas (TMDB).
- `utils/`: Funções utilitárias e Context API.
- `styles/`: Arquivos CSS globais e configurações de tema.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.
