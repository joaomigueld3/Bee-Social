---
name: dev-check
description: Verifica vulnerabilidades de dependências e do código, testa o .gitignore e atualiza os testes
model: claude-sonnet-4-6
---

## 1. Vulnerabilidades de dependências

Rode `npm audit --json` e liste vulnerabilidades com severity `critical` ou `high`.  
Se houver, sugira `npm audit fix` (ou `npm audit fix --force` para breaking changes, com aviso).

## 2. Vulnerabilidades no código (OWASP Top 10)

Analise os arquivos em `src/` buscando os seguintes padrões — confirme se são reais antes de reportar:

- **XSS**: uso de `dangerouslySetInnerHTML`, `innerHTML`, `document.write`, `eval()`, interpolação de input do usuário em HTML
- **Injeção**: template literals com dados externos enviados para `fetch`, `eval`, `new Function()`
- **Exposição de dados sensíveis**: `console.log` com tokens, senhas, dados pessoais; `localStorage` guardando mais do que o necessário (ex: tokens de sessão reais)
- **Autenticação fraca**: verificações de auth apenas no frontend sem validação real (anote mas não considere crítico para app de portfolio)
- **Dependências desnecessariamente permissivas**: imports de `*` ou `require()` dinâmico com variável externa
- **URLs hardcoded** com credenciais ou endpoints privados

Para cada problema encontrado, indique: arquivo, linha, severidade (alta/média/baixa) e sugestão de correção.

## 3. Verificação do .gitignore

Leia o arquivo `.gitignore` do projeto e verifique se estão incluídas as seguintes entradas essenciais:

```
node_modules/
dist/
.env
.env.local
.env.*.local
*.local
.DS_Store
Thumbs.db
coverage/
*.log
```

Verifique também se há arquivos sensíveis já rastreados pelo git que deveriam estar no `.gitignore`:

```bash
git ls-files | grep -E '\.(env|key|pem|secret|token)' 
git ls-files | grep -E '^\.env'
```

Se encontrar lacunas, sugira as linhas a adicionar.

## 4. Testes

Rode `npm test -- --run` e capture a saída.  
Para cada teste falhando:
1. Leia o arquivo de teste correspondente em `src/__tests__/`
2. Leia o componente ou contexto testado
3. Identifique se a falha é no teste (mock desatualizado, asserção errada) ou no código
4. Aplique a correção no arquivo correto

## 5. Resumo final

Apresente um relatório com:
- ✅ / ⚠️ / ❌ para cada seção (dependências, código, .gitignore, testes)
- Lista priorizada de ações (crítico → médio → baixo)
