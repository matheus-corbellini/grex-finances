#!/bin/bash

# Script de Backup Automatizado para Grex Finances
# Este script é executado pelo container de backup no Docker Compose

set -e

# Configurações
BACKUP_DIR="/backups"
DB_HOST="postgres"
DB_PORT="5432"
DB_NAME="grex_finances_production"
DB_USER="grex_production_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Função para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Função para criar backup
create_backup() {
    log "Iniciando backup do banco de dados..."
    
    # Criar backup usando pg_dump
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose \
        --no-password \
        --format=custom \
        --compress=9 \
        --file="$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        log "Backup criado com sucesso: $BACKUP_FILE"
        
        # Verificar tamanho do arquivo
        FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log "Tamanho do backup: $FILE_SIZE"
        
        # Criar arquivo de metadados
        METADATA_FILE="${BACKUP_FILE}.meta"
        cat > "$METADATA_FILE" << EOF
{
    "timestamp": "$TIMESTAMP",
    "database": "$DB_NAME",
    "host": "$DB_HOST",
    "port": "$DB_PORT",
    "user": "$DB_USER",
    "file_size": "$FILE_SIZE",
    "backup_type": "full",
    "compression": "custom",
    "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
        
        log "Metadados salvos: $METADATA_FILE"
    else
        log "ERRO: Falha ao criar backup"
        exit 1
    fi
}

# Função para limpar backups antigos
cleanup_old_backups() {
    log "Limpando backups antigos (mais de $RETENTION_DAYS dias)..."
    
    find "$BACKUP_DIR" -name "backup_*.sql" -type f -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR" -name "backup_*.sql.meta" -type f -mtime +$RETENTION_DAYS -delete
    
    log "Limpeza de backups antigos concluída"
}

# Função para verificar integridade do backup
verify_backup() {
    log "Verificando integridade do backup..."
    
    # Verificar se o arquivo existe e não está vazio
    if [ ! -f "$BACKUP_FILE" ] || [ ! -s "$BACKUP_FILE" ]; then
        log "ERRO: Arquivo de backup não encontrado ou vazio"
        exit 1
    fi
    
    # Verificar se é um arquivo válido do PostgreSQL
    if ! pg_restore --list "$BACKUP_FILE" > /dev/null 2>&1; then
        log "ERRO: Arquivo de backup corrompido ou inválido"
        exit 1
    fi
    
    log "Backup verificado com sucesso"
}

# Função para enviar notificação (opcional)
send_notification() {
    local status=$1
    local message=$2
    
    # Aqui você pode adicionar notificações via webhook, email, etc.
    # Exemplo para webhook:
    # curl -X POST -H 'Content-type: application/json' \
    #      --data "{\"text\":\"Backup $status: $message\"}" \
    #      "$WEBHOOK_URL"
    
    log "Notificação: $status - $message"
}

# Função principal
main() {
    log "Iniciando processo de backup..."
    
    # Criar diretório de backup se não existir
    mkdir -p "$BACKUP_DIR"
    
    # Criar backup
    create_backup
    
    # Verificar integridade
    verify_backup
    
    # Limpar backups antigos
    cleanup_old_backups
    
    # Enviar notificação de sucesso
    send_notification "SUCCESS" "Backup criado com sucesso: $BACKUP_FILE"
    
    log "Processo de backup concluído com sucesso!"
}

# Executar função principal
main "$@"
