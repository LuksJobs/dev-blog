---
title: "A Alibaba acaba de abrir o código-fonte de algo insano"
description: "O OpenCodeReview, revisor de código com IA usado internamente pela Alibaba por dois anos, agora é open-source. Segundo o benchmark do projeto, ele tem precisão maior que o Claude Code usando cerca de 1/9 dos tokens."
date: 2026-10-28
draft: false
tags:
  - devsecops
  - ia
  - agentes de ia
  - arquitetura de software
  - system design
  - code-review
  - open-source
  - security
categories:
  - devsecops
  - arquitetura
  - seguranca
slug: "a-alibaba-acaba-de-abrir-codigo-fonte"
author: "Lucas Oliveira"
image: "https://i.imgur.com/S5s938Y.jpeg"
toc: true
---

O [**OpenCodeReview**](https://github.com/alibaba/open-code-review) é um revisor de código com IA que encontra bugs, falhas de segurança e erros antes que eles cheguem à produção.

E é **gratuito e de código aberto** (licença Apache-2.0).

Não tem licença por assento, não prende você a um fornecedor e não tem uma IA pulando discretamente metade dos arquivos do seu PR.

Não é um projeto de fim de semana. Durante cerca de dois anos ele foi o assistente oficial de code review da Alibaba. Segundo o repositório, foi usado por dezenas de milhares de desenvolvedores e apontou milhões de defeitos antes de virar open-source.

## O que ele faz

Na prática, é uma CLI (`ocr`) que lê o diff do Git, manda os arquivos alterados para um LLM configurável por meio de um agente com ferramentas e devolve comentários presos à linha exata do problema.

- **Revisa o diff** do Git (staged, unstaged e untracked), de uma branch contra outra ou de um commit específico.
- **Traz regras prontas** por linguagem: ponteiro nulo, thread-safety, XSS e SQL injection, entre outras. A cobertura varia de linguagem para linguagem, como mostro no teste mais abaixo.
- **Busca contexto além do diff.** Ele lê o arquivo inteiro, pesquisa no codebase e olha os outros arquivos alterados no mesmo PR.
- **Escaneia código sem diff** com o `ocr scan`, útil para auditar um módulo legado inteiro.
- **Funciona com qualquer endpoint compatível com OpenAI ou Anthropic.**
- **Pode ser usado de dentro do seu agente**: Claude Code, Codex, Cursor, Kimi Code, OpenCode e outros que aceitam skills.
- **Roda em CI/CD**: GitHub Actions, GitLab CI, GitFlic CI e Gerrit.
- **Inclui recursos de operação**: retomada de sessão, visualizador de sessões, suporte a MCP e telemetria via OpenTelemetry.

## Por que um agente genérico não basta

Quem já pediu para um agente de propósito geral "revisar esse PR" conhece os problemas:

- Em PRs grandes, **arquivos são pulados** sem nenhum aviso.
- Os comentários **apontam para a linha errada**, porque o número da linha foi alucinado ou ficou desatualizado.
- A qualidade **muda com pequenas alterações no prompt**, então a mesma revisão feita duas vezes dá dois resultados diferentes.

A causa é a mesma nos três casos: deixar para o modelo decisões que não deveriam depender de julgamento. Escolher quais arquivos revisar ou em qual linha colocar um comentário são tarefas determinísticas e não têm por que passar pelo LLM.

## A arquitetura: código onde tem que ser código, IA onde tem que ser IA

A ideia central do OpenCodeReview é dividir as responsabilidades.

**Parte determinística (código):**

- **Seleção de arquivos.** O código decide o que entra na revisão. Nenhum arquivo é "esquecido" pelo modelo.
- **Agrupamento.** Arquivos relacionados, como os arquivos de localização de um mesmo recurso, viram uma única unidade para um sub-agente, com contexto isolado.
- **Match de regras.** As regras são aplicadas por arquivo a partir de templates, e não porque o modelo "lembrou" delas.
- **Posicionamento e reflexão.** Módulos separados cuidam de ancorar o comentário na linha certa e de revisar o próprio resultado.

**Parte do LLM (agente):**

- Decide o que for dinâmico: se aquilo é mesmo um problema, quão grave é e que contexto ainda falta.
- Busca esse contexto com um conjunto de ferramentas próprio e prompts ajustados para cada cenário.

É a mesma lição que vale para qualquer sistema com agentes em produção: **quanto menos o modelo tiver que decidir, mais previsível o sistema fica.** A IA entra onde agrega valor, que é no julgamento. O resto fica no código, que é auditável e repetível.

Isso também explica a economia de tokens. O modelo não precisa ler o repositório inteiro para descobrir o que revisar, porque já recebe uma unidade de trabalho pronta e delimitada.

## O benchmark

Para comparar, a Alibaba montou o **AACR-Bench**:

![benchmark](https://github.com/alibaba/open-code-review/raw/main/imgs/benchmark-en.png)

- 200 pull requests reais
- 50 repositórios open-source
- 10 linguagens
- 1.505 problemas reais anotados e validados por mais de 80 engenheiros sênior

O resultado divulgado, comparando com o Claude Code **usando o mesmo modelo por baixo**:

- **Precisão e F1 maiores**
- **Cerca de 1/9 dos tokens**
- **Revisões mais rápidas**

O trade-off, que o próprio projeto assume: **o recall é menor**. Ou seja, ele encontra menos problemas no total, e isso é proposital. A escolha é por menos ruído e menos falsos alarmes.

Na minha opinião, essa é a decisão certa para um revisor que roda em todo PR. Um revisor que gera 30 comentários dos quais 25 são irrelevantes treina o time a ignorar todos eles. Um revisor que gera 5 comentários e acerta 4 vira alguém que o time ouve.

> Um ponto de atenção: o benchmark foi feito pela própria Alibaba e os números detalhados estão em imagens no README. Vale olhar com calma e, de preferência, rodar no seu próprio código antes de tirar conclusões.

## Como começar

Pré-requisitos: **Git 2.41+** e um endpoint de LLM (compatível com OpenAI ou Anthropic). Roda em Windows, macOS e Linux.

```bash
npm install -g @alibaba-group/open-code-review
```

O comando instalado é o `ocr`. Configure o provedor e o modelo (o setup interativo pede a chave de API e testa a conexão):


```bash
ocr config provider
ocr config model
```
Selecione um provedor integrado ou adicione um personalizado:

![aliba-code-review](https://github.com/alibaba/open-code-review/raw/main/imgs/providers.jpg)

Escolha um modelo para o provedor ativo

Também dá para instalar por script, pelo binário do GitHub Release ou compilando do código-fonte. Os detalhes estão na [documentação](https://open-codereview.ai/docs).

### Comandos base

```bash
# Revisa as mudanças locais (staged, unstaged e untracked)
ocr review

# Revisa uma branch contra a base do merge
ocr review --from main --to feature-branch

# Revisa um commit específico
ocr review --commit abc123

# Escaneia um diretório inteiro, sem diff
ocr scan --path internal/agent

# Saída em JSON para integrar com outras ferramentas
ocr review --format json --output result.json

# Lista e retoma revisões interrompidas
ocr session list
ocr review --from main --to feature-branch --resume <id>
```

### Modo delegação: sem chave de API própria

Se você já usa Claude Code, Codex ou Cursor, existe o **modo delegação**. Nele o OCR continua fazendo a parte determinística (seleção de arquivos e regras), e o LLM do agente que você já usa faz a revisão. Não é preciso configurar uma chave de API separada para o OCR.

```bash
ocr delegate preview
ocr delegate rule <arquivos>
```

É um bom ponto de partida para testar a ferramenta sem mexer em credenciais nem em custo.

## Testei na prática (sem chave de API)

Quis ver o que a ferramenta entrega de fato antes de recomendar. Instalei a versão **1.13.3** no meu Windows 11 (Git 2.56, Node 24) e montei um repositório de teste: uma API Express de pedidos e clientes, com um PR (`feature/customer-portal`) de 71 linhas.

> As imagens desta seção mostram a saída real dos comandos que rodei, renderizada numa janela de terminal para facilitar a leitura. O texto não foi editado. O prompt da janela é apenas ilustrativo.

![Ambiente do teste: OpenCodeReview v1.13.3 instalado e o repositório ocr-demo com dois commits, a base da API e o PR feature/customer-portal com 71 linhas novas em 3 arquivos.](ocr-teste-01-setup.png)

Nesse PR eu **plantei 8 problemas de propósito** e anotei o gabarito antes de rodar qualquer comando:

| # | Problema plantado | Onde |
|---|---|---|
| 1 | SQL injection (concatenação de `status` na query) | `orders.js` |
| 2 | Paginação errada (`offset = page * pageSize` pula a primeira página) | `orders.js` |
| 3 | Chave de API de pagamento hardcoded | `customers.js` |
| 4 | XSS refletido (`name` da query direto no HTML) | `customers.js` |
| 5 | Null dereference (`customer` pode não existir) | `customers.js` |
| 6 | Path traversal + IDOR no download de faturas | `customers.js` |
| 7 | Race condition no saque (checa saldo, cobra e só depois debita) | `customers.js` |
| 8 | Handlers `async` sem tratamento de erro, `fetch` sem checar `response.ok` | `customers.js` |

Fiz o teste **sem nenhuma chave de API**, usando o modo delegação. Isso tem uma consequência importante: sem LLM, o OCR executa só a parte determinística, ou seja, decide **o que** revisar e **com quais regras**. O julgamento fica com o agente hospedeiro. Então este teste **não mede** precisão, recall nem consumo de tokens do benchmark. Ele mostra a base sobre a qual o modelo trabalha.

### Seleção de arquivos

![ocr delegate preview: o OCR calcula o merge-base entre main e a branch do PR e lista os 3 arquivos alterados, todos marcados para revisão (3 reviewable / 3 total).](ocr-teste-02-preview.png)

Aqui está a promessa de "não pular arquivo": a lista é calculada pelo código a partir do merge-base, não pelo modelo. Os 3 arquivos do PR entraram.

### As regras que ele aplica

![ocr delegate rule: a saída completa das regras embutidas que o OCR entrega ao modelo para arquivos JS/TS. Tem seções de React, async e segurança de front-end (XSS, innerHTML, eval), mas nenhuma menção a SQL, caminhos de arquivo ou concorrência.](ocr-teste-03-regras-js.png)

Os três arquivos caíram no mesmo grupo de regras, o de JS/TS. Isso também é a parte determinística: a regra é escolhida pelo padrão do arquivo, não pela memória do modelo.

### O que o teste revelou: a cobertura depende da linguagem

Cruzando o gabarito com as regras de JS:

| # | Problema | Regra explícita para JS? |
|---|---|---|
| 3 | Segredo hardcoded | ✅ *Sensitive Information* e *Hardcoding* |
| 4 | XSS | ✅ *XSS Protection* |
| 5 | Null dereference | ✅ *Null Checks* |
| 8 | Erros async não tratados | ✅ *Async Handling: Error Handling* |
| 1 | SQL injection | ❌ não mencionado |
| 2 | Paginação errada | ❌ (bug de lógica, nenhuma regra cobre) |
| 6 | Path traversal / IDOR | ❌ não mencionado |
| 7 | Race condition | ❌ não mencionado |

**4 de 8** problemas têm uma regra explícita apontando para eles. O conjunto de JS é claramente voltado para front-end: tem seção inteira de React, `innerHTML` e `document.write`, mas nada sobre SQL, caminhos de arquivo ou concorrência no back-end.

Para comparar, rodei `ocr rules check` em arquivos de outras linguagens.

![Contagem de linhas das regras embutidas que citam "sql", "traversal" ou "check-then-act": 0 em JS, 5 em Go, 1 em Java e 3 em Python. Embaixo, as linhas das regras de Go. Nem toda menção é sobre injeção (sql.Rows, por exemplo, trata de fechar recursos), mas a regra de Go pede explicitamente validação de SQL, paths e URLs montados com entrada não confiável.](ocr-teste-04-cobertura.png)

 As regras de **Go** pedem explicitamente para checar "SQL, shell commands, URLs, paths [...] assembled from untrusted input" e *check-then-act*. As de **Java** e **Python** têm seções de thread-safety com *check-then-act*. Ou seja, a lista "ponteiro nulo, thread-safety, XSS e SQL injection" do README é verdadeira **para o conjunto de linguagens**, mas não vale igualmente para cada uma.

Isso não quer dizer que o modelo não vá encontrar a SQL injection num arquivo JS. Um LLM decente provavelmente encontra, por julgamento próprio. Mas nesse caso a detecção depende do modelo, não da regra, e é exatamente essa variação que a arquitetura do OCR tenta eliminar.

**Na prática:** se o seu back-end é Node, vale escrever regras próprias (o OCR aceita um arquivo de regras via `--rule`) cobrindo injeção, path traversal, autorização e concorrência. Sem isso, você está contando com o modelo justamente nos pontos mais críticos de um back-end.

> Para a revisão completa, com os comentários na linha e as métricas de tokens e tempo, é preciso configurar um provedor de LLM (`ocr config provider`). Esse é o próximo teste que pretendo fazer.

## Onde ele se encaixa num pipeline DevSecOps

Ele não substitui SAST, SCA, linters nem revisão humana. Ele se soma a eles:

1. **Antes do commit, na máquina do dev**: `ocr review` ou o modo delegação, dentro do agente que o time já usa.
2. **No PR, via CI**: GitHub Actions, GitLab CI ou Gerrit comentando direto nas linhas.
3. **Na auditoria de legado**: `ocr scan` em módulos que nunca passaram por revisão decente.

O ganho real está no meio do caminho. Ferramentas de SAST são boas em padrões conhecidos, mas não entendem intenção. O revisor humano entende intenção, mas não tem tempo para ler cada linha de um PR de 40 arquivos. O OpenCodeReview ocupa esse espaço: tem regras explícitas como base, usa julgamento de LLM por cima e coloca o comentário na linha certa.

E isso fica ainda mais relevante agora, com cada vez mais código gerado por IA entrando nos repositórios. Se a geração ficou barata, a revisão tem que ficar escalável. E escalável não quer dizer "mais um agente opinando". Quer dizer um processo previsível, que não pula arquivo.

## Pontos de atenção

- **Recall menor.** Ele vai deixar passar coisas. Não trate o "nenhum comentário" como garantia.
- **Benchmark próprio.** Os números são da Alibaba, com um dataset da Alibaba. Valide no seu contexto.
- **Custo e dados.** Fora do modo delegação, o código vai para o provedor de LLM que você configurar. Em ambientes regulados, avalie usar um endpoint interno ou self-hosted.
- **Regras desiguais entre linguagens.** No meu teste, as regras de JS não mencionam SQL injection, path traversal nem concorrência. Em back-end Node, complemente com regras próprias.
- **Dependência de Git 2.41+.** Imagens antigas de runner de CI podem precisar de atualização.

## Conclusão

O mais interessante do OpenCodeReview não é "a IA da Alibaba ser melhor que o Claude Code". É a abordagem: **tirar do modelo tudo o que não exige julgamento**. É isso que faz ele ser mais barato, mais rápido e mais confiável que um agente genérico revisando código só com prompt.

Vale testar. No mínimo, vale estudar a arquitetura.

**Repositório:** https://github.com/alibaba/open-code-review
**Documentação:** https://open-codereview.ai/docs
