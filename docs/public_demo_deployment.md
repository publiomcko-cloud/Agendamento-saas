# Public Demo Deployment

## Objetivo

Este documento descreve como publicar o projeto no stack:

- frontend na Vercel
- backend no Render
- banco PostgreSQL no Supabase

O foco e colocar o MVP online com dados sinteticos para demonstracao de portfolio.

## Arquitetura publica recomendada

```text
Browser
  -> Vercel frontend
  -> Render backend
  -> Supabase PostgreSQL
```

## Antes de publicar

Confirme localmente:

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

## Variaveis de ambiente de producao

### Backend no Render

Configure:

```env
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[HOST]:5432/postgres?schema=public&sslmode=require
JWT_SECRET=defina-um-segredo-forte-e-longo
JWT_EXPIRES_IN=1d
CORS_ORIGINS=https://seu-frontend.vercel.app
```

Observacao:

- no Supabase, use a string de conexao pooling ou direct connection conforme sua conta permitir
- mantenha `sslmode=require`
- depois que a URL final da Vercel existir, atualize `CORS_ORIGINS` no Render

### Frontend na Vercel

Configure:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com/api
```

## Passo a passo

### 1. Criar o banco no Supabase

1. Crie um novo projeto no Supabase.
2. Defina uma senha forte para o banco.
3. Abra a area de conexao do PostgreSQL.
4. Copie a `connection string`.
5. Ajuste para incluir `?schema=public&sslmode=require`, se necessario.

### 2. Publicar o backend no Render

Opcao recomendada: usar o `render.yaml` da raiz do repositorio.

1. Faça push do repositorio para o GitHub.
2. No Render, clique em `New +`.
3. Escolha `Blueprint`.
4. Conecte o repositorio.
5. O Render deve detectar o arquivo [render.yaml](/home/publio/projetos/agendamento-saas/render.yaml:1).
6. Revise o servico `agendamento-saas-api`.
7. Configure as variaveis:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGINS`
8. Execute o deploy.

### 3. Rodar migracoes no backend publicado

O container do backend ja esta preparado para executar:

```bash
npx prisma migrate deploy && node dist/main
```

Isso significa que, ao subir o container com `DATABASE_URL` valida, o schema sera aplicado automaticamente.

### 4. Validar o backend online

Depois do deploy, valide:

- `https://seu-backend.onrender.com/api/health`
- `https://seu-backend.onrender.com/api`

Se o healthcheck falhar:

- revise `DATABASE_URL`
- confira se o Supabase aceita a conexao
- confira se `JWT_SECRET` esta preenchido

### 5. Publicar o frontend na Vercel

1. No Vercel, clique em `Add New Project`.
2. Importe o repositorio.
3. Configure `Root Directory` como `frontend`.
4. Adicione a variavel:
   - `NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com/api`
5. Execute o deploy.

### 6. Atualizar CORS no Render

Depois que a Vercel gerar a URL final, volte ao Render e defina:

```env
CORS_ORIGINS=https://seu-frontend.vercel.app
```

Se quiser permitir preview deployments da Vercel, voce pode adicionar multiplas origens separadas por virgula.

Exemplo:

```env
CORS_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend-git-main-seuusuario.vercel.app
```

### 7. Validar o fluxo real

1. Abra o frontend publicado.
2. Faça login com uma conta seed de demo.
3. Confirme que o dashboard carrega.
4. Confirme que listagens como clientes e servicos respondem.
5. Confirme que a autenticacao persiste durante a navegacao.

## Seed de demonstracao

O projeto ja possui seed local com:

- `admin@example.com`
- `attendant@example.com`
- `client@example.com`

Para usar isso online, voce tem duas opcoes:

### Opcao A. Rodar seed manualmente uma vez

No ambiente com acesso ao banco e ao backend:

```bash
cd backend
npx prisma db seed
```

### Opcao B. Inserir dados sinteticos manualmente

Mais trabalhoso, mas util se voce quiser controlar melhor os dados do demo.

## Atualizacoes apos o deploy

Quando as URLs estiverem prontas:

1. Atualize o `README.md` em `Live Portfolio Demo`.
2. Adicione:
   - frontend URL
   - backend health URL
   - API docs URL
3. Confirme que as credenciais demo estao corretas.
4. Confirme que somente dados sinteticos aparecem.

## Demo safety

Para o deploy publico:

- use apenas dados sinteticos
- nao use emails pessoais reais
- nao use nomes de clientes reais
- nao exponha segredos no frontend
- use um `JWT_SECRET` forte
- mantenha `CORS_ORIGINS` restrito ao frontend publicado

## Checklist final

- banco criado no Supabase
- `DATABASE_URL` configurada no Render
- `JWT_SECRET` forte configurado
- `CORS_ORIGINS` configurado com a URL da Vercel
- backend respondendo em `/api/health`
- Swagger publico funcionando
- frontend publicado com `NEXT_PUBLIC_API_URL`
- login demo validado
- README atualizado com links publicos
- apenas dados sinteticos expostos
