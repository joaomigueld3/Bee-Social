# TODO — Bee Social

Legenda: `[ ]` a fazer · `[x]` feito · prioridade **P1** (fazer já) / **P2** (próxima) / **P3** (algum dia).
Cada item = **uma branch** saindo de `develop` (git flow: `feature/…`, `bugfix/…`; urgência em produção: `hotfix/…` saindo de `main`).
Fluxo: mova o item para "Em andamento" ao começar e para "Feito" ao fazer o merge em `develop`.

## Em andamento
- [ ] (nada em andamento)

## Próximos (ordenados)

### Setup
- [ ] **P1** Commitar a automação (`CLAUDE.md`, `TODO.md`, `scripts/`, `.githooks/`, `.claude/`, `package.json`) em `main`, criar `develop` a partir dela e ativar o pre-commit (`git config core.hooksPath .githooks`)

### Manutenção
- [ ] **P1** `feature/audit-fix` — rodar `npm audit fix` (2 critical + 1 high, só dev) e conferir testes/build
- [ ] **P1** `feature/remove-dead-code` — apagar `src/components/Login/` e `src/styles/App.css` (não usados)
- [ ] **P2** `feature/refresh-screenshots` — screenshots do README estão antigas (landing, filtros, modal, dark mode)

### Qualidade
- [ ] **P2** `feature/landing-mainpage-tests` — testes de `LandingPage` (`goToEvents`, redirect se logado) e `MainPage` (`matchesPeriod`, filtros via URL)
- [ ] **P3** `feature/theme-header-tests` — testes de `ThemeContext` e `Header`
- [ ] **P2** `bugfix/event-images` — trocar as 7 miniaturas do Google (`encrypted-tbn0…`) por imagens de resolução real (não sobrescrever as do usuário sem pedir)

### Funcionalidades (ideias)
- [ ] **P3** `feature/event-sorting` — ordenação (data, preço) e "ocultar eventos passados"
- [ ] **P3** `feature/url-filters-sync` — sincronizar filtros com a URL depois da montagem (hoje só lê na montagem)
- [ ] **P3** `feature/artist-page` — página de artista (hoje o carrossel só filtra por `?search=`)
- [ ] **P3** `feature/share-ics` — compartilhar evento (Web Share API) e baixar `.ics`
- [ ] **P3** `feature/seo-meta` — meta tags/Open Graph, favicon, domínio próprio

## Feito
- [x] Roteamento, dark mode, favoritos, busca, skeleton, modal, animações
- [x] Filtros unificados (categoria, cidade, preço, período, busca)
- [x] Banner de imagem, Google Maps, Google Agenda
- [x] Landing page (animações, carrossel clicável, botões de categoria/cidade)
- [x] Testes: Card, Filters, EventDetail, FavoritesContext (26)
- [x] Automação: `project-check`, hook Stop, pre-commit, `CLAUDE.md`
