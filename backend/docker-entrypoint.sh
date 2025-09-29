#!/bin/sh

# Aguardar o banco de dados estar disponível
echo "Aguardando banco de dados..."
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
  echo "Banco de dados não está disponível - aguardando..."
  sleep 2
done

echo "Banco de dados está disponível!"

# Executar migrações
echo "Executando migrações..."
npm run migration:run

# Executar seeds (opcional)
if [ "$RUN_SEEDS" = "true" ]; then
  echo "Executando seeds..."
  npm run seed:run
fi

# Iniciar aplicação
echo "Iniciando aplicação..."
exec "$@"
