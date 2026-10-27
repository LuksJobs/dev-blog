+++
author = "Lucas Oliveira"
title = "HPA based on CPU and Memory utilization"
date = "2020-03-16"
description = "In Kubernetes, the HPA is the resource that controls the elasticity of your applications based on resource usage metrics"
tags = [
    "kubernetes",
    "devops",
    "hpa",
]
+++

In this post, I will talk about the **HPA**, which stands for "*Horizontal Pod Autoscaler*". It is a Kubernetes resource that automatically adjusts the number of replicas (pods) in a *deployment* based on observed *CPU* or *memory* utilization.  

<!--more-->

## Why use an HPA

The goal of an **HPA** is to make sure your application has enough resources to handle demand. If resource utilization goes up, the HPA increases the number of replicas (more pods running) so the load is properly distributed. Likewise, if utilization goes down, the HPA reduces the number of replicas, saving resources. This keeps your application scalable and performant automatically and efficiently.

<script src="https://gist.github.com/LuksJobs/7d4c9e2c7b1e4d94ac30163c897bf0b9.js"></script>

Make sure to replace the name "**meu-hpa**" with the name you want for the HPA, and **meu-deployment** with the name of the deployment the HPA will be applied to. This ensures the HPA automatically adjusts the number of replicas of your deployment based on memory and CPU usage, keeping them at around 80% utilization.
