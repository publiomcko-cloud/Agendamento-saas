# Fluxos de Telas e Navegação

## 1. Objetivo

Este documento descreve os fluxos principais de navegação e as telas previstas para o Sistema Web de Agendamento e Gestão para Pequenas Empresas. Seu papel é orientar a construção da interface, reduzir retrabalho e alinhar frontend com regras de negócio e perfis de acesso.

## 2. Princípios de Navegação

A navegação deve seguir alguns princípios simples:

- clareza de acesso por perfil
- poucas camadas de profundidade
- fluxo operacional direto
- feedback visível em ações importantes
- consistência entre listagem, criação e edição

## 3. Perfis Considerados

Os fluxos foram organizados para três perfis:

- administrador
- atendente
- cliente

Cada perfil terá acesso apenas às telas pertinentes ao seu papel.

## 4. Estrutura Geral de Navegação

## 4.1 Fluxo público
- página de login

## 4.2 Fluxo autenticado administrativo
- dashboard
- usuários
- clientes
- serviços
- agendamentos
- pagamentos

## 4.3 Fluxo autenticado do cliente
- meus agendamentos
- novo agendamento
- perfil, se for implementado no MVP

## 5. Telas do Sistema

## 5.1 Tela de Login

### Objetivo
Permitir autenticação de usuários no sistema.

### Elementos principais
- campo de e-mail
- campo de senha
- botão de entrar
- mensagem de erro em falha de autenticação

### Ações possíveis
- autenticar usuário
- redirecionar para o painel conforme perfil

### Regras
- usuário autenticado não deve voltar ao login sem logout
- mensagem de erro deve ser objetiva

## 5.2 Dashboard Administrativo

### Objetivo
Apresentar visão resumida da operação.

### Elementos principais
- total de agendamentos do dia
- próximos atendimentos
- total de pagamentos ou receita simples
- atalhos para ações principais

### Ações possíveis
- acessar clientes
- acessar serviços
- acessar agendamentos
- acessar pagamentos

### Regras
- disponível para admin
- opcionalmente disponível para atendente com versão reduzida

## 5.3 Tela de Usuários

### Objetivo
Permitir gestão de contas internas do sistema.

### Elementos principais
- tabela de usuários
- botão de criar usuário
- ação de editar
- status ativo ou inativo

### Ações possíveis
- listar
- cadastrar
- editar
- ativar ou inativar

### Regras
- acesso apenas para admin

## 5.4 Tela de Clientes

### Objetivo
Permitir gestão dos clientes atendidos.

### Elementos principais
- tabela de clientes
- busca por nome, e-mail ou telefone
- botão de novo cliente
- botão de editar
- acesso ao histórico básico

### Ações possíveis
- criar cliente
- editar cliente
- listar clientes
- visualizar detalhes do cliente

### Regras
- admin e atendente podem acessar
- cliente final não acessa esta tela administrativa

## 5.5 Tela de Serviços

### Objetivo
Permitir gestão dos serviços oferecidos.

### Elementos principais
- lista de serviços
- nome
- duração
- preço
- status ativo
- botão de novo serviço

### Ações possíveis
- criar
- editar
- ativar ou desativar
- listar

### Regras
- admin pode gerenciar
- atendente pode visualizar, se necessário

## 5.6 Tela de Agendamentos

### Objetivo
Permitir visão operacional da agenda.

### Elementos principais
- lista de agendamentos
- filtro por data
- filtro por status
- botão de novo agendamento
- ações de cancelar e reagendar

### Ações possíveis
- criar agendamento
- editar observações
- cancelar
- reagendar
- filtrar

### Regras
- admin e atendente visualizam agenda operacional
- cliente visualiza apenas seus agendamentos

## 5.7 Tela de Novo Agendamento

### Objetivo
Criar agendamento com validações de negócio.

### Elementos principais
- seleção de cliente
- seleção de serviço
- data e horário
- campo de observações
- botão de confirmar

### Ações possíveis
- submeter novo agendamento
- cancelar operação

### Regras
- backend valida conflito de horário
- frontend deve exibir mensagens claras de sucesso ou falha

## 5.8 Tela de Meus Agendamentos

### Objetivo
Permitir que o cliente acompanhe seus atendimentos.

### Elementos principais
- lista dos agendamentos do cliente
- status
- data e horário
- opção de cancelar ou reagendar quando permitido

### Ações possíveis
- visualizar
- cancelar
- reagendar

### Regras
- cliente só acessa os próprios registros

## 5.9 Tela de Pagamentos

### Objetivo
Registrar e consultar pagamentos relacionados aos atendimentos.

### Elementos principais
- lista de pagamentos
- status
- método
- valor
- botão de registrar pagamento

### Ações possíveis
- criar pagamento
- atualizar status, se permitido
- filtrar por status

### Regras
- admin acessa integralmente
- atendente pode registrar pagamento conforme política definida

## 6. Fluxos Principais

## 6.1 Fluxo de Login

1. Usuário acessa tela de login
2. Informa e-mail e senha
3. Sistema autentica
4. Usuário é redirecionado para a área correspondente ao perfil

## 6.2 Fluxo de Cadastro de Cliente

1. Admin ou atendente acessa tela de clientes
2. Clica em novo cliente
3. Preenche formulário
4. Salva registro
5. Sistema exibe confirmação
6. Cliente aparece na listagem

## 6.3 Fluxo de Cadastro de Serviço

1. Admin acessa tela de serviços
2. Clica em novo serviço
3. Informa nome, duração e valor
4. Salva registro
5. Sistema exibe confirmação
6. Serviço fica disponível para agendamento

## 6.4 Fluxo de Novo Agendamento

1. Usuário autorizado acessa novo agendamento
2. Seleciona cliente
3. Seleciona serviço
4. Escolhe data e horário
5. Submete formulário
6. Backend valida conflito
7. Sistema confirma ou informa erro
8. Agendamento aparece na agenda

## 6.5 Fluxo de Cancelamento

1. Usuário autorizado acessa lista de agendamentos
2. Seleciona um registro
3. Aciona cancelar
4. Sistema atualiza status
5. Agenda reflete a mudança

## 6.6 Fluxo de Registro de Pagamento

1. Usuário autorizado acessa tela de pagamentos ou o detalhe do agendamento
2. Informa valor, método e status
3. Salva registro
4. Sistema vincula pagamento ao agendamento
5. Tela reflete o novo status

## 7. Navegação por Perfil

## 7.1 Administrador
Fluxo sugerido:
- login
- dashboard
- usuários
- clientes
- serviços
- agendamentos
- pagamentos

## 7.2 Atendente
Fluxo sugerido:
- login
- dashboard reduzido ou agenda
- clientes
- agendamentos
- pagamentos, se permitido

## 7.3 Cliente
Fluxo sugerido:
- login
- meus agendamentos
- novo agendamento
- logout

## 8. Componentes Visuais Reutilizáveis

Para manter consistência, o frontend deve reaproveitar componentes como:

- layout principal
- menu lateral ou superior
- tabela padrão
- formulário padrão
- modal de confirmação
- badge de status
- alertas de erro e sucesso
- botões padronizados

## 9. Estados de Interface Necessários

Cada tela principal deve prever:

- carregamento
- erro
- vazio sem dados
- sucesso em ação
- confirmação de operações sensíveis

## 10. Regras de UX Importantes

- ações principais devem estar visíveis
- erros devem ser compreensíveis
- filtros devem ser simples
- formulários não devem ser excessivamente longos
- confirmação visual deve existir após criar, editar ou cancelar

## 11. Evoluções Futuras

Os fluxos podem evoluir para incluir:

- calendário visual
- notificações automáticas
- área de perfil mais completa
- filtros avançados
- relatórios gráficos
- onboarding inicial de empresa

## 12. Conclusão

Os fluxos descritos definem uma base clara para construção da interface do sistema. Eles devem ser usados como referência de navegação e distribuição de telas durante o desenvolvimento do frontend, mantendo alinhamento com os perfis de acesso e com o escopo do MVP.
