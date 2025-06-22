+++
author = "Lucas Oliveira"
title = "Introdução ao Scan de Vulnerabilidades em Containers Docker utilizando o SAST"
date = "2025-06-22"
description = "Nesse post irei mostrar como usar testes estáticos para analisar imagens de containers antes da execução, identificando vulnerabilidades em código e configuração — como bibliotecas desatualizadas, permissões perigosas ou segredos embutidos — e integrando essa análise no fluxo de desenvolvimento para garantir que apenas imagens seguras cheguem em produção"
image = "https://i.imgur.com/ybI3hUl.jpeg"
tags = [
    "docker", "sast", "vulnerabilidades", "devops",
]
categories = [
    "devops",
]
+++

## Visão Geral

A implementação de testes de [vulnerabilidade](https://luks.dev.br/search/?keyword=seguran%C3%A7a) tornou-se comum em registros de imagens de contêineres. Para compreender a importância das contramedidas de vulnerabilidade quando as empresas utilizam contentores como o [**Kubernetes**](https://luks.dev.br/search/?keyword=kubernetes), organizámos a inspeção de vulnerabilidades e normas internacionais relacionadas.

### Post relacionado

Aqui no blog tenho um outro post que ensina como fazer um teste de vulnerabilidade do tipo [**SAST**](https://luks.dev.br/search/?keyword=sast), utilizando o **Semgrep** para realizar scan em imagem Docker:

#### [Integre Semgrep SAST no GitLab CI para automatizar a segurança do seu código e encontrar vulnerabilidades cedo](https://luks.dev.br/p/varrendo-o-c%C3%B3digo-automatizando-sast-com-semgrep-e-gitlab-ci/)
---

## Primeiros passos

Os módulos contidos na imagem do contêiner estão constantemente melhorando e melhorando seus esforços para reduzir a vulnerabilidade. Imagens de contêiner uma vez construídas também são encontradas toda vez, um módulo com vulnerabilidades é descoberto. A medida contra a vulnerabilidade é atualizar para o módulo de contramedida e reconstruir a imagem do contêiner.

### Selecionando uma imagem confiável

O código contido no contêiner é importante para a segurança. A maioria das imagens no contêiner são pacotes de código aberto, como [**Linux OS**](https://luks.dev.br/search/?keyword=linux), servidores web, **bancos de dados SQL**, linguagens de programação e cada um desses projetos OSS também distribui na imagem do contêiner, então você precisa construir a imagem sozinho. No entanto, como acontece com o download de código de fontes externas, você deve verificar a origem da imagem do contêiner, o autor e se ela contém código malicioso dentro.

Basicamente você deve seguir os seguintes princípios: 

* As imagens básicas, os pacotes de SO, os pacotes de linguagem de programa e o código do aplicativo trazem ameaças de segurança ao ambiente em execução do contêiner?
* As bibliotecas e os módulos usados pelo aplicativo estão atualizados e não são vulneráveis?
* Imagens básicas como SO e middleware estão usando as últimas versões lançadas e não são vulneráveis?
* Você sabe com que frequência a imagem do contêiner é atualizada ou há uma maneira de saber o que foi atualizado?

### Exemplos de ataques previamente descobertos

Entender quais vulnerabilidades estão em um contêiner é importante para entender e abordar sua importância. Portanto, aqui estou listando os problemas de vulnerabilidade descobertos anteriormente.

#### **Ataque afogado**

Explorar uma vulnerabilidade chamada "**DROWN Attack**" permite que os invasores descriptografem o TLS e leiam e roubem comunicações confidenciais, como senhas, números de cartão de crédito, segredos comerciais e dados financeiros, publicados em março de 2016. Em uma medição, 33% de todos os servidores HTTPS estavam vulneráveis a ataques. Após isso, procedeu-se à aplicação do programa de correção e, a partir de 2019 Laboratórios SSL Estima-se que seja vulnerável a 1,2% dos servidores HTTPS.

Fontes: 
* [Explicação do ataque de afogamento](https://drownattack.com/) (Drown Attack)
* [CVE-ID CVE-2016-0800](https://cve.mitre.org/cgi-bin/cvename.cgi?name=cve-2016-0800)

#### **Ataque de Vaca Suja**

As vulnerabilidades do "**Dirty COW**" estão presentes no **kernel do Linux** desde setembro de 2007 e foram descobertas e exploradas em outubro de 2016. Essa vulnerabilidade afeta todos os sistemas operacionais baseados em Linux, incluindo o **Android**, e é muito séria. Os atacantes podem explorar essa vulnerabilidade para obter autoridade de raiz. Esta vulnerabilidade existe no código copy-on-light no kernel do Linux. Copy-on-light ( Copy-On-Write ) é uma das estratégias de otimização, mesmo que lhe seja pedido para duplicar dados grandes, pode lê-los (entre Read ), na verdade não faça nada e duplique). Em seguida, reescreva os dados (copie e reescreva quando Write) ocorrer. Se você não reescrevê-lo mesmo se você duplicá-lo, o custo de proteger a área de memória e processar a cópia dos dados na memória será desperdiçado. Portanto, o processamento estratégico descrito acima pode melhorar a velocidade de processamento e reduzir o tempo de CPU. Para mais informações, consulte o link abaixo.

Fontes:

* [Vaca Suja](https://dirtycow.ninja/) (Dirty Cow)
* [CVE-ID CVE-2016-5195](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-5195)

#### **Vulnerabilidade da glibc**

**Glibc** é uma implementação da biblioteca padrão **libc** do Projeto GNU. libc é o nome de biblioteca padrão para a linguagem C, e é uma biblioteca que coleta partes básicas, como chamadas de sistema. A maioria dos programas escritos em C usa libc.
E o glibc é baseado em libc com funcionalidade adicional significativa, e no Linux, que herdou as características do UNIX, o glibc forma a base do sistema Linux. A Glibc está quase totalmente em conformidade com os padrões ISO C, POSIX e Unix98 e possui uma API de internacionalização em vigor.
Um grande número de vulnerabilidades foram descobertas no glibc, que tem um histórico tão grande do passado, e você pode consultar a lista de vulnerabilidades, CVE-ID, CWE-ID, Score, etc. no link a seguir. Deve-se notar que muitos foram descobertos em 2019.

Fonte:
* [Detalhes CVE GNU » Glibc: Vulnerabilidades de segurança](https://www.cvedetails.com/vulnerability-list/vendor_id-72/product_id-767/GNU-Glibc.html)

## Base de dados de vulnerabilidades

Quando uma vulnerabilidade é descoberta, ela é registrada no banco de dados de vulnerabilidades de cada organização que desenvolve e distribui produtos SE. [MITRA](https://cve.mitre.org/) (Miter) é o nome de uma organização de pesquisa sem fins lucrativos apoiada pelo governo dos EUA, incluindo CERT/CC, HP, IBM, OSVDB, Red Hat e Symantec: ["Mais de 80 sites de informações sobre grandes vulnerabilidades"](http://cve.mitre.org/data/refs/index.html#sources). Em cooperação com o acima exposto, estamos trabalhando para coletar informações sobre vulnerabilidades e numerar CVEs sem duplicação.

Instituto Nacional de Padrões e Tecnologia [NIST](https://www.nist.gov/) Base de dados de informações de vulnerabilidade gerida por NVD Há. O NVD fornece ao NVD informações detalhadas sobre as informações de vulnerabilidade lançadas pelo CVE. E é caracterizada pelo fato de que o CVSS especificou a pontuação para o perigo.

A CVE possui um sistema de certificação de compatibilidade CVE, e ferramentas de inspeção de vulnerabilidades e serviços de informações de prevenção de vulnerabilidades, etc., atendem à exibição exata dos números de identificação CVE, atendem a outros requisitos funcionais e solicitam que a MITRE receba a certificação de compatibilidade CVE. .. Uma vez certificado, o logotipo CVE pode ser usado e será listado na lista de sites certificados.

#### **Iniciativas e fontes nacionais**

* [CERT.br](cert.br) – publicação de estatísticas sobre serviços vulneráveis e notificações de CVEs aplicáveis a ativos no Brasil.

Excelente para monitorar exposição nacional.

* [Boletins do CAIS/RNP](https://www.rnp.br/cais/) – alertas periódicos com CVEs, orientações de atualização e correção.

## **Varredura de vulnerabilidade**

Os scanners de vulnerabilidade permitem que pacotes contendo vulnerabilidades conhecidas sejam incluídos em uma imagem de contêiner ou inspecionados. No entanto, *o excesso de crença é uma coisa proibida porque esse tipo de ferramenta não encontra todas as vulnerabilidades*. Por outro lado, se os resultados da inspeção relatarem o problema, não é necessariamente um problema que deve ser resolvido imediatamente. 

Por exemplo, as seguintes razões podem ser consideradas:

* Casos que não utilizam os recursos de vulnerabilidade relatados
* Quando em container, ele move apenas o processo mínimo necessário, portanto, o caso é uma vulnerabilidade sem problemas práticos.
* Distribuidor Linux (Red Hat etc.) backporting para fornecer um programa de correção

Como pode haver *falsos positivos* e não detecção, é desejável criar uma imagem compacta, como não acreditar demais no scanner de vulnerabilidade e reduzir os pacotes dependentes. Isso reduz a probabilidade de incluir vulnerabilidades e reduz o tempo gasto em falsos positivos.

## **Scanners de vulnerabilidade**

Existem vários scanners de código aberto e serviços comerciais, então vou resumir o que parece representativo abaixo ...

### Banco Docker para Segurança

O [**Docker Bench for Security**](https://github.com/docker/docker-bench-security) é um script que verifica as melhores práticas gerais apropriadas para implantar um contêiner Docker em produção, todas as inspeções são automatizadas CIS [Docker Benchmark v1.2.0](https://github.com/docker/docker-bench-security). Isso é fornecido pela imagem do contêiner, para que qualquer pessoa possa avaliar facilmente o contêiner docker.

Essa ferramenta é executada no host do Docker para inspecionar a configuração do host do Docker e os contêineres em serviço e é um exemplo do que você fez no nó mestre do Kubernetes. **Scripts Shell** são inspecionados para cada disciplina para mostrar resultados.

Para executar basta seguir o comando abaixo:

```bash
docker run --rm --net host --pid host --userns host --cap-add audit_control \
    -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
    -v /etc:/etc:ro \
    -v /usr/bin/containerd:/usr/bin/containerd:ro \
    -v /usr/bin/runc:/usr/bin/runc:ro \
    -v /usr/lib/systemd:/usr/lib/systemd:ro \
    -v /var/lib:/var/lib:ro \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    --label docker_bench_security \
    docker-bench-security
```
O resultado abaixo esperado:

```bash
# Docker Bench for Security v1.6.0
#
# Docker, Inc. (c) 2015-2025
#
# Checks for dozens of common best-practices around deploying Docker containers in production.
# Inspired by the CIS Docker Community Edition Benchmark v1.1.0.
# ------------------------------------------------------------------------------

Initializing Sun Jun 22 11:44:51 UTC 2025

[INFO] 1 - Host Configuration
[WARN] 1.1  - Ensure a separate partition for containers has been created
[NOTE] 1.2  - Ensure the container host has been Hardened
[INFO] 1.3  - Ensure Docker is up to date
[INFO]      * Using 18.06.1, verify is it up to date as deemed necessary
[INFO]      * Your operating system vendor may provide support and security maintenance for Docker

## A partir daqui, o contêiner é inspecionado para o status de execução

[INFO] 5 - Container Runtime
[PASS] 5.1  - Ensure AppArmor Profile is Enabled
[PASS] 5.2  - Ensure SELinux security options are set, if applicable
[WARN] 5.3  - Ensure Linux Kernel Capabilities are restricted within containers
[WARN]      * Capabilities added: CapAdd=[NET_ADMIN] to k8s_kube-flannel_kube-flannel-ds-amd64-jg7jv_kube-system_13b64578-419d-49c6-a8e4-9f75be3e51de_0
[WARN] 5.4  - Ensure privileged containers are not used
[WARN]      * Container running in Privileged mode: k8s_kube-proxy_kube-proxy-f9xlx_kube-system_19248345-58a8-48f1-b0f5-b9e67e2a1219_0
[PASS] 5.5  - Ensure sensitive host system directories are not mounted on containers
[PASS] 5.6  - Ensure ssh is not run within containers

[INFO] 6 - Docker Security Operations
[INFO] 6.1  - Avoid image sprawl
[INFO]      * There are currently: 9 images
[INFO] 6.2  - Avoid container sprawl
[INFO]      * There are currently a total of 19 containers, with 17 of them currently running

[INFO] Checks: 105
[INFO] Score: 9
```

O relatório de Benchmark no meu ambiente destacou que no meu caso atualmente existe nove imagens Docker e dezenove contêineres (dos quais dezessete estão ativos). Isso não é necessariamente um problema, mas sugere revisar se há sobra de artefatos ou instâncias ociosas, pois isso pode acarretar confusão operacional e possíveis brechas.

Com isso, no meu teste, a pontuação final foi 9 (em um universo de 105 testes avaliáveis). Como referência, quanto mais próximo do total de pontos possível, mais alinhado seu ambiente está com as recomendações do **CIS Benchmarks**.

Em suma, seus principais focos de atenção devem ser:

* Fortalecer o ambiente do host e segmentar as partições do Docker.
* Atualizar o Docker para uma versão suportada e com patches de segurança.
* Remover privilégios de kernel desnecessários dos contêineres, retirando flags como NET_ADMIN e --privileged.
* Fazer uma limpeza criteriosa das imagens e instâncias ativas, eliminando o que estiver desnecessário.

Essas ações não só elevam sua pontuação, mas aumentam significativamente a robustez do ambiente.

### Anchore (Âncora)

O [Anchore](https://github.com/anchore/anchore-engine) é uma ferramenta para inspecionar a segurança do contêiner usando dados CVE e políticas definidas pelo usuário.

Anchor engine é um projeto de **código aberto**. Os motores âncora fornecem serviços centralizados, como auditoria, análise e certificação de imagens de contêineres. O mecanismo de ancoragem é fornecido como uma imagem de contêiner do Docker e pode ser executado sozinho ou em um ambiente de orquestração, como o **Kubernetes** ou o **Docker Swarm**. O usuário pode então usar a API RESTful ou a âncora CLI para operar o mecanismo de âncora.

A implantação do mecanismo de ancoragem em seu ambiente fará o download da imagem do registro de contêiner e as políticas personalizáveis do usuário analisarão, avaliarão e verificarão as práticas de segurança, conformidade e melhores práticas.

**Exemplo de inspeção de vulnerabilidade por motor âncora**

Nesse exemplo irei utilizar o **Docker-Compose** pelo fato de ser mais fácil do que experimentar com o **Kubernetes**, então pode fazer isso como um método simplificado para testes. No meu ambiente, mover o motor de ancoragem por cerca de uma hora deixou o motor do Docker sem resposta, resultando em uma condição instável que exigia uma reinicialização do Docker. Eu simplesmente não acho que a alocação de memória seja suficiente, mas parece desejável usá-la com o CI/CD no cluster do Kubernetes para uso total.

Primeiro de tudo, crie um diretório para copiar o Docker-Compose YAML, execute o contêiner do mecanismo âncora e copie o arquivo Docker-Compose YAML localmente de dentro do contêiner. Em seguida, remova o recipiente usado.

```bash
$ mkdir anchor
$ cd anchor
$ docker pull docker.io/anchore/anchore-engine:latest
latest: Pulling from anchore/anchore-engine
c8d67acdb2ff: Pull complete 

Status: Downloaded newer image for anchore/anchore-engine:latest
docker.io/anchore/anchore-engine:latest

$ docker create --name docker.io/anchore/anchore-engine:latest
47b152d2427862c5ad9c7853b0e32a58e0ae5040224531af7de2e086182cdf65

$ docker cp docker-compose.yaml /anchor/docker-compose.yaml
```

Inicie o sistema do motor de ancoragem com o comando **docker-compose**

```bash
$ ls
docker-compose.yaml

$ docker-compose pull
Pulling anchore-db           ... done
Pulling engine-catalog       ... done
Pulling engine-analyzer      ... done
Pulling engine-policy-engine ... done
Pulling engine-simpleq       ... done
Pulling engine-api           ... done

$ docker-compose up -d
Creating network "anchor_default" with the default driver
Creating volume "anchor_anchore-db-volume" with default driver
Creating volume "anchor_anchore-scratch" with default driver
Creating anchor_anchore-db_1 ... done
Creating anchor_engine-catalog_1 ... done
Creating anchor_engine-simpleq_1       ... done
Creating anchor_engine-api_1           ... done
Creating anchor_engine-analyzer_1      ... done
Creating anchor_engine-policy-engine_1 ... done
```

Verifique os containers em execução:

```bash
#verificando os containers criados e em execução
$ docker-compose ps 

            Name                           Command                       State                   Ports         
---------------------------------------------------------------------------------------------------------------
anchor_anchore-db_1             docker-entrypoint.sh postgres    Up                      5432/tcp              
anchor_engine-analyzer_1        /docker-entrypoint.sh anch ...   Up (health: starting)   8228/tcp              
anchor_engine-api_1             /docker-entrypoint.sh anch ...   Up (health: starting)   0.0.0.0:8228->8228/tcp
anchor_engine-catalog_1         /docker-entrypoint.sh anch ...   Up (health: starting)   8228/tcp              
anchor_engine-policy-engine_1   /docker-entrypoint.sh anch ...   Up (health: starting)   8228/tcp              
anchor_engine-simpleq_1         /docker-entrypoint.sh anch ...   Up (health: starting)   8228/tcp     

# verificando o status da execução do container
$ docker-compose exec engine-api anchore-cli system status

Service analyzer (anchore-quickstart, http://engine-analyzer:8228): up
Service policy_engine (anchore-quickstart, http://engine-policy-engine:8228): up
Service simplequeue (anchore-quickstart, http://engine-simpleq:8228): up
Service apiext (anchore-quickstart, http://engine-api:8228): up
Service catalog (anchore-quickstart, http://engine-catalog:8228): up

Engine DB Version: 0.0.11
Engine Code Version: 0.5.0
```

Imediatamente após iniciar o mecanismo de ancoragem, não tenho dados de vulnerabilidade, portanto, o download será iniciado. Desta vez, para uma tentativa rápida, escolha os meios simplificados de executar o comando `anchor-cli` a partir do contêiner lançado no docker-compose.

```bash
$ docker-compose exec engine-api anchore-cli system feeds list

Feed                   Group                  LastSync                          RecordCount
nvdv2                  nvdv2:cves             None                              0
vulnerabilities        alpine:3.10            2025-06-22T12:10:49.756530        1485
vulnerabilities        alpine:3.3             None                              0
vulnerabilities        alpine:3.4             None                              0
vulnerabilities        alpine:3.5             None                              0
vulnerabilities        alpine:3.6             None                              0
```

No meu ambiente, completei o download de dados de vulnerabilidade em cerca de uma hora. Este mecanismo de ancoragem é uma versão gratuita, portanto, o suporte não inclui nada que exija um contrato de assinatura, como o RHEL. 

Vou listar um relatório sobre a inspeção de vulnerabilidade das imagens de contêiner do ``NGINX`` que construí há alguns meses. Um URL com um ID de vulnerabilidade e detalhes são exibidos. Esta é certamente uma ferramenta útil. Se você pode obter um relatório de vulnerabilidade como um comando, ``anchore-cli`` image wait ao fazer isso, depois de registrar a imagem, você pode esperar até que a inspeção de vulnerabilidade seja concluída.

```bash
$ docker-compose exec engine-api anchore-cli image vuln docker.io/luksjobs/web-nginx:11 all

Vulnerability ID        Package                                 Severity          Fix                      CVE Refs        Vulnerability URL                                                   
CVE-2018-20843          libexpat1-2.2.0-2+deb9u1                High              2.2.0-2+deb9u2                           https://security-tracker.debian.org/tracker/CVE-2018-20843          
CVE-2019-11068          libxslt1.1-1.1.29-2.1                   High              1.1.29-2.1+deb9u1                        https://security-tracker.debian.org/tracker/CVE-2019-11068          
CVE-2019-1547           libssl1.1-1.1.0j-1~deb9u1               Low               1.1.0l-1~deb9u1                          https://security-tracker.debian.org/tracker/CVE-2019-1547           
CVE-2019-11038          libgd3-2.2.4-2+deb9u4                   security-tracker.debian.org/tracker/CVE-2007-5686     
```

Material de referência

* Análise de Contêineres de Ancoragem, https://docs.anchore.com/current/
* Âncora/motor de ancoragem GitHub https://github.com/anchore/anchore-engine

## Considerações finais
 
Todos esses processos que fizemos de forma manual, para testes podem ser incorporados em uma verificação de vulnerabilidade no pipeline do CI/CD, os problemas podem ser descobertos cedo e resolvidos. Após a conclusão da etapa de compilação, execute uma verificação e um relatório de vulnerabilidade. Se uma vulnerabilidade grave for descoberta, implemente medidas de vulnerabilidade sem prosseguir para a próxima etapa de teste, como um "breaker" da pipeline, exibindo o "exit code 1" ou algo do tipo. Alguns dos scanners acima também podem realizar um teste de vulnerabilidade a partir da CLI e encerrar abruptamente a etapa com o código de terminação quando uma vulnerabilidade significativa é descoberta.
 
