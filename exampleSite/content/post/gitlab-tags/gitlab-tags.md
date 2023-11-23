+++
author = "Lucas Oliveira"
title = "Script em Python para Exclusão de Tags no Gitlab"
date = "2023-08-01"
description = "Para quem utiliza as tags do Gitlab e quer automatizar o processo de exclusão, eis aqui uma solução!"
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

```
import requests
import datetime

# Dependências
gitlab_url = 'https://gitlab.com'
repository_id = 'seu_usuario/seu_repositorio'
private_token = 'seu_token_de_acesso'

# Obtém todas as tags do repositório
headers = {'PRIVATE-TOKEN': private_token}
response = requests.get(f'{gitlab_url}/api/v4/projects/{repository_id}/repository/tags', headers=headers)
tags = response.json()

# Filtra as tags antigas (neste exemplo, tags com mais de 30 dias)
threshold_date = datetime.datetime.now() - datetime.timedelta(days=30)
old_tags = [tag for tag in tags if datetime.datetime.strptime(tag['commit']['created_at'], '%Y-%m-%dT%H:%M:%S.%fZ') < threshold_date]

# Exclui as tags antigas
for tag in old_tags:
    response = requests.delete(f'{gitlab_url}/api/v4/projects/{repository_id}/repository/tags/{tag["name"]}', headers=headers)
    if response.status_code == 204:
        print(f'Tag {tag["name"]} excluída com sucesso.')
    else:
        print(f'Erro ao excluir a tag {tag["name"]}. Código de status: {response.status_code}')
```

Lembre-se de substituir as variáveis "`seu_usuario/seu_repositorio`" pelo caminho do seu repositório no GitLab e "`seu_token_de_acesso`" pelo seu token de acesso pessoal do GitLab, que pode ser gerado nas configurações da sua conta. Ou então, se preferir você pode passar esse valor através de uma variável de ambiente do própio gitlab e refernciar no script.
 
Esse é apenas um exemplo básico para te ajudar a começar. Você pode personalizar e aprimorar o script para rodar em uma pipeline, nessem caso, fiz esse script para rodar no pipeline das aplicações que sofrem bastante alterações e que é necessário a criação de tags e as exclusões das mesmas depois de "backupeadas" :D