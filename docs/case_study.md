# Estudo de Caso

## Projeto

`Scheduling SaaS for Small Businesses`

## Contexto

Pequenos negocios de servicos muitas vezes gerenciam agenda, clientes, servicos e pagamentos em ferramentas desconectadas: planilhas, aplicativos de mensagem, anotacoes em papel e lembretes manuais.

Isso cria atrito operacional:

- a equipe perde visibilidade da agenda do dia
- clientes dependem de comunicacao manual para confirmar horarios
- pagamentos ficam dificeis de relacionar com agendamentos
- donos do negocio nao possuem um dashboard operacional simples
- historico de clientes e atendimentos fica fragmentado

## Objetivo

Construir um MVP full-stack de portfolio que demonstre como esse fluxo pode virar um sistema web utilizavel, com perfis claros, regras de negocio reais, dados persistidos e deploy publico.

O projeto nao pretende ser uma plataforma SaaS pronta para producao. Ele e um MVP realista para demonstrar julgamento tecnico, pensamento de produto e entrega ponta a ponta.

## Solucao

O sistema oferece:

- login publico com usuarios demo
- perfis de admin, atendente e cliente
- gestao de clientes
- gestao de servicos
- agendamento de atendimentos
- prevencao de conflito de horario no backend
- acompanhamento de pagamentos
- dashboard com visibilidade operacional
- autoagendamento pelo cliente
- deploy publico de demonstracao

## Perfis de Usuario

### Admin

O admin pode gerenciar usuarios, servicos, clientes, agendamentos, pagamentos e dados do dashboard.

### Atendente

O atendente pode operar o dia a dia: clientes, servicos, agendamentos, pagamentos e revisao do dashboard.

### Cliente

O cliente pode visualizar os proprios agendamentos e criar uma nova reserva por autosservico.

## Arquitetura

```text
Browser
  -> Frontend Next.js
  -> Backend NestJS
  -> PostgreSQL via Prisma
```

Deploy publico:

```text
Frontend na Vercel
  -> Backend no Render
  -> PostgreSQL no Supabase
```

## Decisoes Tecnicas

### Frontend em Next.js

Escolhido pela estrutura moderna para React, rotas protegidas, simplicidade de deploy na Vercel e boa apresentacao para portfolio.

### Backend em NestJS

Escolhido pela organizacao modular da API, injecao de dependencias, guards, decorators, pipes de validacao, integracao com Swagger e manutencao clara de regras de negocio.

### Prisma com PostgreSQL

Escolhido por acesso tipado a dados, migrations, modelagem relacional e configuracao simples para PostgreSQL local e remoto.

### Autenticacao JWT

Escolhida porque o MVP precisa de acesso por perfil sem a complexidade de um provedor externo de identidade.

### Autorizacao por perfil

O sistema separa fluxos de `admin`, `attendant` e `client` para demonstrar software de negocio multiusuario com regras realistas.

### Pagamento manual

O MVP registra o estado do pagamento manualmente em vez de integrar um gateway. Isso mantem o escopo focado e ainda demonstra o fluxo financeiro vinculado aos agendamentos.

## Trade-offs

### Sem multi-tenant

O projeto evita complexidade multi-tenant de proposito. O objetivo e demonstrar uma operacao de negocio com clareza antes de adicionar arquitetura multiempresa.

### Sem gateway de pagamento

A integracao com gateway de pagamento ficou fora do MVP. Pagamentos manuais sao suficientes para demonstrar a relacao entre agendamentos e estado financeiro.

### Sem calendario visual avancado

O modulo de agendamentos usa listas operacionais e filtros em vez de um componente completo de calendario. Isso reduz complexidade visual e tecnica.

### Supabase com TLS no-verify na demo

A demo no Render usa `sslmode=no-verify` com Supabase para evitar problemas de cadeia de certificados no ambiente publico de portfolio. Em producao, o caminho mais correto seria configurar explicitamente o certificado CA.

### Render free tier

O backend roda no plano gratuito do Render, entao cold starts podem acontecer. Isso e aceitavel para uma demo de portfolio, mas precisaria de revisao para uso em producao.

## Valor de Negocio

O MVP mostra como um pequeno negocio pode sair de um fluxo fragmentado para um sistema operacional centralizado:

- clientes centralizados
- catalogo claro de servicos
- visibilidade de agendamentos
- autosservico para clientes
- acompanhamento de status de pagamento
- dashboard operacional

Ele pode ser adaptado para clinicas, saloes, consultorias, estudios, professores particulares, equipes de servicos locais e outras operacoes baseadas em agenda.

## Valor Tecnico

Este projeto demonstra:

- entrega full-stack de produto
- design modular de API backend
- modelagem de banco de dados
- autenticacao e autorizacao
- regras de negocio no backend
- rotas protegidas no frontend
- deploy publico
- estrategia de dados demo
- documentacao para revisores
- empacotamento de portfolio

## Resultado

O projeto esta pronto como MVP publico de portfolio.

Revisores podem abrir a demo, usar contas populadas, inspecionar a documentacao da API, ver screenshots, assistir ao video demo e seguir o roteiro documentado sem rodar o projeto localmente.

## Melhorias Futuras

- smoke test para o deploy publico
- visao de calendario mais rica
- regras de disponibilidade
- fluxo de notificacoes
- integracao com gateway de pagamento
- arquitetura multi-tenant
