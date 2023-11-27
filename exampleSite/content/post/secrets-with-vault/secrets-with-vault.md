+++
author = "Lucas Oliveira"
title = "Utilizando o Vault para Gerenciar Segredos em Aplicações NodeJS"
date = "2023-11-24"
description = "Nesse post o objetivo é integrar o Node.js com o Vault, iremos utilizar a imagem Docker do Vault."
tags = [
    "vault",
    "devops",
    "docker",
]
categories = [
    "vault",
    "docker",
    "nodejs",
]
image = "https://i.imgur.com/soZxPoQ.png"
+++

## Visão Geral 

O HashiCorp Vault é uma ferramenta projetada para armazenar e gerenciar informações sensíveis de forma segura, como chaves de API, senhas, certificados e muito mais. Ele fornece uma solução centralizada para gerenciamento de segredos e controle de acesso. 

## Caso de Uso

Nesse post o objetivo é integrar o **Node.js** com o **Vault**, iremos utilizar a imagem Docker do Vault. Dessa forma subiremos uma API para interagir com o Vault. Armazenar segredos no Vault é melhor do que armazenar segredos em arquivos do tipo ".env" porque o Vault fornece uma maneira mais segura de armazenar segredos. O Vault usa criptografia para proteger os segredos, o que significa que eles não podem ser acessados por pessoas não autorizadas. Além disso, o Vault permite controlar quem pode acessar quais segredos, o que ajuda a proteger os segredos de serem usados indevidamente. 
 
## Recursos do Vault

- **Gerenciamento de Segredos**: O Vault oferece uma maneira segura de armazenar e gerenciar segredos, garantindo que os dados sensíveis sejam criptografados em repouso e em trânsito. 
- **Segredos Dinâmicos**: Ele pode gerar segredos dinâmicos sob demanda para vários serviços, reduzindo o risco de credenciais de longa duração. 
- **Controle de Acesso**: O Vault fornece políticas de controle de acesso detalhadas para restringir e gerenciar o acesso de usuários aos segredos. 
- **Criptografia como Serviço**: Ele oferece criptografia como serviço, permitindo que aplicativos criptografem e descriptografem dados sem lidar diretamente com chaves de criptografia. 
- **Auditoria e Registro**: O Vault mantém um registro detalhado de todas as interações, fornecendo visibilidade e rastreabilidade para fins de conformidade. 
- **Integração e Extensibilidade**: Ele se integra a vários sistemas de autenticação, provedores de nuvem, bancos de dados e muito mais. 

# Instalando e configurando o Vault utilizando o Docker

 O Vault pode ser executado em vários ambientes, só que nesse post, iremos utilizar containers Docker. 

[![Code](https://raw.githubusercontent.com/LuksJobs/secrets-with-vault/master/README.md)](https://github.com/LuksJobs/secrets-with-vault/blob/master/README.md)


## 1. Dockerfile 

A imagem do Vault que iremos utilizar é baseado na imagem base do **Alpine** na versão 3.18 e com a versão do **Vault** 1.13.3

<script src="https://gist.github.com/LuksJobs/e3c93073de814ce046fdc698bbbd8fdd.js"></script>

## 1.1 Buildando a nossa imagem do Vault

Agora que temos nossa imagem definida em nosso Dockerfile, iremos preparar ela buildando nossa imagem:

```
docker build . -t vault:prd
```

## 2. Docker Compose

Agora que temos nossa imagem preparada, precisaremos instruir como iremos levantar nosso container Docker e iremos fazer isso utilizando o Docker Compose:

<script src="https://gist.github.com/LuksJobs/9118a06d73a7ceb3c4324d278411ef00.js"></script>

## 3. Executando o Container

Para levantar o container, basta rodar o comando abaixo:

```
$ docker compose up -d
```

Logo após para gerar as chaves de acesso ao cofre:

```
$ docker exec -it vault vault operator init -n 2 -t 2
```

Esse comando irá gerar duas chaves para acesso ao banco de dados, 🚩 é de extrema importância guardar as chaves e o Token que foram gerados em um local seguro!

### Conectando ao Vault via linha de comando (CLI)

Para conectar-se ao Vault, via linha de comando é necessário  primeiro instalar a linha executar o comando abaixo: 

* Existe várias maneiras de realizar essa instalação, caso tenha dúvidas acesse o link da documentação: https://developer.hashicorp.com/vault/docs/install

Em nosso caso, iremos instalar via pacote: 

```
 1. sudo apt update && sudo apt install gpg
```
Baixando o pacote de Instalação da CLI do Vault:
```
2. wget https://releases.hashicorp.com/vault/1.15.2/vault_1.15.2_linux_amd64.zip
``` 


Em seguida, descompacte o pacote usando o seguinte comando:


```
3. unzip vault_1.15.2_linux_amd64.zip
```
Depois, mova o pacote para o diretório /usr/bin:

```
4 mv vault /usr/bin
```

Verifique a instalação usando o seguinte comando:
```
5. vault -v
```

Agora com a linha de comando instalada, poderemos nos conectar ao nosso Vault que está rodando em container Docker bastando apontar o ip e porta ou então DNS de onde ele está rodando:

```
$ export VAULT_ADDR='http://seu-servidor-vault:8200'
```

Metódo de login utilizando "username" e "password":

```
$ vault login -method=userpass username=lucas.dantas
```
Metódo de login por linha de comando utilizando o "Token":

```
$ vault login -method=token
```

### Criando política de acesso 

Política de acesso: `list-secrets-policy.hcl`(arquivo de texto com extensão ".hcl")`

```
path "secret/metadata"
{
  capabilities = [ "list" ]
}

path "secret/metadata/*"
{
  capabilities = [ "list", "read" ]
}

# Allow a token to manage its own credentials
path "credentials/*" {
    capabilities = ["create", "read", "update", "delete", "list"]
}

# Allow a token to look up its own capabilities on a path
path "sys/capabilities-self" {
    capabilities = ["update"]
}

# Allow general purpose tools
path "sys/tools/hash" {
    capabilities = ["update"]
}
path "sys/tools/hash/*" {
    capabilities = ["update"]
}
```

## Aplicar a política ao Vault: 

```
vault policy write list-secrets-policy list-secrets-policy.hcl
```

## Aplicar a política aos usuários:

```
vault write auth/userpass/users/lucas.dantas policies=list-secrets-policy
vault write auth/userpass/users/lucas.dantas policies=list-secrets-policy
vault write auth/userpass/users/lucas.dantas policies=list-secrets-policy
```

# Criando o SecretID e o APP Role

## Habilitar o APP Role

O **AppRole** no Vault é um mecanismo de autenticação que permite que aplicativos e serviços se autentiquem e obtenham tokens de acesso para acessar recursos no Vault. Ele fornece uma maneira segura para que aplicativos se autentiquem e obtenham tokens de autenticação sem a necessidade de credenciais de usuário.

```
vault auth enable approle
```

Execute o seguinte comando para criar o AppRole "`node-app-role`" e definir as políticas associadas a ele:

```
vault write auth/approle/role/node-app-role \
    token_ttl=1h \
    token_max_ttl=4h \
    token_policies=default

resultado esperado:

Success! Data written to: auth/approle/role/node-app-role
```

Após criar o AppRole, você pode obter as informações do "`role-id`" usando o seguinte comando:

```
vault read auth/approle/role/node-app-role/role-id

resultado esperado:

Key                   Value
---                   -----
secret_id             000000000000000000000000000000000000
secret_id_accessor    000000000000000000000000000000000000
secret_id_num_uses    0
secret_id_ttl         0s
```

## SecretID

Agora iremos gerar um "`secret-id`" para nosso "node-app-role" recentemente criado: 

```
vault write -f auth/approle/role/node-app-role/secret-id


resultado esperado:

Key                   Value
---                   -----
secret_id             000000000000000000000000000000000000
secret_id_accessor    000000000000000000000000000000000000
secret_id_num_uses    0
secret_id_ttl         0s
```

# Relizando Conexão do NodeJS com o Vault

Certifique-se de que as **variáveis** de ambiente (**ROLE_ID** e **SECRET_ID**) estejam configuradas corretamente no seu ambiente de execução para garantir uma autenticação bem-sucedida. Este é um exemplo básico, e na prática, você pode precisar ajustar e expandir o código de acordo com as necessidades específicas do seu projeto e da sua configuração do Vault.

![Gitlab ENV](https://i.imgur.com/uCiUAqs.png) 

Nesse caso, declarei a variável de ambiente "**Secret_ID**" nas variáveis de ambiente do CI/CD do Gitlab; Pois o objeto é que em um estágio da minha pipeline, esse secret id seja adicionado no arquivo ".env" e que seja buildado em nossa aplicação, no caso, imagem docker;
 
Seguindo essas etapas, sua aplicação Node.js será capaz de consumir segredos armazenados na engine do seu servidor Vault. Lembre-se de tratar erros adequadamente e implementar mecanismos de tratamento de erros e autenticação apropriados, de acordo com os requisitos da sua aplicação.

## Exemplo de conexão para consumir o Secret

<script src="https://gist.github.com/LuksJobs/b20768e0442562a3ece3f2372dbe2589.js"></script>

Este código é um exemplo de como usar o NodeVault para se autenticar no HashiCorp Vault usando **AppRole**, o objetivo é obter um token de acesso, e então ler informações sensíveis (como credenciais de banco de dados) armazenadas no Vault.

---

## Conclusão 

Certifique-se de que as variáveis de ambiente (**ROLE_ID** e **SECRET_ID**) estejam configuradas corretamente no seu ambiente de execução para garantir uma autenticação bem-sucedida. Este é um exemplo básico, e na prática, você pode precisar ajustar e expandir o código de acordo com as necessidades específicas do seu projeto e da sua configuração do Vault.