+++
author = "Lucas Oliveira"
title = "Script em Python para Exclusão de Tags no Gitlab"
date = "2023-08-01"
description = "Para quem utiliza as tags do Gitlab e quer automatizar o processo de exclusão, eis aqui uma solução!"
image = "https://i.imgur.com/m41BoXD.jpg"
categories = [
    "cicd"
]
tags = [
    "gitlab",
    "devops",
    "pipeline",
]
+++

Através da `API` do `GitLab`, você pode obter uma lista de todas as tags do repositório e, em seguida, filtrar as tags antigas com base em sua data de criação. Contudo, você pode usar a API para excluir essas tags selecionadas. 

<!--more-->

<blockquote>Repositório: 

Use o repositório como exemplo: [GitlabTag Autoremover](https://gitlab.com/devops3530230/rm_tags.git)</blockquote>

Aqui está um exemplo de como você pode fazer isso usando a API do GitLab com a linguagem Python:

<script src="https://gist.github.com/LuksJobs/84e94290d65e5626f73e4eb13ddee779.js"></script>

Lembre-se de substituir as variáveis "`seu_usuario/seu_repositorio`" pelo caminho do seu repositório no GitLab e "`seu_token_de_acesso`" pelo seu token de acesso pessoal do GitLab, que pode ser gerado nas configurações da sua conta. Ou então, se preferir você pode passar esse valor através de uma variável de ambiente do própio gitlab e refernciar no script.
 
Esse é apenas um exemplo básico para te ajudar a começar. Você pode personalizar e aprimorar o script para rodar em uma pipeline, nessem caso, fiz esse script para rodar no pipeline das aplicações de homologação que sofrem bastante alterações e que é necessário a criação de tags e as exclusões das mesmas depois de "backupeadas" pois assim, libera o espaço de armazenamento nos repositórios.