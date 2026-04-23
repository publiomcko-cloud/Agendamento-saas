# Definição de Escopo do MVP

## 1. Objetivo

Este documento define o escopo mínimo viável do Sistema Web de Agendamento e Gestão para Pequenas Empresas. Sua função é limitar a primeira versão do produto, reduzir risco de escopo excessivo e garantir que o projeto seja concluído com qualidade e utilidade demonstrável.

## 2. Princípio do MVP

O MVP deve ser suficientemente completo para:

- demonstrar valor real de negócio
- comprovar domínio técnico full-stack
- servir como peça forte de portfólio
- permitir uma demonstração funcional ponta a ponta

Ao mesmo tempo, o MVP não deve tentar resolver todos os cenários futuros do produto.

## 3. O que o MVP precisa provar

A primeira versão precisa provar que o sistema consegue:

- autenticar usuários com perfis distintos
- cadastrar clientes e serviços
- criar e gerenciar agendamentos
- impedir conflitos básicos de agenda
- registrar pagamentos
- oferecer uma visão administrativa inicial
- rodar localmente e em ambiente publicado

## 4. Escopo Funcional Incluído

## 4.1 Autenticação
Incluído no MVP:
- login
- proteção de rotas
- controle de acesso por perfil
- hash de senha

Fora do MVP:
- recuperação de senha por e-mail
- autenticação social
- refresh token avançado

## 4.2 Perfis de Usuário
Incluído no MVP:
- admin
- atendente
- cliente

Fora do MVP:
- perfis customizáveis
- permissões granulares por recurso

## 4.3 Gestão de Clientes
Incluído no MVP:
- cadastro
- listagem
- edição
- visualização individual

Fora do MVP:
- histórico avançado
- segmentação
- importação em massa

## 4.4 Gestão de Serviços
Incluído no MVP:
- cadastro
- listagem
- edição
- ativação e desativação

Fora do MVP:
- categorias de serviço
- combos
- promoções

## 4.5 Agendamentos
Incluído no MVP:
- criação
- cancelamento
- reagendamento
- listagem por perfil
- validação de conflito de horário

Fora do MVP:
- agenda em visualização de calendário avançada
- encaixe inteligente
- lista de espera
- recorrência

## 4.6 Pagamentos
Incluído no MVP:
- registro manual de pagamento
- status do pagamento
- método de pagamento

Fora do MVP:
- integração com gateway
- pagamento online
- parcelamento
- emissão fiscal

## 4.7 Dashboard
Incluído no MVP:
- agenda do dia
- total de agendamentos
- total de pagamentos
- visão operacional simples

Fora do MVP:
- relatórios avançados
- comparação por período
- gráficos analíticos complexos

## 4.8 Observabilidade
Incluído no MVP:
- logs estruturados
- endpoint de healthcheck
- tratamento padronizado de erros

Fora do MVP:
- tracing distribuído
- alertas automáticos
- integração com plataforma de monitoramento externa

## 4.9 Testes
Incluído no MVP:
- testes de autenticação
- testes de autorização
- testes de criação de agendamento
- testes de bloqueio de conflito
- testes de pagamento
- teste de healthcheck

Fora do MVP:
- cobertura ampla de frontend
- testes end-to-end completos
- testes de carga

## 5. Escopo Técnico Incluído

O MVP deve incluir:

- frontend funcional
- backend modular
- PostgreSQL
- Prisma com migrações
- seed inicial
- documentação de API básica
- deploy inicial
- variáveis de ambiente organizadas

## 6. Escopo Técnico Excluído do MVP

Itens desejáveis, mas não obrigatórios para a primeira entrega:

- multi-tenant
- fila assíncrona
- cache
- integração com serviços externos
- arquitetura orientada a eventos
- microsserviços
- permissões altamente granulares
- auditoria completa

## 7. Critérios de Pronto do MVP

O MVP será considerado pronto quando atender aos seguintes critérios:

- autenticação funcional para os três perfis
- CRUD básico de clientes e serviços disponível
- criação e gestão de agendamentos funcionando
- conflito de agenda bloqueado no backend
- pagamento manual registrado com consistência
- dashboard inicial funcional
- testes dos endpoints críticos executando com sucesso
- API documentada em nível inicial
- aplicação publicada
- README atualizado com instruções de execução e links principais

## 8. Funcionalidades que Devem Esperar

Para evitar dispersão, os itens abaixo não devem entrar antes da conclusão do MVP:

- integração com WhatsApp
- notificações automáticas
- gateway de pagamento
- calendário visual avançado
- relatórios sofisticados
- recursos multiempresa
- área pública de marketing
- personalização estética extensa

## 9. Limites de Escopo

Decisões práticas para manter o foco:

- não criar painéis diferentes demais visualmente
- não tentar resolver todos os tipos de negócio na primeira versão
- não modelar multi-tenant antes de validar o fluxo central
- não antecipar integrações externas sem necessidade
- não refatorar excessivamente antes da primeira entrega funcional

## 10. Cenário de Demonstração do MVP

O MVP deve ser demonstrável no seguinte fluxo:

1. Administrador faz login
2. Administrador cadastra serviços
3. Administrador ou atendente cadastra cliente
4. Agendamento é criado
5. Sistema valida horário
6. Atendimento é listado no painel
7. Pagamento é registrado
8. Dashboard exibe dados operacionais básicos

Esse fluxo deve funcionar ponta a ponta.

## 11. Conclusão

O escopo do MVP foi definido para equilibrar valor de negócio, viabilidade de entrega e força de portfólio. Ele deve ser tratado como limite operacional do projeto até a primeira publicação funcional.
