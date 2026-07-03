# Modelagem de Banco de Dados

## 1. Visão Geral

Este documento descreve a modelagem de banco de dados proposta para o Sistema Web de Agendamento e Gestão para Pequenas Empresas. A estrutura foi pensada para suportar o MVP do projeto com consistência relacional, clareza semântica e possibilidade de evolução futura.

O banco de dados será relacional, utilizando PostgreSQL, com gerenciamento de schema por migrações e acesso via Prisma ORM.

## 2. Objetivos da Modelagem

- Representar corretamente os principais elementos do domínio
- Garantir integridade entre usuários, serviços, agendamentos e pagamentos
- Suportar autenticação e controle por perfil
- Permitir consultas operacionais e administrativas
- Facilitar evolução futura para cenários mais complexos

## 3. Estratégia Geral

A modelagem inicial é orientada ao MVP, mas já considera crescimento controlado. As entidades principais são:

- User
- Client
- Service
- Appointment
- Payment

Opcionalmente, o modelo pode evoluir para incluir:

- Company
- EmployeeSchedule
- AuditLog
- Notification
- RefreshToken

## 4. Entidades Principais

## 4.1 User

Representa contas com acesso ao sistema.

### Finalidade
Permitir autenticação e autorização conforme perfil de uso.

### Campos propostos

| Campo | Tipo sugerido | Obrigatório | Observação |
|------|---------------|-------------|------------|
| id | uuid | Sim | Chave primária |
| name | varchar | Sim | Nome do usuário |
| email | varchar | Sim | Deve ser único |
| password_hash | varchar | Sim | Senha com hash |
| role | enum | Sim | admin, attendant, client |
| active | boolean | Sim | Controle de ativação |
| created_at | timestamp | Sim | Data de criação |
| updated_at | timestamp | Sim | Data de atualização |

### Regras
- `email` deve ser único
- `role` define permissões de acesso
- usuários inativos não devem autenticar

## 4.2 Client

Representa o cliente atendido pela empresa.

### Finalidade
Separar o conceito de cliente de negócio do conceito de conta autenticada, permitindo flexibilidade operacional.

### Campos propostos

| Campo | Tipo sugerido | Obrigatório | Observação |
|------|---------------|-------------|------------|
| id | uuid | Sim | Chave primária |
| name | varchar | Sim | Nome do cliente |
| email | varchar | Não | Pode existir sem login |
| phone | varchar | Não | Contato |
| notes | text | Não | Observações internas |
| user_id | uuid | Não | Vínculo opcional com User |
| created_at | timestamp | Sim | Data de criação |
| updated_at | timestamp | Sim | Data de atualização |

### Regras
- um cliente pode existir sem conta autenticada
- `user_id` é opcional para permitir operação interna por atendente
- um usuário do tipo client pode estar vinculado a um registro de cliente

## 4.3 Service

Representa os serviços oferecidos pela empresa.

### Finalidade
Permitir parametrização da agenda e do valor dos atendimentos.

### Campos propostos

| Campo | Tipo sugerido | Obrigatório | Observação |
|------|---------------|-------------|------------|
| id | uuid | Sim | Chave primária |
| name | varchar | Sim | Nome do serviço |
| description | text | Não | Descrição opcional |
| duration_minutes | integer | Sim | Duração em minutos |
| price | decimal | Sim | Valor do serviço |
| active | boolean | Sim | Serviço disponível ou não |
| created_at | timestamp | Sim | Data de criação |
| updated_at | timestamp | Sim | Data de atualização |

### Regras
- `duration_minutes` deve ser maior que zero
- `price` não pode ser negativo
- serviços inativos não devem ser agendáveis

## 4.4 Appointment

Representa o agendamento de um atendimento.

### Finalidade
Registrar reservas de horário, status operacional e vínculo com serviço e cliente.

### Campos propostos

| Campo | Tipo sugerido | Obrigatório | Observação |
|------|---------------|-------------|------------|
| id | uuid | Sim | Chave primária |
| client_id | uuid | Sim | Referência para Client |
| service_id | uuid | Sim | Referência para Service |
| created_by_user_id | uuid | Não | Usuário que criou o agendamento |
| scheduled_at | timestamp | Sim | Início do atendimento |
| end_at | timestamp | Sim | Término previsto |
| status | enum | Sim | scheduled, completed, cancelled, no_show |
| notes | text | Não | Observações |
| created_at | timestamp | Sim | Data de criação |
| updated_at | timestamp | Sim | Data de atualização |

### Regras
- um agendamento deve estar vinculado a cliente e serviço válidos
- `end_at` deve ser posterior a `scheduled_at`
- conflitos de horário devem ser bloqueados pela regra de negócio
- agendamentos cancelados não devem contar como ativos
- agendamentos concluídos podem gerar pagamento

## 4.5 Payment

Representa o pagamento relacionado a um atendimento.

### Finalidade
Registrar a liquidação financeira de um serviço executado ou reservado, conforme regra definida.

### Campos propostos

| Campo | Tipo sugerido | Obrigatório | Observação |
|------|---------------|-------------|------------|
| id | uuid | Sim | Chave primária |
| appointment_id | uuid | Sim | Referência para Appointment |
| amount | decimal | Sim | Valor pago |
| status | enum | Sim | pending, paid, refunded, failed |
| method | enum | Não | cash, pix, credit_card, debit_card, other |
| paid_at | timestamp | Não | Data do pagamento |
| external_reference | varchar | Não | Futuro uso com gateway |
| created_at | timestamp | Sim | Data de criação |
| updated_at | timestamp | Sim | Data de atualização |

### Regras
- pagamento deve referenciar um agendamento válido
- `amount` não pode ser negativo
- `paid_at` deve existir quando status for `paid`
- um agendamento pode ter um ou mais registros conforme política adotada

## 5. Relacionamentos

## 5.1 User e Client
- Um `User` pode estar vinculado a zero ou um `Client`
- Um `Client` pode estar vinculado a zero ou um `User`

Tipo:
- 1:1 opcional

## 5.2 Client e Appointment
- Um `Client` pode possuir muitos `Appointments`
- Um `Appointment` pertence a um único `Client`

Tipo:
- 1:N

## 5.3 Service e Appointment
- Um `Service` pode estar presente em muitos `Appointments`
- Um `Appointment` referencia um único `Service`

Tipo:
- 1:N

## 5.4 Appointment e Payment
- Um `Appointment` pode possuir zero ou muitos `Payments`
- Um `Payment` pertence a um único `Appointment`

Tipo:
- 1:N

## 6. Diagrama Relacional Simplificado

```text
User
 └── (0..1) Client
        └── (1..N) Appointment
                ├── (N..1) Service
                └── (1..N) Payment
```

## 7. Enums Sugeridos

## 7.1 UserRole

```text
admin
attendant
client
```

## 7.2 AppointmentStatus

```text
scheduled
completed
cancelled
no_show
```

## 7.3 PaymentStatus

```text
pending
paid
refunded
failed
```

## 7.4 PaymentMethod

```text
cash
pix
credit_card
debit_card
other
```

## 8. Restrições e Integridade

## 8.1 Chaves primárias
Todas as entidades principais devem usar `uuid` como chave primária.

## 8.2 Chaves estrangeiras
Devem existir constraints explícitas para:

- `client.user_id -> user.id`
- `appointment.client_id -> client.id`
- `appointment.service_id -> service.id`
- `appointment.created_by_user_id -> user.id`
- `payment.appointment_id -> appointment.id`

## 8.3 Unicidade
Restrições sugeridas:

- `user.email` único
- opcionalmente `client.user_id` único para garantir vínculo 1:1

## 8.4 Regras de exclusão
Sugestão inicial:

- impedir exclusão física de registros com relacionamento operacional relevante
- preferir desativação lógica em `User` e `Service`
- evitar cascatas destrutivas em dados transacionais

## 9. Índices Recomendados

Para melhor desempenho em consultas comuns, recomenda-se índice em:

- `user.email`
- `client.email`
- `appointment.scheduled_at`
- `appointment.status`
- `appointment.client_id`
- `appointment.service_id`
- `payment.appointment_id`
- `payment.status`

Esses índices favorecem consultas operacionais e administrativas.

## 10. Considerações sobre Datas e Horários

O sistema lida diretamente com agendamento, portanto o tratamento de datas exige atenção especial.

Recomendações:
- armazenar timestamps de forma consistente
- definir estratégia clara de timezone desde o início
- padronizar exibição no frontend
- validar conflitos de horário no backend

## 11. Seed Inicial

A base inicial deve conter dados minimos para testes, demonstracao local e demo publica com dados sinteticos.

Sugestão de seed:

### Users
- 1 admin
- 1 attendant
- 1 client com login

### Clients
- 3 clientes de exemplo

### Services
- corte de cabelo
- consulta inicial
- aula experimental

### Appointments
- alguns horários futuros
- pelo menos um agendamento concluído
- pelo menos um cancelado

### Payments
- 1 pagamento pendente
- 1 pagamento concluído

## 12. Exemplo de Schema Conceitual em Prisma

Exemplo simplificado apenas para orientação estrutural:

```prisma
enum UserRole {
  admin
  attendant
  client
}

enum AppointmentStatus {
  scheduled
  completed
  cancelled
  no_show
}

enum PaymentStatus {
  pending
  paid
  refunded
  failed
}

enum PaymentMethod {
  cash
  pix
  credit_card
  debit_card
  other
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         UserRole
  active       Boolean  @default(true)
  client       Client?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Client {
  id           String         @id @default(uuid())
  name         String
  email        String?
  phone        String?
  notes        String?
  userId       String?        @unique
  user         User?          @relation(fields: [userId], references: [id])
  appointments Appointment[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model Service {
  id              String         @id @default(uuid())
  name            String
  description     String?
  durationMinutes Int
  price           Decimal
  active          Boolean        @default(true)
  appointments    Appointment[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model Appointment {
  id              String            @id @default(uuid())
  clientId        String
  serviceId       String
  createdByUserId String?
  scheduledAt     DateTime
  endAt           DateTime
  status          AppointmentStatus
  notes           String?
  client          Client            @relation(fields: [clientId], references: [id])
  service         Service           @relation(fields: [serviceId], references: [id])
  payments        Payment[]
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

model Payment {
  id                String        @id @default(uuid())
  appointmentId     String
  amount            Decimal
  status            PaymentStatus
  method            PaymentMethod?
  paidAt            DateTime?
  externalReference String?
  appointment       Appointment   @relation(fields: [appointmentId], references: [id])
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}
```

## 13. Evoluções Futuras da Modelagem

A modelagem pode crescer para atender cenários mais completos:

### Company
Permite multi-tenant, separando dados por empresa.

### Employee
Permite associar atendimentos a profissionais específicos.

### WorkingHours
Permite configurar horários de funcionamento e disponibilidade.

### Notification
Permite registrar lembretes por e-mail ou mensageria.

### AuditLog
Permite rastrear ações críticas do sistema.

### RefreshToken
Permite controle mais robusto de sessão.

## 14. Riscos e Cuidados

Pontos que exigem atenção durante a implementação:

- colisão de horários em operações concorrentes
- definição correta entre usuário autenticado e cliente operacional
- política de exclusão versus desativação
- consistência entre status do agendamento e status do pagamento
- tratamento de timezone e horários comerciais

## 15. Conclusão

A modelagem proposta cobre os requisitos centrais do projeto e fornece base adequada para o desenvolvimento do MVP. Ela busca equilíbrio entre simplicidade, integridade relacional e potencial de evolução, sendo apropriada tanto para portfólio quanto para uma primeira versão comercializável do sistema.
