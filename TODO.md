# TODO — Bee Social

Legenda: `[ ]` a fazer · `[x]` feito · prioridade **P1** (fazer já) / **P2** (próxima) / **P3** (algum dia).
Cada item = **uma branch** saindo de `develop` (git flow: `feature/…`, `bugfix/…`; urgência em produção: `hotfix/…` saindo de `main`).
Feature nova passa pelo onp-spec (spec → scaffold → implementação → `verify` + `spec:audit`); a spec é commitada na própria branch da feature.
Fluxo: mova o item para "Em andamento" ao começar e para "Feito" ao fazer o merge em `develop`.

## Em andamento
- Nenhuma tarefa em andamento.

## Próximos (ordenados)

### Manutenção
- [ ] **P2** `feature/refresh-screenshots` — screenshots do README estão antigas (landing, filtros, modal, dark mode)

### Funcionalidades
- [ ] **P3** `feature/event-sorting` — ordenação (data, preço) e "ocultar eventos passados"
- [ ] **P3** `feature/url-filters-sync` — sincronizar filtros com a URL depois da montagem (hoje só lê na montagem)
- [ ] **P3** `feature/artist-page` — página de artista (hoje o carrossel só filtra por `?search=`)
- [ ] **P3** `feature/share-ics` — compartilhar evento (Web Share API) e baixar `.ics`
- [ ] **P3** `feature/seo-meta` — meta tags/Open Graph, favicon, domínio próprio

### Qualidade
- [ ] **P2** `feature/react-router-7` — subir `react-router-dom` 6 → 7 (2 moderate no `npm audit`; checar compatibilidade com TypeScript 4.6)
- [ ] **P2** `feature/landing-mainpage-tests` — testes de `LandingPage` (`goToEvents`, redirect se logado) e `MainPage` (`matchesPeriod`, filtros via URL)
- [ ] **P3** `feature/theme-header-tests` — testes de `ThemeContext` e `Header` (o do Header já veio com o RSVP)
- [ ] **P2** `bugfix/event-images` — trocar as 7 miniaturas do Google (`encrypted-tbn0…`) por imagens de resolução real (não sobrescrever as do usuário sem pedir)
- [ ] **P3** Trazer o código legado para o onp-spec aos poucos (hoje listado em `ignoreGlobs` do `onpspec.config.json`)

## Feito
- [x] Roteamento, dark mode, favoritos, busca, skeleton, modal, animações
- [x] Filtros unificados (categoria, cidade, preço, período, busca)
- [x] Banner de imagem, Google Maps, Google Agenda
- [x] Landing page (animações, carrossel clicável, botões de categoria/cidade)
- [x] Testes: Card, Filters, EventDetail, FavoritesContext (26)
- [x] `CLAUDE.md` e git flow; `develop` criada
- [x] onp-spec + Vitest, constituição (P-002/P-003), CI, CodeQL e Dependabot (`feature/onp-spec-ci`)
- [x] Spec do RSVP (`.spec/features/eu-vou/`)
- [x] Eu vou / RSVP: presença por card e detalhe, total no Header, filtro "Só confirmados"; 45 testes, 10/10 ACs provados (`feature/rsvp`)
- [x] `feature/audit-fix`: `npm audit fix` + Vite 5→7 e Vitest 1→4 (gate `--audit-level=high` verde)
