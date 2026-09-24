---
name: dev-check
description: Verificação completa do projeto (tipos, testes, vulnerabilidades, código, .gitignore) e sincronização do CLAUDE.md
---

## 1. Checagem automática

Rode `npm run check` (chama `scripts/project-check.mjs --full`). Ele executa:
`tsc`, `vitest`, `npm audit`, checagem do `.gitignore`, arquivos sensíveis versionados,
varredura de padrões XSS/injeção em `src/` e detecção de arquivos não usados, e regenera o bloco AUTO do `CLAUDE.md`.

## 2. Análise que o script não faz (leia o código)

- `target="_blank"` sem `rel="noopener noreferrer"`
- `localStorage` guardando algo além de `username`, `theme`, `favorites`
- Interpolação de input do usuário em URLs/HTML; links externos vindos de dados sem validação
- Dependências desnecessárias ou imports mortos
- Componentes/funções novos sem teste correspondente em `src/__tests__/`

## 3. Testes

Para cada teste falhando: leia teste e código, decida se o erro é do teste (mock/asserção desatualizados) ou do código, e corrija o lado certo.
Para código novo sem cobertura, escreva os testes seguindo o padrão dos existentes (Testing Library, `FavoritesProvider` quando necessário).

## 4. CLAUDE.md

Compare as seções narrativas (Arquitetura, Componentes, Testes, Dívidas conhecidas) com o código atual e corrija o que divergiu.
Remova dívidas resolvidas; adicione as novas. Não edite o bloco AUTO.

## 5. Relatório

Mostre ✅/⚠️/❌ por seção (dependências, código, .gitignore, testes, CLAUDE.md), com ações priorizadas.
Não faça commit: sugira apenas o nome do commit (Conventional Commits, inglês).
