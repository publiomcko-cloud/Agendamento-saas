# Current State

## Summary

`Scheduling SaaS for Small Businesses` is ready as a public portfolio MVP.

The project has a deployed frontend, deployed backend, remote PostgreSQL database, synthetic demo data, screenshots, demo video, demo credentials, API documentation, and portfolio-oriented README.

## Public Demo

- Frontend: https://agendamento-saas-sigma.vercel.app
- Backend health: https://agendamento-saas-api.onrender.com/api/health
- API docs: https://agendamento-saas-api.onrender.com/api
- Demo video: https://youtu.be/TbuewDJhGYs

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

## Deployment Stack

```text
Browser
  -> Vercel frontend
  -> Render backend
  -> Supabase PostgreSQL
```

## Implemented Product Scope

- authentication with JWT
- role-based access for `admin`, `attendant`, and `client`
- administrative user management
- client management
- service management
- appointment creation, cancellation, and rescheduling
- appointment conflict prevention in the backend
- payment registration and status updates
- operational dashboard
- client self-service booking flow
- client area for personal appointments
- Swagger API documentation
- healthcheck endpoint
- structured backend logs
- global backend error handling
- seed data for repeatable demos

## Demo Data

The public demo database contains synthetic data only.

Seeded demo records include:

- 3 demo users
- 4 clients
- 4 services
- 5 appointments
- 3 payments

The data covers active, inactive, scheduled, completed, cancelled, paid, pending, and refunded states so reviewers can inspect the main product flows.

## Screenshots

Screenshots are stored in `docs/screenshots/` and are embedded in the README.

Current set:

- login
- dashboard
- users
- clients
- services
- appointments
- payments
- client appointments
- new booking
- mobile dashboard

## Validation Status

Validated during portfolio preparation:

- backend build
- backend unit test
- frontend build
- Docker backend build for Render
- backend deployment on Render
- frontend deployment on Vercel
- Supabase seed with synthetic data
- public healthcheck
- public login flow
- screenshots captured from public demo
- demo video recorded from public demo

Recommended validation commands:

```bash
cd backend
npm run lint
npm test
npm run test:e2e
npm run build
```

```bash
cd frontend
npm run lint
npm run build
```

## Important Operational Notes

- Render requires `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGINS` as environment variables.
- Supabase connection currently uses `sslmode=no-verify` for the public demo.
- Render should keep `DATABASE_SSL_REJECT_UNAUTHORIZED=false`.
- Vercel requires `NEXT_PUBLIC_API_URL` pointing to the Render backend `/api`.
- Public demo data must remain synthetic.

## Known Limitations

- no automated notifications
- no payment gateway
- no multi-tenant model
- no advanced calendar view
- no advanced availability rules

## Recommended Next Steps

- add a simple public smoke test script
- review links before publishing the repo broadly
- update the demo video after relevant UI changes

## Status

Ready for portfolio review.
