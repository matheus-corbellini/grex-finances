# 🚀 Quick Reference - Grex Finances CI/CD

## ⚡ Comandos Rápidos

### 🚀 Deploy
```bash
# Deploy básico
./deploy.sh staging
./deploy.sh production

# Deploy com opções
./deploy.sh production --backup-db --migrate-db
./deploy.sh staging --skip-tests

# Via NPM
npm run deploy:staging
npm run deploy:production:backup
```

### 🐳 Docker
```bash
# Desenvolvimento
npm run docker:dev
docker-compose up --build

# Staging
npm run docker:staging
docker-compose -f backend/docker-compose.staging.yml up --build -d

# Produção
npm run docker:production
docker-compose -f backend/docker-compose.prod.yml up --build -d

# Parar tudo
npm run docker:stop
docker-compose down
```

### 🔍 Monitoramento
```bash
# Health check
npm run health:check
curl http://localhost:3001/health
curl http://localhost:3000

# Logs
npm run logs:backend
npm run logs:frontend
npm run logs:postgres
docker-compose logs -f [service]
```

### 🗄️ Banco de Dados
```bash
# Backup
npm run backup
docker-compose exec postgres pg_dump -U grex_user grex_finances > backup.sql

# Restaurar
docker-compose exec -T postgres psql -U grex_user grex_finances < backup.sql

# Conectar
docker-compose exec postgres psql -U grex_user -d grex_finances

# Migrações
docker-compose exec backend npm run migration:run
```

### 🧹 Limpeza
```bash
# Limpeza básica
docker-compose down

# Limpeza completa
npm run docker:clean
docker system prune -f
docker volume prune -f
```

---

## 📋 Configurações por Ambiente

### 🔧 Development
```bash
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=grex_finances_dev
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
LOG_LEVEL=debug
```

### 🧪 Staging
```bash
NODE_ENV=staging
DB_HOST=staging-db-host.amazonaws.com
DB_NAME=grex_finances_staging
FRONTEND_URL=https://staging.grex-finances.com
NEXT_PUBLIC_API_URL=https://api-staging.grex-finances.com
LOG_LEVEL=info
SENTRY_ENVIRONMENT=staging
```

### 🏭 Production
```bash
NODE_ENV=production
DB_HOST=production-db-host.amazonaws.com
DB_NAME=grex_finances_production
FRONTEND_URL=https://grex-finances.com
NEXT_PUBLIC_API_URL=https://api.grex-finances.com
LOG_LEVEL=warn
SENTRY_ENVIRONMENT=production
```

---

## 🔄 Workflows GitHub Actions

### 📋 Triggers
- **Push `develop`** → Deploy automático para staging
- **Push `main`** → Deploy automático para produção
- **Manual** → Deploy sob demanda

### 🎯 Jobs
1. **test-and-quality** - Testes e qualidade
2. **build-and-push** - Build e push Docker
3. **deploy-staging** - Deploy staging
4. **deploy-production** - Deploy produção

---

## 🐳 Serviços Docker

### 📦 Development
- PostgreSQL
- Backend (NestJS)
- Frontend (Next.js)
- phpMyAdmin

### 🧪 Staging
- PostgreSQL
- Backend (NestJS)
- Frontend (Next.js)
- Redis
- Nginx

### 🏭 Production
- PostgreSQL
- Backend (NestJS) ×2
- Frontend (Next.js) ×2
- Redis
- Nginx
- Backup Service

---

## 🔐 Secrets GitHub

### 📋 Necessários
- `DB_PASSWORD`
- `JWT_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `STRIPE_SECRET_KEY`
- `FIREBASE_API_KEY`
- `SENTRY_DSN`
- `SLACK_WEBHOOK_URL`

---

## 🌐 URLs por Ambiente

| Ambiente | Frontend | Backend | API |
|----------|----------|---------|-----|
| Development | http://localhost:3000 | http://localhost:3001 | http://localhost:3001/api |
| Staging | https://staging.grex-finances.com | - | https://api-staging.grex-finances.com |
| Production | https://grex-finances.com | - | https://api.grex-finances.com |

---

## 🚨 Troubleshooting

### ❌ Deploy Falha
```bash
# Verificar logs
docker-compose logs backend
docker-compose logs frontend

# Verificar saúde
curl http://localhost:3001/health
curl http://localhost:3000

# Verificar recursos
docker stats
```

### ❌ Banco de Dados
```bash
# Verificar conexão
docker-compose exec postgres psql -U grex_user -d grex_finances

# Verificar migrações
docker-compose exec backend npm run migration:show

# Reset (CUIDADO!)
docker-compose down -v
```

### ❌ SSL/HTTPS
```bash
# Verificar certificados
openssl x509 -in backend/ssl/production.crt -text -noout

# Testar SSL
openssl s_client -connect grex-finances.com:443
```

---

## 📊 Rate Limits

| Ambiente | API | Login | Geral |
|----------|-----|-------|-------|
| Staging | 10 req/s | 5 req/min | 200 req/s |
| Production | 20 req/s | 5 req/min | 100 req/s |

---

## 🔒 Security Headers

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

---

## 📁 Estrutura de Arquivos

```
grex-finances/
├── .github/workflows/
│   ├── ci-cd.yml
│   └── manual-deploy.yml
├── backend/
│   ├── docker-compose.yml
│   ├── docker-compose.staging.yml
│   ├── docker-compose.prod.yml
│   ├── nginx/
│   ├── ssl/
│   └── scripts/
├── env.development.example
├── env.staging.example
├── deploy.sh
└── Dockerfile
```

---

## 🎯 Checklist de Deploy

### ✅ Pré-Deploy
- [ ] Testes passando
- [ ] Build funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Secrets configurados no GitHub

### ✅ Deploy
- [ ] Backup do banco (se necessário)
- [ ] Migrações executadas
- [ ] Health checks passando
- [ ] Logs verificados

### ✅ Pós-Deploy
- [ ] Aplicação funcionando
- [ ] SSL funcionando
- [ ] Monitoramento ativo
- [ ] Notificações enviadas

---

**🚀 Happy Deploying!**
