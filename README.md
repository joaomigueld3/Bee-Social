# Bee Social 🐝

Plataforma de descoberta de eventos musicais por cidade — projeto construído com React, TypeScript e Vite.

## Screenshots 🖥️

![Screen One](./src/assets/print-screen1.png?raw=true)
![Screen Two](./src/assets/print-screen2.png?raw=true)

## Funcionalidades ✨

- **Listagem de eventos** — 70+ eventos em 6 cidades (Recife, São Paulo, Rio de Janeiro, Fortaleza, Belo Horizonte e Porto Alegre)
- **Filtros combinados** — categoria (pills), cidade, preço, período do dia e busca por nome, tudo em uma barra unificada
- **Banner de imagem** — eventos com imagem exibem banner no card e no modal
- **Modal de detalhes** — informações completas, fechar com `Esc` ou clique fora
- **Google Maps** — endereço clicável e botão "Ver no Maps" no modal
- **Google Agenda** — botão "Salvar na Agenda" pré-preenche nome, data, horário e local
- **Dark mode** — detecta preferência do sistema, persistido no localStorage
- **Favoritar eventos** — salvo entre sessões via localStorage; página `/favorites` dedicada
- **Badge de data** — indica `Hoje`, `Em breve` ou `Passado` em cada card
- **Badges de categoria e preço** — exibidos diretamente no card
- **Skeleton loading** — animação ao trocar de cidade
- **Animações escalonadas** — cards entram com `fadeInUp` em cascata
- **Roteamento** — React Router com rotas protegidas (`/events`, `/favorites`)
- **Testes unitários** — 26 testes cobrindo Card, Filters, EventDetail e FavoritesContext

## Tecnologias 🛠️

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 5](https://vitejs.dev/) — build tool
- [React Router v6](https://reactrouter.com/) — navegação client-side
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — testes unitários
- CSS puro com variáveis de tema

## Rodando localmente ⚙️

```bash
# instalar dependências
npm install

# iniciar servidor de desenvolvimento
npm run dev
```

Acessa em `http://localhost:5173`

```bash
npm test          # rodar os testes
npm run build     # build de produção
npm run preview   # visualizar o build localmente
```

## Deploy (Vercel) 🚀

O projeto inclui `vercel.json` com rewrites configurados para o React Router funcionar corretamente. Basta importar o repositório no [vercel.com](https://vercel.com) — o framework é detectado automaticamente como Vite.

## Estrutura do projeto 📁

```
src/
├── __tests__/          # testes unitários (Card, SearchBar, FavoritesContext)
├── assets/             # ícones e imagens estáticas
├── components/
│   ├── Card/           # card de evento, skeleton, tags
│   ├── EventDetail/    # modal de detalhes (Maps, Agenda, ingresso)
│   ├── Filters/        # barra de filtros unificada
│   ├── Header/         # navegação, dark mode e logout
│   └── Login/          # formulário de login
├── context/
│   ├── FavoritesContext.tsx
│   └── ThemeContext.tsx
├── data/
│   └── events.ts       # 70+ eventos com categoria, preço e imagem
├── pages/
│   ├── MainPage.tsx
│   └── FavoritesPage.tsx
├── styles/             # CSS global e variáveis de tema (light/dark)
└── types/
    └── index.ts        # tipos compartilhados (Event, EventCategory, EventPrice)
```
