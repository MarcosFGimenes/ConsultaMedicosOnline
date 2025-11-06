# 🔧 BACKEND — API REST para Telemedicina
## Arquitetura MVC + TypeScript + Express + Prisma

> **📌 Este é o projeto Backend!**  
> - API REST com Express e TypeScript
> - Arquitetura MVC (Model-View-Controller)
> - Autenticação JWT
> - Banco de dados PostgreSQL com Prisma ORM
> - WebSocket para comunicação em tempo real

---

## 🚀 Tecnologias

- **Node.js** + **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Socket.IO** - WebSocket para real-time
- **Zod** - Validação de dados
- **Multer** - Upload de arquivos

---

## ⚙️ Configuração e Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/medicos_consultas?schema=public"
JWT_SECRET=your-super-secret-key
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Configurar banco de dados

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Rodar o servidor

```bash
npm run dev
```

Servidor rodando em **http://localhost:3001**