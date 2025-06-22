+++
author = "Lucas Oliveira"
title = "Resolvendo o problema do pod em estado de “evicted” no Kubernetes"
date = "2022-09-21"
description = "Quando um pod está em estado de evicted no Kubernetes, significa que o pod foi encerrado forçadamente ou removido do nó onde estava em execução"
tags = [
    "kubernetes", "devops",
]
+++

Nesse post eu vou compartilhar minha experiência com pods em estado de **“evicted”** e, especialmente, explicar um pouco mais sobre o que é esse estado “evicted” de um pod. Antes de entrarmos no assunto, é obrigatório entender alguns vocabulários usados no Kubernetes.

<!--more-->

## Vocabulário

Um pouco de vocabulário primeiro! Para entender bem este artigo, precisamos falar a mesma língua, então você encontrará a seguir alguns conceitos essenciais para entender.

## Requests e limits:

**Requests**: Parâmetro utilizado para definir os requisitos base de um Pod. Esse parâmetro é a quantidade mínima de recursos que um contêiner precisa para iniciar. Os “requests”, em português “solicitações”, não significam que o recurso é dedicado ao pod.

**Limits**: Esta é a quantidade máxima de um recurso que o nó concederá aos contêineres para usar.
Classes do pod:
- **“Guaranted ou Garantido“**: são os pods que têm solicitações e limites configurados em recursos de memória e CPU:
  - Cada contêiner no pod deve ter um limite de CPU e uma solicitação de CPU, e eles devem ser iguais.
  - Cada Container no Pod deve ter um limite de memória e uma requisição de memória, e eles devem ser iguais.
- **“Burstable ou Explosivo”**: são os pods com pelo menos uma configuração de solicitação na CPU ou memória para pelo menos um de seus contêineres.
- **“Best Effort ou Melhor esforço”**: pods sem solicitações ou limites.

## O que é um pod em estado “Evicted”?

Agora que sabemos o que são solicitações/limites e que os pods têm classes, vamos nos aprofundar no processo de remoção.

Quando um nó atinge seu limite de disco, memória ou quando existe algum problema de rede, uma flag é definida no nó do Kubernetes para indicar que ele está sob pressão. Esta flag também bloqueia novas alocações neste nó, e em seguida inicia-se um processo de “eviction” um tipo de “despejo” para liberar alguns recursos.

Este é o Kubelet do nó sob pressão que cuidará do processo de despejo. Este começará a falhar nos Pods até que os recursos usados ​​do nó estejam abaixo do limite de despejo, o que significa que o Kubelet encerrará todos os contêineres do Pod e definirá seu PodPhase como Failed.

Se uma implantação gerencia o pod removido, a implantação cria outro pod para ser agendado pelo Kubernetes.

## Como os recursos são liberados?

A primeira coisa que o Kubelet fará é liberar o disco excluindo os pods que não estão em execução e suas imagens (essa é uma limpeza rápida, um “garbage collection”) . Então, se a limpeza do disco não for suficiente, o Kubelet iniciará um processo de eviction, ‘despejo’, de pods nesta ordem precisa:

* Pods que demandam de mais **limits** e **requests** são os primeiros a serem excluídos
* Pods com capacidade de explosão (bustable) e que estão usando mais recursos do que a solicitação definida no recurso faz com que o nó sofra;
* Pods com capacidade de explosão  e que estão usando menos recursos do que a solicitação definida no recurso faz com que o nó sofra;

Por exemplo, vamos pegar um nó que tem alguns problemas de CPU. Se um pod tiver uma solicitação no recurso de CPU e usar metade de sua solicitação de CPU, ele será removido após um pod com uma solicitação no recurso de CPU, mas que usa mais do que sua solicitação.

## Resolução de problemas

A resolução de pods em estado de **“evicted”** depende da causa subjacente do problema. Aqui estão algumas possíveis soluções técnicas para resolver esse problema:

**Verificar os logs e eventos do Kubernetes**: O primeiro passo para solucionar um pod em estado de “evicted” é verificar os logs e eventos do Kubernetes para determinar a causa subjacente do problema. Isso pode ajudar a identificar problemas de rede, falta de recursos ou outros problemas que possam estar afetando o pod.

Para listar os pods de um namespace especifico que está em estado de evicted, você pode utilizar o comando abaixo:

```
kubectl get pods --all-namespaces --field-selector=status.phase=Failed | grep Evicted
```

E para remover todos os pods em evicted, através do namespace, basta usar o comando:

```
kubectl get pods --all-namespaces --field-selector=status.phase=Failed | awk '{if ($4 == "Evicted") system("kubectl delete pod --namespace=" $1 " " $2)}'
```

No comando acima, estamos procurando os pods com status ‘Evicted‘ e limpando-os usando o comando “kubectl delete pod” para todos eles.

Em geral, resolver pods em estado de “evicted” pode ser um processo complexo que exige uma análise cuidadosa do ambiente Kubernetes e da configuração do pod. Certifique-se de investigar cuidadosamente as causas subjacentes do problema antes de tentar uma solução.