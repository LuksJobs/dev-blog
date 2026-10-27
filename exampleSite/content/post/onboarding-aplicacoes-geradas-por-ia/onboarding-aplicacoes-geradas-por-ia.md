---
title: "Onboarding de aplicações geradas por IA: o custo real para DevSecOps"
description: "Por que apps quase inteiramente geradas por IA elevam dívida técnica, risco e custo operacional para equipes DevSecOps, e o que a pesquisa sobre agentes de IA diz sobre isso."
date: 2026-07-13
draft: false
tags:
  - devsecops
  - ia
  - agentes de ia
  - arquitetura de software
  - system design
  - kubernetes
  - observabilidade
  - seguranca
categories:
  - devsecops
  - arquitetura
  - seguranca
slug: "onboarding-aplicacoes-geradas-por-ia-devsecops"
author: "Lucas Oliveira"
image: "https://i.imgur.com/bhslPRc.jpeg"
toc: true
---

**Resumo:** quando uma aplicação é produzida quase inteiramente por IA, mas sem base sólida de engenharia de software, o onboarding para produção deixa de ser um exercício de automação e passa a ser um trabalho de contenção de risco. O problema não é a IA. O problema é usar IA para amplificar decisões ruins, ausência de arquitetura e desconhecimento operacional. A própria pesquisa sobre agentes de IA chega a uma conclusão parecida: confiabilidade e governança são propriedades do sistema inteiro, não do modelo.

<!--more-->

## Introdução

Nos últimos anos, o desenvolvimento assistido por IA saiu do campo da curiosidade e entrou de vez no ciclo normal de entrega de software. Em muitos times, já é comum ver geração de código, criação de testes, sugestão de refatorações, montagem de infraestrutura e até escrita inicial de documentação com apoio de ferramentas de IA.

E a mudança não parou no autocomplete. Hoje boa parte desse código é escrita por **agentes**: sistemas que, segundo o survey de Bin Xu (2026), combinam modelos de fundação com raciocínio, planejamento, memória e uso de ferramentas. Na prática, um agente de código lê o repositório, edita arquivos, roda comandos, instala dependências e gera manifests, tudo em um loop que pode rodar por muitos passos sem um humano olhando cada decisão.

Isso, por si só, não é um problema. Na prática, IA é um acelerador de produtividade. Ela reduz atrito, encurta o caminho entre intenção e implementação e ajuda times experientes a ganhar escala. O ponto crítico aparece quando a velocidade da geração passa a ser confundida com maturidade de engenharia.

É nesse cenário que a equipe em que atuo, junto com outras equipes de DevSecOps, Platform Engineering e SRE, começa a receber aplicações que "funcionam" no ambiente local, mas chegam completamente frágeis para produção. Na prática, isso aumenta o volume de trabalho porque o que deveria ser uma entrada simples para o pipeline vira uma análise cuidadosa de arquitetura, operação, segurança e observabilidade. Em vez de um sistema projetado com critérios claros, chega um conjunto de arquivos que parece software, mas se comporta como protótipo permanente.

Minha posição é direta: o problema não é a IA. O problema é usar IA sem compreender os fundamentos que continuam sustentando software sério em ambiente corporativo.

## Contextualização: o crescimento do desenvolvimento assistido por IA

Ferramentas de IA mudaram o ritmo de desenvolvimento. Elas ajudam a escrever boilerplate, gerar endpoints, criar consultas, montar pipelines e até propor arquitetura inicial. Em times maduros, isso vira ganho real. Em times sem base técnica, isso vira dívida operacional acelerada.

O risco não está apenas em "código ruim". O risco está em código que foi produzido rápido demais, com pouca revisão conceitual, sem trade-offs explícitos e sem a disciplina que normalmente existiria em uma equipe de engenharia experiente.

Quando uma equipe sem domínio de arquitetura, system design e engenharia de software usa IA como substituto de pensamento crítico, o resultado costuma ser previsível:

- decisões inconsistentes de arquitetura;
- ausência de fronteiras entre domínios;
- dependências acopladas e difíceis de versionar;
- pouca ou nenhuma atenção a observabilidade;
- segurança tratada como etapa final;
- deploy pensado depois do código pronto.

Em termos práticos, a IA não cria esses problemas do nada. Ela torna mais barato produzir o erro. E quando o erro é barato, ele se propaga rápido.

> **Ponto-chave:** a IA amplia capacidade. Ela também amplia defeitos de processo, falta de conhecimento e atalhos arquiteturais.

### O que a pesquisa sobre agentes de IA diz

O que vemos no dia a dia de plataforma não é só impressão de quem opera. O survey *AI Agent Systems: Architectures, Applications, and Evaluation* (Xu, 2026), que revisa o estado da arte de agentes baseados em LLM, descreve exatamente o tipo de risco que chega no onboarding. Três pontos do trabalho conversam diretamente com este artigo.

**1. As falhas são sutis e aparecem tarde.** Ao discutir agentes de código e manutenção de software, o autor observa que tarefas reais de software são longas e dependem de muitas ferramentas, e que as falhas costumam ser sutis e tardias: regressões de segurança, mudanças de comportamento escondidas atrás de feature flags, problemas que só aparecem em testes de integração ou sob carga parecida com a de produção. Ou seja: o defeito não aparece no ambiente local do desenvolvedor. Ele aparece justamente no momento em que a aplicação chega para a equipe de plataforma.

**2. Um patch plausível não basta.** O texto é explícito: *"plausible patches are not enough"*. É preciso correção de ponta a ponta e o mínimo de regressões. Código que compila e responde na porta 3000 é um patch plausível. Não é software pronto para produção.

**3. Confiabilidade é propriedade da stack inteira.** Na conclusão, o autor afirma que *"reliability and governance are properties of the full stack"*, e não apenas do modelo base. Traduzindo para a nossa realidade: não adianta usar o modelo mais avançado do mercado se o processo em volta dele (revisão, testes, pipeline, observabilidade, controle de permissões) não existe.

O survey também fala da distância entre "demonstrações impressionantes" e "implantação robusta no mundo real". Essa distância é, literalmente, o trabalho que cai no colo de DevSecOps.

## "Funciona" é uma métrica insuficiente

Uma das contribuições mais úteis do survey é sobre avaliação. O autor argumenta que um único número de sucesso não descreve bem um agente, e que a avaliação precisa cobrir várias dimensões ao mesmo tempo: desempenho fim a fim, eficiência e custo, correção no uso de ferramentas, qualidade da trajetória, robustez e segurança. Ele chega a observar que *"agents can 'solve' tasks while being impractically slow or expensive"*.

O paralelo com o onboarding é direto. "A aplicação funciona" é o equivalente a reportar só a taxa de sucesso. Para produção, as outras dimensões importam tanto quanto essa:

| Dimensão de avaliação (Xu, 2026) | Pergunta equivalente no onboarding |
|---|---|
| Desempenho fim a fim | A aplicação entrega o comportamento esperado em um ambiente parecido com produção, e não só no localhost? |
| Eficiência e custo | Qual a latência p95, o consumo de CPU e memória e o custo por requisição sob carga real? |
| Correção no uso de ferramentas | As integrações (banco, filas, APIs externas) tratam erro, timeout e retry corretamente? |
| Robustez e confiabilidade | O que acontece com uma dependência instável, um restart do pod ou um pico de tráfego? |
| Segurança e conformidade | Há vazamento de dados, segredos expostos ou ações sem autorização ao longo de todo o fluxo? |
| Rastreabilidade | Existem logs, métricas e traces suficientes para reconstruir o que aconteceu em um incidente? |

O survey insiste que a segurança precisa ser avaliada ao longo de toda a trajetória de execução, e não apenas na resposta final. Vale o mesmo para aplicações: não basta o endpoint devolver `200 OK`. O que importa é tudo o que aconteceu no caminho até ali.

## O que normalmente chega para uma equipe DevSecOps

Na rotina, o onboarding de uma aplicação gerada quase toda por IA raramente começa com uma arquitetura limpa e um plano de operação. O que chega costuma ser uma coleção de sinais de que o software foi construído a partir da pergunta "como faz funcionar?" e não da pergunta "como isso vai sobreviver em produção?".

| O que chega | O que isso significa para DevSecOps |
|---|---|
| Repositório sem padrão de estrutura | Alto custo para entender fluxo, dependências e pontos de falha |
| Testes inexistentes ou superficiais | Sem base para CI confiável, rollback seguro ou mudança controlada |
| Testes gerados só para "passar" | Falsa sensação de cobertura; asserts fracos que não detectam regressão |
| Dockerfile improvisado | Imagens grandes, lentas e difíceis de auditar |
| Configuração espalhada no código | Segredos, parâmetros e ambientes ficam frágeis e inseguros |
| Manifests Kubernetes genéricos | Falta de health checks, recursos e estratégia de rollout |
| Logs em texto solto | Observabilidade limitada e difícil correlação em incidentes |
| Dependências desatualizadas ou desconhecidas | Aumento direto de risco de supply chain e SCA |
| Nenhum registro de como o código foi gerado | Impossível saber quais decisões foram tomadas pelo agente e quais foram revisadas por alguém |

Em muitos casos, o primeiro trabalho da equipe não é "fazer o deploy". É descobrir se o sistema pode ser tornado operável sem reescrita completa.

## Principais problemas encontrados

### Arquitetura

O primeiro problema costuma ser arquitetural. Aplicações quase totalmente geradas por IA frequentemente seguem o caminho de menor resistência: uma base monolítica gigante, com todas as regras misturadas, sem fronteira de domínio e sem intenção clara de evolução.

Isso tem uma explicação mecânica. O survey de Xu descreve o funcionamento de um agente como um loop de observar, recuperar contexto, propor uma ação, validar, executar e atualizar a memória. Se ninguém fornece uma arquitetura-alvo como contexto, cada passo do loop otimiza localmente: resolve o problema da vez da forma mais direta possível. O resultado global é um sistema montado por acumulação, não por desenho. O autor também aponta que, em tarefas longas, os erros se acumulam (*compounding errors*): uma decisão ruim no passo 3 vira premissa para os passos 4 a 40.

#### Monólitos gigantes e acoplamento excessivo

Monólito não é sinônimo de problema. O problema é um monólito sem modularização real, em que auth, negócio, persistência, integrações, validação e apresentação se misturam no mesmo fluxo. Nessa situação, qualquer mudança pequena afeta partes aparentemente desconectadas.

O acoplamento excessivo aparece quando o código depende de detalhes internos de outras camadas, de formatos específicos de payload e de efeitos colaterais espalhados. O resultado é um sistema difícil de testar, difícil de evoluir e ainda mais difícil de isolar em incidentes.

#### Ausência de separação de responsabilidades

Quando uma IA gera código sem direcionamento arquitetural, é comum ver serviços que fazem tudo: recebem requisição, validam regra, consultam banco, chamam APIs externas, montam resposta, registram auditoria e ainda lidam com tentativa de retry. Isso mata a separação de responsabilidades e cria funções enormes, opacas e frágeis.

#### Violação de SOLID e falta de patterns

Em ambientes assim, princípios como Single Responsibility, Open/Closed e Dependency Inversion praticamente desaparecem. A IA pode produzir algo "bonito" na superfície, mas isso não significa que exista um desenho sustentável.

Também é comum a ausência de padrões simples e úteis: Factory, Strategy, Adapter, Repository, Circuit Breaker, Outbox, Queue Consumer, Bulkhead. Não se trata de aplicar pattern por fetiche. Trata-se de criar linguagem estrutural para lidar com crescimento e mudança.

#### Código duplicado e dependências circulares

Duplicação surge quando a aplicação foi criada com pressa e sem visão de domínio. Pequenas variações de regra são copiadas para outras áreas. Isso gera manutenção cara e inconsistência funcional. Com agentes, o efeito é ainda mais forte: como o contexto de cada sessão é limitado, é comum o agente reescrever um utilitário que já existia em outro módulo, em vez de reutilizá-lo.

Dependências circulares são outro sinal clássico. Em código gerado, elas aparecem com frequência porque o sistema foi montado por proximidade funcional, não por arquitetura. Isso bagunça build, dificulta refatoração e torna o grafo de dependências incontrolável.

### System Design

Se a arquitetura mostra a forma do problema, o system design mostra seu impacto operacional.

#### Não existe estratégia de escalabilidade

Aplicações geradas sem pensamento de sistema costumam assumir carga fixa, latência constante e crescimento linear. Isso não existe em produção real. Picos acontecem. Dependências externas falham. Filas acumulam. O fluxo precisa ser tolerante ao imprevisível.

#### Estado em memória e sessões locais

Guardar estado em memória é um atalho comum. Funciona até o primeiro restart, reschedule ou scaling horizontal. Quando a sessão vive localmente, qualquer tentativa de replicação vira problema.

#### Cache inexistente e banco como gargalo

Sem cache, toda leitura pesa diretamente no banco. Quando o banco vira ponto único de verdade e de gargalo, a aplicação deixa de escalar com elegância. A equipe de DevSecOps passa a olhar para métricas de conexão, pool, saturação e tempo de resposta sem encontrar camadas intermediárias que aliviem a pressão.

#### Ausência de filas e APIs síncronas para tudo

Muita aplicação IA-first tenta resolver tudo com chamadas síncronas em cadeia. Isso acopla latência, aumenta chance de timeout e cria cascatas de falha. Em vez de desacoplar processamento, o sistema empurra cada operação para o caminho mais frágil.

#### Falta de idempotência, tolerância a falhas e alta disponibilidade

Quando não existe idempotência, retry vira risco. Quando não existe tolerância a falhas, uma dependência externa derruba o fluxo inteiro. Quando não existe estratégia de alta disponibilidade, qualquer indisponibilidade vira incidente operacional e, às vezes, indisponibilidade de negócio.

> **Observação:** sistema bom não é o que nunca falha. É o que falha de forma previsível, detectável e recuperável.

### Cloud e Kubernetes

É aqui que o onboarding começa a doer para valer. Muitas aplicações geradas por IA foram desenhadas para "rodar", não para serem operadas em orquestradores modernos. É exatamente o cenário que o survey descreve: problemas que só aparecem sob cargas parecidas com as de produção.

#### Por que são difíceis de colocar em Kubernetes

Kubernetes pressupõe contratos operacionais mínimos. A aplicação precisa sinalizar quando está viva, quando está pronta, como encerra, como escala e como lida com estado.

Se isso não existe no código, a plataforma vira uma camada de compensação, não de habilitação.

#### Health checks, readiness e liveness

Sem `readinessProbe`, o tráfego pode chegar antes da aplicação estar pronta. Sem `livenessProbe`, processos travados continuam presos no pod. Sem `startupProbe`, aplicações com inicialização lenta são reiniciadas antes de subir. Sem uma resposta coerente desses checks, o cluster não toma decisões corretas.

Um erro comum em código gerado é o endpoint `/health` que sempre retorna `200`, sem verificar nada. Ele satisfaz o manifest, mas não informa nada ao cluster.

#### Graceful shutdown

Muitas aplicações não fecham conexões, não drenam requests e não preservam integridade ao receber `SIGTERM`. Em rollout, isso vira request perdido, fila corrompida ou transação interrompida.

#### Horizontal scaling, requests e limits

Escalar horizontalmente não é apenas aumentar réplicas. A aplicação precisa ser stateless o suficiente para suportar isso. Se o estado está em memória, o autoscaling quebra a experiência do usuário.

Sem `requests` e `limits`, o scheduler trabalha no escuro. Sem ajuste de CPU e memória, HPA e VPA ficam imprecisos. Sem observação do comportamento sob carga, a plataforma escala no lugar errado.

#### Persistent storage, ConfigMaps, Secrets e service discovery

Se a aplicação mistura configuração com código, o deploy vira intervenção manual. Se usa storage persistente sem necessidade, complica resiliência e expansão. Se não conversa bem com service discovery, o ambiente deixa de ser dinâmico e passa a depender de suposições frágeis.

```mermaid
flowchart TD
    A[App entregue por IA] --> B[Build inicial]
    B --> C[Testes quase inexistentes]
    C --> D[Deploy em container]
    D --> E[Problemas em readiness/liveness]
    E --> F[Autoscaling ineficaz]
    F --> G[Incidentes, retrabalho e hotfix]
```

### DevSecOps

Do ponto de vista de DevSecOps, o problema mais caro não é apenas encontrar vulnerabilidades. É não ter base suficiente para automatizar controle de qualidade de forma confiável.

#### Quando não existe padrão

Sem padrão de branch, estrutura, dependências e build, cada aplicação exige uma pipeline quase artesanal. Isso aumenta o lead time e reduz a chance de manutenção sustentável.

#### Quando não há testes nem cobertura

Sem testes, a pipeline perde força como mecanismo de confiança. Sem cobertura mínima, qualquer ajuste vira aposta. Em equipes maduras, CI não serve só para "passar". Serve para provar que a mudança não quebrou o comportamento esperado.

Aqui existe uma armadilha específica de código gerado: quando o mesmo agente escreve o código e os testes, os testes tendem a confirmar o que o código faz, e não o que ele deveria fazer. Cobertura alta com asserts fracos é pior do que cobertura baixa honesta, porque dá falsa confiança. Por isso o survey de Xu, ao falar de agentes de engenharia de software, destaca que é essencial reportar a validade do patch e o comportamento de regressão, e não apenas se a tarefa "passou".

#### Build lento, imagens grandes e Dockerfiles ruins

Build lento reduz frequência de feedback. Imagem grande aumenta custo de download, expansão e patching. Dockerfile ruim costuma ser sintoma de uma aplicação que foi empacotada sem foco em previsibilidade.

**Dockerfile ruim**

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

**Dockerfile otimizado**

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

Junto com ele, um `.dockerignore` contendo pelo menos `node_modules`, `.git`, `.env*` e artefatos de teste. Sem isso, o `COPY . .` sobrescreve as dependências do estágio anterior e ainda pode levar segredos locais para dentro da imagem.

#### Segredos versionados e credenciais hardcoded

Este é um dos sinais mais perigosos. Quando segredos aparecem em código, a equipe de DevSecOps herda um problema que já se espalhou: rotação, revogação, auditoria e risco de exposição.

Com agentes, o problema ganha uma camada a mais: a sessão do agente costuma ter acesso ao `.env` local, ao histórico do shell e às credenciais do desenvolvedor. Se nada impede, essas informações acabam copiadas em arquivos de configuração, exemplos de código ou mensagens de commit.

#### O próprio agente como superfície de ataque

Esse é um ponto que costuma ficar fora da conversa, e o survey de Xu ajuda a trazê-lo para dentro. Um agente de código não é só um gerador de texto: ele executa comandos, instala pacotes e altera arquivos. Isso o torna parte da cadeia de suprimentos do software.

O trabalho destaca alguns riscos que valem para qualquer time que deixa agentes trabalharem em repositórios corporativos:

- **Prompt injection por conteúdo não confiável.** Issues, tickets, documentação externa e READMEs de dependências podem conter instruções que o agente acaba seguindo.
- **Ações com efeito colateral.** Rodar uma migration, um `terraform apply` ou um `kubectl delete` não tem volta. O survey recomenda *permission gates* para ações irreversíveis.
- **Memória como superfície de segurança.** Conteúdo envenenado vindo de uma ferramenta pode persistir entre sessões se o agente mantém memória.
- **Permissões amplas demais.** O autor defende permissões limitadas por papel (*least privilege*), allowlists de ferramentas e execução em sandbox, para que a falha de um componente não se espalhe.

Para DevSecOps, a consequência prática é tratar o agente como mais um ator do pipeline: com identidade própria, token de escopo mínimo, execução isolada e logs auditáveis. Se a equipe não consegue responder "quais comandos o agente executou e com quais credenciais?", o problema de supply chain já começou antes do primeiro build.

#### SAST, SCA, Secret Scanning, Container Scanning, IaC Scanning, SBOM e Supply Chain Security

Ferramentas de segurança não resolvem arquitetura ruim, mas ajudam a impedir que problemas óbvios passem despercebidos.

- **SAST** encontra padrões inseguros no código.
- **SCA** identifica dependências vulneráveis e desatualizadas. Em código gerado, vale também conferir se cada pacote existe de fato, é o pacote certo e é mantido, já que modelos podem sugerir nomes parecidos com bibliotecas legítimas.
- **Secret Scanning** detecta chaves, tokens e credenciais expostas.
- **Container Scanning** avalia vulnerabilidades no sistema base e em pacotes da imagem.
- **IaC Scanning** encontra problemas em Terraform, Helm, Kubernetes manifests e afins.
- **SBOM** documenta a composição real do software.
- **Supply Chain Security** fecha a conversa em torno de proveniência, integridade e confiança.

**Exemplo de pipeline GitLab CI**

```yaml
stages:
  - test
  - sast
  - sca
  - build
  - container_scan
  - deploy

variables:
  IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

unit_tests:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test -- --coverage

semgrep_sast:
  stage: sast
  image: semgrep/semgrep
  script:
    - semgrep scan --config p/owasp-top-ten --json --output semgrep.json

owasp_dependency_check:
  stage: sca
  image: owasp/dependency-check:latest
  script:
    - dependency-check.sh --scan . --format JSON --out dependency-check

build_image:
  stage: build
  image: docker:27
  services:
    - docker:27-dind
  script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    - docker build -t "$IMAGE" .
    - docker push "$IMAGE"

trivy_container:
  stage: container_scan
  image: aquasec/trivy:latest
  script:
    - trivy fs --severity HIGH,CRITICAL --exit-code 1 .
    - trivy image --severity HIGH,CRITICAL --exit-code 1 "$IMAGE"
```

**Exemplo de GitHub Actions**

```yaml
name: security-pipeline

on:
  push:
    branches: ["main"]

permissions:
  contents: read

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test -- --coverage
      - uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: fs
          severity: HIGH,CRITICAL
          exit-code: 1
```

Note o bloco `permissions: contents: read`: o token do workflow recebe só o que precisa. É o mesmo princípio de menor privilégio que vale para o agente.

**Exemplo de SonarQube**

```properties
sonar.projectKey=app-gerada-por-ia
sonar.sources=src
sonar.tests=test
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.qualitygate.wait=true
```

**Exemplo de Semgrep e Trivy em comandos diretos**

```bash
semgrep scan --config p/security-audit --config p/owasp-top-ten src/
trivy fs --scanners vuln,secret,misconfig .
```

### Observabilidade

Observabilidade não entra depois. Ela deveria nascer junto com a aplicação. Em apps geradas sem maturidade, normalmente há três cenários: logs espalhados, métricas inexistentes ou tracing só no slide da apresentação.

O survey de Xu trata logs de chamadas de ferramentas, artefatos intermediários e traces como **saídas de primeira classe**, necessárias para depuração, conformidade e reprodutibilidade. A lógica vale para qualquer software em produção: se não dá para reconstruir o que aconteceu, não dá para operar.

#### Logging estruturado

Log em texto livre até ajuda no começo, mas degrada rápido em incidentes. Sem estrutura, não há correlação confiável por `trace_id`, `request_id`, usuário ou serviço.

#### Métricas e dashboards

Sem métricas, ninguém enxerga latência, erro, throughput, saturação e consumo de recursos. Prometheus e Grafana não são acessórios; são parte do contrato operacional.

#### Tracing distribuído e OpenTelemetry

Em sistemas distribuídos, tracing é a única forma prática de enxergar a jornada da requisição entre serviços. OpenTelemetry virou o caminho mais pragmático para instrumentação consistente.

**Exemplo de configuração de ambiente para OpenTelemetry**

```yaml
env:
  - name: OTEL_SERVICE_NAME
    value: app-gerada-por-ia
  - name: OTEL_EXPORTER_OTLP_ENDPOINT
    value: http://otel-collector:4317
  - name: OTEL_RESOURCE_ATTRIBUTES
    value: service.namespace=platform,deployment.environment=prod
```

**Exemplo de arquitetura de observabilidade**

```mermaid
flowchart LR
    A[Aplicação] --> B[OpenTelemetry SDK]
    B --> C[OTel Collector]
    C --> D[Prometheus]
    C --> E[Grafana]
    C --> F[Backend de tracing]
    A --> G[Logs estruturados]
```

### Segurança

A camada de segurança sofre diretamente quando a aplicação foi construída sem revisão séria de fundamentos.

#### JWT implementado incorretamente

É comum ver JWT validado de forma parcial: assinatura ignorada, expiração tratada mal, audience inexistente e refresh token sem proteção adequada.

#### Autorização inexistente

Autenticação sem autorização é uma falha clássica. A aplicação reconhece o usuário, mas não valida o que ele pode ou não fazer.

#### Falhas recorrentes de aplicação

- SQL Injection por concatenação de string;
- XSS por escaping insuficiente;
- SSRF por consumo irrestrito de URL externa;
- upload inseguro sem validação de tipo e tamanho;
- CORS permissivo demais;
- rate limiting inexistente;
- secrets no repositório;
- dependências desatualizadas com CVEs conhecidas.

Essas falhas não são "detalhes". São resultado direto de um projeto que foi produzido sem modelo mental de segurança e sem revisão experiente. E são justamente o tipo de regressão de segurança que, como lembra o survey, costuma passar despercebida até chegar perto de produção.

**Exemplo de Kubernetes Deployment com requisitos mínimos de operação**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-gerada-por-ia
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app-gerada-por-ia
  template:
    metadata:
      labels:
        app: app-gerada-por-ia
    spec:
      terminationGracePeriodSeconds: 30
      securityContext:
        runAsNonRoot: true
      containers:
        - name: app
          image: registry.example/app:1.0.0
          ports:
            - containerPort: 3000
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "256Mi"
          startupProbe:
            httpGet:
              path: /health
              port: 3000
            failureThreshold: 30
            periodSeconds: 2
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            periodSeconds: 10
          lifecycle:
            preStop:
              exec:
                command: ["sh", "-c", "sleep 10"]
```

**Exemplo de Terraform para base de operação**

```hcl
terraform {
  required_version = ">= 1.6.0"
}

resource "kubernetes_namespace" "app" {
  metadata {
    name = "app-gerada-por-ia"
    labels = {
      owner = "platform"
      tier  = "prod"
    }
  }
}
```

## Impactos na operação

Quando uma aplicação chega nesse estado, o impacto não é apenas técnico. É organizacional.

### Operação mais lenta e mais cara

Cada incidente passa a exigir leitura de código, ajuste de infraestrutura, correção de build e, muitas vezes, intervenção manual. O time de plataforma deixa de operar um sistema e passa a sustentar um protótipo em produção.

### Mudanças viram risco

Sem testes, sem contratos e sem observabilidade, toda alteração parece arriscada. Isso desacelera times de produto e aumenta dependência de janelas de manutenção e hotfixes.

### Incidentes ficam mais difíceis de diagnosticar

Sem logs estruturados, sem tracing e sem métricas úteis, o tempo médio para identificar causa raiz cresce. O time investiga sintomas em vez de causas. E quando ninguém do time de produto entende a fundo o código que foi gerado, a investigação não tem a quem recorrer.

### Pipeline deixa de ser guardrail e vira obstáculo

Quando a base é ruim, a pipeline sofre. Ela precisa compensar ausência de padrões, blindar segredos, detectar vulnerabilidades, validar build e ainda impedir regressões funcionais. O resultado é um pipeline complexo, caro e, muitas vezes, contestado por quem produziu o código.

### O custo escondido

O survey de Xu chama atenção para custos que não aparecem em uma métrica de sucesso: retentativas, crescimento de contexto, tempo e intervenção humana. No onboarding acontece o mesmo. A velocidade de geração aparece no relatório do time de produto; as horas de triagem, retrabalho e hotfix aparecem no backlog de outro time. Se a organização só mede a primeira, vai sempre achar que a IA está saindo de graça.

## Como isso aumenta a dívida técnica

Dívida técnica não é só código feio. É uma obrigação acumulada que cresce quando a organização escolhe velocidade sem controle.

Com IA mal usada, a dívida aumenta em quatro dimensões:

1. **Dívida de arquitetura**: o sistema nasce sem fronteiras e fica mais caro de modularizar depois.
2. **Dívida operacional**: faltam sinais, contratos e previsibilidade para operar em produção.
3. **Dívida de segurança**: vulnerabilidades entram cedo e ficam muito mais caras para corrigir depois de espalhadas.
4. **Dívida de plataforma**: a equipe de DevSecOps precisa criar exceções, adaptar pipelines e construir remendos sob pressão.

Existe ainda uma quinta, mais silenciosa: **dívida de conhecimento**. Quando boa parte do código foi escrita por um agente e aceita sem revisão profunda, ninguém no time tem o modelo mental completo do sistema. A dívida não está só no código; está na falta de pessoas capazes de explicá-lo.

O grande problema é que IA acelera a criação dessa dívida. E dívida criada rápido parece produtividade no curto prazo.

## Como poderia ser evitado

Evitar esse cenário não significa bloquear IA. Significa colocar engenharia antes da automação. E, curiosamente, as recomendações que a pesquisa sobre agentes faz para tornar *agentes* confiáveis são praticamente as mesmas que fazemos para tornar *aplicações* confiáveis.

### 1. Definir um baseline arquitetural

Antes de gerar código, o time precisa definir as fronteiras do sistema, o modelo de estado, os contratos de integração e o padrão de persistência. Esse baseline deve virar contexto para o agente (por exemplo, em arquivos de instrução no repositório), e não ficar só na cabeça de quem desenhou.

### 2. Criar templates e starters oficiais

Times maduros não deixam cada projeto inventar sua própria forma de nascer. Eles disponibilizam skeletons, pipelines padrão, observabilidade padrão, policy-as-code e exemplos aprovados. Para um agente, um bom starter funciona como as interfaces estruturadas que o survey recomenda: restringe o espaço de ações possíveis e reduz a chance de desvio.

### 3. Exigir loops de verificação, não só geração

O padrão prático que o survey propõe para agentes de código é um loop explícito de verificação: rodar testes e linters, analisar a falha e corrigir até as checagens passarem, sempre com base em diagnósticos concretos. O mesmo vale para o processo do time: CI precisa bloquear código sem validação básica, e os testes precisam ser revisados por alguém que entenda a regra de negócio, não apenas gerados junto com o código.

### 4. Integrar segurança desde o início

SAST, SCA, secret scanning, container scanning, IaC scanning e SBOM devem fazer parte do fluxo padrão, não de uma etapa posterior.

### 5. Dar ao agente o mínimo de privilégio

Execução em sandbox, tokens com escopo mínimo, allowlist de ferramentas e aprovação humana para ações irreversíveis. O survey resume isso na ideia de **autonomia proporcional ao risco** (*budgeted autonomy*): quanto maior o impacto e menor a reversibilidade de uma ação, maior deve ser a verificação antes de executá-la. Gerar um teste unitário pode ser autônomo; alterar uma policy de IAM, não.

### 6. Projetar a aplicação para operar

Se ela não tem health checks, não é stateless, não respeita shutdown e não foi pensada para escalar, ela ainda não está pronta para produção.

Uma forma útil de formalizar isso é inspirada na proposta de *tool contracts* do survey, em que cada ferramenta tem pré-condições, pós-condições e evidências de auditoria. No nosso contexto, é um **contrato de onboarding**: um conjunto mínimo de pré-condições que a aplicação precisa cumprir antes de entrar no pipeline de produção.

| Pré-condição | Evidência esperada |
|---|---|
| Testes automatizados com asserts significativos | Relatório de cobertura e revisão humana dos testes críticos |
| Health, readiness e startup probes reais | Endpoints que verificam dependências, não só retornam `200` |
| Graceful shutdown | Tratamento de `SIGTERM` testado em rollout |
| Configuração externa ao código | ConfigMaps e Secrets, sem segredos no repositório |
| Logs estruturados, métricas e traces | Dashboards e `trace_id` correlacionável |
| Imagem mínima e não-root | Dockerfile multi-stage e scan sem HIGH/CRITICAL |
| Dependências conhecidas e verificadas | SBOM gerado e SCA aprovado |
| Rastreabilidade da geração | Registro de quais partes foram geradas por IA e quem revisou |

### 7. Tratar IA como copiloto, não como arquiteto

IA pode sugerir, acelerar e padronizar. Mas a responsabilidade por design, trade-offs e operação continua humana. Isso inclui revisão técnica séria, threat modeling e decisão consciente sobre o que entra ou não no sistema. Até o survey, escrito do ponto de vista de quem constrói agentes, mantém as decisões de alto impacto com humanos e trata a taxa de intervenção humana como métrica a ser reportada, não como falha a ser escondida.

```mermaid
flowchart TD
    A[Ideia ou backlog] --> B[Arquitetura mínima]
    B --> C[Starter padronizado]
    C --> D[IA acelera implementação em sandbox]
    D --> E[Loop de verificação: testes, lint, scans]
    E --> F[Revisão humana]
    F --> G[Contrato de onboarding cumprido]
    G --> H[Onboarding para produção]
    E -- falhou --> D
    F -- reprovado --> D
```

## Conclusão

Equipes DevSecOps não estão ali para dizer "não". Elas existem para tornar software colocável em produção de forma segura, observável, escalável e sustentável.

Quando uma aplicação quase toda gerada por IA chega sem fundamentos de engenharia de software, o time não encontra apenas bugs. Encontra ausência de pensamento de sistema, ausência de disciplina arquitetural e ausência de preocupação com operação.

Por isso, a discussão correta não é sobre culpar IA. A discussão correta é sobre responsabilidade técnica. IA é excelente para acelerar trabalho, mas também acelera erros quando o humano que guia o processo não domina os fundamentos. Como resume Xu (2026), confiabilidade e governança são propriedades da stack inteira, e não do modelo isolado.

> **Uma aplicação que funciona não é necessariamente uma aplicação pronta para produção.**

## Considerações finais

Se há uma lição prática aqui, ela é simples: a diferença entre protótipo e software de produção continua sendo engenharia.

Arquitetura continua sendo responsabilidade humana. System design continua sendo responsabilidade humana. Segurança continua sendo responsabilidade humana. E a missão de DevSecOps não é apenas construir pipelines; é transformar aplicações em ativos operáveis, auditáveis e resilientes.

Quando essa base existe, a IA vira multiplicador de capacidade. Quando ela não existe, a IA apenas deixa o problema mais rápido, mais barato de criar e mais caro de corrigir. Na rotina da equipe em que atuo, isso significa mais triagem, mais retrabalho e mais esforço para transformar uma entrega frágil em algo realmente operável. Ou, nas palavras do survey, é o trabalho de fechar a distância entre demonstrações impressionantes e implantação robusta no mundo real.

## Fontes e referências

### Referência bibliográfica

- XU, Bin. **AI Agent Systems: Architectures, Applications, and Evaluation**. arXiv:2601.01743, 2026. Disponível em: [https://arxiv.org/html/2601.01743v1](https://arxiv.org/html/2601.01743v1)

### Documentação técnica

As referências abaixo foram usadas como base para boas práticas de arquitetura, Kubernetes, observabilidade e segurança da cadeia de software:

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes: Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Kubernetes: Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)
- [Kubernetes: Define a Command and Arguments for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)
- [Grafana Documentation](https://grafana.com/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [Semgrep Documentation](https://semgrep.dev/docs/)
- [Trivy Documentation](https://trivy.dev/)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [GitHub Actions: Controlling permissions for GITHUB_TOKEN](https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [SonarQube Documentation](https://docs.sonarsource.com/sonarqube/)
- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
