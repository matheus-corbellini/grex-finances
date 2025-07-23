# Grex Finances - Backend

Backend básico com NestJS, TypeORM e integração com AWS Secrets Manager.

## 🚀 Início Rápido

### Instalação Local

```bash
npm install
cp .env.example .env
npm run start:dev
```

### Docker (Recomendado)

```bash
docker-compose up -d
```

## 📋 Estrutura

```
src/
├── config/           # Configurações (database, AWS)
├── app.module.ts     # Módulo principal
├── app.controller.ts # Controller básico
├── app.service.ts    # Service básico
└── main.ts          # Arquivo principal
```

## 🔧 Endpoints Disponíveis

- `GET /` - Hello World
- `GET /health` - Health Check

## ➕ Próximos Passos

1. Crie seus módulos em `src/modules/`
2. Configure seu banco de dados
3. Implemente autenticação
4. Adicione suas entidades

**Backend rodando em:** http://localhost:3001
