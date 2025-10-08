# Guia de Deploy para Render

## Problema Identificado e Soluções Implementadas

### Problema Principal
O backend estava configurado para aceitar apenas requisições de `http://localhost:3000`, mas em produção precisa aceitar requisições do domínio `https://grexfinances.netlify.app`.

### Soluções Implementadas

#### 1. Configuração CORS Atualizada
- ✅ Atualizado `backend/src/main.ts` para aceitar múltiplos domínios
- ✅ Incluído suporte para `https://grexfinances.netlify.app`
- ✅ Configuração dinâmica baseada em variáveis de ambiente

#### 2. Variáveis de Ambiente Corrigidas
- ✅ Atualizado `env.production.example` com URLs corretas
- ✅ Criado `render.env.example` com configurações específicas para Render
- ✅ Atualizado `docker-compose.prod.yml` com URLs corretas

#### 3. Dockerfile Otimizado
- ✅ Atualizado para usar `npm run start:prod` em vez de `node dist/main`

## Configuração no Render

### Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no painel do Render:

```bash
NODE_ENV=production
DB_HOST=ep-sweet-grass-adnspb26-pooler.c-2.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_FyzXVP8QZv4K
DB_NAME=neondb
JWT_SECRET=your_super_secure_jwt_secret_change_this_to_random_string_min_32_chars
FRONTEND_URL=https://grexfinances.netlify.app
LOG_LEVEL=warn
RUN_SEEDS=false
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm run start:prod
```

### Root Directory
```
backend
```

## Testando o Deploy

Após fazer o deploy:

1. **Verificar se o backend está rodando:**
   ```bash
   curl https://grex-finances.onrender.com/health
   ```

2. **Testar CORS:**
   ```bash
   curl -H "Origin: https://grexfinances.netlify.app" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: X-Requested-With" \
        -X OPTIONS \
        https://grex-finances.onrender.com/accounts
   ```

3. **Verificar logs no Render:**
   - Acesse o painel do Render
   - Vá para "Logs" do serviço
   - Procure por mensagens de erro ou sucesso

## Troubleshooting

### Erro de CORS
Se ainda houver problemas de CORS:
1. Verifique se `FRONTEND_URL` está configurada corretamente
2. Confirme que o domínio está na lista de `allowedOrigins` no código

### Erro de Conexão com Banco
Se houver problemas de conexão com o banco:
1. Verifique as credenciais do Neon
2. Confirme se o banco está acessível externamente
3. Verifique se as variáveis de ambiente estão corretas

### Build Falhando
Se o build falhar:
1. Verifique se todas as dependências estão no `package.json`
2. Confirme se o comando de build está correto
3. Verifique os logs de build no Render

## Próximos Passos

1. ✅ Fazer commit das alterações
2. ✅ Fazer push para o repositório
3. ✅ Aguardar deploy automático no Render
4. ✅ Testar a aplicação em produção
5. ✅ Verificar se o frontend consegue se conectar ao backend

## Arquivos Modificados

- `backend/src/main.ts` - Configuração CORS atualizada
- `backend/env.production.example` - URLs de produção corrigidas
- `backend/docker-compose.prod.yml` - URLs de produção corrigidas
- `backend/Dockerfile` - Comando de start atualizado
- `backend/render.env.example` - Configurações específicas para Render
