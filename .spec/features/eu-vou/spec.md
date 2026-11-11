# Spec: Eu vou

> feature: eu-vou
> status: rascunho
> fonte: `SPECS-RSVP.md` (raiz do repositório, preservado como pedido original)

## Contexto

Hoje o visitante só consegue favoritar eventos. "Eu vou" deixa ele declarar que vai a um evento, ver quantas presenças confirmou e filtrar a lista para ver só esses eventos, transformando a vitrine numa agenda pessoal.

## Histórias

### US-001 — Confirmar presença e manter entre sessões

Como visitante, quero marcar que vou a um evento, para que minha escolha continue lá quando eu voltar ao site.

#### AC-001 — Confirmar presença registra o evento

- **Dado** um visitante sem nenhuma presença confirmada
- **Quando** confirma presença em um evento
- **Então** o evento passa a constar como "vou" e o total de presenças vira 1

#### AC-002 — Confirmar de novo cancela a presença

- **Dado** um visitante com presença confirmada em um evento
- **Quando** aciona a presença desse mesmo evento outra vez
- **Então** o evento deixa de constar como "vou" e o total volta a 0

#### AC-003 — Presenças sobrevivem a um recarregamento

- **Dado** um visitante que confirmou presença em dois eventos
- **Quando** a aplicação é carregada de novo
- **Então** os dois eventos continuam confirmados (salvos em `localStorage['bee_social_rsvp']`)

### US-002 — Ver o total de presenças no topo

Como visitante, quero ver no topo quantas presenças confirmei, para saber o tamanho da minha agenda.

#### AC-004 — Header mostra o total e atualiza na hora

- **Dado** o topo da página com 0 presenças
- **Quando** o visitante confirma presença em um evento
- **Então** o indicador "✓ Presenças" mostra 1, com rótulo acessível para leitor de tela

### US-003 — Confirmar direto pelo card

Como visitante, quero confirmar presença sem abrir o detalhe do evento, para agir rápido na listagem.

#### AC-005 — Botão do card confirma sem abrir o detalhe

- **Dado** um card de evento na listagem
- **Quando** o visitante clica no botão de presença do card
- **Então** a presença é confirmada e o detalhe do evento não abre

#### AC-006 — Card confirmado mostra o selo "Eu vou"

- **Dado** um evento com presença confirmada
- **Quando** o card é exibido
- **Então** aparece o selo verde "Eu vou" junto dos selos de data, categoria e preço

### US-004 — Confirmar pelo detalhe do evento

Como visitante, quero um botão claro no detalhe do evento, para confirmar ou cancelar a presença enquanto leio as informações.

#### AC-007 — Botão do detalhe alterna entre confirmar e cancelar

- **Dado** o detalhe de um evento sem presença confirmada
- **Quando** o visitante clica em "Confirmar Presença"
- **Então** o botão passa a mostrar "✓ Presença Confirmada (Cancelar)", e um novo clique cancela

### US-005 — Ver só os eventos confirmados

Como visitante, quero filtrar a lista para só os eventos em que vou, para consultar minha agenda.

#### AC-008 — Filtro "Só confirmados" restringe a lista

- **Dado** a lista com eventos confirmados e não confirmados
- **Quando** o visitante ativa o filtro "Só confirmados"
- **Então** só aparecem os eventos confirmados

#### AC-009 — Cancelar presença com o filtro ativo tira o evento da lista

- **Dado** o filtro "Só confirmados" ativo
- **Quando** o visitante cancela a presença de um evento listado
- **Então** o evento some da lista na hora

#### AC-010 — Limpar filtros desliga o "Só confirmados"

- **Dado** o filtro "Só confirmados" ativo
- **Quando** o visitante clica em "Limpar"
- **Então** a lista volta a mostrar todos os eventos da cidade

## Fora de escopo

- Login real, contas ou sincronização entre dispositivos (tudo fica no navegador).
- Contagem de presenças de outras pessoas (não há backend).
- Página dedicada de presenças e filtro na URL (Q-001, Q-002).

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-001 | Presença é independente de favorito: um evento pode estar em um, no outro ou nos dois | aberta | — |
| ASM-002 | Eventos passados também podem receber presença (o mock mistura 2022 e 2026–2027) | aberta | — |
| ASM-003 | O filtro "Só confirmados" faz parte do `FilterState`: conta em `countActiveFilters` e é zerado por "Limpar" | aberta | — |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-001 | O filtro "Só confirmados" deve ir para a URL (`?rsvp=1`), como cidade/categoria/busca? | respondida | Não. O filtro fica só no estado da página (usuário, 2026-11-11). |
| Q-002 | Queremos uma página `/presencas`, como `/favorites`, ou o filtro basta? | respondida | Não. O filtro basta, sem página `/presencas` (usuário, 2026-11-11). |
| Q-003 | O indicador do Header deve ser link (para o filtro ou para a página) ou só informativo? | respondida | Não. O indicador é só informativo (usuário, 2026-11-11). |
