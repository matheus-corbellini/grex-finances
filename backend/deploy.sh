#!/bin/bash

# Script de Deploy para Produção
# Uso: ./deploy.sh [ambiente]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="grex-finances"

echo "🚀 Iniciando deploy do $PROJECT_NAME para ambiente: $ENVIRONMENT"

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Fazer backup do banco (se existir)
if docker volume ls | grep -q "${PROJECT_NAME}_postgres_data"; then
    echo "💾 Fazendo backup do banco de dados..."
    docker run --rm -v "${PROJECT_NAME}_postgres_data":/data -v $(pwd):/backup postgres:15 tar czf /backup/postgres_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
fi

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker-compose.prod.yml up --build -d

# Aguardar banco estar disponível
echo "⏳ Aguardando banco de dados estar disponível..."
sleep 10

# Verificar se a aplicação está rodando
echo "🔍 Verificando status da aplicação..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Deploy concluído com sucesso!"
    echo "🌐 Aplicação disponível em: http://localhost:3001"
else
    echo "❌ Erro no deploy. Verifique os logs:"
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
fi

echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps
