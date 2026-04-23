# Sistema Web de Agendamento e Gestão para Pequenas Empresas

Sistema web full-stack para gerenciamento de agendamentos, serviços, clientes e pagamentos, voltado para pequenas empresas como barbearias, clínicas, personal trainers e negócios baseados em atendimento por horário.

## Objetivo

Este projeto foi concebido como um sistema de portfólio com foco em cenário real de mercado. O objetivo é demonstrar capacidade de projetar, desenvolver, testar e publicar uma aplicação full-stack com autenticação, regras de negócio, persistência de dados, documentação de API, deploy e observabilidade básica.

## Problema que o sistema resolve

Muitos pequenos negócios ainda dependem de agenda manual, mensagens em aplicativos e planilhas para controlar horários, clientes e pagamentos. Isso costuma gerar conflitos de agenda, perda de informações, retrabalho e pouca visibilidade operacional.

O sistema centraliza essas operações em uma aplicação web com acesso por perfil de usuário.

## Público-alvo

- Barbearias
- Clínicas
- Personal trainers
- Estúdios
- Professores particulares
- Pequenas empresas baseadas em agendamento

## Principais funcionalidades

- Autenticação de usuários
- Perfis de acesso: administrador, atendente e cliente
- Cadastro e gerenciamento de serviços
- Cadastro e gerenciamento de clientes
- Criação, cancelamento e reagendamento de horários
- Validação de conflito de agenda
- Registro de pagamentos
- Painel administrativo com visão operacional
- Logs estruturados
- Endpoint de healthcheck

## Perfis de acesso

### Administrador
- Gerencia usuários
- Gerencia serviços
- Visualiza agenda completa
- Acompanha pagamentos
- Acessa indicadores do painel administrativo

### Atendente
- Realiza agendamentos
- Consulta clientes
- Atualiza status de atendimentos
- Registra pagamentos

### Cliente
- Realiza login
- Agenda horários
- Consulta seus próprios agendamentos
- Cancela ou reagenda conforme regras do sistema

## Stack tecnológica

### Frontend
- React
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- TypeScript
- NestJS

### Banco de dados
- PostgreSQL
- Prisma ORM

### Testes
- Jest
- Supertest

### Infra e deploy
- Docker
- Vercel para frontend
- Railway, Render ou VPS para backend
- PostgreSQL gerenciado

## Arquitetura resumida

O sistema segue uma arquitetura separada por camadas:

- Frontend responsável pela interface e consumo da API
- Backend responsável por autenticação, regras de negócio e persistência
- Banco relacional para armazenamento estruturado
- Logs estruturados para rastreabilidade
- Healthcheck para monitoramento básico

Documentações complementares podem ser mantidas em `docs/`, incluindo arquitetura detalhada, modelagem de banco e especificação técnica.

## Estrutura prevista do projeto

```text
.
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── modules
│   │   ├── common
│   │   ├── config
│   │   └── main.ts
│   ├── prisma
│   │   ├── schema.prisma
│   │   ├── migrations
│   │   └── seed.ts
│   └── package.json
│
└── docs
    ├── especificacao-tecnica.pdf
    ├── arquitetura.md
    └── modelagem-banco.md
```

## Modelos principais

### User
Representa os usuários do sistema.

Campos previstos:
- id
- name
- email
- password
- role

### Service
Representa os serviços oferecidos pela empresa.

Campos previstos:
- id
- name
- duration
- price
- active

### Appointment
Representa os agendamentos.

Campos previstos:
- id
- clientId
- serviceId
- scheduledAt
- status
- notes

### Payment
Representa os pagamentos associados aos atendimentos.

Campos previstos:
- id
- appointmentId
- amount
- status
- method
- paidAt

## Regras de negócio principais

- Um horário não pode ser reservado duas vezes para o mesmo recurso configurado
- Apenas usuários autenticados podem acessar áreas protegidas
- Cada perfil possui permissões específicas
- Um cliente só pode visualizar seus próprios agendamentos
- Cancelamentos e reagendamentos devem respeitar regras configuradas
- Pagamentos devem estar vinculados a um atendimento válido

## Documentação da API

A API será documentada com Swagger/OpenAPI.

Exemplos de rotas previstas:

### Autenticação
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

### Usuários
- `GET /users`
- `POST /users`
- `PATCH /users/:id`

### Serviços
- `GET /services`
- `POST /services`
- `PATCH /services/:id`

### Agendamentos
- `GET /appointments`
- `POST /appointments`
- `PATCH /appointments/:id`
- `DELETE /appointments/:id`

### Pagamentos
- `GET /payments`
- `POST /payments`

### Monitoramento
- `GET /health`

## Validação e segurança

O sistema adota medidas básicas de segurança e consistência:

- Autenticação com JWT
- Hash de senha
- Validação de payloads
- Controle de acesso por perfil
- Tratamento padronizado de erros
- Separação entre variáveis de ambiente e código-fonte

## Testes

Os testes cobrem os fluxos críticos do sistema, com foco inicial em:

- autenticação
- autorização por perfil
- criação de agendamento
- bloqueio de conflito de horário
- registro de pagamento
- healthcheck

## Observabilidade

O projeto inclui observabilidade básica para ambiente de portfólio e MVP de produção:

- logs estruturados
- tratamento global de erros
- endpoint de healthcheck
- mensagens padronizadas de falha

## Como rodar o projeto localmente

### Pré-requisitos

- Node.js
- PostgreSQL
- Docker opcional
- npm ou pnpm

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Variáveis de ambiente esperadas

### Backend

```env
DATABASE_URL=
JWT_SECRET=
PORT=
NODE_ENV=
```

### Frontend

```env
NEXT_PUBLIC_API_URL=
```

## Seed inicial

A base inicial deve conter dados mínimos para acelerar testes locais:

- 1 usuário administrador
- 1 usuário atendente
- 1 cliente de exemplo
- 3 serviços cadastrados
- alguns agendamentos simulados

## Deploy

### Estratégia sugerida
- Frontend em Vercel
- Backend em Railway ou Render
- Banco PostgreSQL gerenciado

### Requisitos de deploy
- variáveis de ambiente configuradas
- migrações executadas
- build validado
- healthcheck funcional

## Status do projeto

Em fase de planejamento e estruturação inicial.

## Roadmap

### MVP
- autenticação
- perfis de acesso
- cadastro de serviços
- cadastro de clientes
- agendamento com validação
- painel administrativo básico
- registro de pagamentos
- deploy inicial

### Evoluções futuras
- integração com Stripe ou Mercado Pago
- notificações por e-mail e WhatsApp
- agenda em visualização de calendário
- relatórios gerenciais
- arquitetura multi-tenant
- auditoria de ações do sistema

## Demonstração

Links serão adicionados após a publicação do MVP:

- demo pública
- documentação da API
- vídeo curto de apresentação
- especificação técnica

## Diferenciais do projeto

Este projeto foi concebido para demonstrar competências diretamente valorizadas em vagas de desenvolvimento e projetos freelance:

- CRUD completo com regras reais
- autenticação e autorização
- documentação de API
- banco com migrações e seed
- testes de endpoints críticos
- deploy em ambiente real
- observabilidade básica

## Autor

Nome: Seu Nome  
GitHub: seu-link  
LinkedIn: seu-link  
Portfólio: seu-link

## Licença

Este projeto pode ser publicado sob licença MIT.
