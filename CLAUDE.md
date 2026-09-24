# Bee Social — contexto para o Claude

App de descoberta de eventos culturais/musicais no Brasil. **Projeto de portfólio**, 100% frontend (sem backend, sem API). Dados mockados em `src/data/events.ts`. Deploy na Vercel.

## Stack

- React 18 + TypeScript 4.6 + Vite 5 (`@vitejs/plugin-react` v4)
- React Router v6 (`BrowserRouter`)
- Vitest + Testing Library + jsdom
- CSS puro com variáveis (sem UI lib, sem CSS-in-JS)
- Sem gerenciador de estado externo: só Context API

## Comandos

```bash
npm run dev            # http://localhost:5173
npm test -- --run      # testes (sem watch)
npx tsc --noEmit       # checagem de tipos (rodar antes de concluir qualquer mudança)
npm run build          # tsc && vite build
npm run check          # tipos + testes + npm audit + .gitignore + varredura XSS + arquivos não usados
npm run docs:sync      # regenera o bloco AUTO deste arquivo (sem rodar testes)
```

## Manutenção automática deste arquivo

- O bloco entre `AUTO:START` e `AUTO:END` (no fim) é **gerado** por `scripts/project-check.mjs` — nunca edite à mão. Contém contagem de eventos/testes, scripts npm, árvore de arquivos e arquivos possivelmente não usados.
- **Hook Stop** (`.claude/settings.json`): ao fim de cada resposta, se `src/` ou `package.json` mudaram, roda `tsc` + `vitest` e resincroniza o bloco. Se a estrutura mudou (arquivo criado/removido, teste novo, script novo), o hook bloqueia com exit 2 e pede que você **revise as seções narrativas** (Arquitetura, Componentes, Testes, Dívidas). Faça isso e termine; na segunda passada o hook não bloqueia de novo.
- **Git hook** (opcional, o usuário ativa com `git config core.hooksPath .githooks`): `.githooks/pre-commit` recusa o commit se `CLAUDE.md` estiver desatualizado, ou se tipos/testes falharem.
- Ao concluir uma tarefa que muda comportamento, atualize as seções narrativas relevantes (e a lista de dívidas: remova o que foi resolvido).

## Arquitetura

### Camadas e fluxo de dados

```
main.tsx
└─ App.tsx  ── ThemeProvider > FavoritesProvider > BrowserRouter > Routes
     ├─ /            LandingPage      (pública; se já "logado", redireciona p/ /events)
     ├─ /events      PrivateRoute > MainPage
     ├─ /favorites   PrivateRoute > FavoritesPage
     └─ *            Navigate to "/"
```

- **Pages** (`src/pages`) orquestram estado e composição. **Components** (`src/components`) são de apresentação, recebem props. **Context** (`src/context`) guarda estado global. **Data** (`src/data`) é a fonte de verdade dos eventos. **Types** (`src/types`) tem os tipos compartilhados.
- Cada componente tem seu `.css` ao lado, importado no próprio `.tsx`. CSS de página em `src/styles/` (`MainPage.css`, reaproveitado por `FavoritesPage`) ou ao lado da página (`LandingPage.css`).

### "Autenticação" (fake, de propósito)

Não existe login real. `localStorage['username']` é apenas uma flag: a `LandingPage` grava `'visitante'` ao clicar em qualquer CTA/botão e navega para `/events`. `PrivateRoute` (em `App.tsx`) só checa se a flag existe. `Header` faz logout removendo a flag. Serve para demonstrar o padrão de rota protegida sem atrito para quem avalia o portfólio. **Não trate como segurança.**

### Estado global (Context)

- `ThemeContext` — `theme: 'light' | 'dark'`. Inicia por `localStorage['theme']`, senão `prefers-color-scheme`. Aplica `data-theme` em `document.documentElement` e persiste. Hook: `useTheme()`.
- `FavoritesContext` — `Set<string>` de ids de evento, persistido em `localStorage['favorites']` (JSON array). API: `favorites`, `toggle(id)`, `isFavorite(id)`. Hook: `useFavorites()`.

### Tema (light/dark)

Variáveis CSS em `src/styles/index.css`: `:root` (light) e `[data-theme='dark']`. Use sempre as variáveis (`--bg-page`, `--bg-card`, `--text-primary`, `--text-secondary`, `--border-color`, `--tag-bg`, `--tag-text`, `--skeleton-*`, `--badge-past-*`) em vez de cores fixas. Cor de marca: amarelo `#f2ec54` (`--color-primary`). Cores fixas só onde o dark mode precisa de tratamento explícito (ex.: `[data-theme='dark'] .landingTitleAccent`).

### Modelo de dados (`src/types/index.ts`)

`Event { id, name, link, street, city, state, eventDate ('DD/MM/YYYY'), phone, startTime ('HH:MM'), eventPlace, category: EventCategory, price: EventPrice, imageUrl? }`

- `EventCategory` e `EventPrice` são union types fechados. Novos valores exigem atualizar o tipo **e** as listas `CATEGORIES`/`PRICES` em `Filters.tsx`.
- `src/data/events.ts` exporta arrays por cidade (`recifeEvents`, `saoPauloEvents`, …), mais `standUpEvents` e `metalRockEvents` (espalhados por cidade), e monta `allEventsByCity` (Record cidade → eventos, já mesclando stand-up/metal) e `allEvents` (flat). **Ids são strings únicas** — `'1'` a `'69'` em uso; use o próximo livre.
- 6 cidades: Recife, São Paulo, Rio de Janeiro, Fortaleza, Belo Horizonte, Porto Alegre. A lista `CITIES` (com `'Todas'`) é exportada de `Filters.tsx` e reutilizada na landing.
- Datas de eventos mock misturam 2022 (passados, ativam badge "Passado") e 2026–2027 (futuros). Isso é intencional.

### Filtros (fonte única de verdade)

`FilterState { city, search, category, price, period }` + `INITIAL_FILTERS` em `Filters.tsx`. `MainPage` guarda o estado, escolhe `allEvents` (city `'Todas'`) ou `allEventsByCity[city]` e filtra em `useMemo` (busca por substring case-insensitive no nome, categoria, preço, período via `matchesPeriod`: Tarde < 18h, Noite 18–22h, Madrugada ≥ 22h ou < 6h). Skeleton de 500 ms ao trocar de cidade.

**Filtros iniciais vêm da URL:** `MainPage` lê `?city=`, `?search=`, `?category=` via `useSearchParams` **apenas na montagem** (initializer do `useState`). A landing usa isso: botões de categoria/cidade e cards do carrossel navegam para `/events?...`. Mudar a URL depois da montagem não atualiza os filtros.

### Componentes principais

- `Card` — card do evento: banner opcional (`imageUrl`), badges (data: Hoje/Em breve/Passado; categoria; preço), botão de favorito (`stopPropagation`), animação `fadeInUp` escalonada via `animationDelay: index * 60ms`. Clique abre o modal.
- `EventDetail` — modal (overlay + painel). Fecha com Esc, clique no overlay ou botão; trava scroll do body. Gera links: Google Maps (`buildMapsUrl`, sem API key) e Google Agenda (`buildGCalUrl`, evento de 2h a partir de `startTime`, formato `YYYYMMDDTHHmmss`). Todo `target="_blank"` usa `rel="noopener noreferrer"`.
- `Filters` — barra unificada: pills de categoria + busca + selects de cidade/preço/período + contador + "Limpar".
- `Header` — Sair, nav (Eventos / Favoritos com contador), toggle de tema, username.
- `LandingPage` — hero com animações de entrada, toggle de tema, CTA, botões de categoria e cidade, carrossel (marquee CSS infinito) alimentado por `allEvents.filter(e => e.imageUrl)`; o nome do "artista" é `event.name.split(' — ')[0]`. Clicar num card navega para `/events?search=<artista>` (não existe página de artista). Respeita `prefers-reduced-motion`.

## Convenções

- **Idioma:** UI e textos em português (pt-BR). Código/identificadores em inglês.
- **Comentários:** evitar; só onde o porquê não é óbvio.
- **Tipos:** sem `any`. Tipos compartilhados em `src/types`.
- **Simplicidade:** sem abstrações especulativas, sem libs novas sem necessidade (é um portfólio: código legível vale mais).
- **Segurança:** sem `dangerouslySetInnerHTML`/`eval`/`innerHTML`; `rel="noopener noreferrer"` em links externos; nada sensível em `localStorage`.
- **Acessibilidade:** botões reais (`<button>`), `aria-label` em ícones, `role="group"` em grupos de botões.

## Testes (`src/__tests__`, 26 testes)

`Card`, `Filters`, `EventDetail`, `FavoritesContext`. Setup em `src/setupTests.ts` (`jest-dom`). Padrão: envolver em `FavoritesProvider` quando o componente usa `useFavorites`; `mockEvent` tipado como `Event`.
**Sem cobertura ainda:** `LandingPage` (`goToEvents` grava flag + querystring; redirect se logado), `MainPage` (`matchesPeriod`/`parseTime`, leitura da URL), `ThemeContext`, `Header`. Ao mudar comportamento, atualize/adicione testes junto.

Antes de dar algo por concluído: `npx tsc --noEmit` e `npm test -- --run` devem passar.

## Dívidas conhecidas / pendências

1. **Código morto:** `src/components/Login/` (Login.tsx/css) e `src/styles/App.css` não são mais importados por nada — podem ser removidos.
2. **Dependências:** `npm audit` reporta 7 vulns (3 critical/high em `vite`, `vitest`, `form-data`), todas só de dev/build — não afetam o bundle de produção. `npm audit fix` resolve sem breaking changes.
3. **Imagens:** `imageUrl` vem de fontes mistas. Algumas URLs (`encrypted-tbn0.gstatic.com`, Khalid/Rafinha Bastos/Arctic Monkeys) são miniaturas do Google de baixa resolução e ficam borradas no banner; o usuário adiciona URLs manualmente e **quer preservá-las** — não sobrescreva `imageUrl` existentes sem pedir. Alguns hosts podem bloquear hotlink. Unsplash sem autenticação retorna 404; Pexels CDN funciona.
4. **README:** screenshots (`src/assets/print-screen*.png`) são antigas.
5. `Filters.tsx` exporta a constante `CITIES` e o componente; a landing importa dele (acoplamento aceitável, mas poderia ir para `src/data`).

## Fluxo de trabalho com o usuário

- Prefira explicar brevemente o que vai fazer antes de mudanças visuais/grandes.
- O backlog do projeto fica em `TODO.md`. Ao começar uma tarefa, mova o item para "Em andamento"; ao terminar, marque `[x]` e mova para "Feito". Ideias novas que surgirem vão para "Próximos" com prioridade.

### Git flow (commits manuais)

**O usuário faz todas as operações de git manualmente.** Nunca rode `git commit`, `git push`, `git merge`, `git checkout`/`switch` ou `git branch`. Seu papel é **avisar** o que fazer e em que momento, com os comandos prontos em blocos `bash` (um comando por bloco).

Branches:
- `main` — produção. A Vercel publica daqui. Só recebe merge de `release/*` e `hotfix/*`.
- `develop` — integração. Toda branch de trabalho sai daqui e volta para cá.
- `feature/<nome>` — funcionalidade nova, estilo, testes, docs e manutenção (sai de `develop`).
- `bugfix/<nome>` — correção de algo que ainda não está em produção (sai de `develop`).
- `release/<versão>` — preparação de versão (sai de `develop`, merge em `main` + `develop`, tag `vX.Y.Z`).
- `hotfix/<nome>` — correção urgente em produção (sai de `main`, merge em `main` + `develop`).
- Nomes em inglês, kebab-case (`feature/event-sorting`). Cada item do `TODO.md` = uma branch.

Quando avisar:
1. **Antes de começar uma tarefa:** confira a branch atual (`git branch --show-current`). Se estiver em `main` ou `develop`, **pare e peça** para o usuário criar a branch certa antes de editar, com o comando (ex.: `git switch develop` e depois `git switch -c feature/event-sorting`).
2. **A cada unidade lógica concluída** (tipos + testes passando): avise que é um bom ponto de commit. Liste os arquivos a adicionar (`git add` com caminhos específicos, nunca `git add .`) e a mensagem.
3. **Ao terminar a tarefa:** passe o roteiro de fechamento: último commit → `git switch develop` → `git merge --no-ff feature/<nome>` → `git push origin develop` → apagar a branch local.
4. **Quando `develop` tiver um conjunto que vale publicar:** sugira abrir `release/x.y.z`, atualizar README/screenshots se preciso, e fazer merge em `main` com tag.

Mensagens de commit: Conventional Commits em inglês (`feat:`, `fix:`, `style:`, `refactor:`, `test:`, `docs:`, `chore:`), uma linha, no imperativo, sempre em bloco de código. Commits pequenos e temáticos; não misture feature com refactor.
- Existe um skill de projeto em `.claude/skills/dev-check.md` (npm audit + varredura OWASP no código + checagem do `.gitignore` + testes). Skills de projeto podem não ser invocáveis com `/dev-check` no app desktop; nesse caso, execute os passos do arquivo manualmente.
- `dist/` e `.vercel/` estão no `.gitignore`.

<!-- AUTO:START (gerado por scripts/project-check.mjs — não edite à mão) -->
<!-- structure-hash: c1aff87324 -->
## Snapshot automático

- **Eventos mock:** 69 (23 com `imageUrl`, 7 são miniaturas do Google)
- **Testes:** 26 em 4 arquivos — Card.test.tsx (5), EventDetail.test.tsx (9), FavoritesContext.test.tsx (3), Filters.test.tsx (9)
- **Scripts npm:** `dev`, `build`, `preview`, `test`, `test:ui`, `docs:sync`, `check`
- **Arquivos possivelmente não usados:** `src/components/Login/Login.tsx`, `src/styles/App.css`

```
src/App.tsx
src/__tests__/Card.test.tsx
src/__tests__/EventDetail.test.tsx
src/__tests__/FavoritesContext.test.tsx
src/__tests__/Filters.test.tsx
src/components/Card/Card.tsx
src/components/Card/Skeleton.tsx
src/components/Card/TagItem.tsx
src/components/EventDetail/EventDetail.tsx
src/components/Filters/Filters.tsx
src/components/Header/Header.tsx
src/components/Login/Login.tsx
src/context/FavoritesContext.tsx
src/context/ThemeContext.tsx
src/data/events.ts
src/main.tsx
src/pages/FavoritesPage.tsx
src/pages/LandingPage.tsx
src/pages/MainPage.tsx
src/setupTests.ts
src/types/index.ts
src/vite-env.d.ts
```
<!-- AUTO:END -->
