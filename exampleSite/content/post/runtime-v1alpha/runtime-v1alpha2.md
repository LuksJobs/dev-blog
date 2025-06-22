+++
author = "Lucas Oliveira"
title = "Resolvendo o problema: “runtime.v1alpha2.RuntimeService” na inicialização do Kubernetes"
date = "2021-09-04"
description = "Uma vez, eu estava instalando o Kubernetes e ao iniciá-lo enfrentei de cara o problema com o “runtime.v1alpha2.RuntimeService“. Bom… vamos lá! Esse problema refere-se a uma API obsoleta no Kubernetes, que foi removida na versão 1.22."
tags = [
    "kubernetes",
    "devops",
    "pod",
]
+++

Essa API era usada para criar e gerenciar contêineres em tempo de execução no Kubernetes, mas foi substituída por outras APIs mais recentes e melhores, como a “Container Runtime Interface” (CRI). Portanto, se você estiver usando uma versão mais antiga do Kubernetes e estiver enfrentando problemas com a API “runtime.v1alpha2.RuntimeService”, é recomendável atualizar para uma versão mais recente do Kubernetes e usar as APIs mais recentes para gerenciar seus contêineres.
<!--more-->

Resolvendo o problema sem precisar atualizar o Kubernetes:
Se você não pretende atualizar a versão do seu kubernetes e quer resolver esse erro mantendo a versão 1.22 ou mais antiga, aqui vão alguns comandos que pode te ajudar a resolver essa bronca:

```
rm /etc/containerd/config.toml
```

O comando acima remove a configuração do “**containerd**” e faz com que o serviço ao ser iniciado novamente, seja reconfigurado para a configuração padrão do containerd;

```
systemctl restart containerd
```

Assim como explciado acima, quando removido o “config.toml” iremos iniciar o containerd para que esse arquivo no qual removemos, seja recriado com a configuração padrão.

```
kubeadm init
```

Logo após, iremos iniciar novamente nosso kubernetes com o comando “kubeadm init” e se tudo der certo, seu cluster kubernetes iniciará novamente, sem problemas de API;

Espero que isso tenha te ajudado com seu problema, caso não, entre em contato e eu prometo que te ajudarei a resolver essa bronca 🙂
