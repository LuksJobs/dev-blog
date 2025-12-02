+++
author = "Lucas Oliveira"
title = "Noções básicas e práticas do AWS SAM para agilizar o desenvolvimento serveless"
date = "2025-11-26"
image = "https://i.imgur.com/Grnhtf6.jpeg"
description = "AWS Sam é uma estrutura fornecida pela AWS para gerenciar centralmente recursos serverless, como funções Lambda, Amazon API Gateway, Amazon DynamoDB e Amazon S3."
categories = [
    "aws",
    "pipeline",
    "automação",
    "serverless",
]
tags = [
    "pipeline",
    "aws sam",
    "cicd",
]
+++

Olá, pessoal! Quanto tempo hein!? Pois é, o tempo tem sido curto para mim ultimamente, muito trabalho 😒 ... mas vamos lá! Sem choro hehe... decidi trazer esse tema aqui no blog pois tenho sido muito exposto aos *SAMs* ultimamente e tenho tentado divulgar sorrateiramente sua facilidade de uso para engenheiros de software e engenheiros de devsecops.

Pensando bem, eu nunca abordei esse assunto no meu blog, então escrevi este post como uma resenha.

Neste post, irei apresentar os conceitos básicos de SAM (**Serverless Application Model**), construção de manifestos, métodos de teste locais e melhores práticas operacionais para que até mesmo usuários iniciantes possam usá-lo com confiança.
Espero que o conteúdo deste blog ajude os leitores a entender um pouco mais sobre SAM 😊

## Introdução ao AWS SAM ｜ Noções básicas sobre como criar aplicações Serverless

AWS SAM [(**Serverless Application Model**)](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started.html) é uma estrutura fornecida pela AWS para gerenciar centralmente recursos serverless, como funções **Lambda**, Amazon **API Gateway**, Amazon **DynamoDB** e Amazon **S3**. Estende o **AWS CloudFormation** para fornecer uma sintaxe exclusiva que permite declarar concisamente recursos serverless, como funções Lambda e tabelas API Gateway e DynamoDB.

Você pode definir um aplicativo inteiro com um modelo SAM (no formato **YAML**) e automatizar a compilação e a implantação com os comandos `sam build` e `sam deploy`. Isso evita o incômodo de escrever à mão modelos complexos do **CloudFormation** e aumenta drasticamente a produtividade do desenvolvimento serverless.

### Os principais componentes do SAM são os seguintes.

* **Arquivo de modelo**: configurado por template.yaml. Descreva definições de recursos, parâmetros, resultados, etc.
* **Tipo de recurso**: AWS::Serverless::Function, AWS::Serverless::Api, AWS::Serverless::SimpleTable, etc.
* **Ferramentas CLI**: Criação de modelo de projeto com sam init, empacotamento de dependências com sam build, implantação na AWS com sam deploy.

Além disso, usar o comando sam local do SAM CLI facilita o teste e a depuração local, aumentando muito a eficiência do desenvolvimento.

## Hello World Lambda ＋ Build API Gateway

Vamos começar criando um aplicativo serverless com uma configuração mínima e verificar se funciona.
O procedimento aqui apresentado segue o guia do **SAM CLI** para formatos interativos, portanto, mesmo pela primeira vez, você não hesitará em prosseguir.

1. Criação de projeto
    * Selecione o tempo de execução desejado, como Python ou Node.js
    * Especifique o nome do projeto e o caminho padrão da API
2. Editar modelo
    * Recursos de função adicionados e definições de endpoint de API
    * Defina variáveis de ambiente e camadas conforme necessário
3. Construir
    * Armazenando dependências em cache no ambiente local e gerando pacotes reproduzíveis
    * Deploys
A opção --guiada permite a determinação interativa do **bucket S3** e do nome da stack, bem como da região.

Então, vamos seguir em frente.

## Instalação do AWS SAM CLI

Se você já possúi esses requisitos instalados, pule essa etapa ...

Antes de começarmos a criar aplicações serverless, precisamos instalar o AWS SAM CLI. Vou mostrar como fazer isso nos principais sistemas operacionais. 

### Pré-requisitos

Antes de instalar o SAM CLI, certifique-se de ter:

- [**AWS CLI**](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) instalado, configurado e autenticado com sua conta de usuário.
- [**Docker**](docker.io) instalado (para testes locais)
- **Python 3.7+** ou **Node.js 14+** (dependendo da linguagem escolhida)

### Windows

**Opção 1: Usando o instalador MSI (Recomendado)**

1. Baixe o instalador MSI oficial:
```bash
# Acesse: https://github.com/aws/aws-sam-cli/releases/latest
# Baixe o arquivo: AWS_SAM_CLI_64_PY3.msi
```

2. Execute o instalador e siga as instruções

3. Verifique a instalação:
```cmd
$ sam --version
```

**Opção 2: Usando Chocolatey**

```powershell
$ choco install awssamcli
```

**Opção 3: Usando pip**

```python
$ pip install aws-sam-cli
```

### Linux (Ubuntu/Debian)

**Método 1: Download direto (Recomendado)**

```bash
# Baixar o arquivo ZIP
wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip

# Descompactar
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation

# Executar o instalador
sudo ./sam-installation/install

# Verificar instalação
sam --version
```

**Método 2: Usando pip**

```bash
pip3 install aws-sam-cli
```

### Docker (Qualquer SO)

Se preferir usar Docker sem instalar localmente:

```bash
# Criar alias para facilitar o uso
echo 'alias sam="docker run --rm -v $(pwd):/var/task amazon/aws-sam-cli-build-image-python3.9"' >> ~/.bashrc
source ~/.bashrc

# Usar normalmente
sam --version
```

### Verificação da Instalação

Após a instalação, verifique se tudo está funcionando:

```bash
# Verificar versão do SAM CLI
sam --version

# Verificar se o Docker está rodando
docker --version

# Verificar AWS CLI
aws --version
```
---

## Hello World Lambda + Build API Gateway

### 1. **Criação do projeto** (vamos preparar nosso lab)

Quando você executa o `sam init`, um projeto é criado interativamente.
Desta vez, depois de selecionar `1 - AWS Quick Start Templates > 1 - Hello World Example`, crie todos os outros itens usando valores padrão.

No exemplo abaixo, estou utilizando a versão do python "3.12" porque é a qual tenho instalado em meu computador mas ... você pode utilizar outra versão:

```bash
$ sam init --runtime python3.12 --name hello-sam
$ cd hello-sam
```
Referência do output:
```bash
C:\Users\Lucas>sam init --runtime python3.12 --name hello-sam
Which template source would you like to use?
        1 - AWS Quick Start Templates
        2 - Custom Template Location
Choice: 1

Choose an AWS Quick Start application template
        1 - Hello World Example
        2 - Hello World Example with Powertools for AWS Lambda
        3 - Infrastructure event management
        4 - Multi-step workflow
        5 - Lambda EFS example
        6 - Serverless Connector Hello World Example
        7 - Multi-step workflow with Connectors
Template: 1

Based on your selections, the only Package type available is Zip.
We will proceed to selecting the Package type as Zip.

Based on your selections, the only dependency manager available is pip.
We will proceed copying the template using pip.

Would you like to enable X-Ray tracing on the function(s) in your application?  [y/N]: y
X-Ray will incur an additional cost. View https://aws.amazon.com/xray/pricing/ for more details

Would you like to enable monitoring using CloudWatch Application Insights?
For more info, please view https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html [y/N]: n

Would you like to set Structured Logging in JSON format on your Lambda functions?  [y/N]:

Cloning from https://github.com/aws/aws-sam-cli-app-templates (process may take a moment)

    -----------------------
    Generating application:
    -----------------------
    Name: hello-sam
    Runtime: python3.12
    Architectures: x86_64
    Dependency Manager: pip
    Application Template: hello-world
    Output Directory: .
    Configuration file: hello-sam\samconfig.toml

    Next steps can be found in the README file at hello-sam\README.md


Commands you can use next
=========================
[*] Create pipeline: cd hello-sam && sam pipeline init --bootstrap
[*] Validate SAM template: cd hello-sam && sam validate
[*] Test Function in the Cloud: cd hello-sam && sam sync --stack-name {stack-name} --watch


SAM CLI update available (1.148.0); (1.145.0 installed)
To download: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
```

### 2. **Editar modelo** (template.yaml)

Desta vez, usaremos o modelo criado por padrão. Essa é a estutura de arquivos criados dentro do diretório gerado: 

```bash
26/11/2025  14:22    <DIR>          .
26/11/2025  14:22    <DIR>          ..
26/11/2025  14:22             3.973 .gitignore
26/11/2025  14:22    <DIR>          events
26/11/2025  14:22    <DIR>          hello_world
26/11/2025  14:22             8.483 README.md
26/11/2025  14:22               701 samconfig.toml
26/11/2025  14:22             1.766 template.yaml
26/11/2025  14:22    <DIR>          tests
26/11/2025  14:22                 0 __init__.py
               5 arquivo(s)         14.923 bytes
               5 pasta(s)   107.983.888.384 bytes disponíveis
```

Agora, vamos editar o arquivo gerado: "`template.yaml`"

<script src="https://gist.github.com/LuksJobs/d69265f36b90c8e443e7d7b05d6a9d2d.js"></script>

### 3. **Edição de código** (/hello-world/app.py)

Repare que dentro do diretório: "**hello_world**", foi gerado um arquivo python: "**app.py**". Pois é, esse é nosso arquivo de código "hello world", "serveless" em python 😎 

Agora vamos editar esse arquivo ``app.py``. Exemplo:

<script src="https://gist.github.com/LuksJobs/b1a5a51b5a8198a91e56cce61fa57b2d.js"></script>

Aqui vou tentar explicar um pouco do que se trata nosso arquivo de código: "`app.py` gerado pelo nosso querido SAM-CLI:

Este arquivo `app.py` é uma **função AWS Lambda** que implementa um endpoint de API REST simples. Aqui está um resumo do que ele faz:

#### Funcionalidade Principal
- **Função Handler**: `lambda_handler` é o ponto de entrada que o AWS Lambda chama quando a função é executada
- **API Gateway Integration**: Está configurada para trabalhar com API Gateway como proxy, recebendo requisições HTTP e retornando respostas HTTP

#### O que retorna atualmente
- **Status Code**: 200 (sucesso)
- **Body**: JSON com a mensagem "hello world"
- **Código comentado**: Há uma funcionalidade comentada que faria uma requisição para obter o endereço IP público usando `requests.get("http://checkip.amazonaws.com/")`

#### Estrutura
- Recebe dois parâmetros: `event` (dados da requisição) e `context` (informações do runtime do Lambda)
- Retorna um objeto no formato esperado pelo API Gateway Lambda Proxy
- Inclui documentação detalhada sobre os formatos de entrada e saída

#### Propósito
É um exemplo básico de uma API serverless que pode ser deployada na AWS usando o SAM (Serverless Application Model), retornando uma simples mensagem "hello world" quando chamada via HTTP.

### 4. Build && Deploy 

Aqui nesse step, repare que as verificações de aplicabilidade do conjunto de alterações são exibidas interativamente durante a implantação.
Se não houver problemas, digite y e implante.

```bash
$ sam build
```
Se tudo ocorrer bem, esse é o output esperado: 

```bash
C:\Users\Lucas\hello-sam>sam build
Starting Build use cache
Manifest file is changed (new hash: 3298f13049d19cffaa37ca931dd4d421) or dependency folder (.aws-sam\deps\f4518d53-cf86-4be8-bef6-9273c0791941) is missing for (HelloWorldFunction), downloading dependencies and copying/building source
Building codeuri: C:\Users\Lucas\hello-sam\hello_world runtime: python3.12 architecture: x86_64 functions: HelloWorldFunction
 Running PythonPipBuilder:CleanUp
 Running PythonPipBuilder:ResolveDependencies
 Running PythonPipBuilder:CopySource
 Running PythonPipBuilder:CopySource

Build Succeeded

Built Artifacts  : .aws-sam\build
Built Template   : .aws-sam\build\template.yaml

Commands you can use next
=========================
[*] Validate SAM template: sam validate
[*] Invoke Function: sam local invoke
[*] Test Function in the Cloud: sam sync --stack-name {{stack-name}} --watch
[*] Deploy: sam deploy --guided
```

E agora vamos para o deploy:

```
$ sam deploy --guided --region us-east-1
```

Output esperado:

```bash
PS C:\Users\Lucas\hello-sam> sam deploy --guided --region us-northeast-1

Configuring SAM deploy
======================

        Looking for config file [samconfig.toml] :  Found
        Reading default arguments  :  Success

        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [hello-sam]: 
        AWS Region [us-northeast-1]: 
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [Y/n]: Y
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: Y
        #Preserves the state of previously provisioned resources when an operation fails
        Disable rollback [y/N]: N
        HelloWorldFunction has no authentication. Is this okay? [y/N]: Y
        Save arguments to configuration file [Y/n]: Y
        SAM configuration file [samconfig.toml]: 
        SAM configuration environment [default]: 
```

Agora, quando acesso o endpoint do **API Gateway**, ele retorna "Hello World".
Os parâmetros podem ser definidos no formato interativo CLI e a implantação inicial pode prosseguir sem hesitação.

![application-running](https://i.imgur.com/cOA3mQY.png)

Aplicação em funcionamento 😎 Em outro post, detalho um pouco mais sobre como usar o AWS Sam em pipelines de CI/CD. Não sei quando, mas um dia sai hehe 😎

## Referência: Guia do Usuário (AWS)
Modelo de aplicativo sem servidor AWS (AWS SAM):
https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/what-is-sam.html

