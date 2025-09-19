#!/bin/bash

# ===========================================
# GREX FINANCES - FIREBASE SETUP SCRIPT
# ===========================================

echo "🔥 Configurando Firebase para Grex Finances..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}===========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===========================================${NC}"
}

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado. Por favor, instale o npm primeiro."
    exit 1
fi

print_header "VERIFICANDO DEPENDÊNCIAS"

# Instalar dependências do Firebase no frontend
print_message "Instalando dependências do Firebase no frontend..."
npm install firebase

# Instalar dependências do Firebase no backend
print_message "Instalando dependências do Firebase no backend..."
cd backend
npm install firebase-admin
cd ..

print_header "CONFIGURANDO ARQUIVOS DE AMBIENTE"

# Verificar se os arquivos de configuração existem
if [ ! -f "firebase-config.env" ]; then
    print_error "Arquivo firebase-config.env não encontrado!"
    exit 1
fi

if [ ! -f "backend/firebase-backend.env" ]; then
    print_error "Arquivo backend/firebase-backend.env não encontrado!"
    exit 1
fi

# Copiar arquivos de configuração
print_message "Copiando arquivos de configuração..."

# Frontend
if [ ! -f ".env.local" ]; then
    cp firebase-config.env .env.local
    print_message "Arquivo .env.local criado para o frontend"
else
    print_warning "Arquivo .env.local já existe. Não foi sobrescrito."
fi

# Backend
if [ ! -f "backend/.env" ]; then
    cp backend/firebase-backend.env backend/.env
    print_message "Arquivo backend/.env criado para o backend"
else
    print_warning "Arquivo backend/.env já existe. Não foi sobrescrito."
fi

print_header "CONFIGURAÇÃO CONCLUÍDA"

print_message "✅ Arquivos de configuração criados com sucesso!"
print_warning "⚠️  IMPORTANTE: Configure as variáveis de ambiente com seus dados reais do Firebase:"
echo ""
echo "1. Acesse o Firebase Console: https://console.firebase.google.com/"
echo "2. Crie um projeto ou selecione um existente"
echo "3. Configure os serviços: Authentication, Firestore, Storage"
echo "4. Copie as configurações para os arquivos .env.local e backend/.env"
echo "5. Baixe o arquivo de credenciais do Service Account"
echo "6. Configure as variáveis FIREBASE_ADMIN_* no backend/.env"
echo ""
print_message "📚 Consulte o arquivo FIREBASE_SETUP.md para instruções detalhadas"

print_header "PRÓXIMOS PASSOS"

echo "1. Configure suas credenciais do Firebase nos arquivos .env"
echo "2. Execute: npm run dev (para o frontend)"
echo "3. Execute: cd backend && npm run start:dev (para o backend)"
echo "4. Acesse: http://localhost:3000"

print_message "🎉 Setup do Firebase concluído!"
