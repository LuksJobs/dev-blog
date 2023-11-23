+++
author = "Lucas Oliveira"
title = "Configurando a Prioridade de Execução de um POD"
date = "2023-07-28"
description = "No Kubernetes, os pods podem ter diferentes tipos de prioridade para determinar sua ordem de execução."
tags = [
    "kubernetes",
    "devops",
    "pod",
]
+++

A "Prioridade do pod" (Pod Priority) é um recurso de agendamento do Kubernetes que permite ao Kubernetes tomar decisões de agendamento comparando outros pods com base no número de prioridade. Vejamos os dois principais conceitos a seguir na prioridade do pod.

<!--more-->

![Variável de Ambiente](https://static.us-east-1.prod.workshops.aws/public/bdc29db4-9036-4829-a0b1-0df3cbb7a5ac/static/images/over/over-ani-2.gif)

Crédito pelo GIF: Amazon AWS Dev Blog

1. **Prioridade do sistema** (System Priority): É a prioridade mais alta e é usada para pods do sistema que são essenciais para o funcionamento do cluster. Esses pods são críticos para a operação do Kubernetes e geralmente não devem ser interrompidos. 
 
2. **Prioridade de classe** (Class Priority): É uma prioridade intermediária e é usada para definir a importância relativa entre diferentes classes de pods. Por exemplo, você pode ter classes de pods como "alta prioridade", "média prioridade" e "baixa prioridade". Isso permite que você defina a ordem de execução dos pods dentro de cada classe, com base em suas necessidades específicas. 

3. **Prioridade padrão** (Default Priority): É a prioridade mais baixa e é atribuída a todos os pods que não têm uma prioridade específica definida. Esses pods serão executados após os pods de prioridade do sistema e de classe. 
 
Além desses tipos de prioridade, o Kubernetes também suporta recursos como limites de recursos (resource limits) e solicitações de recursos (resource requests), que podem ser usados para controlar a alocação de recursos para os pods.

## Exemplo de classe de prioridade do pod

O exemplo a seguir mostra um objeto `priorityClassName` De um pod "Nginx" que usa o PriorityClassName:

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  priorityClassName: high-priority
  containers:
  - name: web
    image: nginx:latest
    imagePullPolicy: IfNotPresent
  priorityClassName: high-priority-apps
```

Neste exemplo, o campo  `priorityClassName`  está definido como "`high-priority`". Isso se refere a uma classe de prioridade que você definiu em seu cluster. Você pode criar uma classe de prioridade usando o recurso  `PriorityClass`:

```
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
```

No recurso `PriorityClass`, você pode especificar um nome para a classe de prioridade (neste caso, "high-priority") e atribuir um valor a ela (neste caso, 1000000). Quanto maior o valor, maior a prioridade. 
 
Ao definir o priorityClassName na especificação do pod, você atribui a classe de prioridade correspondente ao pod. Isso ajuda o Kubernetes a priorizar o agendamento e a alocação de recursos do pod com base em sua prioridade em comparação com outros pods no cluster.

```
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-apps
value: 1000000
preemptionPolicy: PreemptLowerPriority
globalDefault: false
description: "Aplicação crítica."
---
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: dev
spec:
  containers:
  - name: web
    image: nginx:latest
    imagePullPolicy: IfNotPresent
  priorityClassName: high-priority-apps
```

Vamos analisar o que cada parte do arquivo faz: 
 
- A primeira seção define o objeto PriorityClass. Ele possui os seguintes campos: 
  -  **apiVersion**: Define a versão da API usada (scheduling.k8s.io/v1). 
  -  **kind**: Especifica o tipo do objeto (PriorityClass). 
  -  **metadata**: Contém metadados adicionais, como o nome da classe de prioridade (high-priority-apps). 
  -  **value**: Define o valor da classe de prioridade (1000000). Quanto maior o valor, maior a prioridade. 
  -  **preemptionPolicy**: Define a política de preempção para a classe de prioridade. Neste caso, "PreemptLowerPriority" indica que os pods com prioridade inferior podem ser interrompidos para permitir a execução de pods de prioridade mais alta. 
  -  **globalDefault**: Indica se essa classe de prioridade é a padrão para todos os pods, caso não seja especificada uma classe de prioridade. Neste caso, é definido como "false". 
  -  **description**: Fornece uma descrição opcional para a classe de prioridade ("Mission Critical apps"). 
 
- A segunda seção define o objeto Pod. Ele possui os seguintes campos: 
  -  **apiVersion**: Define a versão da API usada (v1). 
  -  **kind**: Especifica o tipo do objeto (Pod). 
  -  **metadata**: Contém metadados adicionais, como o nome do pod (nginx) e rótulos (labels). 
  -  **spec**: Define as especificações do pod, como os contêineres que serão executados. 
  -  **containers**: Lista os contêineres que serão executados dentro do pod. Neste caso, há um contêiner chamado "web" com a imagem do Nginx. 
  -  **priorityClassName**: Atribui a classe de prioridade (high-priority-apps) definida anteriormente a este pod. 

## Como funciona a prioridade e a preferência do pod de Kubernetes?

Se um pod for implantado com PriorityClassName, o controlador de admissão (admission controller) irá tratar de forma prioritária o POD com o valor prioritário mais alto, isso usando o valor do "PriorityClassName".

Se houver muitos pods na fila de agendamento, o agendador (schedule) organiza a ordem de agendamento com base na prioridade. Ou seja, o agendador coloca o pod de alta prioridade à frente dos pods de baixa prioridade , agora, se não houver nós disponíveis com recursos para acomodar um pod de prioridade mais alta, a lógica de preempção (preemptionPolicy) entrará em ação.

O agendador antecipa o pod de baixa prioridade de um nó onde pode agendar o pod de prioridade mais alta. O pod despejado recebe um tempo de terminação padrão gracioso de 30 segundos. Se os pods tiverem definidos com o parametro "`terminationGracePeriodSeconds` então ao invés dele encerrar aos 30 segundos, encerrará de uma vez.

No entanto, se por algum motivo, os requisitos de agendamento não forem atendidos, o agendador prosseguirá com o agendamento dos pods de prioridade mais baixa.

## Qual é o significado da prioridade do Pod?

Quando você implanta aplicativos para o Kubernetes em produção, há certos aplicativos que você não deseja que sejam mortos. Por exemplo, um coletor de métricas Daemonset, agentes de registro, serviço de pagamento etc.

Para garantir a disponibilidade de pods de missão crítica, você pode criar uma hierarquia de camadas de pod com prioridades; quando houver uma crise de recursos nos clusters, kubelet tenta matar os pods de baixa prioridade para acomodar pods com PriorityClass mais alto.

## Conclusão

Ao trabalhar com Kubernetes, é muito importante entender a prioridade do pod principalmente nas aplicações que estarão rodando no ambiente de produção. É importante entender que, embora a PriorityClassName seja uma ferramenta útil para o sistema de agendamento, não é a única consideração para determinar a alocação de recursos em um cluster Kubernetes. Outros fatores, como limites e requisições de recursos, também desempenham um papel importante na decisão do agendador. Além disso, a PriorityClassName pode não ter efeito em clusters que não estejam configurados para suportar prioridades ou quando os recursos disponíveis são suficientes para atender a todas as demandas de recursos dos Pods.