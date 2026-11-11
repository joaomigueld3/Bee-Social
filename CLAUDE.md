# Bee Social — contexto para o Claude

App de descoberta de eventos culturais/musicais no Brasil. **Projeto de portfólio**, 100% frontend (sem backend, sem API). Dados mockados em `src/data/events.ts`. Deploy na Vercel.

## Stack

- React 18 + TypeScript 4.6 + Vite 7 (`@vitejs/plugin-react` v4; exige Node ≥ 20.19)
- React Router v6 (`BrowserRouter`)
- Vitest 4 + Testing Library + jsdom
- CSS puro com variáveis (sem UI lib, sem CSS-in-JS)
- Sem gerenciador de estado externo: só Context API

## Comandos

```bash
npm run dev            # http://localhost:5173
npm test -- --run      # testes (sem watch)
npm run typecheck      # tsc --noEmit (rodar antes de concluir qualquer mudança)
npm run build          # tsc && vite build
npm audit --audit-level=high
npm run spec:audit     # onp-spec audit --ci (specs, provas e constituição)
npm run spec -- <cmd>  # CLI do onp-spec (new, scaffold, verify, status, resumo…)
```

## Qualidade e CI

- `.github/workflows/ci.yml` roda em push para `main`/`develop` e em todo PR: typecheck → testes → build → `npm audit --audit-level=high` → `verify` de cada feature → `spec:audit`. Tudo bloqueia. O `verify` roda no CI porque o `audit` considera a prova obsoleta quando algum arquivo de `src`/testes tem mtime mais novo que o `verify` (um checkout limpo sempre tem); localmente, `git switch`/merge também invalidam a prova: rode `npm run spec -- verify <feature>` antes do `spec:audit`, sem precisar commitar o `.json` de novo.
- `.github/workflows/codeql.yml`: análise estática de segurança (push, PR e semanal). `.github/dependabot.yml`: PRs semanais de dependências para `develop`.
- Skill `.claude/skills/dev-check.md` roda o mesmo localmente e revisa o que a automação não pega.
- Ao concluir uma tarefa que muda comportamento, atualize as seções narrativas deste arquivo (e remova dívidas resolvidas).

## Spec-driven (onp-spec)

Skill em `.claude/skills/onp-spec-driven/` (leia o `SKILL.md` antes de usar). Specs em `.spec/features/<feature>/`, constituição em `.spec/constituicao.md` (P-001 provas, P-002 segredos, P-003 anti-XSS). Config em `onpspec.config.json` (Vitest com `--reporter=tap-flat`).

**Feature nova = spec antes do código.** Ciclo:
1. `npm run spec -- new <feature>` (`--grande` se cruza domínios/contratos) → completar `spec.md` (US/AC Dado/Quando/Então, Suposições, Perguntas) e `tasks.md` (`Refs:`, `Arquivos:`).
2. `npm run spec -- scaffold <feature>` → testes que falham, com `@spec:AC-xxx` no título.
3. Implementar tarefa a tarefa; `npm run spec -- tarefa <feature> T-xxx concluida`.
4. Só fecha com `npm run spec -- verify <feature>` + `npm run spec:audit` saindo 0. Nunca pule/apague teste para passar.
Decisões de produto em aberto (Q-xxx) são perguntadas ao usuário, nunca inventadas.

- Como o CI bloqueia, uma feature em andamento (ACs sem prova, testes do scaffold falhando) **só existe na sua branch** e só vai para `develop` com `verify` + `spec:audit` verdes.
- O `scaffold` gera testes em `test/<feature>.spec.test.js`. Prefira escrever as provas em `src/__tests__/` com Testing Library, mantendo `@spec:AC-xxx` no título.
- O código anterior ao onp-spec está em `ignoreGlobs` no `onpspec.config.json`, para não exigir spec retroativa. Arquivo novo em `src/` precisa estar em `Arquivos:` de alguma tarefa.

## Arquitetura

### Camadas e fluxo de dados

```
main.tsx
└─ App.tsx  ── ThemeProvider > FavoritesProvider > RSVPProvider > BrowserRouter > Routes
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
- `RSVPContext` — "Eu vou": `Set<string>` de ids de eventos com presença confirmada, persistido em `localStorage['bee_social_rsvp']` (JSON array; ignora dado inválido). Independente dos favoritos. API: `confirmedEventIds`, `confirmedCount`, `isAttending(id)`, `toggleAttendance(id)`. Hook: `useRSVP()`. Sem provider, o hook devolve no-ops (os testes antigos de Card/EventDetail seguem sem envolver em `RSVPProvider`).

### Tema (light/dark)

Variáveis CSS em `src/styles/index.css`: `:root` (light) e `[data-theme='dark']`. Use sempre as variáveis (`--bg-page`, `--bg-card`, `--text-primary`, `--text-secondary`, `--border-color`, `--tag-bg`, `--tag-text`, `--skeleton-*`, `--badge-past-*`) em vez de cores fixas. Cor de marca: amarelo `#f2ec54` (`--color-primary`). Cores fixas só onde o dark mode precisa de tratamento explícito (ex.: `[data-theme='dark'] .landingTitleAccent`).

### Modelo de dados (`src/types/index.ts`)

`Event { id, name, link, street, city, state, eventDate ('DD/MM/YYYY'), phone, startTime ('HH:MM'), eventPlace, category: EventCategory, price: EventPrice, imageUrl? }`

- `EventCategory` e `EventPrice` são union types fechados. Novos valores exigem atualizar o tipo **e** as listas `CATEGORIES`/`PRICES` em `Filters.tsx`.
- `src/data/events.ts` exporta arrays por cidade (`recifeEvents`, `saoPauloEvents`, …), mais `standUpEvents` e `metalRockEvents` (espalhados por cidade), e monta `allEventsByCity` (Record cidade → eventos, já mesclando stand-up/metal) e `allEvents` (flat). **Ids são strings únicas** — `'1'` a `'69'` em uso; use o próximo livre.
- 6 cidades: Recife, São Paulo, Rio de Janeiro, Fortaleza, Belo Horizonte, Porto Alegre. A lista `CITIES` (com `'Todas'`) é exportada de `Filters.tsx` e reutilizada na landing.
- Datas de eventos mock misturam 2022 (passados, ativam badge "Passado") e 2026–2027 (futuros). Isso é intencional.

### Filtros (fonte única de verdade)

`FilterState { city, search, category, price, period, onlyConfirmed }` + `INITIAL_FILTERS` em `Filters.tsx`. `MainPage` guarda o estado, escolhe `allEvents` (city `'Todas'`) ou `allEventsByCity[city]` e filtra em `useMemo` (busca por substring case-insensitive no nome, categoria, preço, período via `matchesPeriod`: Tarde < 18h, Noite 18–22h, Madrugada ≥ 22h ou < 6h; `onlyConfirmed` mantém só ids de `useRSVP().confirmedEventIds`). `onlyConfirmed` conta em `countActiveFilters`, é zerado por "Limpar" e **não vai para a URL**. Skeleton de 500 ms ao trocar de cidade.

**Filtros iniciais vêm da URL:** `MainPage` lê `?city=`, `?search=`, `?category=` via `useSearchParams` **apenas na montagem** (initializer do `useState`). A landing usa isso: botões de categoria/cidade e cards do carrossel navegam para `/events?...`. Mudar a URL depois da montagem não atualiza os filtros.

### Componentes principais

- `Card` — card do evento: banner opcional (`imageUrl`), badges (data: Hoje/Em breve/Passado; categoria; preço; selo verde "Eu vou" se confirmado), botão de presença `+`/`✓` e botão de favorito (ambos com `stopPropagation`), animação `fadeInUp` escalonada via `animationDelay: index * 60ms`. Clique abre o modal.
- `EventDetail` — modal (overlay + painel). Fecha com Esc, clique no overlay ou botão; trava scroll do body. Botão "Confirmar Presença" / "✓ Presença Confirmada (Cancelar)" ao lado de "Salvar na Agenda". Gera links: Google Maps (`buildMapsUrl`, sem API key) e Google Agenda (`buildGCalUrl`, evento de 2h a partir de `startTime`, formato `YYYYMMDDTHHmmss`). Todo `target="_blank"` usa `rel="noopener noreferrer"`.
- `Filters` — barra unificada: pills de categoria + busca + selects de cidade/preço/período + botão "✓ Só confirmados" (`aria-pressed`) + contador + "Limpar".
- `Header` — Sair, nav (Eventos / Favoritos com contador / "✓ Presenças" com total, só informativo, `role="status"`), toggle de tema, username.
- `LandingPage` — hero com animações de entrada, toggle de tema, CTA, botões de categoria e cidade, carrossel (marquee CSS infinito) alimentado por `allEvents.filter(e => e.imageUrl)`; o nome do "artista" é `event.name.split(' — ')[0]`. Clicar num card navega para `/events?search=<artista>` (não existe página de artista). Respeita `prefers-reduced-motion`.

## Convenções

- **Idioma:** UI e textos em português (pt-BR). Código/identificadores em inglês.
- **Comentários:** evitar; só onde o porquê não é óbvio.
- **Tipos:** sem `any`. Tipos compartilhados em `src/types`.
- **Simplicidade:** sem abstrações especulativas, sem libs novas sem necessidade (é um portfólio: código legível vale mais).
- **Segurança:** sem `dangerouslySetInnerHTML`/`eval`/`innerHTML`; `rel="noopener noreferrer"` em links externos; nada sensível em `localStorage`.
- **Acessibilidade:** botões reais (`<button>`), `aria-label` em ícones, `role="group"` em grupos de botões.

## Testes (`src/__tests__`, 45 testes)

`Card`, `Filters`, `EventDetail`, `Header`, `MainPage` (só o filtro "Só confirmados"), `FavoritesContext`, `RSVPContext`. Setup em `src/setupTests.ts`: `jest-dom`, stub de `window.matchMedia`, `localStorage.clear()` antes de cada teste e `Storage` em memória quando o Node (22+) expõe um `localStorage` global sem métodos que sombreia o do jsdom. Padrão: envolver em `FavoritesProvider`/`RSVPProvider` quando o componente usa os hooks; `mockEvent` tipado como `Event`. As provas dos ACs do onp-spec ficam aqui, com `@spec:AC-xxx` no título.
**Sem cobertura ainda:** `LandingPage` (`goToEvents` grava flag + querystring; redirect se logado), `MainPage` (`matchesPeriod`/`parseTime`, leitura da URL), `ThemeContext`. Ao mudar comportamento, atualize/adicione testes junto.

Antes de dar algo por concluído: `npx tsc --noEmit` e `npm test -- --run` devem passar.

## Dívidas conhecidas / pendências

1. **Dependências:** `npm audit --audit-level=high` (gate do CI) passa. Restam 2 moderate em `react-router-dom` 6 (open redirect via `\` em `<Link>`/`useNavigate`, GHSA-wrjc-x8rr-h8h6); a correção é a v7 (major), ainda não feita. O app só navega para caminhos fixos, então o risco prático é baixo.
2. **Imagens:** `imageUrl` vem de fontes mistas. Algumas URLs (`encrypted-tbn0.gstatic.com`, Khalid/Rafinha Bastos/Arctic Monkeys) são miniaturas do Google de baixa resolução e ficam borradas no banner; o usuário adiciona URLs manualmente e **quer preservá-las** — não sobrescreva `imageUrl` existentes sem pedir. Alguns hosts podem bloquear hotlink. Unsplash sem autenticação retorna 404; Pexels CDN funciona.
3. **README:** screenshots (`src/assets/print-screen*.png`) são antigas.
4. `Filters.tsx` exporta a constante `CITIES` e o componente; a landing importa dele (acoplamento aceitável, mas poderia ir para `src/data`).

## Fluxo de trabalho com o usuário

- Prefira explicar brevemente o que vai fazer antes de mudanças visuais/grandes.
- O backlog do projeto fica em `TODO.md`. Ao começar uma tarefa, mova o item para "Em andamento"; ao terminar, marque `[x]` e mova para "Feito". Ideias novas que surgirem vão para "Próximos" com prioridade.

### Git flow

**O Claude executa o git** (branch, add, commit, merge, push), seguindo as regras abaixo. Nunca use `--force`, `reset --hard`, `--no-verify` nem `git add .`/`-A` (adicione arquivos por caminho). **Não apague branches remotas nem tags, e não faça merge em `main`, sem pedir confirmação.** Mostre o que foi feito. Se aparecer algo inesperado (alterações não commitadas, conflito), pare e explique antes de agir.

Branches:
- `main` — produção. A Vercel publica daqui. Só recebe merge de `release/*` e `hotfix/*`.
- `develop` — integração. Toda branch de trabalho sai daqui e volta para cá.
- `feature/<nome>` — funcionalidade nova, estilo, testes, docs e manutenção (sai de `develop`).
- `bugfix/<nome>` — correção de algo que ainda não está em produção (sai de `develop`).
- `release/<versão>` — preparação de versão (sai de `develop`, merge em `main` + `develop`, tag `vX.Y.Z`).
- `hotfix/<nome>` — correção urgente em produção (sai de `main`, merge em `main` + `develop`).
- Nomes em inglês, kebab-case (`feature/event-sorting`). Cada item do `TODO.md` = uma branch.

Quando avisar:
1. **Antes de começar uma tarefa:** confira a branch atual (`git branch --show-current`) e o `git status`. Se estiver em `main` ou `develop`, crie a branch certa a partir de `develop` (`git switch -c feature/<nome>`) antes de editar.
2. **A cada unidade lógica concluída** (tipos + testes passando): faça o commit, com `git add` por caminho e mensagem Conventional Commits.
3. **Ao terminar a tarefa** (CI local verde): confirme com o usuário e então `git switch develop` → `git merge --no-ff feature/<nome>` → `git push origin develop` → apagar a branch local.
4. **Quando `develop` tiver um conjunto que vale publicar:** sugira abrir `release/x.y.z`, atualizar README/screenshots se preciso, e fazer merge em `main` com tag.

Mensagens de commit: Conventional Commits em inglês (`feat:`, `fix:`, `style:`, `refactor:`, `test:`, `docs:`, `chore:`), uma linha, no imperativo, sempre em bloco de código. Commits pequenos e temáticos; não misture feature com refactor.
- Existe um skill de projeto em `.claude/skills/dev-check.md` (npm audit + varredura OWASP no código + checagem do `.gitignore` + testes). Skills de projeto podem não ser invocáveis com `/dev-check` no app desktop; nesse caso, execute os passos do arquivo manualmente.
- `dist/` e `.vercel/` estão no `.gitignore`.
