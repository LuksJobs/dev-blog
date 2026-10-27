---
title: About
description: DevOps, SRE and Cloud with a focus on DevSecOps. Who I am, what I do and what I write about here.
date: '2019-02-28'
license: CC BY-NC-ND
lastmod: '2026-10-27'
menu:
    main: 
        weight: -90
        params:
            icon: user
---

<div class="about-terminal">
<div class="about-terminal__bar"><span></span><span></span><span></span><code>~/luks.dev.br</code></div>
<pre class="about-terminal__body"><span class="t-prompt">$</span> whoami
<span class="t-out">lucas-oliveira-dantas</span>
<span class="t-prompt">$</span> cat profile.yaml
<span class="t-key">role:</span>       <span class="t-val">DevOps · SRE · Cloud</span>
<span class="t-key">focus:</span>      <span class="t-val">DevSecOps and software supply chain security</span>
<span class="t-key">experience:</span> <span class="t-val">10+ years in IT</span>
<span class="t-key">based in:</span>   <span class="t-val">Rio Grande do Norte, Brazil</span>
<span class="t-key">blog:</span>       <span class="t-val">writing since 2019</span>
<span class="t-key">lattes:</span>     <a class="t-link" href="https://lattes.cnpq.br/8767989273085683" target="_blank" rel="noopener">lattes.cnpq.br/8767989273085683</a></pre>
</div>

Hi! 👋 I'm **Lucas Oliveira**, a technology professional with more than a decade of experience in **DevOps, SRE and Cloud**. My job is getting software to production **fast, safely and reliably**: pipelines, containers, Kubernetes, infrastructure as code and, more and more, security across all of those stages.

I started like many people in this field: spending hours in front of the computer, creating virtual machines and hosting simple pages just for the joy of seeing them work. That enthusiasm led me to AWS, Azure and GCP, to the cloud native ecosystem and, more recently, to **DevSecOps**, where most of my studies are focused today.

This blog is where I document what I learn in practice: real problems, tested solutions and the reasoning behind them. Most articles are written in Portuguese; you can read them through the machine translation links at the top of each post.

## What I do

<div class="about-grid">
<div class="about-card">
<p class="about-card__title">🛡️ DevSecOps</p>
<p>SAST with Semgrep and SonarQube, image scanning with Docker Scout, SBOM, SLSA and secrets management with Vault and Terraform.</p>
</div>
<div class="about-card">
<p class="about-card__title">🔁 CI/CD & GitOps</p>
<p>Pipelines on GitLab CI, GitHub Actions, Azure DevOps and Harness, with reusable templates and well-designed cache and artifacts.</p>
</div>
<div class="about-card">
<p class="about-card__title">☸️ Containers & Kubernetes</p>
<p>Docker from Dockerfile to production, autoscaling with HPA, pod priority and cluster troubleshooting.</p>
</div>
<div class="about-card">
<p class="about-card__title">☁️ Cloud & IaC</p>
<p>AWS (including serverless with SAM), GCP and Azure, with infrastructure versioned in Terraform and Ansible.</p>
</div>
</div>

## Everyday stack

<dl class="about-stack">
<dt>Languages</dt><dd><span>Python</span><span>JavaScript</span><span>Node.js</span><span>Shell</span></dd>
<dt>Containers</dt><dd><span>Docker</span><span>Docker Compose</span><span>Kubernetes</span></dd>
<dt>CI/CD</dt><dd><span>GitLab CI</span><span>GitHub Actions</span><span>Azure DevOps</span><span>Harness</span></dd>
<dt>Cloud & IaC</dt><dd><span>AWS</span><span>GCP</span><span>Azure</span><span>Terraform</span><span>Ansible</span></dd>
<dt>Security</dt><dd><span>Semgrep</span><span>SonarQube</span><span>Docker Scout</span><span>Vault</span></dd>
<dt>Observability</dt><dd><span>Prometheus</span><span>Grafana</span><span>Elasticsearch</span></dd>
<dt>Data</dt><dd><span>PostgreSQL</span><span>MongoDB</span></dd>
</dl>

<p class="about-icons">
<img src="https://skillicons.dev/icons?i=py,js,nodejs,docker,kubernetes,gitlab,githubactions,aws,gcp,terraform,ansible,grafana,prometheus,elasticsearch,postgres,mongo,linux,vim&perline=9" alt="Icons of the technologies in the stack" loading="lazy" />
</p>

## Where to start

A few articles that represent what I write about (in Portuguese):

- [Onboarding AI-generated applications: the real cost for DevSecOps]({{< relref path="post/onboarding-aplicacoes-geradas-por-ia/onboarding-aplicacoes-geradas-por-ia.md" lang="pt-br" >}})
- [Scanning the code: automating SAST with Semgrep and GitLab CI]({{< relref path="post/sast-scan-semgrep/semgrep-sast-gitlab.md" lang="pt-br" >}})
- [Exploring Docker Scout: analyzing and hardening Docker image security]({{< relref path="post/docker-scout/docker-scout.md" lang="pt-br" >}})
- [Protecting secrets in Terraform]({{< relref path="post/terraform-secrets/terraform-secrets.md" lang="pt-br" >}})
- [Artifacts vs. cache in GitLab: optimizing your pipeline]({{< relref path="post/gitlab_artifactsvscache/gitlab-pipeline-cache-artifacts.md" lang="pt-br" >}})

In English: [HPA based on CPU and memory utilization]({{< relref "post/kubernetes-hpa/kubernetes-hpa.md" >}}).

## Academic background

Beyond hands-on practice, I value a solid academic foundation and formal learning. My education and career are recorded in my **Lattes CV**, the official platform of CNPq (Brazil's National Council for Scientific and Technological Development) that gathers the academic and professional history of researchers and professionals in Brazil. It's in Portuguese.

<a class="about-lattes" href="https://lattes.cnpq.br/8767989273085683" target="_blank" rel="noopener">
<span class="about-lattes__label">Lattes CV · CNPq</span>
<span class="about-lattes__url">lattes.cnpq.br/8767989273085683 ↗</span>
</a>

## Projects and community

- **AI-assisted software supply chain security:** I've been building a tool for vulnerability scanning, SBOM generation and SLSA verification with AI-generated explanations. [See a preview on X](https://x.com/luksjobs/status/1972500402567602246).
- **Cloud native community in RN:** I follow and take part in the events of [Cloud Native RN]({{< relref path="post/cloud-native-rn/cloud-native.md" lang="pt-br" >}}), the CNCF community group in Rio Grande do Norte.
- **Open source:** examples and scripts from the articles live on [GitHub](https://github.com/LuksJobs) and [GitLab](https://gitlab.com/luksjobs).

## Let's talk

Want to chat about DevOps, security or one of the articles here? Reach out (all channels are on the [Links]({{< relref "page/links" >}}) page):

<div class="about-links">
<a href="https://www.linkedin.com/in/luksjobs/" target="_blank" rel="noopener">LinkedIn</a>
<a href="https://lattes.cnpq.br/8767989273085683" target="_blank" rel="noopener">Lattes</a>
<a href="https://github.com/LuksJobs" target="_blank" rel="noopener">GitHub</a>
<a href="https://gitlab.com/luksjobs" target="_blank" rel="noopener">GitLab</a>
<a href="https://x.com/luksjobs" target="_blank" rel="noopener">X</a>
<a href="mailto:luksjobs@live.com">Email</a>
</div>
