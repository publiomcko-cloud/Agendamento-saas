# SaaS de Agendamento para Pequenos Negocios

Sistema full-stack de agendamento e gestao operacional para pequenos negocios de servicos.

Este projeto e uma demo SaaS-like pronta para portfolio, criada para demonstrar engenharia de produto na pratica, nao apenas telas CRUD isoladas. Ele inclui autenticacao por perfil, gestao de clientes e servicos, agendamentos, acompanhamento de pagamentos e dashboard operacional. O projeto foi pensado para recrutadores, revisores tecnicos e potenciais clientes que querem avaliar a entrega de um software de negocio completo.

## Demo Publica de Portfolio

Demo publica:

- Frontend: https://agendamento-saas-sigma.vercel.app
- Backend health: https://agendamento-saas-api.onrender.com/api/health
- API docs: https://agendamento-saas-api.onrender.com/api
- Video demo: https://youtu.be/TbuewDJhGYs

Demo local:

- Frontend local: `http://localhost:3000`
- Backend health local: `http://localhost:3333/api/health`
- API docs local: `http://localhost:3333/api`

Se a porta `3000` ja estiver em uso, o frontend pode iniciar em `http://localhost:3001`.

Stack publica:

- Frontend: Vercel
- Backend: Render
- Banco de dados: Supabase PostgreSQL

## Usuarios Demo

```text
Admin
admin@example.com
Admin@123456

Atendente
attendant@example.com
Attendant@123456

Cliente
client@example.com
Client@123456
```

Essas contas sao criadas pelo seed local e usam apenas dados sinteticos de demonstracao.

## Para Recrutadores

Este projeto demonstra engenharia full-stack aplicada a um cenario de negocio, incluindo:

- frontend em Next.js com fluxos protegidos
- design de API backend com NestJS
- modelagem relacional em PostgreSQL com Prisma
- autenticacao JWT e autorizacao por perfil
- regras de agendamento e prevencao de conflitos
- fluxos de produto para admin, atendente e cliente
- dashboard operacional
- validacao, testes e experiencia de desenvolvimento local
- documentacao e empacotamento orientado a portfolio

A proposta e mostrar capacidade de construir software de negocio completo, nao apenas mockups de UI ou CRUD generico de tutorial.

## Para Clientes

Este projeto mostra como um fluxo real de agendamento pode virar um produto web funcional com perfis separados, visibilidade operacional e autosservico para clientes.

Ele pode ser adaptado para solucoes como:

- sistemas de agendamento para clinicas ou saloes
- paineis administrativos para negocios de servicos
- portais de clientes para reservas e acompanhamento
- dashboards internos de operacao
- ferramentas de agenda para consultores e negocios locais
- plataformas de gestao de servicos com equipe e area do cliente

## O Que o Projeto Demonstra

- estrutura full-stack com frontend e backend separados
- acesso por perfil para usuarios admin, atendente e cliente
- criacao, cancelamento e reagendamento de agendamentos
- validacao de conflito de horario no backend
- registro e atualizacao de pagamentos
- dashboard operacional com visibilidade do dia
- logs estruturados e filtro global de erros
- documentacao Swagger da API e healthcheck
- ambiente local com seed para revisoes repetiveis

## Capturas de Tela

| Login | Dashboard |
| --- | --- |
| ![Login e contas demo](docs/screenshots/01-login.png) | ![Dashboard admin com metricas operacionais](docs/screenshots/02-dashboard.png) |

| Usuarios | Clientes |
| --- | --- |
| ![Gestao administrativa de usuarios](docs/screenshots/03-users.png) | ![Tela de gestao de clientes](docs/screenshots/04-clients.png) |

| Servicos | Agendamentos |
| --- | --- |
| ![Gestao do catalogo de servicos](docs/screenshots/05-services.png) | ![Agenda operacional de atendimentos](docs/screenshots/06-appointments.png) |

| Pagamentos | Area do Cliente |
| --- | --- |
| ![Tela de acompanhamento de pagamentos](docs/screenshots/07-payments.png) | ![Tela de agendamentos do cliente](docs/screenshots/08-my-appointments.png) |

| Novo Agendamento | Dashboard Mobile |
| --- | --- |
| ![Fluxo de agendamento pelo cliente](docs/screenshots/09-book-appointment.png) | ![Visao mobile do dashboard](docs/screenshots/10-mobile-dashboard.png) |

## Funcionalidades Principais

- login JWT com navegacao baseada em perfil
- gestao de usuarios internos
- gestao de clientes com listagem, detalhe, edicao e inativacao
- gestao de servicos com ativacao e desativacao
- agendamentos com reagendamento e cancelamento
- prevencao de conflitos no backend
- registro e atualizacao de pagamentos
- dashboard administrativo
- autosservico do cliente para criar e revisar agendamentos

## Stack Tecnica

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

### Deploy e Operacao

- Docker
- Docker Compose
- Dockerfiles de producao para frontend e backend
- configuracao de projeto Vercel para o frontend

## Arquitetura

```text
Browser
  -> Frontend Next.js
  -> Backend NestJS
  -> PostgreSQL via Prisma
```

O frontend e responsavel por estado de autenticacao, navegacao protegida, formularios e consumo da API. O backend concentra autenticacao, autorizacao, regras de negocio, persistencia, healthcheck, Swagger e logs operacionais.

## Destaques da API

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

## Demo Local

Roteiro recomendado para revisao:

1. Entrar como `admin@example.com`.
2. Abrir o dashboard e revisar o resumo operacional do dia.
3. Acessar servicos e confirmar o catalogo disponivel.
4. Acessar clientes e inspecionar os registros.
5. Criar ou revisar um agendamento.
6. Registrar ou inspecionar um pagamento.
7. Sair e entrar como `client@example.com`.
8. Revisar agendamentos pessoais e o fluxo de autoagendamento.

## Desenvolvimento Local

### 1. Subir o banco

A partir da raiz do projeto:

```bash
docker compose up -d
```

### 2. Criar arquivos de ambiente locais

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3. Rodar o backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Abrir:

```text
API: http://localhost:3333/api
Swagger: http://localhost:3333/api
Healthcheck: http://localhost:3333/api/health
```

### 4. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir:

```text
Frontend: http://localhost:3000
```

## Variaveis de Ambiente

Este projeto usa tres arquivos de ambiente locais:

- `.env` na raiz
- `backend/.env`
- `frontend/.env.local`

Valores importantes:

```env
# .env na raiz
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

## Validacao

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

## Documentacao

- [Visao geral do projeto](docs/project_overview.md)
- [Escopo do MVP](docs/mvp_scope.md)
- [Arquitetura](docs/architecture.md)
- [Arquitetura do ambiente local](docs/local_environment_architecture.md)
- [Modelagem de banco](docs/database_modeling.md)
- [Fluxos de telas](docs/screen_flows.md)
- [Guia de deploy](docs/initial_deployment.md)
- [Deploy da demo publica](docs/public_demo_deployment.md)
- [Roteiro de demo](docs/demo_script.md)
- [Prontidao de portfolio](docs/portfolio_readiness.md)
- [Estado atual](docs/current_state.md)
- [Estudo de caso](docs/case_study.md)
- [Testes](docs/testing.md)
- [Revisao final do MVP](docs/final_mvp_review.md)
- [Diagrama de classes](docs/class_diagram.html)

## Seguranca da Demo

- Usuarios e registros demo sao sinteticos.
- Nao use dados reais de clientes ou segredos em ambientes locais ou publicos de demonstracao.
- Este repositorio e apresentado como MVP de portfolio, nao como um SaaS de producao com hardening completo.
- O deploy publico esta ativo e deve continuar usando apenas dados sinteticos.

## Limitacoes Conhecidas

- sem notificacoes automaticas
- sem calendario visual avancado
- sem integracao com gateway de pagamento
- sem arquitetura multi-tenant

## Roadmap

- adicionar um smoke test publico simples
- adicionar visoes de calendario e disponibilidade mais ricas
- expandir relatorios operacionais
- adicionar fluxos opcionais de notificacao
- melhorar assets mobile e de portfolio
- manter o video demo publico atualizado apos mudancas relevantes de UI

## Licenca

Este projeto esta licenciado sob a licenca MIT. Veja [LICENSE](LICENSE).
