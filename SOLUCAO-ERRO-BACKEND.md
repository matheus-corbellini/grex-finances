# 🚫 Erro de Conexão com Backend - Solução

## Problema
Você está vendo o erro:
```
Erro ao carregar contas: {message: 'Network Error', code: 'UNKNOWN_ERROR', details: undefined}
GET http://localhost:3001/accounts net::ERR_CONNECTION_REFUSED
```

## Causa
O servidor backend não está rodando na porta 3001.

## ✅ Soluções Rápidas

### Opção 1: Script Automático (Recomendado)
```bash
# Na pasta raiz do projeto
./start-dev.sh
```

### Opção 2: Iniciar Backend Manualmente
```bash
# Na pasta backend
cd backend
npm run start:dev
```

### Opção 3: Usar Docker
```bash
# Na pasta backend
cd backend
docker-compose up
```

### Opção 4: Script do Backend
```bash
# Na pasta backend
./start-backend.sh
```

## 🔧 Verificação

Após iniciar o backend, verifique se está funcionando:
- **API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api

## 📱 Frontend

Com o backend rodando, inicie o frontend:
```bash
# Na pasta raiz do projeto
npm run dev
```

Acesse: http://localhost:3000

## 🆘 Ainda com Problemas?

1. **Verifique se a porta 3001 está livre:**
   ```bash
   lsof -i :3001
   ```

2. **Verifique se o Node.js está instalado:**
   ```bash
   node --version
   npm --version
   ```

3. **Instale as dependências do backend:**
   ```bash
   cd backend
   npm install
   ```

4. **Verifique se o banco de dados está configurado:**
   - MySQL na porta 3306
   - Ou configure SQLite no arquivo `.env`

## 📝 Configuração do Banco

Se você não tem MySQL instalado, pode usar SQLite:

1. Crie um arquivo `.env` na pasta `backend`:
```env
DB_TYPE=sqlite
DB_DATABASE=grex_finances.db
PORT=3001
NODE_ENV=development
JWT_SECRET=development-jwt-secret
```

2. Execute as migrações:
```bash
cd backend
npm run migration:run
npm run seed:run
```

## 🎯 Próximos Passos

Após resolver o problema:
1. ✅ Backend rodando na porta 3001
2. ✅ Frontend rodando na porta 3000
3. ✅ Banco de dados configurado
4. ✅ Aplicação funcionando normalmente

---

**💡 Dica:** Use o script `./start-dev.sh` na pasta raiz para iniciar ambos os serviços automaticamente!
