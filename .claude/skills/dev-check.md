---
name: dev-check
description: Verificação completa do projeto (tipos, testes, vulnerabilidades, código, .gitignore) e sincronização do CLAUDE.md
---

## 1. Checagem automática

Rode, na ordem (é o mesmo que o CI em `.github/workflows/ci.yml`):
`npm run typecheck`, `npm test -- --run`, `npm run build`, `npm audit --audit-level=high`, `npm run spec:audit`
(o último aplica a constituição em `.spec/constituicao.md`: segredos e padrões de XSS proibidos).
Confira também o `.gitignore` (`node_modules`, `dist`, `.env`) e `git ls-files | grep -E '\.env|\.pem|\.key'`.

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
Remova dívidas resolvidas; adicione as novas.

## 5. Relatório

Mostre ✅/⚠️/❌ por seção (dependências, código, .gitignore, testes, CLAUDE.md), com ações priorizadas.
Não faça commit: sugira apenas o nome do commit (Conventional Commits, inglês).
