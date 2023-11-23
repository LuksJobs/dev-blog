+++
author = "Lucas Oliveira"
title = "Template para pipeline no Azure Devops"
date = "2023-08-02"
description = "As pipelines do Azure DevOps são uma ferramenta poderosa para automatizar e gerenciar o fluxo de trabalho de desenvolvimento de software."
tags = [
    "pipeline",
    "azure devops",
    "cicd",
]
+++
Com as pipelines do `Azure DevOps`, você pode definir etapas e tarefas personalizadas para compilar, testar e implantar seu código. Isso inclui integração contínua (**CI**) e entrega contínua (**CD**).

<!--more-->

O template abaixo pode ser usado como um ponto de entrada inicial para seus pipelines de DevOps. Ele foi projetado levando em consideração as melhores práticas, com estágios e jobs para isolar diferentes funcionalidades e torná-lo modular. Você pode incluir mais estágios, jobs e tarefas copiando e colando o código.

```
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: Build
  displayName: 'Build Stage'
  jobs:
  - job: BuildJob
    displayName: 'Build Job'
    steps:
    - script: |
        echo 'Building the application...'
        # Comandos para compilar o código fonte
      displayName: 'Build Application'

- stage: Test
  displayName: 'Test Stage'
  dependsOn: Build
  jobs:
  - job: TestJob
    displayName: 'Test Job'
    steps:
    - script: |
        echo 'Running tests...'
        # Comandos para executar testes automatizados
      displayName: 'Run Tests'

- stage: Deploy
  displayName: 'Deployment Stage'
  dependsOn: Test
  jobs:
  - deployment: DeployJob
    displayName: 'Deployment Job'
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: |
              echo 'Deploying the application...'
              # Comandos para implantar a aplicação em um ambiente de produção
            displayName: 'Deploy Application'
```

## Se tudo tiver dado certo, esse é o resultado esperado:

![Pipeline Azure Devops](https://i.imgur.com/sycSHbQ.png)

## Essa pipeline do Azure DevOps é estruturada da seguinte forma: 

Cabeçalho da estrutura da Pipeline:

**Trigger** (Gatilho): 
- A pipeline é acionada quando há alterações no branch "**main**". 
 
**Pool**: 
- A pipeline utiliza uma imagem de máquina virtual baseada no kernel do **Ubuntu** para execução. 
 
## Estágios da Pipeline: 

1. `Estágio de Build`: 

- O primeiro estágio é chamado de "**Build Stage**" (Estágio de Construção). 
- Ele consiste em um único job chamado "**BuildJob**" (Trabalho de Construção) responsável por construir a aplicação. 
- O job executa um script que exibe a mensagem "*Building the application*..." (Construindo a aplicação...) e inclui comandos para compilar o código-fonte. 
 
2. `Estágio de Teste`: 

- O segundo estágio é chamado de "**Test Stage**" (Estágio de Teste). 
- Ele depende da conclusão bem-sucedida do estágio "**Build**". 
- Ele inclui um único job chamado "**TestJob**" (Trabalho de Teste) responsável por executar os testes automatizados. 
- O job executa um script que exibe a mensagem "*Running tests*..." (Executando testes...) e inclui comandos para executar os testes automatizados. 

3. `Estágio de Implantação`: 

- O terceiro estágio é chamado de "**Deployment Stage**" (Estágio de Implantação). 
- Ele depende da conclusão bem-sucedida do estágio "**Test**". 
- Ele inclui um único job de implantação chamado "**DeployJob**" (Trabalho de Implantação) responsável por implantar a aplicação em um ambiente de produção. 
- O job de implantação executa um script que exibe a mensagem "*Deploying the application*..." (Implantando a aplicação...) e inclui comandos para implantar a aplicação em um ambiente de produção. 
 

<blockquote>Essas são as estruturas da pipeline, onde cada estágio depende do estágio anterior para ser executado. Cada job dentro dos estágios executa etapas específicas, como compilar, testar e implantar a aplicação.</blockquote>
 
 
Em resumo, essa pipeline não possui um gatilho (trigger) configurado para ser executada automaticamente. Ela é um template que tem um estágio com dois jobs, onde cada job executa um script específico. Essa pipeline pode ser usada para realizar tarefas personalizadas ou executar etapas específicas do fluxo de trabalho de desenvolvimento. Sinta-se a vontade para utiliza-lá em seus projetos!