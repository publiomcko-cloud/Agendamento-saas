# Instruções para o Agente de Desenvolvimento

## 1. Objetivo deste arquivo

Este documento define como o agente deve conduzir o desenvolvimento do Projeto Âncora 1. Ele existe para reduzir ambiguidades, evitar expansão indevida de escopo e garantir alinhamento entre implementação, documentação e objetivo de portfólio.

O agente deve tratar este arquivo como ponto inicial de leitura e como referência operacional durante toda a execução do projeto.

## 2. Objetivo do projeto

O projeto consiste em um sistema web full-stack de agendamento e gestão para pequenas empresas, com foco em cenário real de mercado e em valor de portfólio profissional.

O sistema deve permitir, em sua primeira versão:

- autenticação de usuários
- controle por perfis
- cadastro de clientes
- cadastro de serviços
- criação e gestão de agendamentos
- registro manual de pagamentos
- dashboard administrativo básico
- deploy inicial
- observabilidade básica

## 3. Prioridade do projeto

A prioridade principal não é sofisticação excessiva. A prioridade é:

1. concluir o MVP com qualidade
2. manter consistência arquitetural
3. demonstrar práticas reais de desenvolvimento
4. produzir um projeto publicável, legível e demonstrável

O agente não deve sacrificar conclusão por excesso de engenharia.

## 4. Documentos de referência obrigatórios

O agente deve usar os documentos em `docs/` na seguinte hierarquia:

### Documento principal de escopo
- `escopo_mvp_projeto_ancora_1.md`

Este documento define o que entra e o que não entra na primeira versão.

### Documento principal de ordem de execução
- `backlog_mvp_projeto_ancora_1.md`

Este documento define a sequência recomendada de construção.

### Documento principal de arquitetura
- `arquitetura_projeto_ancora_1.md`

Este documento define a estrutura técnica da solução.

### Documento principal de modelagem
- `modelagem_banco_projeto_ancora_1.md`

Este documento define as entidades, relacionamentos e bases do banco.

### Documento principal de frontend e navegação
- `fluxos_telas_projeto_ancora_1.md`

Este documento orienta a construção das telas e dos fluxos por perfil.

### Documento principal do ambiente local
- `arquitetura_ambiente_local_projeto_ancora_1.md`
- `setup_local_execucao_projeto_ancora_1.md`

Esses documentos orientam como o projeto deve rodar localmente.

## 5. Fonte da verdade em caso de conflito

Em caso de divergência entre documentos, aplicar a seguinte precedência:

1. `escopo_mvp_projeto_ancora_1.md`
2. `backlog_mvp_projeto_ancora_1.md`
3. `arquitetura_projeto_ancora_1.md`
4. `modelagem_banco_projeto_ancora_1.md`
5. `fluxos_telas_projeto_ancora_1.md`
6. demais documentos

Se ainda houver ambiguidade, o agente deve escolher a alternativa mais simples, consistente com o MVP e mais fácil de concluir.

## 6. Regras obrigatórias de implementação

O agente deve seguir as regras abaixo sem exceção, salvo atualização explícita da documentação.

### Regra 1. Não expandir escopo do MVP
Não implementar antes do tempo itens como:

- gateway de pagamento
- multi-tenant
- notificações automáticas
- calendário avançado
- relatórios complexos
- integrações externas
- microsserviços
- cache avançado
- filas
- permissões granulares além do necessário

### Regra 2. Seguir a stack definida
Stack esperada:

#### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

#### Backend
- NestJS
- Node.js
- TypeScript

#### Banco
- PostgreSQL
- Prisma ORM

#### Testes
- Jest
- Supertest

#### Infra local
- Docker para PostgreSQL

O agente não deve trocar a stack sem justificativa forte e sem atualização documental correspondente.

### Regra 3. Implementar em ordem incremental
A ordem preferencial é:

1. setup do projeto
2. autenticação e autorização
3. usuários
4. clientes
5. serviços
6. agendamentos
7. pagamentos
8. dashboard
9. testes
10. deploy e observabilidade

### Regra 4. Manter separação clara entre frontend e backend
O agente deve manter responsabilidades separadas:

- frontend para interface e consumo da API
- backend para regras de negócio, autenticação e persistência

### Regra 5. Não simplificar a ponto de quebrar valor de portfólio
O projeto deve continuar demonstrando:

- autenticação real
- API organizada
- banco com migração
- seed
- testes de endpoints críticos
- healthcheck
- logs básicos

### Regra 6. Não complexificar sem necessidade
Evitar abstrações prematuras, arquitetura excessiva ou organização que torne o projeto mais difícil de concluir e explicar.

## 7. Critérios de qualidade esperados

O agente deve produzir código que atenda aos seguintes critérios:

- nomenclatura clara e consistente
- estrutura de pastas coerente
- validação de entrada
- tratamento básico de erro
- baixo acoplamento entre módulos
- legibilidade suficiente para portfólio
- facilidade de execução local
- ausência de código morto evidente
- ausência de dependências desnecessárias

## 8. Critérios mínimos de pronto por módulo

Cada módulo só deve ser considerado concluído quando tiver:

- modelagem coerente
- rotas ou interface funcional, conforme o caso
- validação mínima
- integração com os fluxos existentes
- funcionamento local validado
- atualização da documentação, se houver mudança relevante

## 9. Regras para banco de dados

O agente deve seguir a modelagem proposta e só alterar estrutura quando houver necessidade concreta de implementação.

Ao alterar entidades ou relações:

- atualizar schema Prisma
- criar migração correspondente
- manter consistência entre documentação e implementação
- preservar o escopo do MVP

O agente deve preferir:

- `uuid` como chave primária
- integridade relacional explícita
- desativação lógica quando fizer sentido
- consultas simples e previsíveis

## 10. Regras para API

A API deve seguir padrão REST simples e consistente.

O agente deve buscar:

- nomes claros de endpoints
- status HTTP adequados
- payloads coerentes
- separação por módulos
- autenticação por JWT
- proteção de rotas privadas
- autorização por perfil quando aplicável

O agente deve manter a API fácil de documentar com Swagger.

## 11. Regras para frontend

O frontend deve seguir os fluxos descritos na documentação e priorizar utilidade, clareza e consistência visual.

O agente deve priorizar:

- navegação simples
- telas funcionais
- formulários claros
- feedback de erro e sucesso
- proteção de rotas por autenticação
- diferenciação por perfil

O frontend não precisa ser visualmente sofisticado no início. Deve ser limpo, utilizável e coerente.

## 12. Regras para testes

O agente não precisa buscar cobertura total, mas deve implementar testes para fluxos críticos do backend.

Testes mínimos esperados:
- login
- autorização por perfil
- criação de agendamento
- bloqueio de conflito de horário
- registro de pagamento
- healthcheck

## 13. Regras para observabilidade e produção

Mesmo em projeto de portfólio, o agente deve incluir:

- logs estruturados ou ao menos organizados
- endpoint `GET /health`
- tratamento global de erros no backend
- variáveis de ambiente organizadas
- `.env.example`

## 14. Regras de documentação

O agente deve manter a documentação viva.

Quando houver mudança relevante em:
- arquitetura
- modelagem
- escopo
- fluxo principal
- setup

o agente deve atualizar os documentos correspondentes em `docs/`.

Se a mudança não alterar decisão estrutural, não é necessário reescrever documentação excessivamente.

## 15. Regras de versionamento

O agente deve organizar o trabalho em incrementos pequenos e rastreáveis.

Boas práticas esperadas:
- commits pequenos e coerentes
- mensagens de commit claras
- evitar alterações massivas sem necessidade
- não misturar refatoração ampla com criação de funcionalidade sem motivo

## 16. Estratégia de tomada de decisão em caso de dúvida

Se houver dúvida técnica e mais de uma solução possível, o agente deve preferir a alternativa que seja:

1. compatível com o escopo do MVP
2. consistente com os documentos existentes
3. mais simples de manter
4. mais rápida de concluir com qualidade
5. mais fácil de explicar em portfólio e entrevista

## 17. O que o agente deve entregar primeiro

Primeira meta prática:

- estrutura base do repositório
- frontend criado
- backend criado
- banco local em Docker
- Prisma configurado
- primeira modelagem de usuários
- autenticação inicial funcional

Antes de avançar para módulos secundários, o agente deve consolidar essa base.

## 18. Critério de sucesso do projeto

O projeto será considerado bem-sucedido se entregar um MVP funcional que permita demonstrar, de forma clara:

- sistema full-stack real
- autenticação e perfis
- CRUD operacional
- regras de agendamento
- persistência consistente
- documentação
- testes essenciais
- execução local
- deploy inicial

## 19. Conclusão

O agente deve tratar este projeto como um produto de portfólio profissional, com foco em conclusão sólida do MVP, clareza arquitetural e qualidade suficiente para demonstração pública e avaliação técnica.

Em caso de dúvida, deve sempre preservar o escopo, a simplicidade e a capacidade de entrega.
