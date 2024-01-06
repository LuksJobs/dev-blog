+++
author = "Lucas Oliveira"
title = "Como remediar problemas de segurança em imagens Docker descobertos pelo Docker Scout "
date = "2024-01-06"
description = "Nesse post iremos escanear uma aplicação em Node JS utilizando o Docker Scout pela linha de comando (CLI)"
image = "https://raw.githubusercontent.com/LuksJobs/dev-blog/c02436828a584dded3e400b0ae68cfe862c8dd47/exampleSite/content/post/docker-scout/docker-scout.jpg"
tags = [
    "docker", "devops", "docker-scout",
]
categories = [
    "docker",
]
+++

Olá folks, tudo bem com vocês? Espero que sim! 😅 Nesse post venho trazendo uma novidade dentro do universo de ferramentas do Docker: "**Docker Scout**" que é uma espécie de "linter" das imagens do docker que serve para analisar o conteúdo da imagem e gerar um relatório detalhado dos pacotes e vulnerabilidades que detecta. Ele pode fornecer sugestões sobre como remediar problemas descobertos pela análise de imagens. Nesse guia iremos utilizar uma imagem de contêiner vulnerável com o Node JS e mostrar como usar o **Docker Scout** para identificar e corrigir as vulnerabilidades, comparar versões de imagens ao longo do tempo e compartilhar os resultados obtidos com sua equipe de Segurança ou seja lá qual for sua intenção.

### O Docker Scout oferece as seguintes funcionalidades:

* **Análise de segurança**: O Docker Scout identifica vulnerabilidades de segurança conhecidas nas imagens (CVES). Ele também fornece informações sobre as vulnerabilidades, incluindo a gravidade, a data de descoberta e a versão da imagem em que a vulnerabilidade foi corrigida.
* **Análise de conformidade**: O Docker Scout pode ser usado para verificar a conformidade de imagens com padrões de segurança e conformidade.
* **Análise de desempenho**: O Docker Scout fornece informações sobre o tamanho, o número de camadas e o digest das imagens. Essas informações podem ser usadas para melhorar o desempenho dos contêineres.

### Como usar o Docker Scout?

O Docker Scout está disponível como um pacote Docker, extensão do Docker Desktop ou em binário, via CLI. Nesse caso, iremos utilizar e instalar via CLI através do [repositório oficial do Docker, no Github](https://github.com/docker/scout-cli);
* Para instalá-lo é necessário antes realizar o login no Docker, caso você não tenha cadastro para continuar nessa etapa, será necessário se cadastrar no [Docker Hub](https://hub.docker.com/) e logo após realizar o login pela linha de comando, execute o seguinte comando:

```bash
$ docker login 
```
![dockerlogin](https://raw.githubusercontent.com/LuksJobs/dev-blog/c02436828a584dded3e400b0ae68cfe862c8dd47/exampleSite/content/post/docker-scout/1dockerlogin.png)

Feito login, agora poderemos instalar o **Docker Scout** que está disponível como um script de instalação. Para instalá-lo, execute o seguinte comando:

```bash
$ curl -sSfL https://raw.githubusercontent.com/docker/scout-cli/main/install.sh | sh -s --
```
![dockerscoutinstall](https://raw.githubusercontent.com/LuksJobs/dev-blog/c02436828a584dded3e400b0ae68cfe862c8dd47/exampleSite/content/post/docker-scout/dockerscout-install.png)

🚀 Obs: caso queira instalar de forma manual, recomendo fortemente seguir as orinetação do [repositório oficial do Docker, no Github](https://github.com/docker/scout-cli)

Realizado a instalação, agora basta testar executando o comando: 

```bash
$ docker scout version 
```

Se tudo tiver ocorriddo bem, você verá o seguint output: 

![dockerversion](https://raw.githubusercontent.com/LuksJobs/dev-blog/c02436828a584dded3e400b0ae68cfe862c8dd47/exampleSite/content/post/docker-scout/dockerscoutwin.png)

### Análise de Imagens Docker

Agora que fizemos login no Docker Hub e temos o Docker Scout CLI instalado, estamos habilitados a começar a analisar nossas imagens Docker! 
* Analisar vulnerabilidades de imagem após a construção (docker build), iremos utilizar os comandos na CLI do docker scout para ver as vulnerabilidades detectadas pelo Docker Scout: 
* No meu caso, irei utilizar uma simples aplicação em Node JS para realizar alguns testes e verificar se existe vunerabilidade, caso tenha interesse, o repositório está livre para você usar: [NodeJS busybox](https://github.com/LuksJobs/node-busy-box)


### Primeiro, iremos clonar o repositório

```bash
$ git clone https://github.com/LuksJobs/node-busy-box  && cd node-busy-box/
```

### Com o repositório da nossa aplicação em "mãos" podemos buildar nossa imagem

```bash
$ docker build . -t luksjobs/nodejs:dev
```

![dockerversion](https://raw.githubusercontent.com/LuksJobs/dev-blog/c02436828a584dded3e400b0ae68cfe862c8dd47/exampleSite/content/post/docker-scout/dockerbuild.png)

### Agora com nossa imagem pronta, lets go analyze! 

1. Precisamos copiar o nome (repository) e a tag de nossa imagem, no meu caso "`luksjobs/nodejs:dev`":

![dockerimagesls](https://raw.githubusercontent.com/LuksJobs/dev-blog/c02436828a584dded3e400b0ae68cfe862c8dd47/exampleSite/content/post/docker-scout/dockerscout1.gif)

2. Agora que temos as informações sobre a nossa imagem, iremos escaner com a função "quickview" (visão rápida) do Docker Scout:

```bash
$ docker scout quickview luksjobs/nodejs:dev
```

![dockerimagesls](https://raw.githubusercontent.com/LuksJobs/dev-blog/c02436828a584dded3e400b0ae68cfe862c8dd47/exampleSite/content/post/docker-scout/dockerscout2.gif)

Nesse ponto, de primeira analise, o **docker scout** nos trouxe informações de que a nossa imagem possui algumas CVES (vulnerabilidades) e para detalhar o que seria necessário fazer para corrigir essas vulnerabilidades precisamos rodar um outro comando para detalhar mais ainda o que de fato está vulnerável em nossa imagem para que posteriormente, possamos corrigir.

3. Com a analise da nossa imagem feita, poderemos agora verificar as recomendações de como corrigir essas vulnerabilidades com o comando abaixo:

```bash
$ docker scout recommendations luksjobs/nodejs:dev
```
![dockerimagesls](https://raw.githubusercontent.com/LuksJobs/dev-blog/c02436828a584dded3e400b0ae68cfe862c8dd47/exampleSite/content/post/docker-scout/dockerscoutrecomend.gif)

### Conclusão

O Docker Scout reúne todas as informações que você precisa ao trabalhar para proteger o desenvolvimento do seu contêiner, incluindo uma visão camada por camada das dependências, suas vulnerabilidades conhecidas e caminhos de correção recomendados . É isso, temos agora uma tabela de recomendação de cada item que possuí uma CVE detectada e uma lista de reecomendações para resolver e corrrigir esses atributos da nossa imagem Docker, espero que você tenha gostado do post :)

Lista de comandos do Docker Scout em PDF: [Scout Cheat Sheet](https://www.docker.com/cheat-sheets/scout/)