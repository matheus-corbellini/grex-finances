#!/bin/bash

echo "🗄️ Configurando PostgreSQL para Grex Finances..."

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL não está instalado."
    echo ""
    echo "📦 Instale o PostgreSQL:"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt install postgresql postgresql-contrib"
    echo "   Windows: https://www.postgresql.org/download/windows/"
    exit 1
fi

# Verificar se PostgreSQL está rodando
if ! pg_isready -q; then
    echo "🚀 Iniciando PostgreSQL..."
    
    # Tentar iniciar PostgreSQL
    if command -v brew &> /dev/null; then
        # macOS
        brew services start postgresql
    elif command -v systemctl &> /dev/null; then
        # Linux
        sudo systemctl start postgresql
    else
        echo "❌ Não foi possível iniciar o PostgreSQL automaticamente."
        echo "   Inicie manualmente e execute este script novamente."
        exit 1
    fi
    
    # Aguardar PostgreSQL iniciar
    sleep 3
fi

# Verificar se PostgreSQL está rodando
if ! pg_isready -q; then
    echo "❌ PostgreSQL não está rodando. Inicie manualmente e tente novamente."
    exit 1
fi

echo "✅ PostgreSQL está rodando!"

# Criar banco de dados
echo "🗄️ Criando banco de dados..."
createdb grex_finances_dev 2>/dev/null || echo "⚠️ Banco já existe ou erro na criação"

# Verificar se o banco foi criado
if psql -lqt | cut -d \| -f 1 | grep -qw grex_finances_dev; then
    echo "✅ Banco 'grex_finances_dev' criado com sucesso!"
else
    echo "❌ Erro ao criar banco de dados."
    exit 1
fi

# Criar arquivo .env
echo "📝 Criando arquivo .env..."
cat > .env << EOF
# Configurações de Desenvolvimento Local
NODE_ENV=development

# Banco de Dados PostgreSQL Local
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=grex_finances_dev

# Servidor
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Logs
LOG_LEVEL=debug
EOF

echo "✅ Arquivo .env criado!"

# Executar migrações
echo "📊 Executando migrações..."
npm run migration:run

# Executar seeds
echo "🌱 Executando seeds..."
npm run seed:run

echo ""
echo "🎉 Configuração completa!"
echo ""
echo "📡 Serviços disponíveis:"
echo "   API: http://localhost:3001"
echo "   PostgreSQL: localhost:5432"
echo "   Banco: grex_finances_dev"
echo ""
echo "🔧 Para iniciar a aplicação:"
echo "   npm run start:dev"
echo ""
echo "🗄️ Para conectar no pgAdmin:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: grex_finances_dev"
echo "   Username: postgres"
echo "   Password: password"
echo ""
