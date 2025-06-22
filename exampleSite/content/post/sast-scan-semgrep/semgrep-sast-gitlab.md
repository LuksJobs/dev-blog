+++
author = "Lucas Oliveira"
title = "Varrendo o Código: Automatizando SAST com Semgrep e GitLab CI"
date = "2025-04-21"
description = "Integre Semgrep SAST no GitLab CI para automatizar a segurança do seu código e encontrar vulnerabilidades cedo."
tags = [
    "sast",
    "devsecops",
    "security",
]
categories = [
    "security",
]
image = "https://i.imgur.com/D5zEiSi.png"
+++

## Visão Geral

Imagine a cena: você está desenvolvendo aquela funcionalidade incrível, focado em entregar valor rápido. O código está "quase" pronto, passa nos testes unitários e de integração... **push**! **Merge Request** criado! Tudo lindo, certo? 😊

Nem sempre 🫤. Por trás da funcionalidade ou das funcionalidades, podem existir falhas de segurança esperando para serem descobertas – infelizmente, muitas vezes, por pessoas mal-intencionadas. É aí que entram as ferramentas de segurança, e mais especificamente, o **SAST** (Static Application Security Testing).

**A grande sacada**? Encontrar esses problemas cedo. Encontrar uma **vulnerabilidade** durante o desenvolvimento ou na pipeline de CI custa infinitamente menos para corrigir do que descobri-la em produção, talvez depois que um incidente já aconteceu. Integrar o SAST à sua pipeline de **CI/CD**, como a do **GitLab** (repositório utilizado como exemplo nesse post), significa que cada commit, cada Merge Request, pode ser automaticamente verificado, fornecendo feedback rápido para o time de desenvolvimento.

### 🛸 Semgrep: Um SAST Diferente (e Ótimo para CI)

Existem várias ferramentas de SAST por aí, algumas mais complexas, outras mais simples. O Semgrep se destaca por alguns motivos que o tornam um candidato ideal para pipelines de CI:

* **Velocidade**: Ele é rápido. Muito rápido. Isso é vital para não travar sua pipeline.
 * **Facilidade** de Uso e Regras Flexíveis: O Semgrep usa um motor de padrões poderoso e relativamente fácil de entender. Ele vem com um vasto conjunto de regras prontas (o registro de regras do Semgrep) para várias linguagens e frameworks, e criar regras customizadas é surpreendentemente acessível.
 * **Precisão**: Embora nenhum SAST seja perfeito (falsos positivos acontecem), o Semgrep costuma ter uma taxa de falsos positivos menor que ferramentas mais antigas, pois entende melhor a estrutura do código.
* **Suporte** a Múltiplas Linguagens: Ele suporta uma gama enorme de linguagens populares, o que é ótimo se você trabalha com um stack variado.

O **Semgrep** (https://semgrep.dev) não tenta ser um scanner de segurança "caixa preta" gigante. Ele é mais como um "*grep inteligente para código*", focado em encontrar padrões problemáticos de forma eficiente.

### Disponível em Open Source e Free Tier

A versão open source do Semgrep está disponível no GitHub (https://github.com/semgrep/semgrep?tab=readme-ov-file) e o Free Tier pode ser usada gratuitamente por qualquer pessoa através do site oficial do Semgrep (https://semgrep.dev). Com ela, é possível:

 * Rodar regras de segurança e boas práticas localmente;
 * Criar regras personalizadas para o seu código;
 * Integrar com CI/CD pipelines sem custo;
 * Contribuir com a comunidade criando ou ajustando regras.

Essa abordagem democratiza o acesso à segurança no desenvolvimento, tornando o Semgrep uma excelente escolha para projetos pessoais, startups ou empresas que estão começando a investir em práticas de DevSecOps.

### Fluxo de Scanner SAST na Pipeline

Integrar o job de **SAST** (Static Application Security Testing) na pipeline de CI/CD imediatamente após o commit é uma prática essencial para a segurança do software. Ao identificar vulnerabilidades logo no início, evitamos que elas avancem para fases mais onerosas do **ciclo de vida do desenvolvimento de software** (SDLC), como QA e produção, onde a correção se torna exponencialmente mais cara e complexa.

Este é, sem dúvida, um dos momentos mais estratégicos para fortalecer a segurança do código. A execução do SAST antes da revisão e aprovação do merge request (ou pull request) permite que:

 * Revisores analisem um código já pré-validado contra potenciais falhas de segurança.
 * A equipe de desenvolvimento pode aplicar e reforçar políticas de segurança mais rigorosas, como '*impedir o merge caso existam vulnerabilidades críticas*'.

![Diagrama do Semgrep](https://miro.medium.com/v2/resize:fit:1115/1*HjmSgFAXG8SIs9clczof3A.png)

### Integrando Semgrep (Cloud Free Tier) no GitLab CI

Para reproduzir os cenários abordados neste artigo, você só precisará de uma conta gratuita no GitLab e no Semgrep. No entanto, é importante destacar que todas as funcionalidades que exploraremos também estão disponíveis no GitLab Community Edition (CE). Nesse exemplo, utilizaremos a versão "Free Tier" do Semgrep Cloud, e faremos a integração em nossa pipeline de CI no Gitlab. 

🦊 `Repositório de exemplo`: https://gitlab.com/luksjobs/dotnet-unit-test/-/blob/master/.gitlab-ci.yml?ref_type=heads

Agora, a parte prática! Como fazemos para o Semgrep se tornar parte do seu fluxo de desenvolvimento no GitLab? Vamos configurar um job no seu arquivo .gitlab-ci.yml.
Vamos criar um novo stage e um job dedicado para a análise de segurança com Semgrep.

1. Passo: **Configurar o Job do Semgrep**

Agora, vamos definir o job que vai executar o Semgrep. Usaremos a imagem Docker oficial do Semgrep, que já vem com tudo o que precisamos.

```yaml
semgrep_sast:
  image: semgrep/semgrep
  script: semgrep ci
  rules:
  - if: $CI_PIPELINE_SOURCE == "web"  # allow triggering a scan manually from the gitlab UI
  - if: $CI_MERGE_REQUEST_IID  # scan on merge request events
  - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH  # scan on push events to default branch
  variables:
    
    SEMGREP_APP_TOKEN: $SEMGREP_APP_TOKEN
    # To configure MR comments on gitlab.com, see https://semgrep.dev/docs/semgrep-cloud-platform/gitlab-mr-comments/#steps-to-set-up-mr-comments
    # GITLAB_TOKEN: $PAT
```
2. Passo: **Configurar token de CI** 

Nas variáveis de "CI/CD" do seu projeto no GitLab, será necessário criar a variável: "`SEMGREP_APP_TOKEN` no qual o valor, será o token criado pelo snippet do Semgrep, assim quando você se autenticar na plataforma e criar um novo projeto de integração com o CI/CD do Gitlab, um token será criado.

3. Passo: **Executar a Pipeline no Gitlab**

Agora que já temos tudo configurado em nosso template do gitlab e o token definido nas variáveis do CI/CD e se tudo ocorrer bem, a pipeline será executada e logo em seguida o **Semgrep** aplicará as policies de segurança dependendo do tipo de Stack utilizada em seu projeto.

### Interpretando os Resultados via Logs do Gitlab

![Resultado do Semgrep no GitLab CI](https://i.imgur.com/6a0gn5c.png)

Uma vez que a pipeline rodar e o job **semgrep_sast** for concluído (com sucesso ou falha), onde você vê os problemas encontrados?

* **Logs do Job**: Você sempre pode ver a saída completa do Semgrep diretamente nos logs do job na interface do GitLab.
* **Aba "Security" na Pipeline**: Se você usou artifacts: reports: sast: gl-sast-report.json, o GitLab processará este arquivo e exibirá um resumo na aba "Security" da página da pipeline.
* **Widget de Segurança no Merge Request**: Onde a mágica realmente acontece! No Merge Request, abaixo das informações de commit e pipelines, o GitLab mostrará um widget de segurança comparando os resultados do branch de origem com o branch de destino (default). Ele destacará novas vulnerabilidades introduzidas pelo seu código e vulnerabilidades que foram resolvidas. Isso fornece um feedback direto para o desenvolvedor revisando o MR.

### **Interpretando os Resultados via Dashboard**: 

Como executamos essa pipline utilizando a solução do "Free Tier" do Semgrep Cloud, então conseguimos verificar os resultados via dashboard, através do seu painel do seu projeto no: "https://semgrep.dev". 

![Resultado do Semgrep no Dashboard](https://i.imgur.com/iMNPFd6.png)

No meu caso, como é uma aplicação Dotnet simples, nesse scan, não foram encontrados vulnerabilidades porém isso ainda assim não é uma garantia de ausência total de vulnerabilidades, mas indica que o Semgrep, com as regras e escopo aplicados, não encontrou padrões problemáticos. É um ponto de partida positivo, mas complemente com outras formas de teste de segurança (**DAST**, testes manuais, etc.), falarei com mais detalhes sobre esse tema em outro post 😁

![Resultado do Semgrep no Dashboard](https://i.imgur.com/gJ2wwCC.png)

### Considerações Finais

Integrar o Semgrep na sua pipeline de CI do GitLab é um passo proativo e relativamente simples para fortalecer a segurança das suas aplicações. Ao automatizar a varredura de código em cada alteração, você empodera seu time de desenvolvimento a encontrar e corrigir vulnerabilidades antes que elas se tornem um problema sério em produção.

Se você é desenvolvedor, não encare o **SAST** como um obstáculo, mas sim como um aliado que te dá feedback rápido e ajuda a manter a qualidade e a segurança do seu código em alta. Com Semgrep e GitLab CI trabalhando juntos, você está construindo um fluxo de trabalho mais seguro e confiável, commit por commit.

Experimente, ajuste as regras às suas necessidades e veja a diferença que uma análise de segurança contínua pode fazer!
