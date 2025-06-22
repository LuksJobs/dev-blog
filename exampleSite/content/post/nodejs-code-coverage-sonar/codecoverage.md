+++
author = "Lucas Oliveira"
title = "Como Integrar SonarQube em Projetos Node.js: Análise de Código e Cobertura de Testes" 
date = "2024-09-14"
description = "No mundo do desenvolvimento de software, garantir a qualidade do código é fundamental."
image = "https://buddy.works/guides/covers/sonarqube/sonarqube-share.png"
categories = [
    "nodejs",
    "sonarqube",
    "devops",
]
tags = [
    "nodejs",
    "sonarqube",
    "devops",

]
+++

No mundo do desenvolvimento de software, garantir a qualidade do código é fundamental. É aí que entra o **SonarQube**, uma ferramenta poderosa que nos ajuda a analisar e aprimorar nossos programas. Se você está em busca de uma maneira eficiente de monitorar a *qualidade do seu código* e avaliar a *cobertura de testes*, você está no lugar certo! Neste tutorial, vamos explorar como integrar o SonarQube com um aplicativo feito em **Node.js** e analisar os resultados dos testes de cobertura.

## O que é o SonarQube?

Para quem ainda não conhece, o **SonarQube** é uma ferramenta de *análise de código* *SAST* (Static application security testing) que fornece insights valiosos sobre a qualidade do seu software. Ele examina seu código-fonte e oferece relatórios detalhados sobre potenciais problemas, como bugs, vulnerabilidades e código duplicado. Além disso, o SonarQube é excelente para medir a *cobertura de testes*, ajudando a garantir que seu código esteja bem testado e robusto.

## Passo a Passo: Integrando SonarQube com um Aplicativo Node.js

Nesse post vou simplificar o processo de configuração usando o Docker, que facilita muito a implementação e a gestão das dependências.

1. **Clonando o Projeto de Exemplo**

👌 Para começar, você pode clonar o repositório do meu projeto de amostra feito com **Node.js**, isso fornecerá uma base sólida para que possamos aplicar o SonarQube e ver a análise em ação. O repositório está disponível aqui no meu repositório do: [GitHub](https://github.com/LuksJobs/nodejs-codecoverage).

2. **Configurando o SonarQube com Docker**

Para otimizar o processo de configuração do SonarQube, utilizaremos imagens **Docker**. O Docker permite criar ambientes isolados e replicáveis de forma rápida e fácil. Aqui está um resumo do que você precisa fazer:

* **Baixe e execute a imagem do SonarQube**: Utilizaremos uma imagem Docker oficial para garantir que nossa configuração seja a mais atual e estável possível:

```bash
    docker run -d --name sonarqube -p 9000:9000 sonarqube
```
    
* **Configure o SonarQube**: Com o SonarQube em funcionamento na porta 9000 `localhost:9000`, você precisará configurá-lo para integrar com seu projeto Node.js.

![Tela de Login do SonarQube](https://i.imgur.com/lfSRPQK.png)

Aqui, nosso servidor **SonarQube** está em execução na porta **9000**. Agora iremos criar um nome de projeto e uma chave de projeto. Em seguida realize o login com as credênciais base login: "`admin`" & senha: "`admin`", clique em seguida redefina sua senha e  logo após criaremos o nosso primeiro projeto na opção "`Create a local project`":

![Criando um Projeto Local](https://i.imgur.com/UKOXksG.gif)

Em seguida, vamos gerar um **token** que o nosso aplicativo irá usar para se comunicar com o servidor do **SonarQube**:

![Project Key](https://i.imgur.com/YMhKEh3.gif)

E agora iremos selecionar qual é o tipo de Stack que queremos que o SonarQube realize o scan: 

![Project Stack](https://i.imgur.com/rKl3aL0.png)

## Configurando a Conectidade da Nossa Aplicação Node com o SonarQube

Primeiro, precisamos adicionar um novo arquivo chamado `sonar-project.js`, com esse arquivo, vamos definir o ponto de comunicação da nossa aplicação em nodo com o sonarqube, arquivo de teste unitário, chave do projeto e o token que geramos anteriormente:

<script src="https://gist.github.com/LuksJobs/3ae01f4a5d8b0bb437dcc014514976a2.js"></script>

## Executando o Aplicativo

Precisamos agora instalar as dependências do nosso projeto em NodeJS e para isso, será necessário executar o npm, como no comando abaixo:

```bash
    npm install
```

Com as dependências instaladas, agora podemos rodar o nosso primeiro Scan no SonarQube com o comando abaixo:

```bash
    npm run sonar
```

![Sonar Scanner](https://i.imgur.com/Y7FBd1W.gif)

Aguarde o Scanner do Sonar finalizar, quando finalizado, basta agora acessar a interface do projeto e lá estará toda a análise feita pela SonarQube e a cobertura de código:

![Resultado](https://i.imgur.com/FyiVeTp.png)

## Realizando o teste de cobertura

Agora, para testarmos a nossa aplicação, faremos uma rápida análise de cobertura, para isso, será necessário executar nossa aplicação em container e o banco de dados "mongodb" executando o seguintes comandos:
```bash
    docker compose up -d 
```
Com o banco de dados e nossa aplicação em execução, poderemos agora executar nosso teste de cobertura:

```bash
    npm run test
```
Com isso, será feito um teste de cobertura e logo em seguida gerará um diretório chamado de "coverage" que será exportado para o SonarQube quando realizado um novo scan.

```bash
    npm run sonar
```

![SonarScan](https://europe1.discourse-cdn.com/sonarsource/uploads/sonarcommunity/original/3X/0/7/07a94273926692bc9b69f903aebf86cbe6810652.png)

Espero que este artigo tenha sido útil para você. Se você tiver alguma dúvida ou comentário, sinta-se à vontade para deixar um comentário abaixo.
