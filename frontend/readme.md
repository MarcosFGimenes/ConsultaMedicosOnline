# 🧩 FRONTEND — PAINEL DE TELEMEDICINA  
## Projeto Base (React + Next.js + Tailwind)

> **📌 Este é APENAS o projeto Frontend!**  
> - Interface do usuário (UI/UX)
> - Consome API REST do backend
> - Não contém lógica de negócios ou banco de dados
> - Backend é um projeto separado na pasta `../backend/`

---

### 🧠 Contexto

O objetivo é criar o **frontend completo** de um sistema de **painel de assinante de telemedicina**, mantendo a identidade visual da landing page oficial:  
👉 [https://medicosconsultasonline.com.br](https://medicosconsultasonline.com.br)

O sistema será o painel de acesso dos assinantes, dependentes e administradores, permitindo gerenciar assinaturas, consultas e dados pessoais.

**Arquitetura:**
- ✅ **Frontend (este projeto):** Interface do usuário em React/Next.js
- ✅ **Backend (projeto separado):** API REST + autenticação + banco de dados
- 🔗 **Comunicação:** Frontend consome endpoints REST do backend via Axios
- 🔐 **Autenticação:** Backend gera JWT, frontend armazena e envia em cada requisição

**Público-alvo:**
- Assinantes (usuários finais que contratam o plano de telemedicina)
- Dependentes (familiares vinculados ao titular)
- Administradores (gestão do sistema e suporte)

**Principais funcionalidades:**
- Agendamento de consultas médicas online
- Atendimento imediato (emergencial)
- Gestão de dependentes
- Acompanhamento de faturas e pagamentos
- Gerenciamento de dados pessoais
- Histórico de consultas
- Sistema de notificações
- Cancelamento de plano

---

### ⚙️ Stack Tecnológica

**Framework e Bibliotecas Core:**
- **Next.js 14+** (App Router) - Framework React com SSR/SSG
- **React 18+** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática e segurança de código
- **Tailwind CSS** - Framework CSS utilitário

**Componentes e UI:**
- **Shadcn/ui** - Componentes acessíveis e customizáveis
- **Lucide-react** - Biblioteca de ícones moderna
- **Framer Motion** - Animações e transições suaves
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas e dados

**Gerenciamento de Estado:**
- **Zustand** ou **Context API** - Estado global da aplicação (dados de usuário, tema, etc.)
- **React Query / TanStack Query** - Cache e sincronização de dados do backend

**Comunicação com Backend:**
- **Axios** - Cliente HTTP para chamadas REST API
- **Socket.io-client** - Comunicação em tempo real (notificações, status de atendimento)
- **JWT (JSON Web Tokens)** - Armazenamento e envio de tokens de autenticação

**Notificações e Feedback:**
- **React Hot Toast** ou **Sonner** - Notificações toast
- **React Toastify** - Alternativa para notificações

**Utilitários:**
- **date-fns** ou **dayjs** - Manipulação de datas
- **clsx** / **class-variance-authority** - Gerenciamento de classes CSS
- **react-input-mask** - Máscaras para inputs (CPF, telefone, etc.)

---

### 🎨 Estilo e Layout

**Estrutura de Layout:**
- **Sidebar fixa à esquerda** (navegação principal com 240px de largura)
- **Topbar fixa no topo** (altura de 64px com modo claro/escuro, perfil e notificações)
- **Layout totalmente responsivo (mobile-first)**
- **Container principal** com padding adequado e max-width para telas grandes

**Paleta de Cores (Baseada no site oficial):**
- **Azul petróleo (Primary):** `#0071BC` - Botões principais, links, destaques
- **Azul escuro (Secondary):** `#005A99` - Headers, sidebar, elementos secundários
- **Verde suave (Success):** `#10B981` - Confirmações, status ativos
- **Vermelho (Danger):** `#EF4444` - Alertas, cancelamentos, erros
- **Amarelo (Warning):** `#F59E0B` - Avisos, pendências
- **Cinza claro (Background):** `#F3F4F6` - Fundo das páginas
- **Branco:** `#FFFFFF` - Cards, modais, áreas de conteúdo
- **Cinza textos:** `#6B7280` - Textos secundários

**Modo Escuro:**
- Fundo principal: `#0D1B2A`
- Fundo secundário: `#1B263B`
- Texto primário: `#F8F9FA`
- Texto secundário: `#ADB5BD`
- Bordas: `#374151`

**Tipografia:**
- **Fonte principal:** `Poppins` ou `Inter` (similar ao site)
- **Tamanhos:**
  - Títulos H1: `2.5rem` (40px)
  - Títulos H2: `2rem` (32px)
  - Títulos H3: `1.5rem` (24px)
  - Corpo: `1rem` (16px)
  - Textos pequenos: `0.875rem` (14px)
- **Pesos:** Regular (400), Medium (500), SemiBold (600), Bold (700)

**Espaçamentos e Dimensões:**
- Padding padrão de cards: `p-6` (24px)
- Gap entre elementos: `gap-4` (16px)
- Border radius: `rounded-xl` (12px) ou `rounded-2xl` (16px)
- Sombras: `shadow-sm`, `shadow-md` para elevação
- Margens responsivas: `mx-auto`, `max-w-7xl`

---

### 🧭 Layout Base

#### Sidebar
- **Menu vertical** com ícones e textos
- **Largura:** 240px (desktop), 100% (mobile drawer)
- **Itens principais:**
  - 🏠 Dashboard  
  - 📅 Consultas (com sub-menu: Agendar, Histórico, Atendimento Imediato)
  - 👥 Dependentes  
  - 💳 Faturas  
  - 👤 Meus Dados  
  - ⚙️ Configurações
  - ❌ Cancelar Plano
  - 🚪 Sair
- **Indicador visual** do item ativo (borda esquerda azul + fundo claro)
- **Avatar e nome do usuário** no topo da sidebar
- **Modo colapsado** (somente ícones) para telas médias
- No mobile, vira um **drawer retrátil** (hamburguer menu)

#### Topbar
- **Alinhamento horizontal** com:
  - Botão hamburguer (mobile) para abrir sidebar
  - Breadcrumb ou título da página atual
  - Barra de busca rápida (opcional)
  - Ícone de notificações com badge de contagem
  - **ThemeToggle** (sol/lua)
  - Avatar do usuário com dropdown (Perfil, Configurações, Sair)
- **Background:** branco (light) / `#1B263B` (dark)
- **Shadow:** `shadow-sm` para separação visual
- **Altura fixa:** 64px

#### Topbar
- **Alinhamento horizontal** com:
  - Botão hamburguer (mobile) para abrir sidebar
  - Breadcrumb ou título da página atual
  - Barra de busca rápida (opcional)
  - Ícone de notificações com badge de contagem
  - **ThemeToggle** (sol/lua)
  - Avatar do usuário com dropdown (Perfil, Configurações, Sair)
- **Background:** branco (light) / `#1B263B` (dark)
- **Shadow:** `shadow-sm` para separação visual
- **Altura fixa:** 64px

#### ThemeToggle
- **Componente:** usa hook `useTheme()` do next-themes ou shadcn/ui
- **Opções:** Light, Dark, System
- **Persistência:** salva preferência no `localStorage`
- **Ícones:** Sun (☀️) para light, Moon (🌙) para dark
- **Transição:** animação suave entre modos

#### Área de Conteúdo Principal
- **Padding responsivo:** `p-4 md:p-6 lg:p-8`
- **Max-width:** `max-w-7xl mx-auto` para telas grandes
- **Background:** `#F3F4F6` (light) / `#0D1B2A` (dark)
- **Min-height:** `calc(100vh - 64px)` (viewport - topbar)

---

### 📱 Responsividade

**Breakpoints Tailwind:**
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (telas grandes)

**Estratégias Mobile-First:**
- Sidebar vira drawer lateral (slide-in animation)
- Tabelas viram cards empilháveis
- Formulários em coluna única (mobile) → 2 colunas (desktop)
- Botões fluidos (w-full) em mobile → tamanho fixo em desktop
- Font-sizes ajustáveis por breakpoint
- Grids responsivos: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

**Gestos Mobile:**
- Swipe para abrir/fechar sidebar
- Pull-to-refresh em listas
- Scroll infinito para históricos longos

---

### 📄 Páginas do Sistema

#### 1. 🔐 Login (`/login`)
- **Campos:**
  - E-mail (validação de formato)
  - Senha (com botão mostrar/ocultar)
- **Elementos:**
  - Logo do sistema
  - Botão "Entrar" (loading state)
  - Link "Esqueci minha senha"
  - Link "Primeiro acesso? Clique aqui"
  - Checkbox "Lembrar-me"
- **Validações:** formulário com Zod + React Hook Form
- **Integração:** chamada POST para `/api/auth/login` do backend
- **Estados:** loading, error, success
- **Redirecionamento:** após login → Dashboard
- **Armazenamento:** token JWT no localStorage ou httpOnly cookie

#### 2. 🆕 Primeiro Acesso (`/primeiro-acesso`)
- **Objetivo:** validar CPF e criar credenciais de acesso
- **Campos:**
  - CPF (com máscara)
  - Botão "Verificar"
- **Fluxo:**
  1. Usuário digita CPF
  2. Frontend envia POST para `/api/auth/validate-cpf`
  3. Backend verifica se há assinatura ativa para esse CPF
  4. Se válido → formulário de criação de senha aparece
  5. Confirmação de senha
  6. E-mail para recuperação
  7. Envio POST para `/api/auth/register` com todos os dados
- **Feedback:** mensagens de sucesso ou erro do backend
- **Validações:** CPF válido (frontend), senhas correspondentes, e-mail único (verificado pelo backend)

#### 3. 🏠 Dashboard (`/dashboard`)
- **Cards informativos:**
  - Status da assinatura (Ativo/Inativo/Pendente)
  - Próxima data de cobrança
  - Número de dependentes cadastrados
  - Consultas realizadas no mês
  - Consultas agendadas próximas
- **Ações rápidas:**
  - Botão destaque "Agendar Consulta"
  - Botão "Atendimento Imediato"
  - Link "Ver todas as faturas"
  - Link "Editar meus dados"
- **Gráficos/Widgets:**
  - Timeline de próximas consultas
  - Histórico de consultas (últimas 5)
  - Notificações recentes
- **Layout:** Grid responsivo com cards estilizados

#### 4. 📅 Agendar Consulta (`/consultas/agendar`)
- **Formulário em etapas (Wizard):**
  1. **Etapa 1:** Selecionar especialidade (dropdown ou cards)
  2. **Etapa 2:** Escolher data (date picker)
  3. **Etapa 3:** Escolher horário (lista de slots disponíveis)
  4. **Etapa 4:** Selecionar para quem (titular ou dependente)
  5. **Etapa 5:** Observações adicionais (textarea)
  6. **Confirmação:** resumo do agendamento
- **Validações:**
  - Horários disponíveis em tempo real
  - Verificar conflitos de agenda
  - Campos obrigatórios
- **Feedback:**
  - Loading ao buscar horários
  - Confirmação visual após agendar
  - E-mail de confirmação (mencionado)
- **Navegação:** botões "Voltar" e "Próximo", barra de progresso

#### 5. 🚑 Atendimento Imediato (`/atendimento-imediato`)
- **Objetivo:** conectar paciente com médico disponível
- **Interface:**
  - Card explicativo do serviço
  - Botão grande "Iniciar atendimento agora"
  - Indicador de médicos disponíveis
  - Tempo médio de espera
- **Fluxo:**
  1. Confirmar início do atendimento
  2. Entrar em fila de espera
  3. Status em tempo real (socket)
  4. Notificação quando médico conectar
  5. Abrir sala de videochamada ou chat
- **Estados:** disponível, em espera, conectado, finalizado
- **Restrições:** verificar se plano permite atendimento imediato

#### 6. 👥 Dependentes (`/dependentes`)
- **Lista de dependentes cadastrados:**
  - Card para cada dependente com:
    - Nome
    - Idade
    - CPF
    - Parentesco
    - Foto/avatar
    - Botões: Editar, Remover
- **Botão flutuante:** "+ Adicionar Dependente"
- **Modal de cadastro:**
  - Nome completo
  - Data de nascimento
  - CPF
  - Grau de parentesco (dropdown)
  - Foto (upload opcional)
- **Validações:**
  - Limite de dependentes por plano
  - CPF válido e único
  - Idade compatível (ex: menores de 18 anos)
- **Ações:** editar, remover (com confirmação), visualizar histórico de consultas

#### 7. 💳 Faturas (`/faturas`)
- **Tabela responsiva** (cards em mobile) com colunas:
  - Data de vencimento
  - Valor
  - Status (Pago, Pendente, Atrasado, Cancelado)
  - Método de pagamento
  - Ações (Ver detalhes, Baixar PDF, 2ª via)
- **Filtros:**
  - Por status
  - Por período (último mês, 3 meses, 6 meses, 1 ano)
  - Busca por valor ou data
- **Indicadores visuais:**
  - Badge colorido por status
  - Destaque para faturas vencidas
- **Modal de detalhes:**
  - Informações completas da fatura
  - Histórico de pagamentos
  - Opção de baixar ou imprimir
- **Integração:** link para gateway de pagamento se houver pendência

#### 8. 👤 Meus Dados (`/meus-dados`)
- **Seções organizadas em tabs ou accordion:**
  
  **Dados Pessoais:**
  - Nome completo
  - E-mail
  - Telefone (com máscara)
  - CPF (somente leitura/bloqueado)
  - Data de nascimento
  - Gênero
  
  **Endereço:**
  - CEP (com busca automática)
  - Logradouro
  - Número
  - Complemento
  - Bairro
  - Cidade
  - Estado
  
  **Segurança:**
  - Alterar senha
  - Autenticação de dois fatores (opcional)
  
  **Foto de Perfil:**
  - Upload de avatar
  - Crop/preview antes de salvar
  
- **Botões:** "Salvar alterações", "Cancelar"
- **Validações:** todos os campos obrigatórios, formatos válidos
- **Feedback:** toast de sucesso ou erro ao salvar

#### 9. ❌ Cancelar Plano (`/cancelar-plano`)
- **Tela de retenção:**
  - Motivos do cancelamento (múltipla escolha)
  - Campo de feedback (opcional)
  - Oferta de desconto ou período gratuito (estratégia de retenção)
- **Informações importantes:**
  - Data de término do acesso
  - Perda de benefícios
  - Consultas agendadas que serão canceladas
  - Política de reembolso (se aplicável)
- **Confirmação em duas etapas:**
  1. Modal de aviso com todas as consequências
  2. Digitação de palavra-chave (ex: "CONFIRMAR") ou senha
- **Botões:**
  - "Manter meu plano" (destaque positivo)
  - "Confirmar cancelamento" (discreto)
- **Pós-cancelamento:** página de feedback e possibilidade de reativação

#### 10. 👨‍⚕️ Histórico de Consultas (`/consultas/historico`)
- **Lista/timeline** de consultas realizadas:
  - Data e hora
  - Especialidade
  - Médico responsável
  - Status (Realizada, Cancelada, Não compareceu)
  - Duração
  - Resumo/observações
- **Filtros:**
  - Por período
  - Por especialidade
  - Por dependente
- **Ações:**
  - Ver detalhes completos
  - Baixar receita (se houver)
  - Baixar atestado (se houver)
  - Reagendar com mesmo médico
  - Avaliar atendimento (estrelas + comentário)
- **Detalhes da consulta:**
  - Informações do médico (CRM, foto)
  - Sintomas relatados
  - Diagnóstico
  - Prescrições
  - Exames solicitados
  - Anexos (PDFs, imagens)

#### 11. 🔔 Notificações (`/notificacoes`)
- **Centro de notificações:**
  - Lista de todas as notificações
  - Marcação de lidas/não lidas
  - Categorias (Consultas, Pagamentos, Avisos, Promoções)
  - Data/hora de cada notificação
- **Tipos de notificação:**
  - Consulta agendada confirmada
  - Lembrete de consulta (24h antes)
  - Fatura gerada
  - Pagamento confirmado
  - Fatura vencida
  - Novo dependente adicionado
  - Alteração nos termos de serviço
- **Ações:** marcar como lida, excluir, abrir contexto relacionado
- **Badge:** contador no ícone da topbar

---

### 🔐 Sistema de Permissões

**Tipos de Usuário:**

1. **Assinante (Titular):**
   - Acesso completo ao próprio perfil
   - Gerenciar dependentes
   - Agendar consultas para si e dependentes
   - Gerenciar pagamentos
   - Cancelar plano

2. **Dependente (se tiver login próprio):**
   - Acesso limitado
   - Ver próprio histórico de consultas
   - Agendar consultas para si (com aprovação do titular?)
   - Não pode gerenciar pagamentos ou outros dependentes

3. **Administrador:**
   - Dashboard administrativo separado (`/admin`)
   - Gerenciar todos os usuários
   - Ver estatísticas globais
   - Gerenciar planos e preços
   - Acessar logs do sistema
   - Suporte e atendimento

**Rotas Protegidas:**
- Middleware de autenticação em todas as rotas privadas
- Redirecionamento para `/login` se não autenticado
- Verificação de permissões por tipo de usuário
- Token JWT ou session-based authentication

---

### 🎨 Padrões de Componentes

**Componentes Reutilizáveis:**

1. **Button**
   - Variantes: primary, secondary, outline, ghost, danger
   - Tamanhos: sm, md, lg
   - Estados: default, hover, active, disabled, loading
   - Com ou sem ícone

2. **Card**
   - Header opcional (título + ação)
   - Body com padding configurável
   - Footer opcional
   - Variantes: default, hover, clickable

3. **Input**
   - Tipos: text, email, password, number, tel, date
   - Com label e mensagem de erro
   - Ícone à esquerda ou direita
   - Máscaras para CPF, telefone, CEP, etc.

4. **Select/Dropdown**
   - Single e multi-select
   - Com busca/filtro
   - Agrupamento de opções
   - Async loading

5. **Modal/Dialog**
   - Tamanhos: sm, md, lg, xl, full
   - Header com título e botão fechar
   - Footer com ações
   - Overlay com backdrop blur
   - Animação de entrada/saída

6. **Table**
   - Responsiva (scroll horizontal ou cards em mobile)
   - Ordenação por colunas
   - Paginação
   - Seleção de linhas (checkbox)
   - Ações por linha (dropdown de 3 pontos)

7. **Badge/Tag**
   - Status: success, warning, danger, info, neutral
   - Tamanhos: sm, md, lg
   - Com ícone opcional
   - Removível (X button)

8. **Breadcrumb**
   - Navegação hierárquica
   - Com separador customizável
   - Último item sem link (página atual)

9. **Skeleton Loader**
   - Para cards, listas, tabelas
   - Animação de shimmer
   - Placeholder durante carregamento

10. **Avatar**
    - Tamanhos variados
    - Fallback com iniciais
    - Status indicator (online/offline)
    - Upload com preview

---
  - Próxima cobrança.
  - Botões: “Agendar Consulta”, “Ver Faturas”, “Editar Dados”.

#### 4. Agendar Consulta
- Formulário com:
  - Especialidade
  - Data
  - Horário
  - Observações
- Botão “Agendar” com feedback visual.

#### 5. Atendimento Imediato
- Botão “Iniciar atendimento agora”.
- Feedback de status.

#### 6. Dependentes
- Lista de dependentes cadastrados.
- Botão “+ Novo dependente”.
- Modal de formulário.

#### 7. Faturas
- Tabela com colunas:
  - Data
  - Valor
  - Status
  - Ações
- Botão “Ver detalhes”.

#### 8. Meus Dados
- Formulário com:
  - Nome
  - E-mail
  - Telefone
  - CPF (bloqueado)
- Botão “Salvar alterações”.

#### 9. Cancelar Plano
- Tela de aviso e confirmação.
- Botão “Confirmar cancelamento”.
- Modal de confirmação com alerta visual.

#### 10. Admin
- Dashboard com gráficos e contadores.
- Página “Planos” (formulário de cadastro).
- Página “Logs” (eventos do sistema).

---

### 🔄 Fluxos de Integração com Backend

> **⚠️ IMPORTANTE:** Esta seção documenta os endpoints que o **BACKEND deve fornecer**.  
> O frontend apenas **CONSOME** esses endpoints via HTTP. A implementação desses endpoints está no projeto backend separado.

**Endpoints Esperados do Backend (API REST):**

**Autenticação:**
- `POST /api/auth/login` - Login com e-mail e senha
- `POST /api/auth/register` - Primeiro acesso (validação CPF)
- `POST /api/auth/forgot-password` - Recuperação de senha
- `POST /api/auth/reset-password` - Redefinir senha
- `POST /api/auth/logout` - Encerrar sessão
- `GET /api/auth/me` - Dados do usuário autenticado

**Usuários:**
- `GET /api/users/profile` - Buscar perfil
- `PUT /api/users/profile` - Atualizar dados pessoais
- `PUT /api/users/avatar` - Upload de foto de perfil
- `PUT /api/users/password` - Alterar senha

**Assinaturas:**
- `GET /api/subscriptions` - Dados da assinatura do usuário
- `POST /api/subscriptions/cancel` - Cancelar plano
- `GET /api/subscriptions/invoices` - Listar faturas
- `GET /api/subscriptions/invoices/:id` - Detalhes de uma fatura
- `GET /api/subscriptions/invoices/:id/pdf` - Download de fatura em PDF

**Dependentes:**
- `GET /api/dependents` - Listar dependentes
- `POST /api/dependents` - Adicionar dependente
- `PUT /api/dependents/:id` - Editar dependente
- `DELETE /api/dependents/:id` - Remover dependente

**Consultas:**
- `GET /api/appointments` - Listar consultas agendadas
- `GET /api/appointments/history` - Histórico de consultas
- `POST /api/appointments` - Agendar nova consulta
- `PUT /api/appointments/:id` - Reagendar consulta
- `DELETE /api/appointments/:id` - Cancelar consulta
- `GET /api/appointments/available-slots` - Horários disponíveis
- `GET /api/appointments/:id/documents` - Receitas e atestados

**Especialidades:**
- `GET /api/specialties` - Listar especialidades médicas

**Atendimento Imediato:**
- `POST /api/immediate-care/request` - Solicitar atendimento
- `GET /api/immediate-care/queue-status` - Status na fila
- `WebSocket /ws/immediate-care` - Conexão em tempo real

**Notificações:**
- `GET /api/notifications` - Listar notificações
- `PUT /api/notifications/:id/read` - Marcar como lida
- `DELETE /api/notifications/:id` - Excluir notificação
- `WebSocket /ws/notifications` - Notificações em tempo real

**Admin:**
- `GET /api/admin/dashboard` - Estatísticas do sistema
- `GET /api/admin/users` - Listar todos os usuários
- `GET /api/admin/plans` - Gerenciar planos
- `POST /api/admin/plans` - Criar novo plano
- `GET /api/admin/logs` - Logs do sistema

**Estrutura de Resposta Padrão:**
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operação realizada com sucesso",
  "errors": []
}
```

**Tratamento de Erros:**
- 400 - Bad Request (validação falhou)
- 401 - Unauthorized (não autenticado)
- 403 - Forbidden (sem permissão)
- 404 - Not Found (recurso não encontrado)
- 500 - Internal Server Error (erro no servidor)

**Exemplos de Consumo no Frontend:**

```typescript
// src/services/auth.service.ts
import api from '@/lib/api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// src/services/appointments.service.ts
export const appointmentsService = {
  list: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  
  create: async (data: CreateAppointmentDto) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  
  getAvailableSlots: async (specialtyId: string, date: string) => {
    const response = await api.get('/appointments/available-slots', {
      params: { specialtyId, date }
    });
    return response.data;
  },
};
```

---

### 🧪 Testes e Qualidade

**Estratégias de Teste:**

1. **Testes Unitários (Jest + React Testing Library):**
   - Componentes isolados
   - Funções utilitárias
   - Hooks customizados
   - Validações de formulário

2. **Testes de Integração:**
   - Fluxos completos de usuário
   - Integração com API (mock)
   - Navegação entre páginas

3. **Testes E2E (Playwright ou Cypress):**
   - Fluxo de login
   - Agendamento de consulta
   - Cadastro de dependente
   - Processo de pagamento

4. **Testes de Acessibilidade (axe-core):**
   - Contraste de cores
   - Navegação por teclado
   - Labels em formulários
   - ARIA attributes

**Qualidade de Código:**
- ESLint (configuração do Next.js + regras personalizadas)
- Prettier (formatação consistente)
- Husky (pre-commit hooks)
- Lint-staged (lint apenas em arquivos modificados)
- TypeScript strict mode

---

### 📊 Métricas e Analytics

**Ferramentas:**
- Google Analytics 4 (GA4)
- Hotjar ou Microsoft Clarity (heatmaps, session recordings)
- Sentry (monitoramento de erros)

**Eventos Importantes para Rastrear:**
- Login realizado
- Consulta agendada
- Cancelamento de consulta
- Dependente adicionado
- Fatura visualizada
- Plano cancelado
- Atendimento imediato solicitado
- Tempo médio de permanência
- Taxa de conversão (primeiro acesso → assinatura)
- Páginas mais visitadas
- Erros mais frequentes

---

### 🚀 Performance e Otimizações

**Next.js Features:**
- **Image Optimization:** uso do componente `<Image>` para otimização automática
- **Font Optimization:** `next/font` para carregar fontes de forma eficiente
- **Code Splitting:** lazy loading de componentes pesados
- **Static Generation (SSG):** páginas estáticas quando possível
- **Incremental Static Regeneration (ISR):** atualização de páginas estáticas
- **Server Components:** componentes React renderizados no servidor (App Router)

**Estratégias:**
- Lazy loading de modais e drawers
- Virtualização de listas longas (react-window ou react-virtual)
- Debounce em campos de busca
- Otimização de imagens (WebP, AVIF)
- Compressão de assets (gzip, brotli)
- CDN para assets estáticos
- Service Worker para cache offline (PWA opcional)
- Bundle analyzer para identificar código desnecessário

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

---

### 🔒 Segurança

**Boas Práticas:**
- **HTTPS obrigatório** em produção
- **Sanitização de inputs** (prevenir XSS)
- **CSRF tokens** em formulários
- **Content Security Policy (CSP)** headers
- **Armazenamento seguro** de tokens (httpOnly cookies ou secure localStorage)
- **Validação no frontend E backend** (nunca confiar apenas no frontend)
- **Rate limiting** para prevenir ataques de força bruta
- **Headers de segurança:** X-Frame-Options, X-Content-Type-Options
- **Dependências atualizadas** (npm audit, Dependabot)
- **Secrets em variáveis de ambiente** (.env files não commitados)

**Proteção de Rotas:**
- Middleware de autenticação
- Verificação de permissões por tipo de usuário
- Timeout de sessão (auto-logout após inatividade)
- Renovação automática de tokens

---

### 📦 Estrutura de Pastas Sugerida

```
frontend/
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/                    # App Router (Next.js 14+)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── primeiro-acesso/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── consultas/
│   │   │   ├── dependentes/
│   │   │   ├── faturas/
│   │   │   ├── meus-dados/
│   │   │   └── cancelar-plano/
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # Shadcn components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── forms/
│   │   ├── cards/
│   │   └── modals/
│   ├── lib/
│   │   ├── api.ts              # Axios config
│   │   ├── utils.ts
│   │   ├── validators.ts       # Zod schemas
│   │   └── firebase.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   └── useNotifications.ts
│   ├── store/                  # Zustand ou Context
│   │   ├── authStore.ts
│   │   └── userStore.ts
│   ├── types/
│   │   ├── user.ts
│   │   ├── appointment.ts
│   │   └── subscription.ts
│   ├── styles/
│   │   └── globals.css
│   └── constants/
│       ├── routes.ts
│       └── colors.ts
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

### 🛠️ Configuração Inicial do Projeto

**1. Criar projeto Next.js:**
```bash
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
```

**2. Instalar dependências principais:**
```bash
npm install lucide-react framer-motion axios zustand react-hook-form zod date-fns clsx @tanstack/react-query socket.io-client
```

**3. Configurar Shadcn/ui:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select dialog toast avatar badge table skeleton
```

**4. Configurar variáveis de ambiente (.env.local):**
```env
# URL do Backend (API REST)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# URL do WebSocket (notificações em tempo real)
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Configurações opcionais
NEXT_PUBLIC_APP_NAME=Médicos Consultas Online
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**5. Criar arquivo .env.example (para documentar):**
```env
# Copie este arquivo para .env.local e preencha com os valores corretos

# URL do Backend - altere para produção quando fizer deploy
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# URL do WebSocket
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Nome da aplicação
NEXT_PUBLIC_APP_NAME=Médicos Consultas Online
```

**6. Executar projeto:**
```bash
npm run dev
# Frontend rodando em http://localhost:3000
```

> **⚠️ ATENÇÃO:** Para o frontend funcionar completamente, você precisa:
> 1. ✅ Ter o **backend rodando** (geralmente em http://localhost:3001)
> 2. ✅ Configurar a variável `NEXT_PUBLIC_API_URL` no `.env.local` apontando para o backend
> 3. ✅ Garantir que o backend está aceitando requisições do frontend (CORS configurado)

---

### 🚀 Desenvolvimento Local (Frontend + Backend)

**Passo a passo para rodar o projeto completo:**

```bash
# Terminal 1 - Backend
cd ../backend
npm install
npm run dev
# Backend rodando em http://localhost:3001

# Terminal 2 - Frontend (este projeto)
cd ../frontend
npm install
npm run dev
# Frontend rodando em http://localhost:3000
```

**Testando a conexão:**
1. Acesse http://localhost:3000
2. Tente fazer login
3. Verifique no Network do DevTools se as requisições estão indo para http://localhost:3001/api
4. Se der erro de CORS, configure no backend

---

**7. Configurar cliente HTTP (criar `src/lib/api.ts`):**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - redirecionar para login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
export default api;
```

---

### 🔌 Integração Frontend ↔ Backend

**Responsabilidades do Frontend:**
- ✅ Validação de dados no cliente (formato, campos obrigatórios)
- ✅ Interface do usuário (UI/UX)
- ✅ Armazenamento temporário de token JWT
- ✅ Envio de requisições HTTP para o backend
- ✅ Exibição de dados recebidos do backend
- ✅ Tratamento de erros retornados pelo backend
- ✅ Animações e feedback visual ao usuário

**Responsabilidades do Backend (NÃO faça no frontend):**
- ❌ Validação definitiva de dados (segurança)
- ❌ Autenticação e autorização
- ❌ Conexão com banco de dados
- ❌ Lógica de negócios (cálculos, regras)
- ❌ Envio de e-mails
- ❌ Geração de PDFs (receitas, atestados)
- ❌ Integração com gateways de pagamento
- ❌ Criptografia de senhas

**Exemplo de Fluxo (Login):**
```
1. Usuário digita e-mail e senha no frontend
2. Frontend valida formato (e-mail válido, senha não vazia)
3. Frontend envia POST para backend: /api/auth/login
4. Backend valida credenciais no banco de dados
5. Backend gera token JWT e retorna para frontend
6. Frontend armazena token no localStorage
7. Frontend redireciona para /dashboard
8. Toda requisição seguinte inclui o token no header Authorization
```

---

### 📝 Checklist de Desenvolvimento

**Fase 1 - Estrutura Base:**
- [ ] Criar projeto Next.js com TypeScript
- [ ] Configurar Tailwind CSS com paleta de cores
- [ ] Instalar Shadcn/ui e componentes base
- [ ] Criar layout base (Sidebar + Topbar)
- [ ] Implementar ThemeToggle (dark mode)
- [ ] Configurar roteamento (App Router)

**Fase 2 - Integração com Backend:**
- [ ] Configurar cliente Axios (src/lib/api.ts)
- [ ] Configurar variáveis de ambiente (.env.local)
- [ ] Criar interceptors para JWT
- [ ] Testar conexão com backend (health check)
- [ ] Implementar tratamento de erros HTTP

**Fase 3 - Autenticação:**
- [ ] Página de Login (integração com POST /api/auth/login)
- [ ] Página de Primeiro Acesso (POST /api/auth/register)
- [ ] Sistema de proteção de rotas (middleware)
- [ ] Hook useAuth customizado (gerenciar estado de autenticação)
- [ ] Recuperação de senha (POST /api/auth/forgot-password)
- [ ] Logout (limpar token e redirecionar)

**Fase 4 - Dashboard e Páginas Principais:**
- [ ] Dashboard com cards informativos
- [ ] Página de Agendamento de Consultas
- [ ] Página de Atendimento Imediato
- [ ] Página de Dependentes
- [ ] Página de Faturas
- [ ] Página Meus Dados

**Fase 4 - Funcionalidades Avançadas:**
- [ ] Histórico de Consultas
- [ ] Sistema de Notificações
- [ ] WebSocket para real-time
- [ ] Upload de arquivos (avatar, documentos)
- [ ] Cancelamento de Plano
- [ ] Painel Admin (se aplicável)

**Fase 5 - Refinamento:**
- [ ] Responsividade em todos os breakpoints
- [ ] Animações e transições
- [ ] Loading states e skeleton loaders
- [ ] Tratamento de erros
- [ ] Validações de formulários
- [ ] Testes unitários

**Fase 6 - Otimização e Deploy:**
- [ ] Otimização de performance
- [ ] SEO (meta tags, sitemap)
- [ ] Analytics e tracking
- [ ] Configurar CI/CD
- [ ] Deploy em Vercel ou servidor
- [ ] Monitoramento de erros (Sentry)

---

### 🌐 Deploy e Infraestrutura

**Opções de Deploy:**

1. **Vercel (Recomendado para Next.js):**
   - Deploy automático a cada commit
   - Preview deployments para PRs
   - Edge functions
   - Analytics integrado
   - Domínio customizado gratuito

2. **Netlify:**
   - Similar ao Vercel
   - Bom para sites estáticos
   - Functions serverless

3. **AWS (EC2 + S3 + CloudFront):**
   - Mais controle
   - Escalabilidade
   - Custos variáveis

4. **Docker + VPS:**
   - Controle total
   - Servidor próprio
   - Requer mais configuração

**Variáveis de Ambiente em Produção:**
- Configurar todas as env vars no painel do Vercel/Netlify
- Separar configs de dev, staging e production
- Usar secrets manager para dados sensíveis

**CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        run: vercel --prod
```

---

### 📚 Documentação e Recursos

**Links Úteis:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

**Boas Práticas de Código:**
- Componentes pequenos e reutilizáveis
- Nomenclatura clara e descritiva
- Comentários apenas quando necessário
- Evitar prop drilling (usar Context ou Zustand)
- Preferir composição a herança
- DRY (Don't Repeat Yourself)
- SOLID principles
- Commits semânticos (Conventional Commits)

---

### 🎯 Próximos Passos

1. **Definir MVP (Minimum Viable Product):**
   - Priorizar funcionalidades essenciais
   - Login + Dashboard + Agendamento
   - Lançar versão beta para testes

2. **Roadmap Futuro:**
   - App mobile (React Native ou Flutter)
   - Integração com wearables (Apple Watch, Fitbit)
   - Telemedicina com vídeo integrado
   - Prontuário eletrônico completo
   - Integração com laboratórios
   - Programa de fidelidade
   - Chat com IA para triagem inicial

3. **Melhorias Contínuas:**
   - A/B testing de interfaces
   - Feedback constante dos usuários
   - Análise de métricas
   - Otimização baseada em dados
   - Atualização de dependências
   - Refatoração de código legado

---

**Última atualização:** 06/11/2025  
**Versão do documento:** 2.0