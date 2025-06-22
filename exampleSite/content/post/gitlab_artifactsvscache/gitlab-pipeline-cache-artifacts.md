+++
author = "Lucas Oliveira"
title = "Otimizando sua Pipeline: Entenda a diferença entre Artifacts e Cache no GitLab"
date = "2024-12-01"
description = "Aprenda a usar artifacts e cache de maneira eficiente para acelerar suas etapas de CI/CD."
image = "https://i.imgur.com/ki34PvF.png"
categories = [
    "ci/cd"
]
tags = [
    "gitlab",
    "devops",
    "pipeline",
]
+++

No **GitLab CI/CD**, tanto **artifacts** quanto **cache** são recursos que ajudam no gerenciamento de arquivos durante as etapas de uma pipeline. Apesar de terem funcionalidades parecidas em alguns casos, existem diferenças importantes em como eles funcionam e para que são usados. Entender essas diferenças permite utilizá-los de forma mais eficiente para acelerar suas pipelines.

* 🦊 Repositório prático utilizado no Gitlab como referência: [Lucas Oliveira: Artifact vs Cache](https://gitlab.com/luksjobs/cache-vs-artifacts)
---

### 📦 **Artifacts**

Os **artifacts** são arquivos ou diretórios que você deseja **preservar após a execução de um job**. Esses arquivos podem ser disponibilizados para outros jobs na mesma pipeline, para download manual no GitLab ou armazenados por um período específico.

- **Principais Características:**
  - São usados para compartilhar arquivos **entre jobs** ou para serem salvos como resultado final de um processo.
  - São armazenados de forma temporária, de acordo com o tempo definido no parâmetro `expire_in`.
  - Podem ser baixados manualmente na interface do GitLab.
  - São sempre ligados a uma execução específica de um job/pipeline.

- **Quando usar artifacts:**
  - Para compartilhar resultados intermediários, como binários gerados em uma etapa de build.
  - Para salvar relatórios, logs ou outros arquivos que precisam ser analisados após a execução da pipeline.
  - Em pipelines que requerem aprovação manual, para os arquivos serem inspecionados antes de prosseguir.

- **Exemplo de uso:**

<script src="https://gist.github.com/LuksJobs/768354aceeeb584f491eaf172f2bb390.js"></script>

  **Artefato criado na Pipeline:**

  ![gitlabartifact](https://i.imgur.com/h4zFGYT.png) 

  * **Artifact Criado (dist/)**: O artifact contém arquivos gerados durante o job (neste caso, o diretório dist/ com o build da aplicação). Ele é usado para transferir resultados de um job para outro (via dependencies) ou para ser baixado manualmente após o término do pipeline. Diferentemente do cache, o artifact é específico da execução do job e geralmente tem um prazo de expiração definido.


### 📦 **Cache**

O **cache** é usado para armazenar **arquivos reutilizáveis entre diferentes pipelines** ou **jobs dentro da mesma pipeline**. Esses arquivos geralmente incluem dependências, bibliotecas, pacotes ou qualquer coisa que possa ser reutilizada para evitar reprocessamento.

- **Principais Características:**
  - Focado em arquivos reutilizáveis (como dependências de linguagens de programação).
  - Armazenado por runner, sendo reutilizável entre pipelines e jobs (se configurado corretamente).
  - Pode ser compartilhado entre diferentes projetos (quando o cache é compartilhado no mesmo runner).

- **Quando usar cache:**
  - Para economizar tempo na instalação de dependências em projetos que utilizam ferramentas como npm, Maven, Composer, pip, etc.
  - Em projetos que geram ou consomem arquivos pesados em várias execuções, como imagens base ou arquivos de configuração.

- **Exemplo de uso:**

<script src="https://gist.github.com/LuksJobs/95eb655cab94c33d819a37d9f9bebe3c.js"></script>

**Cache extraído e utilizado por outro Job:**

![CACHE_EXTRAIDO](https://i.imgur.com/tH6FiWS.png)

* **Cache Mantido (node_modules/):** No nosso caso, esse cache foi utilizado no Job do "`Build`" e consumido pelo job seguinte: "`Test`". O cache armazena arquivos reutilizáveis, como dependências instaladas (neste caso, node_modules/), para acelerar a execução de etapas futuras. Ele é compartilhado entre jobs e pipelines (se configurado corretamente), reduzindo o tempo necessário para reinstalar pacotes.

### **Principais Diferenças**

| **Aspecto**          | **Artifacts**                            | **Cache**                              |
|-----------------------|------------------------------------------|----------------------------------------|
| **Finalidade**        | Compartilhar arquivos entre jobs ou salvar resultados. | Reutilizar arquivos para acelerar jobs repetidos. |
| **Persistência**      | Relacionado a uma execução específica.   | Reutilizável entre pipelines e jobs.   |
| **Local de Armazenamento** | Armazenado pelo GitLab no servidor.         | Armazenado no runner (ou cache compartilhado). |
| **Expiração**         | Configurável com `expire_in`.            | Expiração definida globalmente ou conforme configuração do runner. |
| **Exemplo de Uso**    | Salvar binários ou relatórios.           | Cachear dependências ou bibliotecas.  |


### **Como usar ambos para acelerar a pipeline**

1. **Cache para dependências:** 
   - Use o **cache** para armazenar dependências que precisam ser instaladas repetidamente em jobs. Isso reduz significativamente o tempo de instalação de pacotes e bibliotecas.

   **Exemplo:** Armazenar o diretório `dist`, `node_modules` ou `.m2` (Maven) para reutilização entre builds.

2. **Artifacts para resultados intermediários:**
   - Use **artifacts** para compartilhar resultados entre jobs. Isso evita a necessidade de regenerar arquivos ou reexecutar tarefas.

   **Exemplo:** Gerar um binário na etapa de build e disponibilizá-lo para a etapa de testes.

3. **Combinação eficiente:**
   - Configure **cache** para armazenar arquivos reutilizáveis ao longo do tempo (como dependências).
   - Use **artifacts** para os arquivos que precisam ser compartilhados entre jobs específicos dentro da mesma pipeline.

   **Exemplo de pipeline completa:**

<script src="https://gist.github.com/LuksJobs/ea8cddb935bdf7a0df7c3c398f2bbb16.js"></script>

![pipeline](https://i.imgur.com/gn8zf6n.png)

### **Considerações Finais**

Ao usar ambos corretamente, você reduz o tempo de execução da pipeline e evita retrabalho, tornando seu processo mais eficiente.