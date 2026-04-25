# Sistema Web de Agendamento e Gestao para Pequenas Empresas

Aplicacao full-stack para gestao de agenda, clientes, servicos e pagamentos, pensada como projeto de portfolio com fluxo ponta a ponta.

## Status

MVP funcional localmente.

Ja implementado:

- autenticacao com JWT
- perfis `admin`, `attendant` e `client`
- gestao de usuarios
- gestao de clientes
- gestao de servicos
- criacao, cancelamento e reagendamento de agendamentos
- bloqueio de conflito de horario
- registro e atualizacao de pagamentos
- dashboard administrativo
- frontend com navegacao por perfil
- healthcheck
- Swagger
- logs estruturados
- filtro global de excecoes
- seed de desenvolvimento
- testes criticos de backend
- artefatos iniciais de deploy

## Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL

### Testes

- Jest
- Supertest

### Deploy

- Docker
- Vercel para frontend
- Render, Railway ou Docker para backend

## Estrutura do projeto

```text
.
├── backend
├── frontend
├── docs
├── docker-compose.yml
├── docker-compose.prod.yml
└── to-do.md
```

## Como rodar localmente

### 1. Subir o banco

Na raiz do projeto:

```bash
docker compose up -d
```

### 2. Configurar variaveis de ambiente

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

API local:

```text
http://localhost:3333/api
```

Swagger:

```text
http://localhost:3333/api
```

Healthcheck:

```text
http://localhost:3333/api/health
```

### 4. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend local:

```text
http://localhost:3000
```

## Credenciais seed de desenvolvimento

- `admin@example.com` / `Admin@123456`
- `attendant@example.com` / `Attendant@123456`
- `client@example.com` / `Client@123456`

## Funcionalidades por perfil

### Admin

- gerencia usuarios
- gerencia clientes
- gerencia servicos
- gerencia agendamentos
- registra e atualiza pagamentos
- acessa dashboard

### Attendant

- consulta clientes
- consulta servicos
- cria, cancela e reagenda agendamentos na agenda operacional
- registra e atualiza pagamentos
- acessa dashboard

### Client

- faz login
- cria agendamento proprio
- consulta os proprios agendamentos
- cancela ou reagenda seus proprios agendamentos

## Endpoints principais

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

## Observabilidade

O backend hoje inclui:

- logs estruturados em JSON
- log de requisicoes concluídas
- filtro global de excecoes
- payload padronizado de erro
- endpoint de healthcheck

## Testes

Backend:

```bash
cd backend
npm run lint
npm test
npm run test:e2e
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Deploy

Artefatos incluidos:

- [backend/Dockerfile](/home/publio/projetos/agendamento-saas/backend/Dockerfile:1)
- [frontend/Dockerfile](/home/publio/projetos/agendamento-saas/frontend/Dockerfile:1)
- [docker-compose.prod.yml](/home/publio/projetos/agendamento-saas/docker-compose.prod.yml:1)

Guia de publicacao:

- [docs/deploy_inicial_projeto_ancora_1.md](/home/publio/projetos/agendamento-saas/docs/deploy_inicial_projeto_ancora_1.md:1)

## Documentacao complementar

- [docs/diagrama_classes_mermaid.md](/home/publio/projetos/agendamento-saas/docs/diagrama_classes_mermaid.md:1)
- [docs/instrucoes_para_agente.md](/home/publio/projetos/agendamento-saas/docs/instrucoes_para_agente.md:1)
- [docs/README_projeto_ancora_1.md](/home/publio/projetos/agendamento-saas/docs/README_projeto_ancora_1.md:1)
- [docs/deploy_inicial_projeto_ancora_1.md](/home/publio/projetos/agendamento-saas/docs/deploy_inicial_projeto_ancora_1.md:1)
