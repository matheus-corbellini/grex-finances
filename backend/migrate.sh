#!/bin/bash

# Script para executar migrações do banco de dados
# Uso: ./migrate.sh [run|revert|generate] [nome_da_migracao]

set -e

ACTION=${1:-run}
MIGRATION_NAME=${2:-""}

echo "🗄️  Executando migração: $ACTION"

case $ACTION in
    "run")
        echo "▶️  Executando migrações..."
        npm run migration:run
        echo "✅ Migrações executadas com sucesso!"
        ;;
    "revert")
        echo "↩️  Revertendo última migração..."
        npm run migration:revert
        echo "✅ Migração revertida com sucesso!"
        ;;
    "generate")
        if [ -z "$MIGRATION_NAME" ]; then
            echo "❌ Nome da migração é obrigatório para generate"
            echo "Uso: ./migrate.sh generate NomeDaMigracao"
            exit 1
        fi
        echo "🆕 Gerando nova migração: $MIGRATION_NAME"
        npm run migration:generate -- src/migrations/$MIGRATION_NAME
        echo "✅ Migração gerada com sucesso!"
        ;;
    "status")
        echo "📊 Status das migrações:"
        npm run migration:show
        ;;
    *)
        echo "❌ Ação inválida: $ACTION"
        echo "Ações disponíveis: run, revert, generate, status"
        exit 1
        ;;
esac
