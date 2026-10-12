# G03_Busca_EDA2_2026.2 

Aplicação web para consulta e gerenciamento de um catálogo de medicamentos, com busca por **código** e por **nome**.

O objetivo do trabalho é implementar e demonstrar o funcionamento da **busca binária** e da **busca sequencial**.

## Alunos

| Matrícula | Nome |
| --- | --- |
| 241025944 | Ian Pedersoli Barbosa |
| 241012329 | Luiz Henrique Pallavicini |

**Disciplina:** Estrutura de Dados 2  
**Professor:** Mauricio Serrano

## Descrição

O sistema apresenta um catálogo de medicamentos com código, nome, categoria e descrição. A aplicação permite visualizar e filtrar os medicamentos, cadastrar novos registros, excluir registros e realizar buscas.

Cada busca informa o algoritmo utilizado e o número de comparações realizadas.

## Algoritmos de busca

- **Busca binária por código** — divide repetidamente o intervalo de busca até encontrar o medicamento. Possui complexidade `O(log n)` e exige registros ordenados pelo código.
- **Busca sequencial por nome** — percorre os medicamentos um por um até encontrar um nome correspondente. Possui complexidade `O(n)`.

## Como executar

Requisito: Node.js 22.12 ou superior.

```bash
npm install --include=optional --no-package-lock
npm run dev
```

Depois, abra no navegador o endereço exibido no terminal, normalmente:

```text
http://localhost:5173
```

## Estrutura do projeto

```text
src/App.tsx       interface, catálogo e algoritmos de busca
src/main.tsx      inicialização da aplicação
src/index.css     estilos globais
index.html        página principal
package.json      dependências e comandos do projeto
vite.config.ts    configuração do Vite
```
