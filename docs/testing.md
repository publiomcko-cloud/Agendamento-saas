# Testing

## Objetivo

Este documento centraliza os comandos de validacao do projeto e explica o que cada etapa cobre.

## Backend

Executar dentro de `backend`:

```bash
npm run lint
npm test
npm run test:e2e
npm run build
```

### O que cobre

- lint de TypeScript
- testes unitarios
- testes e2e com Supertest
- build de producao do NestJS

### Fluxos criticos cobertos

Os testes do backend validam os principais fluxos do MVP:

- healthcheck
- login
- autenticacao invalida
- autorizacao por perfil
- usuarios administrativos
- clientes
- servicos
- agendamentos
- bloqueio de conflito
- pagamentos
- dashboard
- formato padronizado de erro

## Frontend

Executar dentro de `frontend`:

```bash
npm run lint
npm run build
```

### O que cobre

- lint do frontend
- validacao TypeScript durante o build
- build de producao do Next.js
- geracao das rotas principais

## Docker

Validar o backend como imagem Docker:

```bash
docker build -t agendamento-backend-render-check ./backend
```

Validar o frontend como imagem Docker:

```bash
docker build -t agendamento-frontend-render-check ./frontend
```

## Demo publico

Validar healthcheck:

```bash
curl -s https://agendamento-saas-api.onrender.com/api/health
```

Resultado esperado:

```json
{"status":"ok","service":"backend"}
```

Validar login admin:

```bash
curl -s -X POST 'https://agendamento-saas-api.onrender.com/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin@123456"}'
```

Resultado esperado:

- resposta contem `accessToken`
- resposta contem usuario `admin@example.com`

## Validacao manual recomendada

1. Abrir https://agendamento-saas-sigma.vercel.app
2. Entrar como admin
3. Abrir dashboard
4. Abrir clientes
5. Abrir servicos
6. Abrir agendamentos
7. Abrir pagamentos
8. Sair
9. Entrar como cliente
10. Abrir meus agendamentos
11. Abrir novo agendamento

## Observacoes

- O ambiente publico usa dados sinteticos.
- O backend no Render free tier pode ter cold start.
- O banco publico usa Supabase PostgreSQL.
- A URL publica do backend deve terminar em `/api` para consumo do frontend.
- O frontend precisa de `NEXT_PUBLIC_API_URL` configurado na Vercel.

## Status atual

Validacoes realizadas durante o preparo de portfolio:

- backend build
- backend unit test
- frontend build
- Docker build do backend
- deploy backend no Render
- deploy frontend na Vercel
- seed remoto com dados sinteticos
- login demo validado
- screenshots capturadas do ambiente publico
