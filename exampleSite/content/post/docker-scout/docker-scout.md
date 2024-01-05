+++
author = "Lucas Oliveira"
title = "Como remediar problemas de segurança descobertos pelo Docker Scout "
date = "2024-01-06"
description = "Nesse post iremos escanear uma aplicação em Node JS utilizando o Docker Scout pela linha de comando (CLI)"
image = "https://i.imgur.com/UYrnMfy.png"
tags = [
    "docker", "devops", "docker-scout",
]
categories = [
    "docker",
]
+++

O **Docker Scout** analisa o conteúdo da imagem e gera um relatório detalhado dos pacotes e vulnerabilidades que detecta. Ele pode fornecer sugestões sobre como remediar problemas descobertos pela análise de imagens. Nesse guia iremos utilizar uma imagem de contêiner vulnerável com o Node JS e mostrar como usar o **Docker Scout** para identificar e corrigir as vulnerabilidades, comparar versões de imagens ao longo do tempo e compartilhar os resultados obtidos com sua equipe de Segurança ou seja lá qual for sua intenção.

### O Docker Scout oferece as seguintes funcionalidades:

* **Análise de segurança**: O Docker Scout identifica vulnerabilidades de segurança conhecidas nas imagens (CVES). Ele também fornece informações sobre as vulnerabilidades, incluindo a gravidade, a data de descoberta e a versão da imagem em que a vulnerabilidade foi corrigida.
* **Análise de conformidade**: O Docker Scout pode ser usado para verificar a conformidade de imagens com padrões de segurança e conformidade.
* **Análise de desempenho**: O Docker Scout fornece informações sobre o tamanho, o número de camadas e o digest das imagens. Essas informações podem ser usadas para melhorar o desempenho dos contêineres.

### Como usar o Docker Scout?

O Docker Scout está disponível como um pacote Docker. Para instalá-lo é necessário antes realizar o login no Docker, caso você não tenha cadastro para continuar nessa etapa, será necessário se cadastrar no [Docker Hub](https://hub.docker.com/) , execute o seguinte comando: