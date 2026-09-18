# Bee Social 🐝

Plataforma de descoberta de eventos musicais por cidade — projeto de portfólio construído com React, TypeScript e Vite.

## Screenshots 🖥️

![Screen One](./src/assets/print-screen1.png?raw=true)
![Screen Two](./src/assets/print-screen2.png?raw=true)

## Funcionalidades ✨

- **Listagem por cidade** — Recife, São Paulo e Rio de Janeiro
- **Busca em tempo real** — filtro por nome do evento
- **Dark mode** — detecta preferência do sistema, persistido no localStorage
- **Favoritar eventos** — salvo entre sessões via localStorage
- **Página de favoritos** — `/favorites` com todos os eventos salvos
- **Modal de detalhes** — clique no card para ver todas as informações; fechar com `Esc` ou clique fora
- **Badge de data** — indica `Hoje`, `Em breve` ou `Passado` em cada card
- **Skeleton loading** — animação de carregamento ao trocar de cidade
- **Roteamento** — URLs amigáveis com React Router (`/events?city=...`, `/favorites`)

## Tecnologias 🛠️

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 5](https://vitejs.dev/) — build tool
- [React Router v6](https://reactrouter.com/) — navegação client-side
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — testes unitários
- CSS puro com variáveis de tema (sem UI library)

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
├── __tests__/          # testes unitários
├── assets/             # ícones e imagens
├── components/
│   ├── Card/           # card de evento, skeleton, tags
│   ├── EventDetail/    # modal de detalhes
│   ├── Header/         # navegação e controles globais
│   ├── Login/          # formulário de login
│   └── SearchBar/      # busca por nome
├── context/
│   ├── FavoritesContext.tsx
│   └── ThemeContext.tsx
├── data/
│   └── events.ts       # dados dos eventos
├── pages/
│   ├── MainPage.tsx
│   └── FavoritesPage.tsx
├── styles/             # CSS global e variáveis de tema
└── types/
    └── index.ts        # tipos compartilhados
```
