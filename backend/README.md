# Backend

API NestJS do sistema de agendamento e gestao para pequenas empresas, concluida como parte do MVP de portfolio.

## Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Jest e Supertest

## Funcionalidades

- autenticacao com JWT
- autorizacao por perfil: `admin`, `attendant`, `client`
- gestao de usuarios
- gestao de clientes
- gestao de servicos
- agendamentos com bloqueio de conflito
- pagamentos manuais
- dashboard administrativo
- healthcheck
- Swagger
- logs estruturados e filtro global de excecoes

## Requisitos

- Node.js 22+
- npm
- PostgreSQL acessivel

## Ambiente local

Crie o arquivo `backend/.env` com base em `backend/.env.example`.

Exemplo:

```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/agendamento_db?schema=public
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
```

Observacao:
o projeto usa `5434` por padrao nos exemplos atuais para evitar conflito com outras stacks locais que ja ocupam `5432`.

## Instalar dependencias

```bash
cd backend
npm install
```

## Rodar localmente

Gerar client do Prisma:

```bash
npx prisma generate
```

Aplicar migracoes:

```bash
npx prisma migrate dev
```

Popular base local:

```bash
npx prisma db seed
```

Subir em desenvolvimento:

```bash
npm run start:dev
```

## Endpoints principais

Base local:

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

Rotas principais implementadas:

- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `PATCH /api/users/:id/activate`
- `PATCH /api/users/:id/deactivate`
- `GET /api/clients`
- `POST /api/clients`
- `PATCH /api/clients/:id`
- `PATCH /api/clients/:id/deactivate`
- `GET /api/services`
- `POST /api/services`
- `PATCH /api/services/:id`
- `PATCH /api/services/:id/activate`
- `PATCH /api/services/:id/deactivate`
- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/cancel`
- `PATCH /api/appointments/:id/reschedule`
- `GET /api/payments`
- `POST /api/payments`
- `PATCH /api/payments/:id`
- `GET /api/dashboard`

## Credenciais seed de desenvolvimento

- `admin@example.com` / `Admin@123456`
- `attendant@example.com` / `Attendant@123456`
- `client@example.com` / `Client@123456`

## Testes

Unitarios:

```bash
npm test
```

E2E:

```bash
npm run test:e2e
```

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

## Deploy

O backend possui `Dockerfile` proprio em [backend/Dockerfile](Dockerfile).

Para o objetivo atual de portfolio, o backend ja esta concluido para uso local e demo publica. Para detalhes de publicacao, consulte [docs/initial_deployment.md](../docs/initial_deployment.md).
