# Deploy Inicial do Projeto Ancora 1

## Objetivo

Este documento descreve um caminho simples e reproduzivel para publicar o MVP em ambiente inicial de producao.

Para o estado atual do projeto, este deploy e opcional. O MVP ja e considerado concluido para portfolio por funcionar localmente, possuir documentacao, testes criticos e artefatos de publicacao preparados.

## Estrategia recomendada

- frontend: Vercel
- backend: Render, Railway ou container Docker
- banco: PostgreSQL gerenciado

Stack recomendada para o portfolio publico:

- frontend: Vercel
- backend: Render
- banco: Supabase PostgreSQL

## Variaveis de ambiente

### Backend

Obrigatorias:

```env
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public&sslmode=require
JWT_SECRET=defina-um-segredo-forte
JWT_EXPIRES_IN=1d
CORS_ORIGINS=https://seu-frontend.vercel.app
```

### Frontend

Obrigatoria:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.exemplo.com/api
```

## Build validado localmente

### Backend

```bash
cd backend
npm ci
npx prisma generate
npm run build
```

### Frontend

```bash
cd frontend
npm ci
npm run build
```

## Publicacao com Docker

O repositorio inclui:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.prod.yml`

### Subir stack de producao local

```bash
docker compose -f docker-compose.prod.yml up --build
```

Endpoints esperados:

- frontend: `http://localhost:3000`
- backend: `http://localhost:3333/api`
- healthcheck: `http://localhost:3333/api/health`

Se a porta `3000` estiver ocupada no host, ajuste o mapeamento do frontend conforme necessario.

## Publicacao do backend em Render ou Railway

### Opcao A. Usando Docker

1. Crie um novo service apontando para a pasta `backend`
2. Configure as variaveis de ambiente do backend
3. Garanta que o banco PostgreSQL remoto esteja criado
4. Publique usando o `Dockerfile`

O container executa:

```bash
npx prisma migrate deploy && node dist/main
```

Fluxo recomendado para este projeto:

1. banco remoto no Supabase
2. backend no Render
3. frontend na Vercel

Passo a passo detalhado:

- [docs/public_demo_deployment.md](/home/publio/projetos/agendamento-saas/docs/public_demo_deployment.md:1)

## Publicacao do frontend em Vercel

1. Importe o repositorio na Vercel
2. Configure o projeto com Root Directory em `frontend`
3. Defina `NEXT_PUBLIC_API_URL` apontando para a URL publica do backend
4. Execute o deploy

## Checklist de deploy

- banco remoto criado
- `DATABASE_URL` configurada no backend
- `JWT_SECRET` forte configurado
- migracoes executadas com `prisma migrate deploy`
- build do backend validado
- build do frontend validado
- `NEXT_PUBLIC_API_URL` apontando para o backend publicado
- healthcheck respondendo em producao

## Observacoes

- o frontend usa `output: standalone`, o que simplifica o deploy em container
- o backend sobe com logs estruturados em JSON
- o seed de desenvolvimento nao deve ser executado automaticamente em producao
