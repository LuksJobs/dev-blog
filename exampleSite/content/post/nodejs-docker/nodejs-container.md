+++
author = "Lucas Oliveira"
title = "Rode seu aplicativo Node.js em container usando o Docker"
date = "2022-06-12"
description = "Iremos dockerizar uma aplicação em NodeJS utilizando o Docker Compose"
tags = [
    "docker", "devops",
]
+++

Nesse post, desenvolvi um simples aplicativo utilizando o **Node.js** para demonstrar que ao invés de você rodar esse seu software localmente (self hosted) com o express também há a possibilidade de rodar em container de forma persistente utilizando o **docker** e **docker-compose**.

<!--more-->

Os códigos usados nesse post estão no repositório: https://gitlab.com/luksjobs/nodejs-aula-dev

Criando a “receita de bolo”, nosso **Dockerfile**
Para rodar uma aplicação dentro do Node.js utilizando o Docker, você precisará seguir alguns passos básicos:

Crie um arquivo chamado de: “Dockerfile", sim com o “D” maiúsculo na raiz do diretório do projeto, com o seguinte conteúdo:

```
# Define a imagem base a ser utilizada pelo docker
FROM node:14

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto, nesse caso utilizei o npm
RUN npm install

# Copia o restante do código para o diretório de trabalho do container
COPY . .

# Expõe a porta em que a aplicação irá rodar
EXPOSE 3000

# Inicia a aplicação
CMD [ "npm", "start" ]

```

Este arquivo define a imagem base a ser utilizada (node:14), cria um diretório de trabalho (/usr/src/app), copia os arquivos de configuração (package.json e package-lock.json) e instala as dependências do projeto. Em seguida, copia o restante do código para o diretório de trabalho, expõe a porta em que a aplicação irá rodar (3000) e define o comando para iniciar a aplicação (npm start).

## ‘Buildando’ nossa imagem Docker

Este comando irá construir a imagem Docker a partir do Dockerfile e dará um nome à imagem (nome-da-imagem). O ponto final (.) indica que o Dockerfile está na raiz do diretório atual.

## Rodando nosso container a partir da imagem criada

Este comando irá rodar o container Docker a partir da imagem criada anteriormente (nome-da-imagem) e mapeará a porta da máquina host (3000) para a porta do container Docker (3000).

Com esses passos básicos, você deve ser capaz de rodar sua aplicação Node.js em um container Docker. É importante lembrar que você pode precisar adaptar o Dockerfile dependendo das necessidades específicas do seu projeto.

### Acessando sua aplicação via Web

Para acessar seu container, bata digitar em seu navegador de internete preferido: “localhost:3000” ou então especificar seu IP e Porta: “10.10.1.0:3000“.

## Parando ou Removendo o Container
Já terminou os testes e agora não há mais a necessidade de manter o container em “pé” ou “rodando”, para parar ou remover esse container, existe os dois comandos abaixo:

- Parando o Container
```
docker container stop nome-do-container
```

- Removendo o Container
```
docker container rm -f "nome-do-container"
```

## Criando o Docker-compose

Para criar um docker-compose para uma aplicação Node.js, você precisa seguir os seguintes passos:

Crie um arquivo docker-compose.yml na raiz do seu projeto. Defina os serviços necessários para a sua aplicação, como o serviço do Node.js. Defina as configurações para cada serviço, como as portas de exposição, as variáveis de ambiente, os volumes, etc.

Aqui está um exemplo básico de um arquivo docker-compose.yml para uma aplicação Node.js:

```
version:"3"
services:
nodejs-luksjobs:
container_name:luksjobs/nodejs
image:nome-da-sua-imagem
ports:
  -"3000:3000"
environment:
NODE_ENV:development
volumes:
  -.:/app
working_dir:/app
command:npm start
```

## Rodando o Container a partir do Compose

No terminal, navegue até o diretório onde o arquivo  docker-compose.yml  está localizado. 
 
1. Execute o comando  `docker-compose up`  para iniciar todos os serviços definidos no arquivo  docker-compose.yml . Se você quiser executar os serviços em segundo plano, adicione a opção  -d  ao comando, ficando  `docker-compose up -d` . 
 
2. O Docker Compose irá baixar as imagens necessárias, criar os containers e iniciar os serviços especificados. Você poderá ver os logs de cada serviço sendo executado. 


Espero que você tenha gostado do artigo! Você pode me ajudar compartilhando esse post em suas redes sociais 🙂