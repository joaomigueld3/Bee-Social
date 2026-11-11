# Especificação Técnica: Feature "Eu Vou" (RSVP & Presença) — Bee Social

Documento de especificação técnica e guia de implementação para a funcionalidade de Confirmação de Presença (RSVP) no **Bee Social**.

---

## 1. Visão Geral & Proposta de Valor

O **Bee Social** é uma plataforma de descoberta e agenda cultural de eventos por cidade. 
Atualmente, o usuário pode apenas "Favoritar" eventos. A funcionalidade **"Eu Vou" (RSVP)** complementa isso transformando a vitrine em uma **agenda ativa**, permitindo que o usuário declare intenção real de ir ao evento, visualize seu total de presenças confirmadas no Header e filtre a grade principal para ver somente seus eventos confirmados.

---

## 2. Requisitos Funcionais

### 2.1. Gerenciamento de Estado (`RSVPContext`)
* **Contexto Global:** Criar `src/context/RSVPContext.tsx` e o hook consumidor `useRSVP()`.
* **Estado Reativo:**
  * Armazenar a lista de IDs de eventos confirmados (`Set<string>` internamente ou `string[]`).
  * `isAttending(eventId: string): boolean`
  * `toggleAttendance(eventId: string): void`
  * `confirmedCount: number` (total de eventos com presença marcada)
  * `confirmedEventIds: string[]`
* **Persistência:** Sincronizar automaticamente no `localStorage` sob a chave `'bee_social_rsvp'` (salvando e restaurando entre sessões/reloads).

### 2.2. Header (`Header.tsx` & `Header.css`)
* Adicionar ao lado do link "Favoritos" o indicador de presenças:
  * Exemplo de exibição: `✓ Presenças` com badge numérico `(X)`.
  * Atualização dinâmica em tempo real sempre que uma presença for confirmada ou desmarcada em qualquer parte da aplicação.
  * Acessibilidade: atributos semânticos (`role="status"` ou `aria-label`) para leitores de tela.

### 2.3. Card de Evento (`Card.tsx` & `Card.css`)
* **Badge de Status:** Na linha superior de badges (onde ficam Data, Categoria e Preço), exibir o badge `"Eu vou"` ou `"Presença Confirmada"` em verde quando o usuário estiver confirmado.
* **Ação Rápida:** Adicionar um botão discreto de alternância de presença no card (ao lado ou integrado com o botão de favoritar), permitindo confirmar presença sem necessariamente abrir o modal.

### 2.4. Modal de Detalhes (`EventDetail.tsx` & `EventDetail.css`)
* Botão destacado de alternância de presença:
  * Estado não confirmado: `"Confirmar Presença"` (estilo primário).
  * Estado confirmado: `"✓ Presença Confirmada (Cancelar)"` (estilo outline/suave).
* Sinergia visual com o botão existente de *"Salvar na Agenda"* (Google Calendar).

### 2.5. Barra de Filtros (`Filters.tsx` & `MainPage.tsx`)
* Adicionar na barra de filtros um toggle / pill:
  * Label: `"Só confirmados"` ou `"Minhas Presenças"`.
* Ao ativar o filtro, a listagem de eventos da `MainPage` filtra apenas os eventos onde `isAttending(event.id) === true`.
* Se o usuário desmarcar a presença de um evento com o filtro ativo, o card deve sair da listagem reativamente.

---

## 3. Melhorias de Base & Qualidade (Pré-requisitos Técnicos)

Antes ou durante a implementação, incorporar as seguintes melhorias descobertas durante a auditoria do projeto:

### 3.1. Isolamento de Testes (`src/setupTests.ts`)
* Adicionar limpeza automática do `localStorage` antes de cada teste:
  ```typescript
  beforeEach(() => {
    localStorage.clear();
  });
  ```
* Adicionar stub de `window.matchMedia` para evitar erros de renderização no JSDOM com o `ThemeContext`:
  ```typescript
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  ```

### 3.2. Limpeza de Código Morto (conforme `TODO.md`)
* Excluir a pasta não utilizada `src/components/Login/`.
* Excluir o arquivo não utilizado `src/styles/App.css`.

---

## 4. Estrutura de Arquivos

```text
src/
├── context/
│   ├── FavoritesContext.tsx
│   ├── ThemeContext.tsx
│   └── RSVPContext.tsx                  # [NOVO] Contexto e hook de RSVP
├── components/
│   ├── Header/
│   │   ├── Header.tsx                   # [ALTERAR] Contador de presenças
│   │   └── Header.css
│   ├── Card/
│   │   ├── Card.tsx                     # [ALTERAR] Badge e botão de RSVP
│   │   └── Card.css
│   ├── EventDetail/
│   │   ├── EventDetail.tsx              # [ALTERAR] Botão de ação de RSVP
│   │   └── EventDetail.css
│   └── Filters/
│       ├── Filters.tsx                  # [ALTERAR] Toggle de confirmados
│       └── Filters.css
├── pages/
│   └── MainPage.tsx                     # [ALTERAR] Lógica do filtro de confirmados
├── setupTests.ts                        # [ALTERAR] Limpeza de localStorage + matchMedia
└── __tests__/
    ├── Card.test.tsx                    # [ALTERAR] Testes dos novos badges
    ├── EventDetail.test.tsx             # [ALTERAR] Testes do botão de RSVP
    ├── Filters.test.tsx                 # [ALTERAR] Testes do novo filtro
    └── RSVPContext.test.tsx             # [NOVO] Testes unitários do contexto
```

---

## 5. Plano de Testes Automatizados

1. **`RSVPContext.test.tsx`:**
   * Iniciar com estado vazio (0 presenças).
   * Confirmar presença em um evento incrementa `confirmedCount` e persiste no `localStorage`.
   * Chamar `toggleAttendance` novamente desmarca e remove do `localStorage`.
   * Múltiplos eventos mantêm contagem precisa.
2. **`Filters.test.tsx` & Integração na `MainPage`:**
   * Ativar o filtro "Só confirmados" restringe a lista de eventos.
   * Limpar filtros restaura todos os eventos.
3. **`Header.test.tsx`:**
   * Exibe `(0)` inicialmente e atualiza dinamicamente conforme presenças são marcadas.

---

## 6. Checklist de Implementação (Passo a Passo para o Novo Chat)

- [ ] **Passo 1:** Aplicar as correções de base em `src/setupTests.ts` e excluir `src/components/Login/` e `src/styles/App.css`.
- [ ] **Passo 2:** Criar `src/context/RSVPContext.tsx`, envolvendo a aplicação no `src/App.tsx`.
- [ ] **Passo 3:** Criar a suíte de testes `src/__tests__/RSVPContext.test.tsx` e rodar `npm test`.
- [ ] **Passo 4:** Atualizar `Header.tsx` e `Header.css` com o badge contador.
- [ ] **Passo 5:** Atualizar `Card.tsx` e `EventDetail.tsx` com as ações e badges visuais de presença.
- [ ] **Passo 6:** Atualizar `Filters.tsx` e `MainPage.tsx` com a filtragem por presença confirmada.
- [ ] **Passo 7:** Executar `npm test`, `npm run build` e `npm run check` para garantir 100% de integridade e zero regressões.
