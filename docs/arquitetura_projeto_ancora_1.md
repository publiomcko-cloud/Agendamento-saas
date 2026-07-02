# Arquitetura do Sistema

## 1. Visão Geral

Este documento descreve a arquitetura atual do Sistema Web de Agendamento e Gestão para Pequenas Empresas. O objetivo é registrar a organização técnica da solução, os principais componentes, os fluxos centrais e as decisões estruturais adotadas no MVP.

A aplicação foi concebida como um sistema full-stack com separação entre frontend, backend e banco de dados, priorizando simplicidade operacional, clareza arquitetural e aderência a práticas comuns de mercado.

## 2. Objetivos da Arquitetura

- Separar responsabilidades entre interface, regras de negócio e persistência
- Facilitar manutenção e evolução do sistema
- Permitir deploy independente entre frontend e backend
- Sustentar autenticação, autorização e rastreabilidade básica
- Viabilizar crescimento incremental do projeto sem reestruturação prematura

## 3. Visão de Alto Nível

A solução é composta por três blocos principais:

- Frontend web
- API backend
- Banco de dados relacional

Fluxo geral:

1. O usuário interage com a interface web
2. O frontend envia requisições HTTP para a API
3. O backend valida autenticação, autorização e regras de negócio
4. O backend persiste e consulta dados no PostgreSQL
5. A API devolve respostas estruturadas ao frontend
6. Logs e healthcheck suportam observabilidade básica

## 4. Componentes Principais

### 4.1 Frontend

Responsável pela interface do usuário, navegação, formulários e consumo da API.

Tecnologias adotadas:
- React
- Next.js
- TypeScript
- Tailwind CSS

Responsabilidades:
- Renderizar páginas e componentes
- Gerenciar autenticação no cliente
- Consumir endpoints protegidos e públicos
- Exibir estados de carregamento, erro e sucesso
- Aplicar restrições visuais por perfil de usuário

### 4.2 Backend

Responsável pela autenticação, regras de negócio, validação, controle de acesso e integração com o banco.

Tecnologias adotadas:
- Node.js
- TypeScript
- NestJS
- Prisma ORM

Responsabilidades:
- Expor API REST
- Autenticar usuários
- Aplicar autorização por perfil
- Validar dados de entrada
- Executar regras de negócio
- Persistir dados
- Registrar logs estruturados
- Expor endpoint de healthcheck

### 4.3 Banco de Dados

Responsável pelo armazenamento persistente e estruturado das informações do sistema.

Tecnologia adotada:
- PostgreSQL

Responsabilidades:
- Armazenar usuários, serviços, agendamentos e pagamentos
- Garantir integridade relacional
- Suportar migrações de esquema
- Permitir seed inicial para ambiente local e demonstração

## 5. Estilo Arquitetural

A aplicação adota uma arquitetura modular em camadas.

### Camadas principais

#### Camada de apresentação
Representada pelo frontend e pelos controladores da API.

#### Camada de aplicação
Responsável por orquestrar casos de uso e fluxos do sistema.

#### Camada de domínio
Responsável pelas regras de negócio centrais, como validação de conflito de agenda, permissões e consistência do fluxo operacional.

#### Camada de infraestrutura
Responsável por persistência, acesso ao banco, logs, autenticação e integrações externas.

Essa separação reduz acoplamento e facilita testes, manutenção e evolução.

## 6. Organização Modular do Backend

Estrutura atual:

```text
src/
  auth/
  users/
  services/
  clients/
  appointments/
  payments/
  dashboard/
  common/
    guards/
    decorators/
    filters/
    interceptors/
  prisma/
  app.module.ts
  main.ts
```

### Módulos implementados

#### Auth
- login
- geração e validação de JWT
- validação do usuário autenticado em rotas protegidas

#### Users
- cadastro
- atualização
- perfis de acesso
- listagem administrativa

#### Services
- cadastro de serviços
- preço
- duração
- status ativo ou inativo

#### Clients
- dados do cliente
- histórico de relacionamento
- vínculo com agendamentos

#### Appointments
- criação de agendamento
- cancelamento
- reagendamento
- validação de conflito

#### Payments
- registro de pagamento
- status de pagamento
- método de pagamento

#### Dashboard
- visão agregada para administrador
- métricas operacionais básicas

## 7. Fluxo de Autenticação e Autorização

### Autenticação

Fluxo esperado:

1. O usuário envia credenciais para a rota de login
2. O backend valida email e senha
3. A senha é comparada com hash armazenado
4. Em caso de sucesso, o backend gera um token JWT
5. O frontend armazena o token conforme estratégia definida
6. O token é enviado nas próximas requisições protegidas

### Autorização

A autorização é baseada em papéis de usuário.

Perfis implementados:
- admin
- atendente
- cliente

Cada endpoint protegido pode exigir um ou mais perfis. O backend aplica guards para verificar permissões antes de executar a lógica de negócio.

## 8. Fluxo Principal de Agendamento

Fluxo simplificado:

1. O usuário autenticado solicita um novo agendamento
2. A API valida formato e campos obrigatórios
3. O backend verifica:
   - existência do cliente
   - existência do serviço
   - disponibilidade do horário
   - regras de acesso do solicitante
4. Em caso de conflito, a API retorna erro de negócio
5. Em caso de sucesso, o agendamento é salvo no banco
6. O sistema registra log estruturado da operação
7. O frontend recebe a confirmação e atualiza a interface

## 9. Modelo de Dados em Nível Arquitetural

Entidades centrais:

### User
Representa contas de acesso ao sistema.

### Service
Representa serviços oferecidos pela empresa.

### Client
Representa a pessoa atendida pelo negócio e pode, opcionalmente, estar vinculada a uma conta de acesso.

### Appointment
Representa reservas de horário.

### Payment
Representa a liquidação financeira associada ao atendimento.

### Company
Entidade opcional para futura evolução multi-tenant.

## 10. Comunicação Entre Camadas

### Frontend para backend
- protocolo HTTP/HTTPS
- payloads JSON
- autenticação via token JWT

### Backend para banco
- acesso via Prisma ORM
- queries encapsuladas nos serviços de cada módulo

### Backend para observabilidade
- logs estruturados
- endpoint de healthcheck
- futura integração opcional com ferramenta de monitoramento

## 11. Estratégia de Validação

A validação será aplicada em dois níveis:

### Validação sintática
Verifica formato, presença e tipo dos dados recebidos.

Exemplos:
- email válido
- campos obrigatórios
- datas válidas
- preço numérico

### Validação de negócio
Verifica consistência operacional.

Exemplos:
- evitar conflito de horários
- impedir acesso indevido
- não permitir pagamento sem atendimento válido

## 12. Estratégia de Tratamento de Erros

O backend padroniza respostas de erro para melhorar rastreabilidade e previsibilidade de consumo.

Padrões adotados:
- mensagens coerentes para erros de validação
- códigos HTTP adequados
- tratamento global de exceções
- registro de falhas relevantes em log

## 13. Observabilidade Básica

Para este projeto, a observabilidade implementada inclui:

- logs estruturados em JSON
- identificação de requisições relevantes
- registro de erros
- endpoint `GET /api/health`

Objetivos:
- facilitar depuração
- demonstrar maturidade técnica
- viabilizar uso em ambiente de demonstração ou MVP real

## 14. Estratégia de Deploy

### Frontend
Hospedagem sugerida:
- Vercel

### Backend
Hospedagem sugerida:
- Railway
- Render
- VPS com Docker

### Banco
Hospedagem sugerida:
- PostgreSQL gerenciado

### Requisitos
- variáveis de ambiente definidas
- build reproduzível
- migrações aplicáveis
- healthcheck funcional
- Dockerfiles para frontend e backend

## 15. Decisões Técnicas e Justificativas

### Next.js no frontend
Escolhido por produtividade, organização, boa adoção de mercado e facilidade de deploy.

### NestJS no backend
Escolhido por estrutura modular, padronização, suporte a arquitetura escalável e boa aderência a projetos profissionais em TypeScript.

### PostgreSQL
Escolhido por robustez, suporte relacional e ampla adoção em aplicações corporativas e web.

### Prisma
Escolhido por produtividade, tipagem forte e boa experiência de desenvolvimento com TypeScript.

### JWT
Escolhido por simplicidade de implementação e ampla utilização em APIs modernas.

## 16. Evoluções Arquiteturais Futuras

A arquitetura foi pensada para permitir expansão posterior, incluindo:

- multi-tenant
- integração com gateways de pagamento
- notificações por e-mail e WhatsApp
- agenda em visualização de calendário avançada
- auditoria de ações
- fila para tarefas assíncronas
- cache para consultas críticas
- monitoramento externo

## 17. Riscos e Cuidados Técnicos

Pontos que exigem atenção durante a implementação:

- controle correto de fuso horário e datas
- prevenção de conflito de agenda em concorrência
- definição clara de limites entre usuário e cliente
- política consistente para cancelamento e reagendamento
- tratamento seguro de autenticação e armazenamento de credenciais
- organização do projeto para evitar crescimento desordenado

## 18. Conclusão

A arquitetura atual busca equilíbrio entre simplicidade, clareza e aderência a práticas reais de desenvolvimento. Ela é adequada para um projeto de portfólio com aparência profissional e também para servir como base de um produto inicial comercializável.

Seu foco principal é demonstrar capacidade de construção de um sistema web completo, com autenticação, domínio de regras de negócio, persistência consistente, documentação, testes e deploy.
