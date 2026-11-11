# Tasks: Eu vou

> feature: eu-vou

## T-001 — Base de testes e limpeza de código morto [concluida]

- Refs: US-001
- Arquivos: src/setupTests.ts, src/components/Login/Login.tsx, src/components/Login/Login.css, src/styles/App.css
- Notas: `beforeEach(() => localStorage.clear())` e stub de `window.matchMedia` no setup; apagar `Login/` e `App.css` (não importados). Pré-requisito das demais.

## T-002 — Contexto de presenças [concluida]

- Refs: US-001, AC-001, AC-002, AC-003
- Arquivos: src/context/RSVPContext.tsx, src/App.tsx, src/__tests__/RSVPContext.test.tsx
- Notas: `useRSVP()` com `isAttending`, `toggleAttendance`, `confirmedCount`, `confirmedEventIds`; persistência em `bee_social_rsvp`, mesmo padrão do `FavoritesContext`. Depende de T-001.

## T-003 — Indicador de presenças no Header [concluida]

- Refs: US-002, AC-004
- Arquivos: src/components/Header/Header.tsx, src/components/Header/Header.css, src/__tests__/Header.test.tsx
- Notas: depende de T-002. Indicador só informativo, não é link (Q-003).

## T-004 — Botão e selo de presença no Card [concluida]

- Refs: US-003, AC-005, AC-006
- Arquivos: src/components/Card/Card.tsx, src/components/Card/Card.css, src/__tests__/Card.test.tsx
- Notas: botão com `stopPropagation`, como o de favorito. Depende de T-002.

## T-005 — Botão de presença no detalhe do evento [concluida]

- Refs: US-004, AC-007
- Arquivos: src/components/EventDetail/EventDetail.tsx, src/components/EventDetail/EventDetail.css, src/__tests__/EventDetail.test.tsx
- Notas: posicionar junto de "Salvar na Agenda". Depende de T-002.

## T-006 — Filtro "Só confirmados" [pendente]

- Refs: US-005, AC-008, AC-009, AC-010
- Arquivos: src/components/Filters/Filters.tsx, src/components/Filters/Filters.css, src/pages/MainPage.tsx, src/__tests__/Filters.test.tsx, src/__tests__/MainPage.test.tsx
- Notas: depende de T-002 e de ASM-003. Não vai para a URL (Q-001).

## T-007 — Documentação [pendente]

- Refs: US-001
- Arquivos: CLAUDE.md, README.md, TODO.md
- Notas: atualizar arquitetura (novo contexto), componentes, testes e dívidas.
