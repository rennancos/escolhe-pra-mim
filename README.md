# Escolhe Pra Mim

Indeciso e já perdeu mais tempo escolhendo do que assistindo?
O **Escolhe Pra Mim** nasceu justamente pra resolver isso.

A ideia é simples: você diz o que está com vontade de ver (filme ou série), escolhe alguns gêneros e os streamings que você assina — e a aplicação faz o resto, trazendo uma sugestão aleatória pra você só apertar o play.

<img width="1172" height="647" alt="image" src="https://github.com/user-attachments/assets/ba1d7865-c54a-42d1-bf02-bb256786b92a" />

---

## O que dá pra fazer

* Receber **sugestões aleatórias** com base nos filtros escolhidos
* Escolher entre **filmes ou séries**
* Filtrar por **gêneros** (ação, comédia, drama, terror, etc.)
* Filtrar por **serviços de streaming** que você realmente usa
* Consultar um **histórico** das sugestões já feitas
* **Salvar** títulos pra ver depois
* Alternar entre **modo claro e escuro**

---

## Tecnologias usadas

O projeto foi desenvolvido com foco em organização, performance e uma boa experiência de uso:

* **Next.js 16** – App Router e Server Actions
* **React 19**
* **Tailwind CSS** – estilização simples e responsiva
* **TMDB API** – dados de filmes e séries
* **Lucide React** e **Phosphor Icons** – ícones

---

## Como rodar o projeto

### Pré-requisitos

* Node.js 18 ou superior
* Chave de API do TMDB

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/rennancos/escolhe-pra-mim.git
   cd escolhe-pra-mim
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env.local` na raiz do projeto e adicione sua chave do TMDB:

   ```env
   TMDB_API_KEY=sua_chave_aqui
   ```

4. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse no navegador:

   ```
   http://localhost:3000
   ```

---

## Estrutura do projeto

* `app/` – rotas e páginas (App Router)
* `components/` – componentes reutilizáveis
* `services/` – integração com a API do TMDB
* `utils/` – funções auxiliares e contextos
* `styles/` – estilos globais e tema

---

## Contribuições

Se quiser contribuir, fique à vontade para abrir uma issue ou mandar um pull request.
Sugestões e melhorias são sempre bem-vindas.

