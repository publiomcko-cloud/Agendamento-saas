# Case Study

## Project

`Scheduling SaaS for Small Businesses`

## Context

Small service businesses often manage appointments, customers, services, and payments across disconnected tools: spreadsheets, messaging apps, paper notes, and manual reminders.

This creates operational friction:

- staff lose visibility of the day schedule
- customers depend on manual communication to confirm appointments
- payments are hard to track against appointments
- business owners lack a simple operational dashboard
- customer records and appointment history stay fragmented

## Goal

Build a full-stack portfolio MVP that demonstrates how this workflow can become a usable web system with clear roles, real business rules, persistent data, and public deployment.

The project is not intended to be a production SaaS platform. It is a realistic MVP designed to show engineering judgment, product thinking, and end-to-end delivery.

## Solution

The system provides:

- public login with demo users
- admin, attendant, and client roles
- client management
- service management
- appointment scheduling
- conflict prevention in the backend
- payment tracking
- dashboard with operational visibility
- client self-service booking
- public demo deployment

## User Roles

### Admin

The admin can manage users, services, clients, appointments, payments, and dashboard data.

### Attendant

The attendant can work with daily operations: clients, services, appointments, payments, and dashboard review.

### Client

The client can view personal appointments and create a new booking through a self-service flow.

## Architecture

```text
Browser
  -> Next.js frontend
  -> NestJS backend
  -> PostgreSQL via Prisma
```

Public deployment:

```text
Vercel frontend
  -> Render backend
  -> Supabase PostgreSQL
```

## Technical Decisions

### Next.js frontend

Chosen for a modern React application structure, protected routes, deployment simplicity on Vercel, and a clean portfolio presentation.

### NestJS backend

Chosen for modular API organization, dependency injection, guards, decorators, validation pipes, Swagger integration, and maintainable business logic.

### Prisma with PostgreSQL

Chosen for typed data access, schema migrations, relational modeling, and simple setup for local and remote PostgreSQL.

### JWT authentication

Chosen because the MVP needs role-based access without the complexity of a third-party identity provider.

### Role-based authorization

The system separates `admin`, `attendant`, and `client` flows to demonstrate realistic multi-user business software.

### Manual payment tracking

The MVP records payment state manually instead of integrating a payment gateway. This keeps the scope focused while still proving the financial workflow.

## Trade-offs

### No multi-tenant model

The project intentionally avoids multi-tenant complexity. The goal is to demonstrate one business operation clearly before adding multi-company architecture.

### No payment gateway

Payment gateway integration is outside the MVP. Manual payments are enough to show the relationship between appointments and financial state.

### No advanced calendar UI

The appointment module uses operational lists and filters instead of a full calendar component. This keeps the interface simpler and avoids calendar-specific complexity.

### Supabase TLS no-verify for demo

The Render demo uses `sslmode=no-verify` with Supabase to avoid certificate-chain issues in the public portfolio environment. For production, the stricter path would be configuring the CA certificate explicitly.

### Render free tier

The backend runs on Render free tier, so cold starts can happen. This is acceptable for a portfolio demo but would need review for production usage.

## Business Value

The MVP shows how a small business could move from fragmented scheduling to a single operational system:

- centralized clients
- clear service catalog
- appointment visibility
- customer self-service
- payment status tracking
- operational dashboard

It can be adapted for clinics, salons, consultancies, studios, tutors, local service teams, and other appointment-based operations.

## Engineering Value

This project demonstrates:

- full-stack product delivery
- modular backend API design
- database modeling
- authentication and authorization
- business rules in the backend
- frontend protected routes
- public deployment
- demo data strategy
- documentation for reviewers
- portfolio packaging

## Outcome

The project is ready as a public portfolio MVP.

Reviewers can open the demo, use seeded accounts, inspect the API docs, view screenshots, watch the recorded demo video, and follow the documented demo flow without needing to run the project locally.

## Future Improvements

- smoke test for the public deployment
- richer calendar view
- availability rules
- notification workflow
- payment gateway integration
- multi-tenant architecture
