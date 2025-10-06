# 🛠️ Exemplos Práticos - Grex Finances CI/CD

## 🚀 Cenários de Deploy

### 📋 Cenário 1: Deploy de Nova Feature para Staging

```bash
# 1. Criar branch de feature
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver e commitar
git add .
git commit -m "feat: adiciona nova funcionalidade"

# 3. Push para staging
git push origin feature/nova-funcionalidade

# 4. Criar PR para develop
# (via GitHub interface)

# 5. Merge para develop
git checkout develop
git merge feature/nova-funcionalidade
git push origin develop

# 6. Deploy automático para staging acontece!
# ✅ Acesse: https://staging.grex-finances.com
```

### 📋 Cenário 2: Deploy Manual para Produção

```bash
# 1. Deploy com backup e migrações
./deploy.sh production --backup-db --migrate-db

# Ou via NPM
npm run deploy:production:backup

# 2. Verificar deploy
curl https://grex-finances.com/health
curl https://api.grex-finances.com/health

# 3. Verificar logs
docker-compose -f backend/docker-compose.prod.yml logs backend
```

### 📋 Cenário 3: Deploy de Hotfix Urgente

```bash
# 1. Deploy rápido sem testes
./deploy.sh production --skip-tests --force

# 2. Verificar se funcionou
curl https://grex-finances.com/health

# 3. Executar testes depois
npm run test
```

---

## 🔧 Configuração Inicial

### 📋 Setup Completo do Projeto

```bash
# 1. Clone do repositório
git clone https://github.com/seu-usuario/grex-finances.git
cd grex-finances

# 2. Configurar ambiente de desenvolvimento
cp env.development.example .env.development
# Editar .env.development com suas configurações

# 3. Instalar dependências
npm install
cd backend && npm install && cd ..

# 4. Iniciar desenvolvimento
npm run docker:dev

# 5. Verificar se está funcionando
npm run health:check
```

### 📋 Setup de Produção

```bash
# 1. Configurar secrets no GitHub
# Acesse: Settings > Secrets and variables > Actions
# Adicione todos os secrets necessários

# 2. Configurar domínios
# Configure DNS para:
# - grex-finances.com
# - api.grex-finances.com
# - staging.grex-finances.com
# - api-staging.grex-finances.com

# 3. Configurar SSL
# Use Let's Encrypt ou seu provedor SSL

# 4. Configurar AWS RDS
# Crie instâncias PostgreSQL para staging e produção

# 5. Primeiro deploy
git push origin main
# Deploy automático para produção!
```

---

## 🐳 Comandos Docker Avançados

### 📋 Debugging de Containers

```bash
# Entrar no container do backend
docker-compose exec backend bash

# Verificar variáveis de ambiente
docker-compose exec backend env

# Verificar logs específicos
docker-compose logs --tail=100 backend

# Verificar recursos
docker stats

# Verificar rede
docker network inspect grex-network
```

### 📋 Backup e Restore Avançado

```bash
# Backup completo com timestamp
docker-compose exec postgres pg_dump -U grex_user grex_finances > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup apenas estrutura
docker-compose exec postgres pg_dump -U grex_user -s grex_finances > schema.sql

# Backup apenas dados
docker-compose exec postgres pg_dump -U grex_user -a grex_finances > data.sql

# Restaurar backup
docker-compose exec -T postgres psql -U grex_user grex_finances < backup.sql

# Restaurar em banco diferente
docker-compose exec -T postgres psql -U grex_user grex_finances_test < backup.sql
```

### 📋 Limpeza Avançada

```bash
# Remover containers parados
docker container prune -f

# Remover imagens não utilizadas
docker image prune -f

# Remover volumes não utilizados
docker volume prune -f

# Remover redes não utilizadas
docker network prune -f

# Limpeza completa (CUIDADO!)
docker system prune -a -f --volumes
```

---

## 🔍 Monitoramento e Logs

### 📋 Logs em Tempo Real

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas banco
docker-compose logs -f postgres

# Com filtro de erro
docker-compose logs -f backend | grep ERROR

# Últimas 100 linhas
docker-compose logs --tail=100 backend
```

### 📋 Health Checks Detalhados

```bash
# Script de health check completo
#!/bin/bash

echo "🔍 Verificando saúde dos serviços..."

# Backend
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: FALHA"
fi

# Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: FALHA"
fi

# PostgreSQL
if docker-compose exec postgres pg_isready -U grex_user > /dev/null 2>&1; then
    echo "✅ PostgreSQL: OK"
else
    echo "❌ PostgreSQL: FALHA"
fi

# Redis (se disponível)
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: OK"
else
    echo "❌ Redis: FALHA"
fi
```

### 📋 Monitoramento de Performance

```bash
# Verificar uso de recursos
docker stats --no-stream

# Verificar espaço em disco
df -h

# Verificar memória
free -h

# Verificar processos
htop

# Verificar conexões de rede
netstat -tulpn
```

---

## 🚨 Troubleshooting Avançado

### 📋 Problema: Deploy Falha

```bash
# 1. Verificar logs do GitHub Actions
# Acesse: Actions > [Workflow] > [Job] > Logs

# 2. Verificar logs locais
docker-compose logs backend
docker-compose logs frontend

# 3. Verificar recursos
docker stats
df -h
free -h

# 4. Verificar configurações
docker-compose config

# 5. Testar build local
docker-compose build
```

### 📋 Problema: Banco de Dados

```bash
# 1. Verificar conexão
docker-compose exec postgres psql -U grex_user -d grex_finances

# 2. Verificar migrações
docker-compose exec backend npm run migration:show

# 3. Verificar logs do banco
docker-compose logs postgres

# 4. Verificar espaço em disco
docker-compose exec postgres df -h

# 5. Reset completo (CUIDADO!)
docker-compose down -v
docker-compose up -d postgres
# Aguardar banco inicializar
docker-compose exec backend npm run migration:run
```

### 📋 Problema: SSL/HTTPS

```bash
# 1. Verificar certificados
openssl x509 -in backend/ssl/production.crt -text -noout

# 2. Verificar validade
openssl x509 -in backend/ssl/production.crt -checkend 86400

# 3. Testar SSL
openssl s_client -connect grex-finances.com:443

# 4. Verificar configuração Nginx
docker-compose exec nginx nginx -t

# 5. Recarregar Nginx
docker-compose exec nginx nginx -s reload
```

---

## 🔧 Configurações Avançadas

### 📋 Variáveis de Ambiente Dinâmicas

```bash
# Script para configurar ambiente baseado na branch
#!/bin/bash

BRANCH=$(git branch --show-current)

case $BRANCH in
    "main")
        ENV_FILE="env.production.example"
        COMPOSE_FILE="docker-compose.prod.yml"
        ;;
    "develop")
        ENV_FILE="env.staging.example"
        COMPOSE_FILE="docker-compose.staging.yml"
        ;;
    *)
        ENV_FILE="env.development.example"
        COMPOSE_FILE="docker-compose.yml"
        ;;
esac

echo "Usando configuração: $ENV_FILE"
echo "Usando compose: $COMPOSE_FILE"
```

### 📋 Deploy com Rollback

```bash
# Script de deploy com rollback automático
#!/bin/bash

ENVIRONMENT=$1
BACKUP_TAG=$(date +%Y%m%d_%H%M%S)

echo "🚀 Iniciando deploy para $ENVIRONMENT"

# 1. Fazer backup da versão atual
docker tag grex-finances-backend:latest grex-finances-backend:$BACKUP_TAG

# 2. Deploy
./deploy.sh $ENVIRONMENT

# 3. Verificar se funcionou
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Deploy bem-sucedido!"
else
    echo "❌ Deploy falhou! Fazendo rollback..."
    docker tag grex-finances-backend:$BACKUP_TAG grex-finances-backend:latest
    docker-compose restart backend
    echo "🔄 Rollback concluído!"
fi
```

---

## 📊 Métricas e Alertas

### 📋 Script de Monitoramento

```bash
#!/bin/bash

# Configurações
WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
SERVICE_URL="https://grex-finances.com"

# Verificar saúde
if curl -f $SERVICE_URL/health > /dev/null 2>&1; then
    STATUS="✅ OK"
    COLOR="good"
else
    STATUS="❌ FALHA"
    COLOR="danger"
fi

# Enviar notificação
curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"Health Check: $STATUS\", \"color\":\"$COLOR\"}" \
    $WEBHOOK_URL
```

### 📋 Logs de Performance

```bash
# Script para analisar logs de performance
#!/bin/bash

echo "📊 Análise de Performance - Últimas 24h"

# Requests por minuto
docker-compose logs --since=24h nginx | grep "GET\|POST" | wc -l

# Tempo de resposta médio
docker-compose logs --since=24h nginx | grep "rt=" | awk '{print $NF}' | cut -d'=' -f2 | awk '{sum+=$1; count++} END {print sum/count "ms"}'

# Erros 5xx
docker-compose logs --since=24h nginx | grep " 5[0-9][0-9] " | wc -l

# Top endpoints
docker-compose logs --since=24h nginx | grep "GET\|POST" | awk '{print $7}' | sort | uniq -c | sort -nr | head -10
```

---

## 🎯 Best Practices

### 📋 Checklist de Deploy

#### ✅ Pré-Deploy
- [ ] Testes passando localmente
- [ ] Build funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Secrets configurados no GitHub
- [ ] Backup do banco (se necessário)
- [ ] Documentação atualizada

#### ✅ Deploy
- [ ] Deploy executado
- [ ] Health checks passando
- [ ] Logs verificados
- [ ] Performance verificada
- [ ] SSL funcionando

#### ✅ Pós-Deploy
- [ ] Aplicação funcionando
- [ ] Monitoramento ativo
- [ ] Notificações enviadas
- [ ] Equipe notificada
- [ ] Documentação atualizada

### 📋 Rollback Plan

```bash
# 1. Identificar versão anterior
docker images | grep grex-finances-backend

# 2. Fazer rollback
docker tag grex-finances-backend:previous grex-finances-backend:latest
docker-compose restart backend

# 3. Verificar rollback
curl http://localhost:3001/health

# 4. Notificar equipe
# Enviar notificação sobre rollback
```

---

**🚀 Com esses exemplos práticos, você está pronto para qualquer cenário de deploy!**
