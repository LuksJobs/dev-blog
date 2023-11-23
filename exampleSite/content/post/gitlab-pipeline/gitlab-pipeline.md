+++
author = "Lucas Oliveira"
title = "Gitlab CI para construção de imagens Docker, criação de tags no Git e envio para o registro Docker"
date = "2023-07-26"
description = "Pipeline do GitLab CI para construir contêineres Docker, adicionar tags ao código no Git e enviar o novo contêiner gerado para o seu registro de imagens Docker."
tags = [
    "docker",
    "gitlab",
    "cicd",
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

```
image: docker:latest
services:
    - docker:dind
stages:
    - Dev
    - Prod-Tag
    - Prod-publish

variables:
    REGISTRY: seuregistro.com.br
    REPOSITORY: suaimagem/docker 

before_script:
    # verificando a VERSÃO do arquivo
    - chmod +x script.sh; ./script.sh
    - if [ ! -f VERSION ]; then echo "A versão dessa imagem não foi encotrada!"; exit 1; else export VERSION=$(cat VERSION); fi
    - 'echo "Executando Pipeline para a imagem: $REGISTRY/$REPOSITORY:${VERSION}"'

build:
    stage: Dev
    script:
        - docker build -t $REGISTRY/$REPOSITORY .
    tags:
        - node-busy
    only:
        - branch-específica

publish:
    stage: Prod-publish
    dependencies:
        - build
        - docker-tag
    script:
        # carrengando as variáveis "$REGISTRY_USER" e "$REGISTRY_PW" 
        - if [ -z ${REGISTRY_USER+x} ]; then echo "REGISTRY_USER não definida!"; exit 1; fi
        - if [ -z ${REGISTRY_PW+x} ]; then echo "REGISTRY_PW não definida!"; exit 1; fi
        # login no registro docker (Harbor)
        - docker login -u $REGISTRY_USER -p $REGISTRY_PW $REGISTRY
        # verificando as imagens antigas (Host)
        #- docker load -i image.tar
        # Enviando a nova imagem ao repositório (Harbor)
        - docker tag $REGISTRY/$REPOSITORY:latest $REGISTRY/$REPOSITORY:$VERSION
        - docker push $REGISTRY/$REPOSITORY:$VERSION
    tags:
        - node-busy
    only:
        - branch-específica

docker-tag:
    image: python:3.7-stretch
    stage: Prod-Tag
    dependencies:
        - build
    script:
        - mkdir -p ~/.ssh && chmod 700 ~/.ssh
        # utilizando a chave ssh para realizar o tagueamento da nova imagem
        - ssh-keyscan gitlab.com >> ~/.ssh/known_hosts && chmod 644 ~/.ssh/known_hosts
        - eval $(ssh-agent -s)
        #- echo -n "$SSH_DEPLOY_KEY" | tr -d '\r' | ssh-add - > /dev/null
        - chmod +x tag.py
        - ./tag.py
    #when: manual
    allow_failure: false
    tags:
        - node-busy
    only:
        - branch-específica
```

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

`tag.py`

```
#!/usr/bin/env python3
import os
import re
import sys
import subprocess


def git(*args):
    return subprocess.check_output(['git'] + list(args))


def tag_repo(tag):
    url = os.environ['CI_REPOSITORY_URL']

    # "Transforma a URL do repositório para a URL SSH"
    # Exemplo de entrada: https://gitlab-ci-token:xxxxxxxxxxxxxxxxxxxx@gitlab.com/luksjobs/pipelineexample.git
    # Exemplo de saída: gitlab.com/luksjobs/pipelineexample.git

    push_url = re.sub(r'.+@([^/]+)/', r'git@\1:', url)

    git('remote', 'set-url', '--push', 'origin', push_url)
    git('tag', tag)
    git('push', 'origin', tag)


def main():
    if 'VERSION' not in os.environ:
        print('VERSÃO não definida')
        return -1
    version = os.environ['VERSION']

    # verifique se a versão já existe
    tags = git('describe', '--tags', '--always').decode().strip()
    if version in tags:
        print('Essa versão de imagem: "',version,'" já existe! ლ(ಠ益ಠლ)')
        return -1

    tag_repo(version)

    return 0


if __name__ == '__main__':
    sys.exit(main())
```

Esse script forçará o uso de uma nova tag sempre que um novo commit ou merge request subir para a branch especificada no CI; E esse estágio será o estágio que tanto adicionará uma nova tag ao repositório do gitlab quanto ao tag utilizado na imagem Docker.

`VERSION`

```
0.0.1
```

Com as dependências e variáveis criadas agora basta criar o runner e rodar o projeto, se tudo der certo, o seu pipeline versionará tanto o seu repositório GIT tanto quanto as versões da suas imagens Docker serão igual à versão da tag do seu repositório.