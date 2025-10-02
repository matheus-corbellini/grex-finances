#!/bin/bash

echo "🚀 Iniciando Grex Finances - Frontend e Backend"
echo "================================================"

# Verificar se estamos na pasta raiz do projeto
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Execute este script na pasta raiz do projeto Grex Finances"
    exit 1
fi

# Função para verificar se uma porta está em uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Porta em uso
    else
        return 1  # Porta livre
    fi
}

# Verificar se o backend já está rodando
if check_port 3001; then
    echo "✅ Backend já está rodando na porta 3001"
    BACKEND_RUNNING=true
else
    echo "⚠️  Backend não está rodando na porta 3001"
    BACKEND_RUNNING=false
fi

# Verificar se o frontend já está rodando
if check_port 3000; then
    echo "✅ Frontend já está rodando na porta 3000"
    FRONTEND_RUNNING=true
else
    echo "⚠️  Frontend não está rodando na porta 3000"
    FRONTEND_RUNNING=false
fi

echo ""
echo "📋 Status dos serviços:"
echo "   Frontend (porta 3000): $([ "$FRONTEND_RUNNING" = true ] && echo "✅ Rodando" || echo "❌ Parado")"
echo "   Backend (porta 3001): $([ "$BACKEND_RUNNING" = true ] && echo "✅ Rodando" || echo "❌ Parado")"
echo ""

# Se ambos estão rodando, apenas mostrar informações
if [ "$FRONTEND_RUNNING" = true ] && [ "$BACKEND_RUNNING" = true ]; then
    echo "🎉 Ambos os serviços já estão rodando!"
    echo ""
    echo "🌐 Acesse a aplicação em:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:3001"
    echo "   Swagger Docs: http://localhost:3001/api"
    echo ""
    echo "🛑 Para parar os serviços:"
    echo "   Frontend: Ctrl+C neste terminal"
    echo "   Backend: Vá para o terminal do backend e pressione Ctrl+C"
    exit 0
fi

# Perguntar ao usuário o que fazer
echo "🤔 O que você gostaria de fazer?"
echo "1) Iniciar apenas o frontend"
echo "2) Iniciar apenas o backend"
echo "3) Iniciar ambos (recomendado)"
echo "4) Usar Docker para iniciar tudo"
echo "5) Sair"
echo ""

read -p "Escolha uma opção (1-5): " choice

case $choice in
    1)
        echo "🚀 Iniciando apenas o frontend..."
        npm run dev
        ;;
    2)
        echo "🚀 Iniciando apenas o backend..."
        cd backend
        npm run start:dev
        ;;
    3)
        echo "🚀 Iniciando ambos os serviços..."
        
        # Iniciar backend em background se não estiver rodando
        if [ "$BACKEND_RUNNING" = false ]; then
            echo "📡 Iniciando backend..."
            cd backend
            npm run start:dev &
            BACKEND_PID=$!
            cd ..
            echo "✅ Backend iniciado (PID: $BACKEND_PID)"
        fi
        
        # Aguardar um pouco para o backend inicializar
        if [ "$BACKEND_RUNNING" = false ]; then
            echo "⏳ Aguardando backend inicializar..."
            sleep 5
        fi
        
        # Iniciar frontend
        echo "🎨 Iniciando frontend..."
        npm run dev
        ;;
    4)
        echo "🐳 Iniciando com Docker..."
        cd backend
        docker-compose up --build
        ;;
    5)
        echo "👋 Saindo..."
        exit 0
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac
