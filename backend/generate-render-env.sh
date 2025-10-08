#!/bin/bash

echo "🔧 Gerando comandos para configurar variáveis no Render..."
echo "=================================================="
echo ""
echo "📋 Copie e cole estas variáveis no painel do Render:"
echo ""

# Ler o arquivo .env.production e formatar para o Render
while IFS='=' read -r key value; do
    # Ignorar comentários e linhas vazias
    if [[ ! $key =~ ^# ]] && [[ -n $key ]]; then
        # Remover espaços em branco
        key=$(echo "$key" | xargs)
        value=$(echo "$value" | xargs)
        echo "$key=$value"
    fi
done < .env.production

echo ""
echo "✅ Cole essas variáveis no painel do Render:"
echo "   Seu Serviço > Environment > Add Environment Variable"
echo ""
echo "🔒 Lembre-se de alterar o JWT_SECRET para um valor seguro!"
