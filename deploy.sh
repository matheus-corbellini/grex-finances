#!/bin/bash

# Script de Deploy Automatizado para Grex Finances
# Uso: ./deploy.sh [ambiente] [opções]
# Exemplo: ./deploy.sh staging --skip-tests
#          ./deploy.sh production --backup-db

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
PROJECT_NAME="grex-finances"
DOCKER_REGISTRY="ghcr.io"
REPOSITORY_NAME="grex-finances"

# Função para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para mostrar ajuda
show_help() {
    echo "Script de Deploy Automatizado para Grex Finances"
    echo ""
    echo "Uso: $0 [ambiente] [opções]"
    echo ""
    echo "Ambientes:"
    echo "  development  - Ambiente de desenvolvimento local"
    echo "  staging      - Ambiente de staging"
    echo "  production   - Ambiente de produção"
    echo ""
    echo "Opções:"
    echo "  --skip-tests     - Pular testes"
    echo "  --backup-db      - Fazer backup do banco antes do deploy"
    echo "  --migrate-db     - Executar migrações do banco"
    echo "  --force          - Forçar deploy mesmo com falhas"
    echo "  --dry-run        - Simular deploy sem executar"
    echo "  --help           - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 staging --skip-tests"
    echo "  $0 production --backup-db --migrate-db"
    echo "  $0 development"
}

# Função para verificar pré-requisitos
check_prerequisites() {
    log "Verificando pré-requisitos..."
    
    # Verificar se Docker está rodando
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando. Por favor, inicie o Docker."
        exit 1
    fi
    
    # Verificar se Docker Compose está disponível
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado."
        exit 1
    fi
    
    # Verificar se Git está disponível
    if ! command -v git &> /dev/null; then
        error "Git não está instalado."
        exit 1
    fi
    
    success "Pré-requisitos verificados com sucesso!"
}

# Função para fazer backup do banco
backup_database() {
    local environment=$1
    log "Fazendo backup do banco de dados..."
    
    local backup_file="backup_${environment}_$(date +%Y%m%d_%H%M%S).sql"
    local compose_file="docker-compose.${environment}.yml"
    
    if [ ! -f "$compose_file" ]; then
        compose_file="docker-compose.yml"
    fi
    
    # Fazer backup usando pg_dump
    docker-compose -f "$compose_file" exec -T postgres pg_dump -U grex_${environment}_user grex_finances_${environment} > "backups/${backup_file}"
    
    if [ $? -eq 0 ]; then
        success "Backup criado: backups/${backup_file}"
    else
        error "Falha ao criar backup do banco"
        exit 1
    fi
}

# Função para executar migrações
run_migrations() {
    local environment=$1
    log "Executando migrações do banco de dados..."
    
    local compose_file="docker-compose.${environment}.yml"
    if [ ! -f "$compose_file" ]; then
        compose_file="docker-compose.yml"
    fi
    
    docker-compose -f "$compose_file" exec backend npm run migration:run
    
    if [ $? -eq 0 ]; then
        success "Migrações executadas com sucesso!"
    else
        error "Falha ao executar migrações"
        exit 1
    fi
}

# Função para executar testes
run_tests() {
    log "Executando testes..."
    
    # Testes do backend
    cd backend
    npm run test:cov
    
    if [ $? -ne 0 ]; then
        error "Testes do backend falharam"
        exit 1
    fi
    
    cd ..
    
    # Testes do frontend
    npm run test
    
    if [ $? -ne 0 ]; then
        error "Testes do frontend falharam"
        exit 1
    fi
    
    success "Todos os testes passaram!"
}

# Função para fazer build das imagens
build_images() {
    local environment=$1
    log "Fazendo build das imagens Docker..."
    
    local compose_file="docker-compose.${environment}.yml"
    if [ ! -f "$compose_file" ]; then
        compose_file="docker-compose.yml"
    fi
    
    docker-compose -f "$compose_file" build --no-cache
    
    if [ $? -eq 0 ]; then
        success "Imagens construídas com sucesso!"
    else
        error "Falha ao construir imagens"
        exit 1
    fi
}

# Função para fazer deploy
deploy() {
    local environment=$1
    log "Iniciando deploy para ambiente: $environment"
    
    local compose_file="docker-compose.${environment}.yml"
    if [ ! -f "$compose_file" ]; then
        compose_file="docker-compose.yml"
    fi
    
    # Parar containers existentes
    log "Parando containers existentes..."
    docker-compose -f "$compose_file" down
    
    # Iniciar novos containers
    log "Iniciando novos containers..."
    docker-compose -f "$compose_file" up -d
    
    # Aguardar serviços estarem prontos
    log "Aguardando serviços estarem prontos..."
    sleep 30
    
    # Verificar saúde dos serviços
    log "Verificando saúde dos serviços..."
    
    # Verificar backend
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        success "Backend está funcionando!"
    else
        error "Backend não está respondendo"
        docker-compose -f "$compose_file" logs backend
        exit 1
    fi
    
    # Verificar frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        success "Frontend está funcionando!"
    else
        error "Frontend não está respondendo"
        docker-compose -f "$compose_file" logs frontend
        exit 1
    fi
    
    success "Deploy concluído com sucesso!"
}

# Função para limpeza
cleanup() {
    log "Fazendo limpeza..."
    
    # Remover imagens não utilizadas
    docker image prune -f
    
    # Remover volumes não utilizados
    docker volume prune -f
    
    success "Limpeza concluída!"
}

# Função principal
main() {
    local environment=""
    local skip_tests=false
    local backup_db=false
    local migrate_db=false
    local force=false
    local dry_run=false
    
    # Parse argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            development|staging|production)
                environment="$1"
                shift
                ;;
            --skip-tests)
                skip_tests=true
                shift
                ;;
            --backup-db)
                backup_db=true
                shift
                ;;
            --migrate-db)
                migrate_db=true
                shift
                ;;
            --force)
                force=true
                shift
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                error "Opção desconhecida: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Verificar se ambiente foi especificado
    if [ -z "$environment" ]; then
        error "Ambiente não especificado"
        show_help
        exit 1
    fi
    
    # Verificar se arquivo de ambiente existe
    if [ ! -f "env.${environment}.example" ]; then
        error "Arquivo de configuração não encontrado: env.${environment}.example"
        exit 1
    fi
    
    log "Iniciando deploy do $PROJECT_NAME para ambiente: $environment"
    
    if [ "$dry_run" = true ]; then
        log "Modo dry-run ativado - simulando deploy..."
        log "Ambiente: $environment"
        log "Skip tests: $skip_tests"
        log "Backup DB: $backup_db"
        log "Migrate DB: $migrate_db"
        log "Force: $force"
        success "Simulação concluída!"
        exit 0
    fi
    
    # Verificar pré-requisitos
    check_prerequisites
    
    # Fazer backup do banco se solicitado
    if [ "$backup_db" = true ]; then
        backup_database "$environment"
    fi
    
    # Executar testes se não foram pulados
    if [ "$skip_tests" = false ]; then
        run_tests
    else
        warning "Testes pulados conforme solicitado"
    fi
    
    # Fazer build das imagens
    build_images "$environment"
    
    # Executar migrações se solicitado
    if [ "$migrate_db" = true ]; then
        run_migrations "$environment"
    fi
    
    # Fazer deploy
    deploy "$environment"
    
    # Limpeza
    cleanup
    
    success "Deploy do $PROJECT_NAME para $environment concluído com sucesso!"
    log "Aplicação disponível em:"
    log "  Frontend: http://localhost:3000"
    log "  Backend: http://localhost:3001"
    log "  Health Check: http://localhost:3001/health"
}

# Executar função principal
main "$@"
