+++
author = "Lucas Oliveira"
title = "Gitlab CI para construção de imagens Docker, criação de tags no Git e envio para o registro Docker"
date = "2023-07-26"
image = "https://i.imgur.com/v8f4vqF.png"
description = "Pipeline do GitLab CI para construir contêineres Docker, adicionar tags ao código no Git e enviar o novo contêiner gerado para o seu registro de imagens Docker."
categories = [
    "cicd",
]
tags = [
    "docker",
    "ci/cd",
]
+++

O CI (**Integração Contínua**) do GitLab é uma ferramenta essencial para a construção de imagens Docker, criação de tags no Git e envio para o registro Docker. Ele automatiza todo o processo de integração, teste e implantação contínua, garantindo que suas alterações de código sejam testadas e implantadas de forma confiável. 

<!--more-->

## Repositório: 

Use o repositório como exemplo: [Docker Tag Pipeline](https://gitlab.com/devops3530230/docker-tag-pipeline) 

## Introdução

Ao usar um CI do **GitLab** em conjunto com o Docker, você pode criar pipelines automatizados que executam etapas como compilação, teste e empacotamento de aplicativos em contêineres Docker. Isso ajuda a garantir que suas imagens Docker estejam sempre atualizadas e prontas para implantação. 

Além disso, o CI do GitLab permite que você crie tags no Git, que são marcadores significativos para versões específicas do seu código. Essas tags podem ser usadas para rastrear e identificar facilmente versões estáveis do seu aplicativo ou serviço. 
 
Uma vez que suas imagens Docker estejam construídas e suas tags estejam definidas, o CI do GitLab também facilita o envio dessas imagens para um registro Docker, como o Docker Hub. Isso permite que você compartilhe e distribua suas imagens Docker de maneira eficiente. 

## Configuração da Pipeline

Na raiz do seu repositório crie um arquivo chamado de `".gitlab-ci.yml"`, esse arquivo será responsável pelas configurações definidas nos estágios do seu pipeline:

<script src="https://gist.github.com/LuksJobs/81c99ccfbced1b2c1d6d133a16c9f412.js"></script>

## Variáveis de Ambiente do Gitlab

* Crie uma variável no GitLab para REGISTRY_USER e REGISTRY_PW. Onde "**REGISTRY_USER**" é o nome de usuário e "**REGISTRY_PW**" senha do seu registro de imagems do Docker! No seu projeto, vá para Configurações > CI/CD > Variáveis e crie as duas variáveis. 
 
* Crie uma Chave de Implantação (Deploy Key) com acesso de gravação ao seu repositório e adicione-a como **SSH_DEPLOY_KEY** às variáveis. Primeiro, você precisa criar uma chave pública e privada. Para fazer isso, abra o seu terminal Git-Bash e digite: ```ssh-keygen -o -t rsa -b 4096 -C "email@example.com" -f ssh-key```. Copie a chave pública para o token em Settings > Repository > Deploy Keys e a chave privada para as sua variável "**SSH_DEPLOY_KEY**".

Obs: a chave ssh gerada é a qual o Runner for utilizar, então se você está usando o usuário padrão do Gitlab (gitlab-runner) será necessário criar a chave para esse usuário e cadastrar nas variáveis mencionadas acima;

![Variável de Ambiente](https://i.imgur.com/cbRYwHn.png)

## Configurando as Dependências

Essa pipeline utiliza: "`scripts em shell`", script em "`python`" e um arquivo "`.env`" em determinados estágios do Pipeline, então, será necessário criar os arquivos de script:

`script.sh`

```
#!/bin/bash
 # Leia o valor da variável "IMAGE_TAG" do arquivo ".env"
image_tag=$(grep IMAGE_TAG .env | cut -d '=' -f2)
 # Copiar o valor para o arquivo "VERSION"
echo "$image_tag" > VERSION
```

Esse script é responsável em ler os valores do nosso arquivo de variáves **".env"** e alterar os valores de versão do arquivo **"VERSION"** pois esse arquivo version é necessário para o nosso código em python interpretar qual a tag do nosso repositório git;

`.env`

```
DOCKER_USERNAME = "usuariodorepositoriodeimagens" 
APPLICATION_NAME = "nomedaaplicao" 
IMAGE_TAG =0.0.1
VERSION =0.0.1
```

Agora será necessário criar o script que irá versionar o nosso repositório do Gitlab:

<script src="https://gist.github.com/LuksJobs/836289698230b5ca44c76befdfdd7b07.js"></script>

Esse script forçará o uso de uma nova tag sempre que um novo commit ou merge request subir para a branch especificada no CI; E esse estágio será o estágio que tanto adicionará uma nova tag ao repositório do gitlab quanto ao tag utilizado na imagem Docker.

`VERSION`

```
0.0.1
```

Com as dependências e variáveis criadas agora basta criar o runner e rodar o projeto, se tudo der certo, o seu pipeline versionará tanto o seu repositório GIT tanto quanto as versões da suas imagens Docker serão igual à versão da tag do seu repositório.