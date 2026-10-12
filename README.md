# G03_Ordenacao_EDA2_2026.2

Aplicação web para consulta e gerenciamento de um catálogo de medicamentos, com ordenação por **código** e por **nome**.

O objetivo do trabalho é implementar e demonstrar o funcionamento do **Counting Sort** e do **Radix Sort MSD**, dando continuidade ao projeto [G03_Busca_EDA2_2026.2](https://github.com/eda2-2026/G03_Busca_EDA2_2026.2).

## Alunos

| Matrícula | Nome |
| --- | --- |
| 241025944 | Ian Pedersoli Barbosa |
| 241012329 | Luiz Henrique Pallavicini |

**Disciplina:** Estrutura de Dados 2  
**Professor:** Mauricio Serrano

## Descrição

O sistema apresenta um catálogo de medicamentos com código, nome, categoria e descrição. A aplicação permite visualizar e filtrar os medicamentos, cadastrar novos registros, excluir registros e realizar buscas.

Nesta entrega, foram incorporados algoritmos de ordenação por código e por nome, mantendo as buscas binária e sequencial do trabalho anterior.

## Algoritmos de ordenação

- **Counting Sort por código** — conta as ocorrências dos códigos e utiliza as contagens acumuladas para posicionar os medicamentos em ordem crescente. Possui complexidade de tempo e espaço `O(n + k)`, sendo `n` o número de medicamentos e `k` o intervalo entre o menor e o maior código. Também prepara a lista para a busca binária.
- **Radix Sort MSD por nome** — distribui os medicamentos em baldes e ordena os nomes caractere por caractere, começando pelo primeiro. Normaliza os nomes para ignorar diferenças entre maiúsculas, minúsculas e acentos básicos.

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
src/App.tsx       interface, catálogo e algoritmos de busca e ordenação
src/main.tsx      inicialização da aplicação
src/index.css     estilos globais
index.html        página principal
package.json      dependências e comandos do projeto
vite.config.ts    configuração do Vite
```
