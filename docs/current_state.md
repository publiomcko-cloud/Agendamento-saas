# Estado Atual

## Resumo

`Scheduling SaaS for Small Businesses` esta pronto como MVP publico de portfolio.

O projeto possui frontend publicado, backend publicado, banco PostgreSQL remoto, dados sinteticos, screenshots, video demo, credenciais de demonstracao, documentacao da API e README orientado para portfolio.

## Demo Publica

- Frontend: https://agendamento-saas-sigma.vercel.app
- Backend health: https://agendamento-saas-api.onrender.com/api/health
- API docs: https://agendamento-saas-api.onrender.com/api
- Video demo: https://youtu.be/TbuewDJhGYs

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

## Stack de Deploy

```text
Browser
  -> Frontend na Vercel
  -> Backend no Render
  -> PostgreSQL no Supabase
```

## Escopo Implementado

- autenticacao com JWT
- acesso por perfil para `admin`, `attendant` e `client`
- gestao administrativa de usuarios
- gestao de clientes
- gestao de servicos
- criacao, cancelamento e reagendamento de agendamentos
- prevencao de conflito de horario no backend
- registro e atualizacao de pagamentos
- dashboard operacional
- fluxo de autoagendamento para cliente
- area do cliente para acompanhar os proprios agendamentos
- documentacao Swagger da API
- endpoint de healthcheck
- logs estruturados no backend
- filtro global de erros no backend
- dados de seed para demos repetiveis

## Dados de Demonstracao

O banco publico usa apenas dados sinteticos.

Registros de demo populados:

- 3 usuarios demo
- 4 clientes
- 4 servicos
- 5 agendamentos
- 3 pagamentos

Os dados cobrem estados ativo, inativo, agendado, concluido, cancelado, pago, pendente e estornado para permitir revisao dos principais fluxos.

## Screenshots

As capturas ficam em `docs/screenshots/` e sao exibidas no README.

Conjunto atual:

- login
- dashboard
- usuarios
- clientes
- servicos
- agendamentos
- pagamentos
- meus agendamentos
- novo agendamento
- dashboard em mobile

## Validacao

Validado durante a preparacao de portfolio:

- build do backend
- teste unitario do backend
- build do frontend
- build Docker do backend para Render
- deploy do backend no Render
- deploy do frontend na Vercel
- seed no Supabase com dados sinteticos
- healthcheck publico
- fluxo de login publico
- screenshots capturadas da demo publica
- video demo gravado da demo publica

Comandos recomendados:

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

## Observacoes Operacionais

- Render precisa de `DATABASE_URL`, `JWT_SECRET` e `CORS_ORIGINS`.
- A conexao Supabase da demo publica usa `sslmode=no-verify`.
- O Render deve manter `DATABASE_SSL_REJECT_UNAUTHORIZED=false`.
- A Vercel precisa de `NEXT_PUBLIC_API_URL` apontando para o backend Render com `/api`.
- A demo publica deve continuar usando apenas dados sinteticos.

## Limitacoes Conhecidas

- sem notificacoes automaticas
- sem gateway de pagamento
- sem multi-tenant
- sem calendario visual avancado
- sem regras avancadas de disponibilidade

## Proximos Passos Opcionais

- adicionar smoke test publico simples
- revisar links antes de divulgar amplamente o repositorio
- atualizar o video demo apos mudancas relevantes de UI

## Status

Pronto para revisao de portfolio.
