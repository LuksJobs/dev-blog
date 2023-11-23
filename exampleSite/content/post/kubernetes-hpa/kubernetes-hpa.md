+++
author = "Lucas Oliveira"
title = "HPA com base na utilização de CPU e Memória"
date = "2020-03-16"
description = "No Kubernetes, o HPA é o recurso que controla a elasticidade das suas aplicações baseado em algumas metricas de uso de recursos"
tags = [
    "kubernetes",
    "devops",
    "hpa",
]
+++

Neste post, irei falar sobre o **HPA** que significa "*Horizontal Pod Autoscaler*". É um recurso no Kubernetes que ajusta automaticamente o número de réplicas (pods) em um *deployment* com base na utilização observada de *CPU* ou *memória*.  

<!--more-->

## Objetivo em usar um HPA

O objetivo de um **HPA** é garantir que sua aplicação tenha recursos suficientes para lidar com a demanda. Se a utilização de recursos aumentar, o HPA aumentará o número de réplicas (aumenta a quantidade de pods em execução) para garantir que a carga seja distribuída adequadamente. Da mesma forma, se a utilização diminuir, o HPA reduzirá o número de réplicas, economizando recursos. Isso ajuda a manter a escalabilidade e o desempenho da sua aplicação de forma automática e eficiente.

```
apiVersion: autoscaling/v2b
kind: HorizontalPodAutoscaler
metadata:
  name: meu-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: meu-deployment #mesmo nome que está definido no seu arquivo de deployment
  minReplicas: 1  #quantidade mínima de replicas de um POD
  maxReplicas: 10 #quantidade máxima de criação de replicas de POD
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80 #ao bater 80% de CPU, crie um novo pod
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80 #ao bater 80% de memória, crie um novo pod
```

Certifique-se de substituir o nome: "**meu-hpa**" pelo nome desejado para o HPA e **meu-deployment** pelo nome do seu deployment ao qual o HPA será aplicado. Isso garantirá que o HPA ajuste automaticamente o número de réplicas do seu deployment com base no uso de recursos de memória e CPU, mantendo-os em torno de 80% de utilização.