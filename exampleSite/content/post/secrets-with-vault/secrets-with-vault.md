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

```
version: '3'
services:
  vault_production:
    image: vault:prd
    container_name: vault
    environment:
      VAULT_ADDR: http://127.0.0.1:8200
    ports:
      - "8200:8200"
    restart: always
    volumes:
      - ./private-volume:/vault/file:rw
      - ./vault:/vault/config:rw
    cap_add:
      - IPC_LOCK
    entrypoint: vault server -config=/vault/config/vault.json
```


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

# Relizando Conexão do NodeJS com o Vault

Para fazer com que uma aplicação em Node.js consuma a chave "kv" (key value) no seu Vault, você pode usar a biblioteca cliente do Vault para Node.js. Aqui está um exemplo de como fazer isso: 
 
1. Instale a biblioteca cliente do Vault executando  npm install node-vault  no diretório do seu projeto Node.js. 
 
2. Importe a biblioteca do Vault na sua aplicação Node.js:

```
const vault = require('node-vault')();
```

3. Configure o cliente do Vault com o endpoint e o método de autenticação apropriados:

```
vault.options({
  apiVersion: 'v1',
  endpoint: 'http://seu-servidor-vault:8200',
  token: 'seu-token-vault',
});
```

Substitua  'http://seu-servidor-vault:8200' pela URL do seu servidor Vault e  'seu-token-vault'  por um token válido que tenha acesso às chaves. 
 
4. Recupere o segredo do "kv" engine:

```
const caminhoSegredo = 'secret/meuapp/config'; // Caminho para o seu segredo no engine "kv"
const resposta = await vault.read(caminhoSegredo);
const dadosSegredo = resposta.data;
```

Substitua  `'secret/meuapp/config'`  pelo caminho real para o seu segredo dentro do engine "kv". 
 
5. Agora você pode usar o objeto  dadosSegredo  na sua aplicação para acessar os valores do segredo recuperado. 
 
Seguindo essas etapas, sua aplicação Node.js será capaz de consumir segredos armazenados no engine "kv" do seu servidor Vault. Lembre-se de tratar erros adequadamente e implementar mecanismos de tratamento de erros e autenticação apropriados, de acordo com os requisitos da sua aplicação.

---

### Comandos Úteis

Para conectar-se ao Vault, via linha de comando é necessário executar o comando abaixo: 

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

Aplicar a política ao Vault: 

```
vault policy write list-secrets-policy list-secrets-policy.hcl
```

Aplicar a política aos usuários:

```
vault write auth/userpass/users/leonardo.matos policies=list-secrets-policy
vault write auth/userpass/users/lucas.dantas policies=list-secrets-policy
vault write auth/userpass/users/arquinael.filho policies=list-secrets-policy
```

---

### Habilitar o APP Role

O AppRole no Vault é um mecanismo de autenticação que permite que aplicativos e serviços se autentiquem e obtenham tokens de acesso para acessar recursos no Vault. Ele fornece uma maneira segura para que aplicativos se autentiquem e obtenham tokens de autenticação sem a necessidade de credenciais de usuário.

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