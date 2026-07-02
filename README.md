# Scheduling SaaS for Small Businesses

Full-stack scheduling and operations system for small service businesses.

This project is a portfolio-ready SaaS-style demo built to show practical product engineering, not only isolated CRUD screens. It includes role-based authentication, client and service management, appointment scheduling, payment tracking, and an operational dashboard. It is intended for recruiters, technical reviewers, and freelance clients evaluating real business software delivery.

## Live Portfolio Demo

Public deployment pending.

Current demo mode:

- Local frontend: `http://localhost:3000`
- Local backend health: `http://localhost:3333/api/health`
- Local API docs: `http://localhost:3333/api`

If port `3000` is already in use, the frontend may start on `http://localhost:3001`.

Target public stack for the next release:

- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL

## Demo Users

```text
Admin
admin@example.com
Admin@123456

Attendant
attendant@example.com
Attendant@123456

Client
client@example.com
Client@123456
```

These accounts are created by the local seed and use synthetic demo data only.

## For Recruiters

This project demonstrates practical full-stack software engineering in a business-oriented scenario, including:

- Next.js frontend development with protected application flows
- NestJS backend API design
- PostgreSQL relational modeling with Prisma
- JWT authentication and role-based authorization
- scheduling business rules and conflict prevention
- admin, attendant, and client product flows
- operational dashboard design
- validation, testing, and local developer experience
- documentation and portfolio-oriented project packaging

It is meant to show the ability to build complete business software, not only UI mockups or generic tutorial CRUD.

## For Clients

This project shows how a real scheduling workflow can be turned into a working web product with separate roles, operational visibility, and customer self-service.

It can be adapted into solutions such as:

- appointment systems for clinics or salons
- admin panels for service businesses
- customer portals for bookings and schedule follow-up
- internal operations dashboards
- scheduling tools for consultants and local businesses
- service management platforms with staff and customer views

## What It Demonstrates

- full-stack application structure with separate frontend and backend
- role-based access for admin, attendant, and client users
- appointment creation, cancellation, and rescheduling
- backend conflict validation for time slots
- payment registration and status updates
- operational dashboard with day-level business visibility
- structured logging and global error handling
- Swagger API documentation and healthcheck support
- seeded local demo environment for repeatable reviews

## Screenshots

Screenshots are planned as the next portfolio-polish step and are not yet included in the repository.

Planned capture set:

- login
- admin dashboard
- users
- clients
- services
- appointments
- payments
- client appointments
- new client booking

## Main Features

- JWT login with profile-based navigation
- user management for internal accounts
- client management with list, detail, update, and deactivation flows
- service management with activation and deactivation
- appointment scheduling with reschedule and cancel actions
- conflict prevention in the backend
- payment registration and updates
- administrative dashboard
- client self-service for booking and reviewing personal appointments

## Tech Stack

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

### Testing

- Jest
- Supertest

### Deployment Readiness

- Docker
- Docker Compose
- production Dockerfiles for frontend and backend
- Vercel project config for the frontend

## Architecture

```text
Browser
  -> Next.js frontend
  -> NestJS backend
  -> PostgreSQL via Prisma
```

The frontend is responsible for authentication state, protected navigation, forms, and API consumption. The backend owns authentication, authorization, business rules, persistence, healthcheck, Swagger docs, and operational logging.

## API Highlights

### Authentication

- `POST /api/auth/login`

### Users

- `GET /api/users/me`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id`
- `PATCH /api/users/:id/activate`
- `PATCH /api/users/:id/deactivate`

### Clients

- `GET /api/clients`
- `POST /api/clients`
- `GET /api/clients/:id`
- `PATCH /api/clients/:id`
- `PATCH /api/clients/:id/deactivate`

### Services

- `GET /api/services`
- `POST /api/services`
- `GET /api/services/:id`
- `PATCH /api/services/:id`
- `PATCH /api/services/:id/activate`
- `PATCH /api/services/:id/deactivate`

### Appointments

- `GET /api/appointments`
- `POST /api/appointments`
- `GET /api/appointments/:id`
- `PATCH /api/appointments/:id/cancel`
- `PATCH /api/appointments/:id/reschedule`

### Payments

- `GET /api/payments`
- `GET /api/payments/:id`
- `POST /api/payments`
- `PATCH /api/payments/:id`

### Dashboard

- `GET /api/dashboard`

### Monitoring

- `GET /api/health`

## Local Demo

Recommended review path:

1. Sign in as `admin@example.com`.
2. Open the dashboard and review the day-level operational summary.
3. Visit services and confirm the available catalog.
4. Visit clients and inspect the operational customer records.
5. Create or review an appointment.
6. Register or inspect a payment.
7. Sign out and log in as `client@example.com`.
8. Review personal appointments and the self-service booking flow.

## Local Development

### 1. Start the database

From the project root:

```bash
docker compose up -d
```

### 2. Create local environment files

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3. Run the backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Open:

```text
API: http://localhost:3333/api
Swagger: http://localhost:3333/api
Healthcheck: http://localhost:3333/api/health
```

### 4. Run the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
Frontend: http://localhost:3000
```

## Environment Variables

This project uses three local environment files:

- root `.env`
- `backend/.env`
- `frontend/.env.local`

Important values:

```env
# root .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=agendamento_db
POSTGRES_PORT=5434
```

```env
# backend/.env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/agendamento_db?schema=public
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
DATABASE_SSL_REJECT_UNAUTHORIZED=true
```

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

## Validation

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

## Documentation

- [Project overview](docs/README_projeto_ancora_1.md)
- [MVP scope](docs/escopo_mvp_projeto_ancora_1.md)
- [Architecture](docs/arquitetura_projeto_ancora_1.md)
- [Local environment architecture](docs/arquitetura_ambiente_local_projeto_ancora_1.md)
- [Database modeling](docs/modelagem_banco_projeto_ancora_1.md)
- [Screen flows](docs/fluxos_telas_projeto_ancora_1.md)
- [Deployment guide](docs/deploy_inicial_projeto_ancora_1.md)
- [Public demo deployment](docs/public_demo_deployment.md)
- [Final MVP review](docs/revisao_final_aderencia_mvp.md)
- [Class diagram](docs/diagrama_classes_mermaid.html)

## Demo Safety

- Demo users and records are synthetic.
- Do not use real customer data or secrets in local or future public demo environments.
- This repository is presented as a portfolio MVP, not as a production-ready hardened SaaS.
- Public deployment is not active at this time.

## Known Limitations

- no public demo URL yet
- screenshots are not yet included
- no automated notifications
- no advanced calendar view
- no payment gateway integration
- no multi-tenant architecture

## Roadmap

- add screenshots and a short demo video
- publish optional public demo
- add richer calendar and availability views
- expand operational reports
- add optional notification flows
- improve mobile showcase and portfolio assets

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
