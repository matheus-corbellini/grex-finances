#!/bin/bash

echo "🧪 Testando atualização de saldo da conta BB"
echo "============================================="

# ID da conta BB
ACCOUNT_ID="ecb07ce1-600e-4340-a161-98452c114917"

echo "📊 Saldo atual da conta BB:"
curl -s http://localhost:3001/accounts | jq '.[] | select(.name == "Conta Poupança BB") | {name: .name, balance: .balance}'

echo ""
echo "💰 Criando transação de R$ 50,00 (despesa)..."
curl -X POST http://localhost:3001/transactions \
  -H "Content-Type: application/json" \
  -d "{
    \"description\": \"Teste de atualização de saldo\",
    \"amount\": 50,
    \"type\": \"expense\",
    \"accountId\": \"$ACCOUNT_ID\",
    \"date\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"
  }" | jq '.success'

echo ""
echo "📊 Saldo após a transação:"
curl -s http://localhost:3001/accounts | jq '.[] | select(.name == "Conta Poupança BB") | {name: .name, balance: .balance}'

echo ""
echo "✅ Teste concluído!"
