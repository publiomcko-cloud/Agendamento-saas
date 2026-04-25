# Frontend

Aplicacao Next.js do sistema de agendamento e gestao.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Funcionalidades implementadas

- login com redirecionamento por perfil
- layout autenticado com navegacao por papel
- dashboard administrativo
- modulo de usuarios
- modulo de clientes
- modulo de servicos
- modulo de agendamentos
- modulo de pagamentos
- area do cliente com meus agendamentos
- novo agendamento para cliente

## Requisitos

- Node.js 22+
- npm
- backend rodando e acessivel

## Ambiente local

Crie `frontend/.env.local` com base em `frontend/.env.example`.

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

## Instalar dependencias

```bash
cd frontend
npm install
```

## Rodar localmente

```bash
npm run dev
```

Endereco padrao:

```text
http://localhost:3000
```

## Fluxo de acesso local

Credenciais seed:

- `admin@example.com` / `Admin@123456`
- `attendant@example.com` / `Attendant@123456`
- `client@example.com` / `Client@123456`

Perfis:

- `admin`: acessa usuarios, dashboard, clientes, servicos, agendamentos e pagamentos
- `attendant`: acessa dashboard, clientes, servicos em leitura, agendamentos e pagamentos
- `client`: acessa meus agendamentos e novo agendamento

## Scripts

Desenvolvimento:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

Subir build de producao:

```bash
npm run start
```

## Deploy

O frontend esta configurado com `output: standalone` em [frontend/next.config.ts](/home/publio/projetos/agendamento-saas/frontend/next.config.ts:1) e possui `Dockerfile` proprio em [frontend/Dockerfile](/home/publio/projetos/agendamento-saas/frontend/Dockerfile:1).

Para o passo a passo de publicacao, consulte [docs/deploy_inicial_projeto_ancora_1.md](/home/publio/projetos/agendamento-saas/docs/deploy_inicial_projeto_ancora_1.md:1).
