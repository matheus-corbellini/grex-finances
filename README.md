# Grex Finances

Sistema de finanças pessoais com Next.js (frontend) e NestJS (backend).

## 🏗️ Estrutura do Projeto

```
grex-finances/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   └── page.tsx
├── src/                    # Frontend
│   ├── components/         # Componentes reutilizáveis
│   ├── hooks/              # Custom hooks
│   ├── services/           # Serviços de API
│   ├── context/            # Contextos React
│   ├── types/              # Tipos TypeScript
│   ├── utils/              # Funções utilitárias
│   └── styles/             # Estilos CSS
├── backend/                # NestJS Backend
│   ├── src/
│   │   ├── config/         # Configurações (DB, AWS)
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── package.json
│   └── README.md
├── shared/                 # Tipos compartilhados (vazio por enquanto)
└── package.json            # Frontend
```

## 🚀 Como Usar

### Frontend (Next.js)

```bash
npm install
npm run dev
```

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

### Docker (Opcional)

```bash
cd backend
docker-compose up -d
```

## 📋 Próximos Passos

1. **Crie seus módulos no backend** em `backend/src/`
2. **Desenvolva componentes no frontend** em `src/components/`
3. **Defina tipos compartilhados** em `shared/types/`
4. **Configure banco de dados** usando TypeORM
5. **Implemente autenticação** com JWT

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, TypeScript, CSS
- **Backend**: NestJS, TypeORM, PostgreSQL, AWS Secrets Manager
- **Docker**: Para desenvolvimento local

---

**Projeto pronto para desenvolvimento!** 🚀
