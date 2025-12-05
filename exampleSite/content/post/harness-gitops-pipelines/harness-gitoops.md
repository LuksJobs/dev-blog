+++
author = "Lucas Oliveira"
title = "Harness GitOps: Automatizando Deploys Kubernetes com Pull Request Pipeline"
date = "2027-11-16"
description = "Aprenda a criar uma pipeline GitOps completa no Harness para automatizar deploys em Kubernetes com aprovações, notificações e sincronização automática usando Pull Requests"
image = "https://i.imgur.com/bwPctrO.jpeg"
tags = [
    "harness", "gitops", "kubernetes", "devsecops", "ci-cd"
]
categories = [
    "devsecops",
]
+++

## 🔖 Visão Geral

O **GitOps** revolucionou a forma como fazemos deploys em ambientes **Kubernetes**, usando o **Git** como fonte única da verdade. Neste post, vou mostrar como criar uma pipeline completa no Harness que automatiza todo o fluxo **GitOps**: desde a atualização do repositório até o deploy no cluster, passando por aprovações e notificações.

### Tópicos:
1. Como configurar uma pipeline GitOps no Harness
2. Implementar aprovações automáticas com notificações por email
3. Sincronizar aplicações Kubernetes usando GitOps
4. Boas práticas de segurança e governança

---

## Por que GitOps com Harness?



O Harness GitOps oferece uma abordagem declarativa para gerenciar deployments Kubernetes, combinando:

- **Rastreabilidade completa**: Todo change é versionado no Git
- **Aprovações automatizadas**: Workflows de aprovação integrados
- **Rollback seguro**: Reverter para qualquer estado anterior
- **Visibilidade**: Dashboards e métricas em tempo real

---

## 🛠️ Arquitetura da Pipeline

Nossa pipeline GitOps seguirá este fluxo:

![harness gitops](https://developer.harness.io/assets/images/572d35be32e656cea58795c7aefde6d91f50270201ac7f1906d8875ef3c1408a-d394511ae3557e7305f1b02555958194.png)

## Pré-requisitos

Antes de começar, certifique-se de ter:

- Conta no Harness com GitOps habilitado
- Cluster Kubernetes configurado
- Repositório GitOps (Helm Charts)
- Agent do Harness instalado no cluster

### Configuração inicial no Harness:

1. **Instale o GitOps Agent:**
```bash
helm repo add harness https://app.harness.io/storage/harness-download/harness-helm-charts/
helm install gitops-agent harness/gitops-agent \
  --set agent.identifier=my-agent \
  --set agent.token=<YOUR_AGENT_TOKEN>
```

2. **Configure o repositório GitOps:**
   - Vá em **GitOps > Repositories**
   - Adicione seu repositório com as credenciais

---

## 🔧 Implementando a Pipeline

### 1. Estrutura Base da Pipeline

```yaml
pipeline:
  name: gitops-pr-pipeline
  identifier: gitops_pr_pipeline
  projectIdentifier: <+project.identifier>
  orgIdentifier: <+org.identifier>
  tags:
    team: devsecops
    environment: production
  stages:
    - stage:
        name: GitOps_Deployment
        identifier: gitops_deployment
        type: Deployment
        spec:
          deploymentType: Kubernetes
          gitOpsEnabled: true
```

### 2. Configuração do Serviço

```yaml
service:
  serviceRef: <+input>
  serviceInputs:
    serviceDefinition:
      type: Kubernetes
      spec:
        artifacts:
          primary:
            primaryArtifactRef: <+input>
            sources: <+input>
```

### 3. Steps da Pipeline

#### Step 1: Atualização do Repositório GitOps

```yaml
- step:
    type: GitOpsUpdateReleaseRepo
    name: Update GitOps Repository
    identifier: update_gitops_repo
    timeout: 10m
    spec:
      variables:
        - name: image.repository
          type: String
          value: <+artifacts.primary.repositoryName>
        - name: image.tag
          type: String
          value: <+artifacts.primary.tag>
        - name: app.version
          type: String
          value: <+pipeline.sequenceId>
      prTitle: "chore: update <+service.name> to <+artifacts.primary.tag>"
      prBody: |
        ## 🚀 Automated GitOps Update
        
        **Service:** <+service.name>
        **Environment:** <+env.name>
        **Image:** <+artifacts.primary.repositoryName>:<+artifacts.primary.tag>
        **Pipeline:** <+pipeline.executionUrl>
        **Author:** <+pipeline.triggeredBy.name>
```

#### Step 2: Notificação Inteligente

```yaml
- step:
    type: Email
    name: Notify Operations Team
    identifier: notify_ops_team
    spec:
      to: <+pipeline.variables.opsTeamEmail>
      cc: <+pipeline.triggeredBy.email>
      subject: "🔄 [GitOps] Deployment Pending: <+service.name> → <+env.name>"
      body: |
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <img src="https://developer.harness.io/img/icon_harness.svg" alt="Harness" width="60" height="60">
            <h2 style="color: #0084ff; margin: 10px 0;">GitOps Deployment Request</h2>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e1e5e9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f3f4;">Service:</td>
                <td style="padding: 8px; border-bottom: 1px solid #f1f3f4;"><+service.name></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f3f4;">Environment:</td>
                <td style="padding: 8px; border-bottom: 1px solid #f1f3f4;"><+env.name></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f3f4;">Image Tag:</td>
                <td style="padding: 8px; border-bottom: 1px solid #f1f3f4;"><+artifacts.primary.tag></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f3f4;">Requested By:</td>
                <td style="padding: 8px; border-bottom: 1px solid #f1f3f4;"><+pipeline.triggeredBy.name></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Execution ID:</td>
                <td style="padding: 8px;"><+pipeline.executionId></td>
              </tr>
            </table>
            
            <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <strong>⚠️ Action Required:</strong> This deployment requires operations team approval.
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="<+pipeline.executionUrl>" style="background: #0084ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                🔗 Review & Approve
              </a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; color: #6c757d; font-size: 12px;">
            This is an automated notification from Harness GitOps Pipeline<br>
            DevSecOps Team | <+account.name>
          </div>
        </div>
```

#### Step 3: Aprovação com Governança

```yaml
- step:
    type: HarnessApproval
    name: Operations Team Approval
    identifier: ops_approval
    spec:
      approvalMessage: |
        ## 📋 Deployment Approval Request
        
        Please review the following deployment details:
        
        **Service:** <+service.name>
        **Environment:** <+env.name>
        **Image:** <+artifacts.primary.repositoryName>:<+artifacts.primary.tag>
        **Pipeline:** <+pipeline.name>
        
        ### Pre-deployment Checklist:
        - [ ] Image security scan passed
        - [ ] Configuration reviewed
        - [ ] Rollback plan identified
        - [ ] Monitoring alerts configured
        
        **Execution URL:** <+pipeline.executionUrl>
      includePipelineExecutionHistory: true
      isAutoRejectEnabled: true
      autoRejectTimeout: 24h
      approvers:
        userGroups:
          - operations_team
          - platform_engineering
        minimumCount: 1
        disallowPipelineExecutor: true
      approverInputs:
        - name: deployment_notes
          type: String
          defaultValue: "Standard deployment - no special considerations"
    timeout: 2d
```

#### Step 4: Merge Automatizado

```yaml
- step:
    type: MergePR
    name: Merge GitOps PR
    identifier: merge_gitops_pr
    spec:
      deleteSourceBranch: true
      mergingStrategy: squash
      commitMessage: |
        feat: deploy <+service.name> <+artifacts.primary.tag> to <+env.name>
        
        Pipeline: <+pipeline.executionUrl>
        Approved by: <+approval.approvedBy>
        Execution: <+pipeline.executionId>
    timeout: 5m
```

#### Step 5: Sincronização GitOps

```yaml
- step:
    type: GitOpsSync
    name: Sync Application
    identifier: gitops_sync
    spec:
      prune: true
      dryRun: false
      applyOnly: false
      forceApply: false
      applicationsList:
        - applicationName: <+service.name>-<+env.name>
          agentId: <+pipeline.variables.agentId>
      syncOptions:
        skipSchemaValidation: false
        autoCreateNamespace: true
        pruneResourcesAtLast: true
        applyOutOfSyncOnly: false
        replaceResources: false
        prunePropagationPolicy: foreground
      showResourceProgress: true
      waitTillHealthy: true
      healthCheckTimeout: 10m
    timeout: 15m
```

#### Step 6: Validação e Notificação de Sucesso

```yaml
- step:
    type: GitOpsGetAppDetails
    name: Validate Deployment
    identifier: validate_deployment
    spec:
      hardRefresh: true
      applicationsList:
        - applicationName: <+service.name>-<+env.name>
          agentId: <+pipeline.variables.agentId>
    timeout: 5m

- step:
    type: Email
    name: Deployment Success Notification
    identifier: success_notification
    spec:
      to: <+pipeline.triggeredBy.email>
      cc: <+pipeline.variables.opsTeamEmail>
      subject: "✅ [GitOps] Deployment Successful: <+service.name> → <+env.name>"
      body: |
        ## 🎉 Deployment Completed Successfully!
        
        **Service:** <+service.name>
        **Environment:** <+env.name>
        **Image:** <+artifacts.primary.repositoryName>:<+artifacts.primary.tag>
        **Duration:** <+pipeline.executionDuration>
        
        **Application Status:** <+gitops.appDetails.healthStatus>
        **Sync Status:** <+gitops.appDetails.syncStatus>
        
        **Monitoring:** [Dashboard](<+pipeline.variables.monitoringUrl>)
        **Logs:** [Application Logs](<+pipeline.variables.logsUrl>)
```

---

## 🛡️ Configurações de Segurança

### Failure Strategies

```yaml
failureStrategies:
  - onFailure:
      errors:
        - AllErrors
      action:
        type: StageRollback
  - onFailure:
      errors:
        - ApprovalRejection
      action:
        type: Abort
```

### RBAC e Governança

- **Princípio do menor privilégio**: Usuários só podem aprovar deployments dos seus ambientes
- **Segregação de funções**: Quem executa não pode aprovar
- **Auditoria completa**: Todos os passos são registrados

---

## 📊 Monitoramento e Métricas

### Variáveis da Pipeline

```yaml
variables:
  - name: opsTeamEmail
    type: String
    default: "ops-team@company.com"
  - name: agentId
    type: String
    default: "production-cluster-agent"
  - name: monitoringUrl
    type: String
    default: "https://monitoring.company.com/dashboard"
  - name: logsUrl
    type: String
    default: "https://logs.company.com/app/<+service.name>"
```

### Triggers Automáticos

```yaml
triggers:
  - trigger:
      name: main-branch-trigger
      identifier: main_branch_trigger
      enabled: true
      type: Webhook
      spec:
        type: Github
        spec:
          type: PullRequest
          spec:
            connectorRef: github-connector
            autoAbortPreviousExecutions: false
            payloadConditions:
              - key: targetBranchName
                operator: Equals
                value: main
            headerConditions: []
            actions:
              - Closed
```

---

## 🚨 Troubleshooting Comum

### Problema: GitOps Sync falha
**Solução:**
```bash
# Verificar status do agent
kubectl get pods -n harness-delegate-ng

# Verificar logs do sync
kubectl logs -f deployment/gitops-agent -n harness-delegate-ng
```

### Problema: Aprovação não chega
**Verificar:**
- Configuração do SMTP no Harness
- Grupos de usuários configurados
- Permissões RBAC

---

## 🎯 Próximos Passos

1. **Integre com Slack/Teams** para notificações em tempo real
2. **Adicione testes automatizados** pós-deploy
3. **Configure rollback automático** em caso de falha
4. **Implemente Progressive Delivery** com Canary/Blue-Green

---

## 📚 Recursos Adicionais

- [Documentação oficial Harness GitOps](https://developer.harness.io/docs/continuous-delivery/gitops/)
- [Best Practices GitOps](https://www.gitops.tech/)
- [Helm Charts Security](https://helm.sh/docs/topics/charts/)

---

**Conclusão:** Com esta pipeline GitOps no Harness, você tem um fluxo completo de deploy automatizado, seguro e auditável. A combinação de aprovações, notificações e sincronização automática garante que apenas código validado chegue em produção, mantendo a governança e visibilidade necessárias para ambientes críticos.

*Gostou do conteúdo? Compartilhe suas experiências com GitOps nos comentários!* 🚀
