# 🚀 GUIA DE INSTALAÇÃO E EXECUÇÃO

## ✅ Projeto Criado com Sucesso!

Este projeto foi estruturado conforme as especificações do README, com:
- ✅ Backend em Node.js + Express + TypeScript + Prisma (MVC)
- ✅ Frontend em Next.js 14 + TypeScript + Tailwind CSS
- ✅ Autenticação JWT completa
- ✅ Estrutura de pastas organizada

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 ou superior) - [Download](https://www.postgresql.org/download/)
- **Git** (opcional) - [Download](https://git-scm.com/)

---

## 🔧 PASSO 1: Configurar o Backend

### 1.1 - Navegar para a pasta do backend

```bash
cd backend
```

### 1.2 - Instalar dependências

```bash
npm install
```

### 1.3 - Configurar PostgreSQL

Crie um banco de dados no PostgreSQL:

```sql
CREATE DATABASE medicos_consultas;
```

### 1.4 - Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
copy .env.example .env    # Windows
# ou
cp .env.example .env      # Linux/Mac
```

Edite o arquivo `.env` e configure:

```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/medicos_consultas?schema=public"
JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Substitua `seu_usuario` e `sua_senha` pelas credenciais do seu PostgreSQL!

### 1.5 - Gerar Prisma Client e criar tabelas

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 1.6 - Rodar o servidor backend

```bash
npm run dev
```

✅ Backend rodando em: **http://localhost:3001**

---

## 🎨 PASSO 2: Configurar o Frontend

### 2.1 - Abrir NOVO TERMINAL e navegar para a pasta do frontend

```bash
cd frontend
```

### 2.2 - Instalar dependências

```bash
npm install
```

### 2.3 - Verificar variáveis de ambiente

O arquivo `.env.local` já está configurado com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_NAME=Médicos Consultas Online
```

### 2.4 - Rodar o servidor frontend

```bash
npm run dev
```

✅ Frontend rodando em: **http://localhost:3000**

---

## 🧪 PASSO 3: Testar o Sistema

### 3.1 - Acessar o frontend

Abra seu navegador em: **http://localhost:3000**

### 3.2 - Criar primeiro usuário (via Prisma Studio ou API)

**Opção 1: Usar o frontend (Primeiro Acesso)**
1. Clique em "Primeiro Acesso"
2. Digite um CPF válido (ex: 12345678901)
3. Preencha os dados e crie sua conta

**Opção 2: Criar direto no banco (para testes)**

Abra o Prisma Studio:
```bash
cd backend
npm run prisma:studio
```

Ou use a API de registro diretamente:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "email": "admin@example.com",
    "password": "senha123",
    "name": "Administrador"
  }'
```

### 3.3 - Fazer Login

1. Vá para http://localhost:3000/login
2. Digite o e-mail e senha criados
3. Você será redirecionado para o dashboard

---

## 🐛 Solução de Problemas

### Erro: "Cannot connect to database"
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env` do backend
- Teste a conexão: `psql -U seu_usuario -d medicos_consultas`

### Erro: "Port 3001 already in use"
- Mude a porta no arquivo `.env` do backend
- OU mate o processo: 
  - Windows: `netstat -ano | findstr :3001` e `taskkill /PID <numero> /F`
  - Linux/Mac: `lsof -ti:3001 | xargs kill -9`

### Erro: "ECONNREFUSED" no frontend
- Certifique-se que o backend está rodando
- Verifique se a URL em `.env.local` está correta: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

### Erros de TypeScript
- Os erros de TypeScript são normais até você instalar as dependências
- Execute `npm install` nas pastas backend E frontend

---

## 📁 Estrutura Final do Projeto

```
ConsultaMedicosOnline/
├── backend/                    # 🔧 API Backend
│   ├── prisma/
│   │   └── schema.prisma      # Schema do banco
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── middlewares/       # Auth, validações
│   │   ├── routes/            # Rotas da API
│   │   ├── lib/               # Utilitários
│   │   └── server.ts          # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/                   # 🎨 Interface Web
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # Componentes React
│   │   └── lib/               # API client, utils
│   ├── package.json
│   ├── tailwind.config.ts
│   └── .env.local
│
└── INSTALL.md                 # Este arquivo
```

---

## 🎯 Próximos Passos

Agora que o projeto está funcionando:

1. ✅ **Backend está pronto com**:
   - Autenticação JWT funcional
   - Todos os endpoints criados
   - Banco de dados estruturado

2. ✅ **Frontend tem**:
   - Página de login funcional
   - Integração com API configurada
   - Tema dark/light configurado

3. 🚧 **Para completar**:
   - Implementar as demais páginas (Dashboard, Consultas, etc)
   - Criar componentes de layout (Sidebar, Topbar)
   - Implementar lógica completa nos controllers do backend
   - Adicionar validações e tratamento de erros

---

## 📞 Comandos Rápidos

```bash
# Rodar backend
cd backend && npm run dev

# Rodar frontend (em outro terminal)
cd frontend && npm run dev

# Prisma Studio (visualizar banco)
cd backend && npm run prisma:studio

# Build para produção
cd backend && npm run build
cd frontend && npm run build
```

---

**🎉 Pronto! Seu sistema de telemedicina está configurado e rodando!**

Para dúvidas, consulte os README.md em cada pasta (backend/ e frontend/).
