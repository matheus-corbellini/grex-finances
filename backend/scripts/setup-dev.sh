#!/bin/bash

echo "🚀 Configurando ambiente de desenvolvimento..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.development.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis conforme necessário."
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.dev.yml down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker-compose.dev.yml up --build -d

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 10

# Executar migrações
echo "📊 Executando migrações..."
docker-compose -f docker-compose.dev.yml exec app npm run migration:run

# Executar seeds
echo "🌱 Executando seeds..."
docker-compose -f docker-compose.dev.yml exec app npm run seed:run

echo ""
echo "✅ Ambiente de desenvolvimento configurado!"
echo ""
echo "📡 Serviços disponíveis:"
echo "   API: http://localhost:3001"
echo "   PostgreSQL: localhost:5432"
echo "   Redis: localhost:6379"
echo ""
echo "🔧 Comandos úteis:"
echo "   docker-compose -f docker-compose.dev.yml logs -f app"
echo "   docker-compose -f docker-compose.dev.yml exec app npm run migration:run"
echo "   docker-compose -f docker-compose.dev.yml exec app npm run seed:run"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose -f docker-compose.dev.yml down"
echo ""
