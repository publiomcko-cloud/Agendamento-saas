# Inventario da Documentacao

## Objetivo

Este documento organiza a pasta `docs/` apos a padronizacao dos nomes de arquivos em ingles.

O conteudo dos documentos permanece em portugues. Os nomes dos arquivos usam ingles para manter padrao tecnico consistente no repositorio.

## Documentacao publica de portfolio

Arquivos recomendados para avaliadores, recrutadores e clientes:

- `project_overview.md`: visao geral do projeto e estado atual.
- `current_state.md`: estado operacional atual da demo publica.
- `case_study.md`: estudo de caso com problema, solucao, decisoes e trade-offs.
- `portfolio_readiness.md`: checklist de prontidao para portfolio.
- `demo_script.md`: roteiro curto para demonstrar o produto.
- `public_demo_deployment.md`: guia da demo publica em Vercel, Render e Supabase.
- `testing.md`: comandos de validacao e testes.
- `final_mvp_review.md`: revisao final de aderencia do MVP.

## Documentacao tecnica de referencia

Arquivos uteis para entender arquitetura, dominio e implementacao:

- `architecture.md`: arquitetura do sistema.
- `database_modeling.md`: modelagem relacional e regras de dados.
- `screen_flows.md`: fluxos de telas e navegacao.
- `local_environment_architecture.md`: arquitetura recomendada do ambiente local.
- `initial_deployment.md`: referencia operacional do deploy inicial.
- `class_diagram.html`: diagrama de classes em HTML.
- `backend_class_diagram.mmd`: diagrama Mermaid do backend.
- `domain_class_diagram.mmd`: diagrama Mermaid do dominio.

## Documentacao interna ou historica

Estes documentos continuam no repositorio porque ajudam a entender o processo de construcao, mas nao precisam ser destacados no README publico:

- `agent_instructions.md`: instrucoes operacionais usadas durante o desenvolvimento assistido.
- `mvp_backlog.md`: backlog original de implementacao, mantido como historico de planejamento.
- `local_setup_execution.md`: guia detalhado de setup local passo a passo, mais longo que o necessario para avaliacao rapida.
- `demo_video_lessons.md`: aprendizados internos sobre gravacao do video demo.
- `scheduling_system_project_anchor.pdf`: artefato PDF original do projeto.

## Conteudo sem utilidade atual

Nao foi identificado conteudo que precise ser removido neste momento.

Os documentos historicos ainda tem valor como registro de planejamento e execucao. A decisao tomada foi nao apaga-los, mas tambem nao destaca-los na documentacao publica principal.

## Convencao adotada

- nome de arquivo em ingles
- conteudo em portugues
- documentos publicos linkados no README
- documentos internos mantidos em `docs/`, mas sem destaque publico
- links locais revisados apos renomeacao
