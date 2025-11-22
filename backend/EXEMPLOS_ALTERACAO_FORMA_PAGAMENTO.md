# Exemplos de Requisições - Alteração de Forma de Pagamento

Este documento contém exemplos práticos de como usar a rota `PUT /api/subscription/update-payment-method/:assinaturaId` para alterar a forma de pagamento de uma assinatura.

## Pré-requisitos

1. **Autenticação**: A rota é protegida e requer token JWT do Firebase
   - Header: `Authorization: Bearer <TOKEN_JWT_FIREBASE>`

2. **Assinatura**: A assinatura deve existir e estar ativa no Asaas

3. **Validações**:
   - Não pode haver cobranças pendentes (PENDING) ou atrasadas (OVERDUE)
   - Para CREDIT_CARD, é necessário fornecer dados do cartão ou token

---

## Exemplo 1: Alterar de BOLETO para PIX

### cURL
```bash
curl -X PUT "http://localhost:3000/api/subscription/update-payment-method/sub_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "billingType": "PIX",
    "nextDueDate": "2025-12-01"
  }'
```

### JavaScript (Fetch API)
```javascript
const response = await fetch('http://localhost:3000/api/subscription/update-payment-method/sub_xxxxxxxxxxxx', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${firebaseToken}`
  },
  body: JSON.stringify({
    billingType: 'PIX',
    nextDueDate: '2025-12-01'
  })
});

const data = await response.json();
console.log(data);
```

### Body JSON
```json
{
  "billingType": "PIX",
  "nextDueDate": "2025-12-01"
}
```

### Resposta de Sucesso (200)
```json
{
  "success": true,
  "message": "Forma de pagamento atualizada com sucesso.",
  "assinaturaId": "sub_xxxxxxxxxxxx",
  "billingType": "PIX",
  "nextDueDate": "2025-12-01"
}
```

---

## Exemplo 2: Alterar de BOLETO/PIX para CARTÃO (com dados completos)

### cURL
```bash
curl -X PUT "http://localhost:3000/api/subscription/update-payment-method/sub_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "billingType": "CREDIT_CARD",
    "nextDueDate": "2025-12-01",
    "creditCard": {
      "holderName": "JOÃO SILVA",
      "number": "5162306219378829",
      "expiryMonth": "05",
      "expiryYear": "2028",
      "ccv": "318"
    },
    "creditCardHolderInfo": {
      "name": "João Silva",
      "email": "joao@email.com",
      "cpfCnpj": "12345678901",
      "postalCode": "13040000",
      "addressNumber": "123",
      "addressComplement": "Apto 45",
      "phone": "19999998888"
    }
  }'
```

### Body JSON
```json
{
  "billingType": "CREDIT_CARD",
  "nextDueDate": "2025-12-01",
  "creditCard": {
    "holderName": "JOÃO SILVA",
    "number": "5162306219378829",
    "expiryMonth": "05",
    "expiryYear": "2028",
    "ccv": "318"
  },
  "creditCardHolderInfo": {
    "name": "João Silva",
    "email": "joao@email.com",
    "cpfCnpj": "12345678901",
    "postalCode": "13040000",
    "addressNumber": "123",
    "addressComplement": "Apto 45",
    "phone": "19999998888"
  }
}
```

### Resposta de Sucesso (200)
```json
{
  "success": true,
  "message": "Forma de pagamento atualizada com sucesso.",
  "assinaturaId": "sub_xxxxxxxxxxxx",
  "billingType": "CREDIT_CARD",
  "nextDueDate": "2025-12-01"
}
```

---

## Exemplo 3: Alterar para CARTÃO usando Token

### cURL
```bash
curl -X PUT "http://localhost:3000/api/subscription/update-payment-method/sub_xxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "billingType": "CREDIT_CARD",
    "nextDueDate": "2025-12-01",
    "creditCardToken": "tok_xxxxxxxxxxxx",
    "creditCardHolderInfo": {
      "name": "João Silva",
      "email": "joao@email.com",
      "cpfCnpj": "12345678901",
      "postalCode": "13040000",
      "addressNumber": "123",
      "addressComplement": "Apto 45",
      "phone": "19999998888"
    }
  }'
```

### Body JSON
```json
{
  "billingType": "CREDIT_CARD",
  "nextDueDate": "2025-12-01",
  "creditCardToken": "tok_xxxxxxxxxxxx",
  "creditCardHolderInfo": {
    "name": "João Silva",
    "email": "joao@email.com",
    "cpfCnpj": "12345678901",
    "postalCode": "13040000",
    "addressNumber": "123",
    "addressComplement": "Apto 45",
    "phone": "19999998888"
  }
}
```

---

## Exemplo 4: Alterar de PIX para BOLETO

### Body JSON
```json
{
  "billingType": "BOLETO",
  "nextDueDate": "2025-12-01"
}
```

---

## Respostas de Erro

### Erro 400 - Campos Inválidos
```json
{
  "error": "billingType inválido. Use um dos seguintes: BOLETO, PIX, CREDIT_CARD."
}
```

### Erro 400 - Dados de Cartão Incompletos
```json
{
  "error": "Para CREDIT_CARD, é necessário fornecer creditCardToken ou dados completos do cartão (holderName, number, expiryMonth, expiryYear, ccv)."
}
```

### Erro 401 - Não Autenticado
```json
{
  "error": "Usuário não autenticado."
}
```

### Erro 409 - Cobranças Pendentes
```json
{
  "error": "Não é possível alterar a forma de pagamento: existem cobranças pendentes ou atrasadas.",
  "cobrancasPendentes": [
    {
      "id": "pay_xxxxxxxxxxxx",
      "status": "PENDING",
      "value": 79.9,
      "dueDate": "2025-11-10"
    }
  ]
}
```

### Erro 404 - Assinatura Não Encontrada
```json
{
  "error": "Erro ao atualizar assinatura no Asaas.",
  "details": {
    "errors": [
      {
        "code": "404",
        "description": "Assinatura não encontrada"
      }
    ]
  }
}
```

### Erro 500 - Erro no Servidor
```json
{
  "error": "Erro ao atualizar forma de pagamento.",
  "details": {
    "errors": [
      {
        "code": "500",
        "description": "Erro interno do servidor"
      }
    ]
  }
}
```

---

## Observações Importantes

### Limitações da API do Asaas

1. **Cobranças Pendentes**: Não é possível alterar a forma de pagamento se houver cobranças com status PENDING ou OVERDUE
   - A API verifica automaticamente antes de permitir a alteração

2. **Atualização de Faturas Pendentes**: 
   - O campo `updatePendingPayments` é sempre enviado como `true`
   - Isso significa que faturas pendentes também serão atualizadas com a nova forma de pagamento

3. **Cartão de Crédito**:
   - Se usar `creditCardToken`, não é necessário enviar `creditCard`
   - O token é mais seguro pois os dados do cartão já estão tokenizados no Asaas
   - Sempre forneça `creditCardHolderInfo` completo (nome, email, CPF, CEP, número do endereço)

4. **nextDueDate**:
   - Formato: `YYYY-MM-DD`
   - Opcional: se não fornecido, mantém a data atual
   - Útil para alterar quando a próxima cobrança deve ser gerada

5. **IP do Cliente**:
   - O IP é capturado automaticamente da requisição (`req.ip` ou headers `x-forwarded-for`)
   - Usado pelo Asaas para segurança ao atualizar dados do cartão

### Boas Práticas

1. **Validação no Frontend**: Sempre valide os campos antes de enviar a requisição
2. **Tratamento de Erros**: Trate adequadamente os erros 409 (pendências) e 400 (validação)
3. **Feedback ao Usuário**: Informe claramente se há cobranças pendentes que impedem a alteração
4. **Token de Cartão**: Sempre que possível, use `creditCardToken` em vez de dados completos do cartão
5. **Logs**: A API registra todos os erros para auditoria

### Fluxo Recomendado no Frontend

1. Usuário seleciona nova forma de pagamento
2. Se for CREDIT_CARD, coletar dados do cartão (ou tokenizar primeiro)
3. Fazer requisição para atualizar forma de pagamento
4. Se houver erro 409 (pendências), informar ao usuário e sugerir pagar as pendências primeiro
5. Se sucesso, atualizar a UI e confirmar a alteração

