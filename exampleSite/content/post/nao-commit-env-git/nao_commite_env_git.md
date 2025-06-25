
+++
author = "Lucas Oliveira"
title = "Por que .env no Git é um erro fatal – Mesmo em projetos privados"
date = "2025-06-24"
description = "Mesmo em repositórios privados, **não** "commita" arquivos `.env` no repositório Git! Existe métodos e técnicas seguras de gestão de variáveis de ambiente para evitar incidentes de segurança expostos (hardcoded) em arquivos ".env"."
image = "https://i.imgur.com/8yrUcKa.jpeg"
tags = [
    "security", "sast", "vulnerabilidades", "devsecops",
]
categories = [
    "devsecops",
]
+++

## 🔖 Visão Geral

Muitos desenvolvedores acreditam erroneamente que "em repositório privado, é seguro comitar `.env`". Este post derruba esse mito, apresenta riscos reais baseado em experiências práticas (eu mesmo já cometi esse erro), e ensina práticas seguras — desde ferramentas modernas até integração contínua.

Nesse post, você vai aprender a:

- Entender por que é perigoso comitar `.env`, mesmo em repositórios privados  
- Conhecer casos reais de incidentes de segurança  
- Usar `dotenv-cli` para alternar ambientes com segurança  
- Implementar verificações automáticas com `git-secrets` e hooks no `pre-commit`  
- Utilizar serviços robustos como `AWS Secrets Manager` e `Doppler`

---

## 1. O mito: "Privado = seguro"

A falsa sensação de segurança em repositórios privados é perigosa. Aqui compartilho alguns exemplos reais:

- Acesso concedido a consultores eventuais, sem revogação de acesso adequada ... 
- Repositório privado que se tornou público por acidente e acreditem ... não é só o estagiário ou o júnior da empresa que cometem erros ...
- Tecnologia adquirida por outra empresa, expandindo o acesso, como por exemplo: "integrações de repositório com outras ferramentas de mercado" ...

## 2. Três razões pelas quais isso é arriscado

### 1. Controle de acesso é dinâmico  
Conforme o projeto cresce, mais pessoas ou organizações podem ganhar acesso.

### 2. Histórico do Git é permanente  
Mesmo que você delete `.env`, ele permanece nos commits antigos:

```bash
git rm .env
git commit -m "removendo do repositório arquivo .env"
```

### 3. Erros humanos são comuns  
Exemplos: alteração acidental para `public`, push no repositório errado, falha ao tratar forks.

## 3. Casos reais de vazamento

**Caso 1: Uso indevido de API**  
Chaves como `OPENAI_API_KEY` e credenciais AWS em `.env` foram expostas. Resultado: em vez de US$50 mensais, houve fatura de US$15.000 ... isso não aconteceu comigo (por sorte), mas aqui vai algumas fontes:

* [Regarding the latest breach where .env files were leaked](https://www.reddit.com/r/aws/comments/1eysew1/regarding_the_latest_breach_where_env_files_were/) (Reddit)
* [Attackers Exploit Public .env Files to Breach Cloud Accounts in Extortion Campaign](https://thehackernews.com/2024/08/attackers-exploit-public-env-files-to.html) (The Hackers News)

**Caso 2: Ataque ao banco de dados**  
Credenciais do banco (por ex. `DATABASE_URL`) que podem vazar registros de clientes e serem expostos na internet, sim isso pode gerar multa por violação do GDPR ou no Brasil pela LGPD; Abaixo cito alguns exemplos reais de vazamento: 

* [Report: unidentified database exposes 200 million Americans](https://cybernews.com/security/report-unidentified-database-exposes-200-million-americans/) (Cybernews)


## ✅ 4. Como gerenciar variáveis de ambiente corretamente

### ✅ Passo 1: configurar `.gitignore`

```
.properties
.env
.env.local
.env.development
.env.staging
.env.production
.env.*.local
node_modules/
npm-debug.log*
.next/
out/
.DS_Store
Thumbs.db
target/
```

### ✅ Passo 2: criar `.env.example`

```env
# .env.example
NEXT_PUBLIC_APP_NAME=MyApp
DATABASE_URL=postgresql://username:password@localhost:5432/myapp
OPENAI_API_KEY=sk-xxxx
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### ✅ Passo 3: váriaveis de ambiente definidas em seu repositório 

Algumas das ferramentas de armazenamento de projetos Git podem te ajudar a definir variáveis de ambiente diretamente no repositório, evitando o uso de .env com valores sensíveis.

Ferramentas como:

* GitLab (https://gitlab.com)
* GitHub (https://github.com)

Exemplo utilizando o **Gitlab**:

No **GitLab**, defina as varáveis que seriam utilizadas em seu .env e outros segredos em **Settings > CI/CD > Variables**:

<p align="center">
  <img src="https://i.imgur.com/ZGv02RK.png" alt="Gitlab Variables" width="500"/>
</p>

Exemplo utilizando o **Github**:

No **Github**, adicione os secrets do seu .env em **"Settings > Secrets and variables > Actions > Variables"**:

<p align="center">
  <img src="https://i.imgur.com/Mtpv0EI.png" alt="Github Variables" width="500"/>
</p>

## 5. Alternância segura entre ambientes (execução local)

```bash
npm install --save-dev dotenv-cli
```

E no `package.json`:

```json
"scripts": {
  "dev": "dotenv -e .env.development -- next dev",
  "build:production": "dotenv -e .env.production -- next build"
}
```

## 6. Validação de variáveis (execução local)

```js
require('dotenv').config();
const requiredEnvVars = ['DATABASE_URL','OPENAI_API_KEY'];
const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length) {
  console.error('❌ Variáveis faltantes:', missing);
  process.exit(1);
}
```

## 7. Plataformas cloud com gestão segura

### Vercel

```bash
vercel env add DATABASE_URL production
vercel env pull .env.local
```

### Next.js

- Variáveis privadas: `process.env.OPENAI_API_KEY` (somente server-side)  
- Variáveis públicas (cliente): prefixo `NEXT_PUBLIC_...`

## 8. Ferramentas de segurança

### ✅ `git-secrets`

```bash
brew install git-secrets
git secrets --install
git secrets --register-aws
git secrets --add 'sk-[a-zA-Z0-9]{48}'
```

### ✅ Hooks com `pre-commit`

Exemplo `.pre-commit-config.yaml` para prevenir commits de `.env` e outros erros.

## 9. Fluxo em equipe

1. Vaults como LastPass ou Bitwarden  
2. Arquivos criptografados com GPG  
3. Serviços temporários como Privnote

**Serviços especializados:**

- AWS Secrets Manager  
- Google Secret Manager  
- HashiCorp Vault  
- Doppler

## 10. Checklist de boas práticas

- `.env*` no `.gitignore`  
- `.env.example` presente no repositório como exemplo para os demais desenvolvedores utilizar como base
- Compartilhamento seguro em equipe  
- Ferramentas como `git-secrets`, `pre-commit`, `dotenv-cli`  
- Validação de ambiente  
- Gestão via cloud (e.g., Vercel)  
- Rotação de segredos  
- Uso de serviços de gestão de segredos


## 11. O que fazer se "commitou" o `.env`

### 1. Revogue credenciais imediatamente

### 2. Apague o histórico Git completamente:

```bash
git filter-branch --force --index-filter   'git rm --cached --ignore-unmatch .env'   --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
git push origin --force --tags
```

⚠️ Todos devem re-clonar o repositório após isso.


## Consideraçções finais

Gerenciar variáveis de ambiente é mais que técnica — é cultura de segurança. Mesmo repositórios privados não garantem proteção. Adotar práticas como `dotenv-cli`, validação, hooks e gestão via serviços de segredos eleva a segurança e eficiência do projeto. Comece mandando bem já no seu próximo projeto!