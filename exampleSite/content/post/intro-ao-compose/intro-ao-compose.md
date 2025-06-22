+++
author = "Lucas Oliveira"
title = "Introdução e Instalação do Docker Compose"
date = "2019-10-12"
description = "Nesse rápido tutorial, mostrarei o conceito de como instalar e usar o Docker-Compose."
image = "https://i.imgur.com/WMMXkQn.png"
tags = [
    "docker", "devops","docker-compose"
]
categories = [
    "docker",
]
+++

**Docker Compose** é uma ferramenta de *orquestração de contêineres* que permite agrupar vários serviços de contêiner em uma única aplicação. Ele é usado para definir e gerenciar aplicações em contêineres de forma simples e eficiente.

## **Como funciona**

O Docker Compose usa um arquivo de configuração chamado `docker-compose.yml` para definir a aplicação. O arquivo de configuração especifica os serviços de contêiner que compõem a aplicação, bem como suas dependências e configurações.

O Docker Compose usa o arquivo de configuração para criar e iniciar os serviços de contêiner. Ele também gerencia os serviços de contêiner, monitorando seu status e reiniciando-os se eles falharem.

**Benefícios**

O Docker Compose oferece uma série de benefícios, incluindo:

* **Simplicidade**: O Docker Compose simplifica a criação e o gerenciamento de aplicações em contêineres.
* **Escalabilidade**: O Docker Compose permite que você escale suas aplicações adicionando ou removendo serviços de contêiner.
* **Recursos**: O Docker Compose fornece uma série de recursos avançados, como balanceamento de carga, rede e volumes compartilhados.
Exemplo

Aqui está um exemplo de arquivo de configuração `docker-compose.yml` para uma aplicação web simples:

```
YAML
version: '3.8'
services:
  web:
    image: nginx
    ports:
      - 80:80
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
```

Este arquivo de configuração define dois serviços de contêiner: um serviço web que hospeda um servidor web nginx e um serviço db que hospeda um banco de dados MySQL.

## **Para criar e iniciar a aplicação, execute o seguinte comando**:

```
docker-compose up
```

Este comando criará os dois serviços de contêiner e os iniciará. O servidor web nginx estará disponível em `localhost:80` e o banco de dados MySQL estará disponível em `localhost:3306`.

## Instalação do Docker Compose

* Página oficial de instalação: https://docs.docker.com/compose/install/

## **Instalação de forma automática via "curl"**:

```
1. $ mkdir -p ~/.docker/cli-plugins/
2. $ curl -SL https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
3. $ chmod +x ~/.docker/cli-plugins/docker-compose
4. $ docker compose version
```

## **Instalação de forma manual**:

Esta opção requer o gerenciamento de atualizações manualmente. Recomendo configurar o repositório do Docker para facilitar a manutenção.

1. Para baixar e instalar o plugin Compose CLI, execute o seguinte comando:

```
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.14.0/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
```

Este comando baixa a versão mais recente do Docker Compose (do repositório de lançamentos do Compose) e instala o Compose para o usuário ativo no diretório $HOME.

1. Para instalar:

* Docker Compose para todos os usuários do sistema, substitua `~/.docker/cli-plugins` por `/usr/local/lib/docker/cli-plugins.`
Uma versão diferente do Compose, substitua v2.14.0 pela versão do Compose que você deseja usar.
* Para uma arquitetura diferente, substitua x86_64 pela arquitetura que você deseja.

2. Aplique permissões executáveis ao binário:

Melhorias:

Tornei o texto mais natural e direto.
Substituí "latest release" por "versão mais recente" para maior fluidez.
Usei "substitua" para facilitar a compreensão das opções de alteração de versão e arquitetura.
Escrevi "binário" em minúsculo para padronização.
Espero que esteja adequado!

```
 chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
```

3. Verificando se a instalação deu certo:

```
docker compose version
```

4. E por último: permissão para executar o Docker

```
docker permission
$ sudo groupadd docker
$ sudo usermod -aG docker $USER

# docker-compose permission
$ sudo chmod 666 /var/run/docker.sock
```


É isso! Espero que tenha te ajudo e tirado algumas dúvidas :)