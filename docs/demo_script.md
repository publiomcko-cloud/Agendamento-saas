# Demo Script

## Objetivo

Este roteiro ajuda a apresentar o projeto em uma demonstracao curta de portfolio, com foco em valor de negocio e pontos tecnicos principais.

Demo publica:

- Frontend: https://agendamento-saas-sigma.vercel.app
- Backend health: https://agendamento-saas-api.onrender.com/api/health
- API docs: https://agendamento-saas-api.onrender.com/api

## Credenciais

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

## Roteiro Curto

Tempo estimado: 2 a 4 minutos.

1. Abra o frontend publico.

2. Mostre a tela de login.
   Explique que o sistema tem tres perfis: admin, atendente e cliente.

3. Entre como admin.
   Use `admin@example.com` e `Admin@123456`.

4. Abra o dashboard.
   Mostre agenda do dia, proximos atendimentos e indicadores operacionais.

5. Abra clientes.
   Mostre que a operacao pode cadastrar, editar e inativar clientes.

6. Abra servicos.
   Mostre duracao, preco e status ativo/inativo.

7. Abra agendamentos.
   Mostre que o sistema organiza horarios por cliente e servico, com suporte a reagendamento e cancelamento.

8. Abra pagamentos.
   Mostre status, metodo, valor e vinculo com agendamentos.

9. Saia e entre como cliente.
   Use `client@example.com` e `Client@123456`.

10. Mostre meus agendamentos.
    Explique que o cliente visualiza apenas os proprios registros.

11. Abra novo agendamento.
    Mostre o fluxo de autosservico do cliente.

## Pontos Tecnicos Para Comentar

- frontend em Next.js com rotas protegidas
- backend em NestJS com API REST modular
- autenticacao JWT
- autorizacao por perfil
- PostgreSQL com Prisma
- validacao de conflito de agenda no backend
- logs estruturados e filtro global de erros
- Swagger em `/api`
- deploy publico com Vercel, Render e Supabase

## Demo Safety

- todos os dados sao sinteticos
- as credenciais sao apenas para demonstracao
- nenhum dado real de cliente deve ser inserido no ambiente publico
- o projeto e um MVP de portfolio, nao uma instancia SaaS de producao
