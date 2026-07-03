# Backlog de Implementação

## 1. Objetivo

Este documento organiza a execução do projeto em fases, épicos, funcionalidades e tarefas técnicas. O objetivo é transformar a documentação do sistema em um plano prático de construção, priorizando entrega incremental, clareza de escopo e viabilidade de conclusão.

## 1.1 Estado atual

O backlog original foi executado ate o ponto de um MVP de portfolio concluido. O sistema esta pronto para demonstracao local e publica ponta a ponta. A publicacao em nuvem foi realizada; proximas evolucoes sao opcionais e nao bloqueiam o encerramento do MVP.

## 2. Estratégia de Implementação

A implementação será conduzida em camadas, começando pela base estrutural do projeto, seguida pelas funcionalidades centrais do MVP e, por fim, pelos elementos de qualidade, testes e publicação.

Ordem de prioridade:

1. Estrutura base do projeto
2. Autenticação e autorização
3. Cadastro de entidades principais
4. Regras de agendamento
5. Pagamentos
6. Dashboard
7. Testes
8. Deploy e observabilidade
9. Refinamentos

## 3. Fases de Execução

## Fase 1. Setup do Projeto

### Objetivo
Preparar a base técnica do sistema para permitir desenvolvimento contínuo.

### Entregáveis
- repositório organizado
- backend inicial
- frontend inicial
- banco configurado
- variáveis de ambiente definidas

### Tarefas
- criar estrutura de pastas do projeto
- inicializar frontend com Next.js e TypeScript
- inicializar backend com NestJS e TypeScript
- configurar Prisma
- configurar PostgreSQL local
- criar arquivos `.env.example`
- configurar lint e formatter
- definir convenção de nomes e organização de módulos

## Fase 2. Autenticação e Autorização

### Objetivo
Permitir acesso seguro ao sistema com controle por perfil.

### Entregáveis
- login funcional
- registro inicial controlado
- guards por perfil
- fluxo de autenticação validado

### Tarefas
- modelar entidade User
- criar migration inicial de usuários
- implementar hash de senha
- implementar login
- implementar emissão de JWT
- implementar guard de autenticação
- implementar guard de autorização por papel
- proteger rotas privadas
- testar fluxo de login e acesso restrito

## Fase 3. Gestão de Clientes

### Objetivo
Permitir cadastro e consulta de clientes atendidos pela empresa.

### Entregáveis
- CRUD de clientes
- listagem administrativa
- detalhes de cliente

### Tarefas
- modelar entidade Client
- criar migration de clientes
- implementar criação de cliente
- implementar listagem de clientes
- implementar atualização de cliente
- implementar inativação ou remoção controlada
- validar vínculos entre usuário e cliente

## Fase 4. Gestão de Serviços

### Objetivo
Permitir parametrização dos serviços oferecidos.

### Entregáveis
- CRUD de serviços
- ativação e desativação
- preço e duração definidos

### Tarefas
- modelar entidade Service
- criar migration de serviços
- implementar criação de serviço
- implementar listagem de serviços
- implementar atualização de serviço
- implementar ativação e desativação
- validar duração e preço

## Fase 5. Agendamentos

### Objetivo
Implementar o núcleo funcional do sistema.

### Entregáveis
- criação de agendamento
- cancelamento
- reagendamento
- validação de conflito
- visualização por perfil

### Tarefas
- modelar entidade Appointment
- criar migration de agendamentos
- implementar criação de agendamento
- calcular horário final com base na duração do serviço
- validar conflito de horário
- implementar cancelamento
- implementar reagendamento
- implementar listagem por cliente
- implementar listagem administrativa
- implementar filtros por status e período

## Fase 6. Pagamentos

### Objetivo
Permitir registro financeiro vinculado ao atendimento.

### Entregáveis
- registro manual de pagamento
- atualização de status
- vínculo com agendamento

### Tarefas
- modelar entidade Payment
- criar migration de pagamentos
- implementar criação de pagamento
- implementar atualização de status
- implementar listagem por agendamento
- validar consistência entre agendamento e pagamento

## Fase 7. Dashboard Administrativo

### Objetivo
Oferecer visão resumida da operação.

### Entregáveis
- indicadores básicos
- agenda do dia
- visão de receita simples

### Tarefas
- definir consultas agregadas
- implementar endpoint de dashboard
- exibir total de agendamentos do dia
- exibir total de pagamentos
- exibir próximos atendimentos
- exibir serviços mais utilizados, se viável no MVP estendido

## Fase 8. Frontend e Fluxos de Interface

### Objetivo
Entregar a aplicação utilizável por todos os perfis.

### Entregáveis
- login
- dashboard
- módulos CRUD
- telas de agendamento
- navegação consistente

### Tarefas
- implementar layout base
- implementar tela de login
- implementar proteção de rotas
- implementar tela de dashboard
- implementar tela de clientes
- implementar tela de serviços
- implementar tela de agendamentos
- implementar tela de pagamentos
- implementar feedback visual de erro e sucesso

## Fase 9. Testes

### Objetivo
Validar os fluxos críticos do sistema.

### Entregáveis
- testes dos endpoints centrais
- validação mínima de regressão

### Tarefas
- configurar Jest e Supertest
- testar login
- testar autorização por perfil
- testar criação de cliente
- testar criação de serviço
- testar criação de agendamento
- testar bloqueio de conflito
- testar registro de pagamento
- testar healthcheck

## Fase 10. Observabilidade e Deploy

### Objetivo
Publicar o sistema e torná-lo monitorável em nível básico.

### Entregáveis
- artefatos de publicacao preparados e validados
- logs estruturados
- endpoint healthcheck funcional

### Tarefas
- configurar logger estruturado
- implementar filtro global de exceções
- implementar endpoint `/health`
- preparar build do backend
- preparar build do frontend
- configurar banco em ambiente remoto
- configurar variáveis de ambiente em produção
- publicar frontend
- publicar backend
- validar funcionamento completo em produção

## 4. Épicos Funcionais

## Épico A. Acesso e Segurança
- autenticação
- autorização
- proteção de rotas
- controle por perfil

## Épico B. Cadastro Operacional
- clientes
- serviços
- usuários administrativos

## Épico C. Agenda
- criar
- listar
- reagendar
- cancelar
- evitar conflito

## Épico D. Financeiro Básico
- registrar pagamento
- acompanhar status

## Épico E. Gestão e Visão Administrativa
- dashboard
- métricas básicas
- listagens operacionais

## 5. Priorização

## Prioridade Alta
- setup
- autenticação
- clientes
- serviços
- agendamentos

## Prioridade Média
- pagamentos
- dashboard
- testes centrais

## Prioridade Baixa
- relatórios avançados
- notificações
- integrações externas
- multi-tenant

## 6. Critério de Pronto por Fase

Uma fase só deve ser considerada concluída quando atender aos critérios abaixo:

- funcionalidade implementada
- validações mínimas aplicadas
- testes básicos realizados quando aplicável
- código integrado sem quebrar fluxos anteriores
- documentação atualizada quando necessário

## 7. Sequência Recomendada de Execução Semanal

### Semana 1
- setup completo
- autenticação
- estrutura de banco

### Semana 2
- clientes
- serviços
- base do frontend

### Semana 3
- agendamentos
- regras de conflito
- listagens principais

### Semana 4
- pagamentos
- dashboard
- testes centrais
- deploy inicial opcional

## 8. Riscos de Execução

- expandir o escopo cedo demais
- começar pelo frontend sem fechar regras de negócio
- atrasar testes até o fim
- não definir claramente o MVP
- misturar futuras evoluções com entrega inicial

## 9. Conclusão

Este backlog organiza o desenvolvimento em uma ordem lógica e controlada, reduzindo retrabalho e risco de dispersão. Ele deve ser usado como referência principal de execução durante a implementação do MVP.
