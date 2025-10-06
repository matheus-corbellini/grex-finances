# 🚀 CI/CD e Ambientes - Grex Finances

Este documento descreve a configuração de CI/CD e ambientes para o projeto Grex Finances.

## 📋 Visão Geral

O projeto utiliza GitHub Actions para CI/CD e está configurado com três ambientes distintos:

- **Development** - Ambiente local de desenvolvimento
- **Staging** - Ambiente de testes e validação
- **Production** - Ambiente de produção

## 🔧 Configuração de Ambientes

### Development
- **Banco**: PostgreSQL local via Docker
- **URL**: http://localhost:3000 (Frontend) / http://localhost:3001 (Backend)
- **Configuração**: `env.development.example`

### Staging
- **Banco**: PostgreSQL na AWS (RDS)
- **URL**: https://staging.grex-finances.com
- **Configuração**: `env.staging.example`
- **Deploy**: Automático via branch `develop` ou `staging`

### Production
- **Banco**: PostgreSQL na AWS (RDS)
- **URL**: https://grex-finances.com
- **Configuração**: `env.production.example`
- **Deploy**: Automático via branch `main`

## 🐳 Docker Compose

### Arquivos de Configuração
- `docker-compose.yml` - Desenvolvimento local
- `docker-compose.staging.yml` - Staging
- `docker-compose.prod.yml` - Produção

### Serviços Incluídos
- **PostgreSQL** - Banco de dados
- **Backend** - API NestJS
- **Frontend** - Next.js
- **Redis** - Cache (staging/production)
- **Nginx** - Reverse proxy (staging/production)
- **Backup** - Serviço de backup automático (production)

## 🔄 Workflows de CI/CD

### 1. CI/CD Principal (`.github/workflows/ci-cd.yml`)
- **Trigger**: Push para `main`, `develop`, `staging`
- **Jobs**:
  - `test-and-quality` - Testes e qualidade de código
  - `build-and-push` - Build e push de imagens Docker
  - `deploy-staging` - Deploy para staging
  - `deploy-production` - Deploy para produção

### 2. Deploy Manual (`.github/workflows/manual-deploy.yml`)
- **Trigger**: Manual via GitHub Actions
- **Opções**:
  - Escolher ambiente (staging/production)
  - Pular testes
  - Backup do banco
  - Executar migrações

## 🚀 Scripts de Deploy

### Script Principal (`deploy.sh`)
```bash
# Deploy para staging
./deploy.sh staging

# Deploy para produção com backup
./deploy.sh production --backup-db --migrate-db

# Deploy com opções
./deploy.sh staging --skip-tests --force

# Simular deploy
./deploy.sh production --dry-run
```

### Opções Disponíveis
- `--skip-tests` - Pular testes
- `--backup-db` - Fazer backup do banco
- `--migrate-db` - Executar migrações
- `--force` - Forçar deploy
- `--dry-run` - Simular deploy

## 🔐 Variáveis de Ambiente

### Configuração por Ambiente

Cada ambiente possui seu próprio arquivo de configuração:

```bash
# Copiar configuração de exemplo
cp env.development.example .env.development
cp env.staging.example .env.staging
cp env.production.example .env.production
```

### Variáveis Importantes

#### Banco de Dados
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=grex_user
DB_PASSWORD=secure_password
DB_NAME=grex_finances
```

#### JWT
```bash
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=24h
```

#### URLs
```bash
FRONTEND_URL=https://grex-finances.com
NEXT_PUBLIC_API_URL=https://api.grex-finances.com
```

## 🛡️ Segurança

### Headers de Segurança
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

### Rate Limiting
- API: 20 req/s (production), 10 req/s (staging)
- Login: 5 req/min
- Geral: 100 req/s (production), 200 req/s (staging)

### SSL/TLS
- TLS 1.2 e 1.3
- Ciphers seguros
- HSTS habilitado

## 📊 Monitoramento

### Health Checks
- Backend: `GET /health`
- Frontend: `GET /`
- Banco: `pg_isready`
- Redis: `redis-cli ping`

### Logs
- Nginx: `/var/log/nginx/`
- Aplicação: `./logs/`
- Docker: `docker-compose logs [service]`

### Métricas
- Sentry para error tracking
- Logs estruturados
- Health checks automáticos

## 🔄 Backup e Recuperação

### Backup Automático (Production)
- Backup diário do banco
- Retenção de 30 dias
- Verificação de integridade
- Compressão customizada

### Restauração
```bash
# Restaurar backup
pg_restore -h localhost -U grex_user -d grex_finances backup_file.sql
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Deploy Falha
```bash
# Verificar logs
docker-compose logs backend
docker-compose logs frontend

# Verificar saúde dos serviços
curl http://localhost:3001/health
curl http://localhost:3000
```

#### 2. Banco de Dados
```bash
# Verificar conexão
docker-compose exec postgres psql -U grex_user -d grex_finances

# Verificar migrações
docker-compose exec backend npm run migration:show
```

#### 3. SSL/HTTPS
```bash
# Verificar certificados
openssl x509 -in ssl/production.crt -text -noout

# Testar SSL
openssl s_client -connect grex-finances.com:443
```

## 📚 Comandos Úteis

### Docker
```bash
# Build e start
docker-compose up --build -d

# Logs em tempo real
docker-compose logs -f backend

# Executar comandos no container
docker-compose exec backend npm run migration:run

# Parar e limpar
docker-compose down -v
```

### Deploy
```bash
# Deploy rápido
./deploy.sh staging

# Deploy com todas as opções
./deploy.sh production --backup-db --migrate-db

# Verificar status
docker-compose ps
```

### Backup
```bash
# Backup manual
docker-compose exec postgres pg_dump -U grex_user grex_finances > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U grex_user grex_finances < backup.sql
```

## 🔗 Links Úteis

- [GitHub Actions](https://github.com/features/actions)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📞 Suporte

Para dúvidas ou problemas com CI/CD e ambientes:

1. Verificar logs do GitHub Actions
2. Consultar este documento
3. Verificar configurações de ambiente
4. Contatar a equipe de DevOps
