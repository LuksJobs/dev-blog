+++
author = "Lucas Oliveira"
title = "Dockerfile, a receita de bolo do Docker (Guia Prático)"
date = "2019-09-22"
description = "Iremos dockerizar uma aplicação em NodeJS utilizando o Docker Compose"
image = "https://i.imgur.com/UYrnMfy.png"
tags = [
    "docker", "devops",
]
+++

Um **Dockerfile** é um arquivo de texto simples que contém uma lista de comandos que o cliente do Docker chama durante a criação de uma imagem. É uma maneira simples de automatizar o processo de criação de imagens. Em essência, é uma lista de comandos que o mecanismo do Docker executa para montar a imagem e, assim, instâncias de imagens como contêineres.

<!--more-->

A melhor parte é que os comandos que você escreve em um Dockerfile são quase idênticos aos seus comandos equivalentes no Linux. Isso significa que você não precisa aprender a nova sintaxe para criar seus próprios dockerfiles.

Nesse tutorial iremos realizar a instalação do Alpine pela forma automatica via DockerHub e depois com uma imagem Dockerfile. O Alpine Linux é uma distro GNU/Linux construída em torno das bibliotecas musl, libc e do Busybox.Estas características permitem que seja bastante pequena e muito eficiente em termos de uso de recursos do sistema. Para rodar no Docker, o contêiner não requer mais do que 8 MB.

## **Obtendo imagens Via Dockerhub**

Agora iremos baixar e usar uma imagem do **Alpine Linux**, não iremos precisar de um Dockerfile, porquê!? Quando uma imagem não é encontrada localmente, ela é baixada automaticamente, pelo **Docker Hub**. Então ao executarmos o comando abaixo ele dará um pull direto do dockerhub, nos trazendo a imagem do Alpine pronta, veja só:

```
docker pull alpine
```

Após isso, veja o resultado abaixo:

```
latest: Pulling from library/alpine
ee54741ab35b: Pull complete 
Digest: sha256:24a36bbc059b1345b7e8be0df20f1b23caa3602e85d42fff7ecd9d0bd255de56
Status: Downloaded newer image for alpine:latest

```

Repare agora que se você executar o comando "`docker ps`" em seu terminal neste momento, já é possível ver a imagem na relação de disponíveis localmente:


```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
alpine              latest              90239124c352        1 minute ago          4.79 MB
```

Agora o próximo passo é rodar a imagem, use o comando run.
Como o Alpine é baseado no Busybox (software que fornece várias ferramentas Unix), é fácil iniciar esta imagem executando o comando:

```
$ docker run -t -i alpine busybox
```

Dá para fazer mais do que isto. Nos exemplos abaixo, determinamos a versão do Alpine em uso no contêiner:

```
docker run -t -i alpine cat /etc/alpine-release 3.3.1
```

Quando uma imagem não é encontrada localmente, ela é baixada automaticamente, pelo Docker.
Se você quiser rodar uma shell dentro do contêiner Alpine, use o ash (semelhante ao Bash):

```
docker run -t -i alpine /bin/ash
```

**Importante**: Você pode buscar e baixar imagens públicas do Docker Hub livremente. Contudo, para enviar e armazenar suas imagens no hub é necessário ter uma conta cadastrada.

## **Detalhando um Dockerfile**

Se você baixou um  dockerfile via GitHub ou até mesmo pelo DockerHub, inicialmente é preciso entender a composição do arquivo listada abaixo:

```
FROM: Informa a partir de qual imagem será gerada a nova imagem, lembrando que em poucos casos (Veremos em posts futuros), uma imagem será gerada se um imagem base;
MAINTAINER: Campo opcional, que informa o nome do mantenedor da nova imagem;
RUN: Especifica que o argumento seguinte será executado, ou seja, realiza a execução de um comando;
CMD: Define um comando a ser executado quando um container baseado nessa imagem for iniciado, esse parâmetro pode ser sobrescrito caso o container seja iniciado utilizando alguma informação de comando, como: docker run -d imagem comando, neste caso o CMD da imagem será sobrescrito pelo comando informado;
LABEL: Adiciona metadados a uma imagem, informações adicionais que servirão para identificar versão, tipo de licença, ou host, lembrando que a cada nova instrução LABEL é criada uma nova layer, o Docker recomenda que você não use muitas LABEL. É possível realizar filtragens posteriormente utilizando essas LABEL.
EXPOSE: Expõem uma ou mais portas, isso quer dizer que o container quando iniciado poderá ser acessível através dessas portas;
ENV: Instrução que cria e atribui um valor para uma variável dentro da imagem, isso é útil para realizar a instalação de alguma aplicação ou configurar um ambiente inteiro.
ADD: Adiciona arquivos locais  ou que estejam em uma url, para dentro da imagem.
COPY: Copia arquivos ou diretórios locais para dentro da imagem.
ENTRYPOINT: Informa qual comando será executado quando um container for iniciado utilizando esta imagem, diferentemente do CMD, o ENTRYPOINT não é sobrescrito, isso quer dizer que este comando será sempre executado.
VOLUME: Mapeia um diretório do host para ser acessível pelo container;
USER: Define com qual usuário serão executadas as instruções durante a geração da imagem;
WORKDIR: Define qual será o diretório de trabalho (lugar onde serão copiados os arquivos, e criadas novas pastas);
ONBUILD: Define algumas instruções que podem ser realizadas quando alguma determinada ação for executada, é basicamente como uma trigger.
```

### Buildando uma imagem depois de ter baixado o Dockerfile:

```
$ sudo docker build -t + "nome da aplicação"
```

```
sudo docker build -t + "nome da aplicação" para adicionar tag, basta usar dois pontos ":1.0" se estiver no diretório do docker file "espaço . ".
```

### Depois verifique se a imagem está ok através do comando "docker images". Se estiver tudo ok, agora vamos rodar sua aplicação com o comando:

```
$ "docker run -ti "nome da imagem"
```

Lembrando que se você adiciou tag a sua imagem, ao rodar o comando docker run, você deve especificar o nome e a tag da imagem. Para acessar sua imagem, basta rodar o comando "docker attach nome da imagem".

Para obter um Shell (Bash) em um container que já esteja rodando, execute isso:

```
$ docker exec -i -t nginx /bin/bash
```

NOTA: quando saímos do nosso container com o comando "exit", ele mata o nosso processo.
Para darmos um dettach, ou em outras palavras, sair sem fecharmos ele, precisamos dos comandos: Ctrl+p + Ctrl+q. Para subirmos ele novamente, basta utilizar o comando start.


## Docker Compose

O **Docker Compose** é uma ferramenta usada para definir e gerenciar aplicativos multi-container do Docker. Ele permite que você defina todo o ambiente de um aplicativo em um arquivo YAML, chamado de arquivo docker-compose.yml. Com esse arquivo, você pode especificar todos os serviços, redes e volumes necessários para executar e interligar diferentes contêineres como um único aplicativo.

O Docker Compose é útil principalmente para cenários em que você tem uma aplicação que requer vários serviços diferentes (como bancos de dados, servidores web, caches, etc.) e deseja orquestrá-los facilmente.

Aqui está uma explicação básica de como usar o Docker Compose:

### Instalação:
Antes de começar, verifique se você tem o Docker Compose instalado em sua máquina. Se ainda não o tiver, você pode encontrar as instruções de instalação na documentação oficial do Docker.

**Crie o arquivo docker-compose.yml**:
Crie um arquivo chamado docker-compose.yml na raiz do seu projeto ou diretório de trabalho. Este arquivo será onde você definirá a configuração do seu aplicativo.

**Defina serviços**:

No arquivo docker-compose.yml, você deve definir os serviços que compõem seu aplicativo. Cada serviço representa um contêiner separado. Para cada serviço, você especifica a imagem Docker que será usada, portas expostas, volumes compartilhados, variáveis de ambiente e outras configurações relevantes.

**Defina redes e volumes (opcional)**:

Além dos serviços, você pode definir redes personalizadas e volumes compartilhados que os serviços usarão para se comunicar e armazenar dados.

**Execute o aplicativo**:

Após definir o arquivo docker-compose.yml, vá para o diretório onde ele está localizado e execute o seguinte comando para iniciar o aplicativo:

```
docker-compose up
```
Isso fará com que o Docker Compose inicie todos os contêineres especificados no arquivo docker-compose.yml.

**Gerencie o aplicativo**:

Uma vez que o aplicativo esteja em execução, você pode usar comandos como docker-compose stop, docker-compose start, docker-compose restart, docker-compose down, entre outros, para gerenciar os contêineres.

É importante mencionar que o Docker Compose facilita a orquestração de contêineres e a configuração de um ambiente de desenvolvimento consistente. Ele não é recomendado para ambientes de produção de alto nível, onde soluções mais avançadas de orquestração, como Kubernetes, são mais apropriadas.

O Docker Compose é uma ferramenta poderosa e valiosa, especialmente para desenvolvedores e equipes que desejam simplificar o gerenciamento de aplicativos baseados em contêineres e evitar a complexidade de configurar manualmente vários contêineres separados.

Referências utilizadas nesse guia:

https://docs.docker.com/docker-hub/overview/.
http://www.alpinelinux.org/about/.
https://www.mundodocker.com.br/o-que-e-dockerfile/