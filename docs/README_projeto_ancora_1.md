# README do Projeto Ancora 1

## Objetivo

Este documento resume o estado atual do Sistema Web de Agendamento e Gestao para Pequenas Empresas e serve como referencia de alto nivel para escopo, fluxo funcional e execucao.

## Estado atual

O projeto ja possui MVP funcional localmente, com backend e frontend integrados.

Implementado:

- login com JWT
- perfis `admin`, `attendant` e `client`
- usuarios administrativos
- clientes
- servicos
- agendamentos com conflito bloqueado
- pagamentos manuais
- dashboard
- healthcheck
- Swagger
- logs estruturados
- filtro global de excecoes
- artefatos de deploy inicial

## Principais funcionalidades

- autenticacao de usuarios
- controle de acesso por perfil
- cadastro e gerenciamento de clientes
- cadastro e gerenciamento de servicos
- criacao, cancelamento e reagendamento de agendamentos
- validacao de conflito de agenda
- registro de pagamentos
- painel administrativo com visao operacional
- observabilidade basica

## Perfis de acesso

### Administrador

- gerencia usuarios
- gerencia servicos
- visualiza agenda completa
- acompanha pagamentos
- acessa indicadores do dashboard

### Atendente

- realiza agendamentos
- consulta clientes
- consulta servicos
- registra pagamentos
- acessa dashboard

### Cliente

- realiza login
- cria agendamentos proprios
- consulta seus agendamentos
- cancela ou reagenda os proprios agendamentos

## Stack

### Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- NestJS

### Banco de dados

- PostgreSQL
- Prisma ORM

### Testes

- Jest
- Supertest

### Infra e deploy

- Docker
- Vercel para frontend
- Render, Railway ou Docker para backend

## Rotas principais implementadas

### Autenticacao

- `POST /api/auth/login`

### Usuarios

- `GET /api/users/me`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `PATCH /api/users/:id/activate`
- `PATCH /api/users/:id/deactivate`

### Clientes

- `GET /api/clients`
- `POST /api/clients`
- `GET /api/clients/:id`
- `PATCH /api/clients/:id`
- `PATCH /api/clients/:id/deactivate`

### Servicos

- `GET /api/services`
- `POST /api/services`
- `GET /api/services/:id`
- `PATCH /api/services/:id`
- `PATCH /api/services/:id/activate`
- `PATCH /api/services/:id/deactivate`

### Agendamentos

- `GET /api/appointments`
- `POST /api/appointments`
- `GET /api/appointments/:id`
- `PATCH /api/appointments/:id/cancel`
- `PATCH /api/appointments/:id/reschedule`

### Pagamentos

- `GET /api/payments`
- `GET /api/payments/:id`
- `POST /api/payments`
- `PATCH /api/payments/:id`

### Dashboard

- `GET /api/dashboard`

### Monitoramento

- `GET /api/health`

## Execucao local resumida

### Banco

```bash
docker compose up -d
```

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Enderecos locais

- frontend: `http://localhost:3000`
- backend: `http://localhost:3333/api`
- swagger: `http://localhost:3333/api`
- healthcheck: `http://localhost:3333/api/health`

## Credenciais locais

- `admin@example.com` / `Admin@123456`
- `attendant@example.com` / `Attendant@123456`
- `client@example.com` / `Client@123456`

## Observabilidade

O backend inclui:

- logs estruturados
- log de requisicoes
- filtro global de excecoes
- mensagens padronizadas de falha
- endpoint de healthcheck

## Deploy

O projeto possui artefatos iniciais de publicacao e um guia especifico em [docs/deploy_inicial_projeto_ancora_1.md](/home/publio/projetos/agendamento-saas/docs/deploy_inicial_projeto_ancora_1.md:1).
