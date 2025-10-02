#!/bin/bash

echo "🚀 Iniciando Backend Grex Finances"
echo "=================================="

# Verificar se estamos na pasta backend
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Execute este script na pasta 'backend' do projeto"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado. Instale o npm primeiro."
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando arquivo de exemplo..."
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=grex_finances

# JWT Configuration
JWT_SECRET=development-jwt-secret-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Arquivo .env criado com configurações padrão"
fi

# Verificar se o banco de dados está acessível (opcional)
echo "🔍 Verificando configuração do banco de dados..."

# Função para verificar se uma porta está em uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Porta em uso
    else
        return 1  # Porta livre
    fi
}

# Verificar se a porta 3001 está livre
if check_port 3001; then
    echo "⚠️  Porta 3001 já está em uso. O backend pode já estar rodando."
    echo "   Para verificar: http://localhost:3001"
    echo ""
    read -p "Deseja continuar mesmo assim? (y/N): " continue_anyway
    if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
        echo "👋 Cancelando..."
        exit 0
    fi
fi

echo ""
echo "🚀 Iniciando servidor backend..."
echo "   URL: http://localhost:3001"
echo "   Swagger: http://localhost:3001/api"
echo ""
echo "🛑 Para parar o servidor, pressione Ctrl+C"
echo ""

# Iniciar o servidor
npm run start:dev
