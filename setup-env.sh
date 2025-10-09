#!/bin/bash

# Script de configuração do ambiente de desenvolvimento
# Este script cria o arquivo .env.local com as configurações necessárias

set -e

echo "🔧 Configuração do Ambiente - Grex Finances"
echo "==========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se .env.local já existe
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  O arquivo .env.local já existe!${NC}"
    echo ""
    read -p "Deseja sobrescrevê-lo? (s/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${BLUE}ℹ️  Operação cancelada.${NC}"
        exit 0
    fi
fi

# Verificar se o arquivo de exemplo existe
if [ ! -f "env.local.example" ]; then
    echo -e "${RED}❌ Erro: Arquivo env.local.example não encontrado!${NC}"
    echo "   Certifique-se de estar na raiz do projeto."
    exit 1
fi

# Copiar arquivo de exemplo
echo -e "${BLUE}📋 Copiando arquivo de exemplo...${NC}"
cp env.local.example .env.local

echo ""
echo -e "${GREEN}✅ Arquivo .env.local criado com sucesso!${NC}"
echo ""
echo -e "${YELLOW}⚡ Configurações do Firebase${NC}"
echo "================================"
echo ""
echo "As seguintes variáveis do Firebase foram configuradas:"
echo ""
echo "  • NEXT_PUBLIC_FIREBASE_API_KEY"
echo "  • NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "  • NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "  • NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo "  • NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "  • NEXT_PUBLIC_FIREBASE_APP_ID"
echo ""
echo -e "${GREEN}✅ Firebase configurado para autenticação apenas${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos Passos:${NC}"
echo "=================="
echo ""
echo "1. Verifique o arquivo .env.local"
echo "2. Se necessário, atualize as credenciais do Firebase"
echo "3. Configure outros serviços (AWS, Stripe, etc.)"
echo "4. Execute 'npm run dev' para iniciar o servidor"
echo ""
echo -e "${BLUE}📚 Documentação:${NC}"
echo "   Leia FIREBASE-SETUP.md para mais informações"
echo ""
echo -e "${GREEN}🎉 Configuração concluída!${NC}"
echo ""

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js não encontrado!${NC}"
    echo "   Instale o Node.js antes de continuar:"
    echo "   https://nodejs.org/"
    echo ""
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependências não instaladas!${NC}"
    echo ""
    read -p "Deseja instalar as dependências agora? (s/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${BLUE}📦 Instalando dependências...${NC}"
        npm install
        echo ""
        echo -e "${GREEN}✅ Dependências instaladas!${NC}"
        echo ""
    else
        echo -e "${YELLOW}⚡ Lembre-se de executar 'npm install' antes de iniciar o projeto${NC}"
        echo ""
    fi
fi

echo -e "${BLUE}🚀 Para iniciar o projeto:${NC}"
echo "   npm run dev"
echo ""

