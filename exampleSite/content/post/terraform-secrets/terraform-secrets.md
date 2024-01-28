+++
author = "Lucas Oliveira"
title = "Protegendo Segredos no Terraform: Estratégias Eficazes para o Gerenciamento de Informações Confidenciais"
date = "2024-01-28"
description = "Uma das perguntas mais comuns que recebo é sobre o uso do Terraform para gerenciamento da infraestrutura de como lidar com segredos, com senha e com outros dados confidenciais."
image = "https://i.imgur.com/xs0WUZK.png"
tags = [
    "terraform", "devops",
]
categories = [
    "terraform",
]
+++

Fala pessoal, tudo bem com vocês!? Espero que sim! 😄 Então, nesse novo post irei falar um pouco sobre o uso do **Terraform** que permite a codificação da configuração da infraestrutura, proporcionando a vantagem conhecida como **Infrastructure as Code** (IaC). Conforme você avança no uso do Terraform, surge a necessidade de pensar, de maneira semelhante ao desenvolvimento de software, '*Como lidar com informações confidenciais sem escrevê-las diretamente no código ou em `.env`* ?'

Neste artigo, abordaremos diversos tópicos, como métodos e considerações ao lidar com informações confidenciais no Terraform.

Ao escrever este artigo, percebi que a abordagem se assemelha ao conteúdo da seguinte página, então tentarei apresentar uma perspectiva diferente sempre que possível.

[How to Handle Secrets in Terraform | Blog Git Guardian](https://blog.gitguardian.com/how-to-handle-secrets-in-terraform/)

### Pontos Básicos a Serem Observados

1. Não Inclua Informações Confidenciais diretamente nos Arquivos TF
Não deve haver inclusão direta de informações confidenciais, como senhas, nos arquivos `*.tf` Embora seja uma prática óbvia, vale a pena mencionar.

2. Informações Confidenciais Podem Estar Presentes nos Arquivos de Estado!
Mais adiante, apresentarei algumas maneiras de evitar a inclusão de informações confidenciais nos arquivos `*.tf` no entanto, na maioria dos métodos, essas informações confidenciais podem ainda estar presentes nos arquivos de estado (terraform.tfstate). 

Para mais detalhes, consulte a seção 'Sensitive Values' na seguinte página: 

[Secure Storage of Variables | Hashicorp Blog](https://developer.hashicorp.com/terraform/cloud-docs/workspaces/variables#secure-storage-of-variables)

### Principais Métodos para Lidar com Informações Confidenciais

Agora que entendemos os pontos básicos, vamos explicar alguns métodos gerais para lidar com informações confidenciais. Detalhes sobre como utilizá-los serão discutidos na próxima seção.

#### [Método 1](#metodo-1): Externalização por meio de `Variáveis de Ambiente` ou `Arquivos Externos``

O primeiro método envolve o fornecimento de informações confidenciais através dos seguintes meios:

* **Variáveis de ambiente** (enviadas através de variáveis de ambiente com o nome de TF_VAR_*)
* **Arquivos externos** (*.tfvars)

Embora seja fácil de implementar, distribuir variáveis de ambiente ou arquivos externos de alguma forma pode apresentar desafios:

✘: As informações distribuídas não podem ser recuperadas. Portanto, se uma pessoa com informações confidenciais sair da equipe, pode ser necessário alterar as informações confidenciais (por exemplo, senhas). Além disso, este método escreve informações confidenciais nos arquivos de estado (state files).

#### [Método 2](#metodo-2): Criptografar Arquivos

O segundo método envolve a *criptografia de arquivos* que contêm informações confidenciais. Apenas os arquivos criptografados são commitados no controle de código-fonte.

Vamos listar os prós e contras gerais deste "Método 2":

* ✔ As informações confidenciais são versionadas após serem criptografadas. É fácil desfazer as alterações. Evita esquecimentos de configurações.
* × É necessário executar comandos para criptografar e descriptografar durante o processo.
* × Os arquivos descriptografados são armazenados localmente, apresentando um problema semelhante ao Método 1 se um funcionário sair.

Neste método, a gestão da chave usada na criptografia é crucial. Abaixo, apresentamos métodos ruins, não tão bons, e por que são inadequados.

* × Commitar o arquivo de chave privada no controle de código-fonte. Razão do × (pró) Isso anula o propósito da criptografia.
* × Armazenar o arquivo de chave privada em outro repositório ou em uma unidade compartilhada com acesso restrito.
* Razões do "×" (contras) - O arquivo de chave privada ainda é armazenado localmente e pode exigir mudanças caso alguém com a chave saia da equipe.

Um bom método é o uso de *serviços de gerenciamento de chaves*, como o *AWS Key Management Service* (KMS) ou o *Cloud Key Management do GCP*. Os prós e contras do KMS e CKM são listados abaixo:

**AWS Key Management Service** (Prós e Contras) - https://aws.amazon.com/pt/kms/
* ✔ O arquivo de chave privada é armazenado na AWS e não pode ser baixado.
* ✔ Rotação de chaves é possível.
* ✔ O acesso à chave pode ser gerenciado por usuários IAM e funções.
* × Incorre em custos mínimos.

**GCP Cloud Key Management** (Prós e Contras) - https://cloud.google.com/security/products/security-key-management
* ✔ Grenciamento de chave na nuvem rápido, centralizado e escalonável
* ✔ Cumpre com as necessidades de conformidade, privacidade e segurança
* ✔ Aprove ou recuse qualquer solicitação das suas chaves de criptografia com base em justificativas claras e precisas.
* × Incorre em custos mínimos.

Outros fornecedores, como Azure Key Vault e Hashicorp Vault, oferecem funcionalidades semelhantes.

Lembre-se de que este método também escreve informações confidenciais nos arquivos de estado.

#### [Método 3](#metodo-3): Armazenamento em Serviços Externos como AWS Secrets Manager

O terceiro método envolve o armazenamento de informações confidenciais em serviços externos, como **AWS Secrets Manager** ou **GCP Secret Manager**, e a leitura dessas informações pelo Terraform ao criar recursos. Alguns serviços específicos incluem:"

* Serviço AWS Secrets Manager
* AWS Systems Manager Parameter Store
* GCP Secrets Manager
* HashiCorp Vault

No momento, com base na visualização da seguinte página, parece que o Azure não possui um serviço similar.

Além disso, a existência de dois serviços semelhantes na AWS é uma característica comum da AWS. Sobre as diferenças e o uso desses dois serviços, uma busca fornecerá uma variedade de informações.

Agora, vamos listar os prós e contras deste método:

* ✔ As informações não são armazenadas localmente.
* ✔ O serviço oferece várias funcionalidades úteis, como:

Funcionalidade para alterar informações confidenciais periodicamente. Capacidade de recuperar informações confidenciais não apenas do Terraform, mas também de aplicativos e por final: Logs de auditoria.

* ✔ O acesso às informações confidenciais pode ser gerenciado por usuários IAM e funções.
* × As informações confidenciais não são versionadas (*), sendo necessário registrá-las manualmente (principalmente via UI).
* × Gera um custo mínimo.

É importante observar que, ao usar o **Secrets Manager**, embora o versionamento não seja feito pelo Git, o Secrets Manager possui sua própria funcionalidade de controle de versão. Consulte a documentação para obter mais detalhes.

Além disso, este método também escreve informações confidenciais nos arquivos de estado.

#### [Método 4](#metodo-4): Não Lidar com Informações Confidenciais no Terraform

Você pode pensar: 'Mas este é um artigo de blog com o título 'Lidando com Informações Confidenciais no Terraform', por que estamos falando sobre isso?' Aquilo que estamos apresentando aqui é mais precisamente:

'*Não lidar diretamente com informações confidenciais no Terraform*'

Quando você especifica informações confidenciais, como senhas, ao criar recursos com o Terraform, mesmo que sejam obtidas de fora, seja através de variáveis de ambiente ou do **Secrets Manager**, elas serão gravadas nos arquivos de estado. Embora, em geral, isso não seja um problema se for gerenciado com segurança usando o estado remoto, dependendo dos requisitos de segurança, os métodos de 1 a 3 podem não ser adequados.

[O Método 4](#metodo-4), basicamente, consiste em:

* Armazenar informações confidenciais em serviços como o Secrets Manager.
* Ao criar recursos com o Terraform, especificar as informações confidenciais de forma adequada.

Após a criação dos recursos, alterar as informações confidenciais de outra forma. Embora isso envolva um pouco de trabalho, usando `null_resource` ou `local-exec` do Terraform, é possível iniciar um script separado após a conclusão da criação de recursos para recuperar e definir valores a partir do Secrets Manager.

#### Métodos Específicos:

A seguir, apresentamos comandos específicos. Os *métodos 1 a 3* são detalhados no blogpost mencionado anteriormente pela [Gruntwork - Using the Library](https://docs.gruntwork.io/library/usage/using-the-library/), então vamos explicar brevemente.

**Detalhes do Método 1**: Externalização por meio de Variáveis de Ambiente ou Arquivos Externos {#metodo-1}

Crie um arquivo `variables.tf` da seguinte maneira:"

<script src="https://gist.github.com/LuksJobs/14246bd93e36bff999640e39e8cf68f8.js"></script>

#### Utilizando Variáveis de Ambiente:
Se estiver utilizando variáveis de ambiente, configure conforme abaixo e logo após execute '`$ terraform apply`' normalmente:

```bash
export TF_VAR_db_username="luksjobs"
export TF_VAR_db_password="suasenha123"
```
#### Utilizando Arquivos Externos:
Se estiver utilizando arquivos externos, por exemplo, crie um arquivo chamado `variables.tfvars` da seguinte maneira. Lembre-se de adicionar este arquivo ao `.gitignore`:

```bash
db_username = "luksjobs"
db_password = "suasenha123"
```

Em seguida, execute o seguinte comando:

```bash
terraform apply -var-file="variables.tfvars"
```
**Detalhes do Método 2**: Criptografar Arquivos (utilizando KMS): {#metodo-2}

Neste método, explicarei o uso do KMS, mas a abordagem é semelhante com outros serviços.

* Crie um arquivo `secrets.yaml` em texto simples e adicione ao `.gitignore`.

```yaml
db_username = "luksjobs"
db_password = "suasenha123"
```

* Crie uma chave no [AWS KMS](https://us-east-2.console.aws.amazon.com/kms/home?region=us-east-2#/kms/home) (manualmente ou usando o Terraform) e anote o ID dessa chave.
Execute o comando abaixo para criptografar o arquivo `secrets.yaml`.

Obs: é importante ter o **console (CLI) da AWS instalado**, caso esteja executando esses passos do seu computador local. Baixar o [AWS Command Line Interface](https://aws.amazon.com/pt/cli/).

```bash
aws kms encrypt \
  --key-id <ID da Chave KMS> \
  --region <REGIÃO AWS> \
  --plaintext fileb://secrets.yaml \
  --output text \
  --query CiphertextBlob \
  > secrets.yaml.encrypted
```

* Agora, utilize o **Terraform** para decifrar o arquivo e criar o recurso:

<script src="https://gist.github.com/LuksJobs/798782b31d7d1d0a92070353222c694d.js"></script>

* Para decifrar manualmente via bash, utilize o seguinte comando:

```bash
aws kms decrypt \
  --key-id <ID da Chave KMS> \
  --region <REGIÃO AWS> \
  --ciphertext-blob fileb://<(base64 -d ./secrets.yaml.encrypted) \
  --output text \
  --query Plaintext
```
Lembrando que a utilização do base64 é crucial.

Detalhes do **Método 3**: Armazenar em AWS Secrets Manager: {#metodo-3}
Registre as informações confidenciais no AWS Secrets Manager em formato YAML ou JSON. Anote o nome do segredo ao registrar.

* Crie o seguinte arquivo no Terraform:

<script src="https://gist.github.com/LuksJobs/f307630d840bd9706bc3198270ad4cd7.js"></script>


Detalhes do **Método 4**: Não Lidar com Informações Confidenciais no Terraform: {#metodo-4}

* Veja os detalhes neste post do **Google** [Práticas recomendadas para usar o Terraform](https://cloud.google.com/docs/terraform/best-practices-for-terraform?hl=pt-br) 

<script src="https://gist.github.com/LuksJobs/53ee5578a05fdf714bfa8b47fd477fbf.js"></script>

Aqui, podem ser considerados dois métodos de implementação para o update_password.py:

1. Deixar a senha no Secrets Manager antecipadamente
   - Configurar o Secrets Manager antecipadamente e salvar a senha
   - Obter a senha do Secrets Manager no script
   - Alterar a senha do banco de dados
   - Gerar a senha no script
   - Gerar a senha no script novamente
   - Gerar a senha do banco de dados no script
   - O script salva essa senha no Secrets Manager
   - Geralmente, essa abordagem é mais conveniente, especialmente para rotações automáticas.

#### Outros tópicos:

#### random_password

No Terraform, há o `random_password`, que, como o nome sugere, gera senhas aleatórias. No entanto, as senhas geradas por ele também são gravadas no arquivo de estado (state file).

Para obter detalhes sobre a implementação, consulte a seguinte página:

[Terraform password hack. A simple way to create passwords in… | por Marcelo Clavel | Medium](https://medium.com/@marceloclavel/terraform-password-hack-3bcf9a7a0ee0)

Vale ressaltar que nesta página é usado o `random_string`, que, conforme mencionado no final da página, apresenta o problema de exibir as senhas geradas na tela. Entretanto, esse problema foi resolvido na implementação subsequente do random_password.

#### Flag sensitive

A partir do Terraform 0.14, é possível adicionar a flag sensitive aos recursos. Configurando isso, as saídas do terraform plan ou terraform apply não incluirão os valores sensíveis. Para obter mais informações, consulte a seguinte página:

[Terraform 0.14 Adds the Ability to Redact Sensitive Values in Console Output](https://www.hashicorp.com/blog/terraform-0-14-sensitive-values)


### Conclusão

O **Terraform** é uma ferramenta poderosa para gerenciar infraestrutura como código, mas pode ser um desafio lidar com informações confidenciais de forma segura. Neste artigo, exploramos várias abordagens para lidar com informações confidenciais no Terraform, incluindo o uso de variáveis, módulos e provedores. Também discutimos algumas considerações importantes ao trabalhar com informações confidenciais no Terraform, como criptografia e controle de acesso. 
 
Espero que este artigo tenha sido útil para você. Se você tiver alguma dúvida ou comentário, sinta-se à vontade para deixar um comentário abaixo.