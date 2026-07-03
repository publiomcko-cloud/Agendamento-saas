# Frontend

Aplicacao Next.js do sistema de agendamento e gestao, concluida como parte do MVP de portfolio.

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
- pagina de conta para consulta basica do usuario autenticado

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

Observacao:
se a porta `3000` estiver ocupada, o Next.js pode iniciar em `3001`.

## Fluxo de acesso local

Contas de demonstracao:

- `admin@example.com` / `Admin@123456`
- `attendant@example.com` / `Attendant@123456`
- `client@example.com` / `Client@123456`

Essas contas sao criadas pelo seed local e servem para demonstracao guiada dos perfis no portfolio.

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

Testes:

```bash
npm run test
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

O frontend esta configurado com `output: standalone` em [frontend/next.config.ts](next.config.ts) e possui `Dockerfile` proprio em [frontend/Dockerfile](Dockerfile).

Para o objetivo atual de portfolio, o frontend ja esta concluido para demonstracao local e demo publica. Para detalhes de publicacao, consulte [docs/initial_deployment.md](../docs/initial_deployment.md).
