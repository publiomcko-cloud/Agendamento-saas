# Arquitetura do Ambiente Local de Desenvolvimento

## 1. Objetivo

Este documento define a arquitetura recomendada do ambiente local de desenvolvimento para o Projeto Âncora 1, um sistema web full-stack de agendamento e gestão para pequenas empresas.

O foco deste documento é estabelecer, de forma prática e operacional:

- quais aplicações devem ser instaladas
- como organizar o projeto no computador
- onde cada comando deve ser executado
- como rodar frontend, backend e banco localmente
- quando usar terminal do Windows, terminal do Ubuntu no WSL e ferramentas gráficas
- como manter o ambiente estável para desenvolvimento contínuo

Este documento foi pensado para reduzir confusão operacional e servir como referência durante toda a implementação.

## 2. Estratégia Geral do Ambiente

A recomendação para este projeto é utilizar uma arquitetura híbrida simples:

- desenvolvimento principal no computador local
- código-fonte armazenado dentro do ambiente Linux do WSL
- edição do projeto com VS Code
- execução de comandos principalmente no terminal do Ubuntu
- banco de dados local em Docker ou instalação local controlada
- publicação futura em nuvem apenas após o MVP estar funcional

Essa abordagem oferece bom equilíbrio entre:

- produtividade
- realismo de mercado
- baixo custo
- facilidade de manutenção
- menor risco de incompatibilidade entre ferramentas

## 3. Arquitetura Recomendada

## 3.1 Camadas do ambiente

O ambiente local pode ser entendido em quatro camadas:

### Camada 1. Sistema hospedeiro
É o Windows instalado no computador.

Responsável por:
- executar interface gráfica
- abrir VS Code
- hospedar o WSL
- hospedar Docker Desktop, se utilizado

### Camada 2. Ambiente Linux de desenvolvimento
É o Ubuntu rodando via WSL.

Responsável por:
- armazenar os arquivos do projeto
- executar comandos de desenvolvimento
- rodar Node.js, npm, pnpm e NestJS
- executar Prisma, migrações e seed
- interagir com Docker
- executar Git

### Camada 3. Ferramentas de desenvolvimento
São os aplicativos utilizados no dia a dia.

Principais:
- VS Code
- terminal do Ubuntu
- Docker Desktop
- navegador
- GitHub

### Camada 4. Serviços locais
São os serviços necessários para o projeto rodar.

Principais:
- frontend Next.js
- backend NestJS
- banco PostgreSQL
- eventualmente Prisma Studio

## 4. Regra Mais Importante do Ambiente

O projeto deve ficar salvo dentro do Linux do WSL, e não dentro da pasta do Windows.

Exemplo recomendado:

```text
/home/seu-usuario/projetos/agendamento-saas
```

Exemplo que deve ser evitado:

```text
/mnt/c/Users/SeuNome/Desktop/projetos/agendamento-saas
```

### Motivo
Guardar projeto dentro do sistema de arquivos Linux costuma trazer:

- melhor desempenho
- menos bugs com permissões
- menos problemas com Node.js, npm e Docker
- comportamento mais previsível para ferramentas web

## 5. Aplicativos Recomendados

## 5.1 Obrigatórios

### 1. WSL com Ubuntu
Função:
- ambiente Linux principal de desenvolvimento

### 2. Visual Studio Code
Função:
- editor principal do projeto

Extensões recomendadas:
- Remote - WSL
- ESLint
- Prettier
- Prisma
- Docker
- GitLens

### 3. Git
Função:
- versionamento

### 4. Node.js
Função:
- executar frontend e backend

### 5. npm ou pnpm
Função:
- gerenciar dependências

### 6. Docker Desktop
Função:
- rodar PostgreSQL local em container
- facilitar ambiente reproduzível

### 7. Navegador
Função:
- testar frontend e documentação da API

## 5.2 Opcionais mas úteis

### 1. DBeaver
Função:
- visualizar banco PostgreSQL graficamente

### 2. Postman ou Insomnia
Função:
- testar endpoints manualmente

### 3. Prisma Studio
Função:
- inspecionar dados do banco de forma simples

## 6. Onde Executar Cada Coisa

Essa seção é a mais importante operacionalmente.

## 6.1 VS Code
Executar no Windows, mas abrindo o projeto dentro do WSL.

Fluxo recomendado:
1. abrir o VS Code
2. conectar no ambiente WSL
3. abrir a pasta Linux do projeto

O projeto deve ser aberto por algo equivalente a:

```text
/home/seu-usuario/projetos/agendamento-saas
```

Não abrir preferencialmente a pasta via caminho do Windows.

## 6.2 Terminal principal do projeto
O terminal principal deve ser o terminal do Ubuntu no WSL.

É nele que devem ser executados quase todos os comandos do projeto, incluindo:

- `git`
- `npm install`
- `pnpm install`
- `npx prisma migrate dev`
- `npm run dev`
- `npm run start:dev`
- `docker compose up -d`
- comandos de build
- comandos de teste

## 6.3 Docker Desktop
A interface gráfica roda no Windows, mas os comandos normalmente devem ser executados no terminal do Ubuntu.

Exemplo:
- abrir Docker Desktop pelo Windows
- subir containers pelo terminal do Ubuntu

## 6.4 Navegador
Pode ser usado normalmente no Windows.

Exemplo de acesso:
- frontend em `http://localhost:3000`
- backend em `http://localhost:3333`
- Swagger em `http://localhost:3333/api`
- Prisma Studio em `http://localhost:5555`

## 7. Estrutura de Pastas Recomendada

Estrutura local sugerida:

```text
/home/seu-usuario/
└── projetos/
    └── agendamento-saas/
        ├── frontend/
        ├── backend/
        ├── docs/
        ├── docker-compose.yml
        ├── .gitignore
        ├── README.md
        └── .env.example
```

## 8. Organização Operacional do Projeto

## 8.1 Pasta `frontend`
Responsável pela aplicação Next.js.

Comandos dessa pasta devem ser executados nela mesma.

Exemplo:

```bash
cd ~/projetos/agendamento-saas/frontend
npm install
npm run dev
```

## 8.2 Pasta `backend`
Responsável pela API NestJS e Prisma.

Comandos dessa pasta devem ser executados nela mesma.

Exemplo:

```bash
cd ~/projetos/agendamento-saas/backend
npm install
npm run start:dev
```

## 8.3 Arquivo `docker-compose.yml`
Responsável por subir serviços auxiliares, especialmente o PostgreSQL local.

O comando deve ser executado na raiz do projeto.

Exemplo:

```bash
cd ~/projetos/agendamento-saas
docker compose up -d
```

## 9. Fluxo Recomendado de Instalação do Ambiente

## Etapa 1. Preparar Ubuntu no WSL

Executar no terminal do Ubuntu:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git unzip
```

## Etapa 2. Criar pasta principal de projetos

Executar no terminal do Ubuntu:

```bash
mkdir -p ~/projetos
cd ~/projetos
```

## Etapa 3. Instalar Node.js

A recomendação é usar `nvm` para gerenciar versões.

Executar no terminal do Ubuntu:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Depois fechar e abrir o terminal, ou recarregar o shell.

Executar:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
node -v
npm -v
```

## Etapa 4. Instalar pnpm, se quiser usar

Executar no terminal do Ubuntu:

```bash
npm install -g pnpm
pnpm -v
```

Se preferir, pode usar apenas `npm`. O importante é escolher um e manter padrão.

## Etapa 5. Instalar Docker Desktop no Windows

Executar no Windows:
- instalar Docker Desktop
- habilitar integração com WSL
- garantir que o Ubuntu esteja integrado

Depois validar no terminal do Ubuntu:

```bash
docker --version
docker compose version
```

## Etapa 6. Criar o projeto

Executar no terminal do Ubuntu:

```bash
cd ~/projetos
mkdir agendamento-saas
cd agendamento-saas
mkdir frontend backend docs
```

## 10. Estratégia Recomendada para Banco de Dados

## 10.1 Melhor opção para início
Usar PostgreSQL em Docker.

### Motivos
- instalação mais limpa
- fácil reset
- menos sujeira no sistema
- mais próximo de ambiente reproduzível
- fácil apagar e recriar

## 10.2 Exemplo de `docker-compose.yml`

Criar na raiz do projeto:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: agendamento_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: agendamento_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 10.3 Como subir o banco

Executar na raiz do projeto, no terminal do Ubuntu:

```bash
cd ~/projetos/agendamento-saas
docker compose up -d
```

## 10.4 Como verificar se subiu

Executar no terminal do Ubuntu:

```bash
docker ps
```

## 10.5 Como parar o banco

Executar na raiz do projeto:

```bash
docker compose down
```

## 11. Estratégia Recomendada para Backend

## 11.1 Ferramenta
NestJS com TypeScript.

## 11.2 Onde criar
Na pasta `backend`.

Exemplo de criação, no terminal do Ubuntu:

```bash
cd ~/projetos/agendamento-saas
npm i -g @nestjs/cli
nest new backend
```

Se a pasta já existir e estiver vazia, pode remover e recriar de forma controlada antes.

## 11.3 Comandos principais do backend

Executar dentro de `backend`:

```bash
cd ~/projetos/agendamento-saas/backend
npm install
npm run start:dev
npm run test
npm run build
```

## 11.4 Prisma no backend

Executar dentro de `backend`:

```bash
npm install prisma @prisma/client
npx prisma init
```

Depois editar `.env` com a conexão do banco.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agendamento_db?schema=public"
```

Comandos principais do Prisma, executados em `backend`:

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio
```

## 12. Estratégia Recomendada para Frontend

## 12.1 Ferramenta
Next.js com TypeScript.

## 12.2 Onde criar
Na pasta `frontend`.

Executar no terminal do Ubuntu:

```bash
cd ~/projetos/agendamento-saas
npx create-next-app@latest frontend
```

## 12.3 Comandos principais do frontend

Executar dentro de `frontend`:

```bash
cd ~/projetos/agendamento-saas/frontend
npm install
npm run dev
npm run build
```

## 13. Portas Recomendadas

Para evitar confusão, padronizar portas desde o início.

Sugestão:

- frontend: 3000
- backend: 3333
- postgres: 5432
- prisma studio: 5555

## 14. Fluxo Diário de Trabalho

A rotina recomendada é esta.

## 14.1 Início do dia

No terminal do Ubuntu:

```bash
cd ~/projetos/agendamento-saas
docker compose up -d
```

Depois abrir dois terminais adicionais.

### Terminal 1, backend

```bash
cd ~/projetos/agendamento-saas/backend
npm run start:dev
```

### Terminal 2, frontend

```bash
cd ~/projetos/agendamento-saas/frontend
npm run dev
```

### Navegador
Abrir:
- `http://localhost:3000`
- `http://localhost:3333`
- `http://localhost:3333/api`, se Swagger estiver ativo

## 14.2 Durante o desenvolvimento

Executar conforme necessidade no terminal do Ubuntu:

### Rodar migrações
```bash
cd ~/projetos/agendamento-saas/backend
npx prisma migrate dev --name nome_da_migracao
```

### Gerar cliente Prisma
```bash
cd ~/projetos/agendamento-saas/backend
npx prisma generate
```

### Abrir Prisma Studio
```bash
cd ~/projetos/agendamento-saas/backend
npx prisma studio
```

### Rodar testes do backend
```bash
cd ~/projetos/agendamento-saas/backend
npm run test
```

### Fazer commit
```bash
cd ~/projetos/agendamento-saas
git status
git add .
git commit -m "mensagem do commit"
git push
```

## 14.3 Fim do dia

Pode manter ou parar os serviços.

Para parar o banco:

```bash
cd ~/projetos/agendamento-saas
docker compose down
```

## 15. Onde Cada Tipo de Comando Deve Ser Executado

## 15.1 Na raiz do projeto
Executar na raiz quando o comando afetar múltiplas partes do sistema ou containers.

Exemplos:
- `docker compose up -d`
- `docker compose down`
- `git status`
- `git add .`
- `git commit`

## 15.2 Dentro de `backend`
Executar quando o comando afetar a API, Prisma, testes do backend ou build do backend.

Exemplos:
- `npm run start:dev`
- `npm run test`
- `npx prisma migrate dev`
- `npx prisma studio`

## 15.3 Dentro de `frontend`
Executar quando o comando afetar a interface.

Exemplos:
- `npm run dev`
- `npm run build`

## 15.4 No Windows e não no Ubuntu
Executar no Windows apenas o que for interface gráfica do sistema ou instalação do hospedeiro.

Exemplos:
- instalar Docker Desktop
- abrir VS Code
- abrir navegador
- gerenciar configurações do Windows

## 16. Convenção para Terminais

Para evitar confusão, usar sempre a mesma lógica:

- Terminal A: raiz do projeto e Docker
- Terminal B: backend
- Terminal C: frontend

Isso reduz erros de contexto.

## 17. Boas Práticas do Ambiente Local

- manter projeto no WSL
- evitar misturar comandos Linux e Windows no mesmo fluxo
- usar um gerenciador de versão do Node
- não instalar banco manualmente se Docker resolver
- manter `.env.example` atualizado
- usar Git desde o primeiro dia
- criar commits pequenos e frequentes
- não executar comandos do backend dentro do frontend e vice-versa

## 18. Erros Operacionais Comuns

## 18.1 Rodar projeto em pasta do Windows
Problema:
- lentidão
- bugs com permissões
- comportamento inconsistente

## 18.2 Esquecer em qual pasta está
Problema:
- comandos falham
- dependências instalam no lugar errado

Comando útil para conferir:

```bash
pwd
```

## 18.3 Rodar Docker sem integração WSL
Problema:
- `docker` não encontrado
- containers não sobem corretamente

## 18.4 Misturar npm e pnpm sem critério
Problema:
- lockfiles conflitantes
- comportamento inconsistente

## 18.5 Subir frontend e backend na mesma porta
Problema:
- erro de porta ocupada

## 19. Arquitetura Operacional Recomendada para Este Projeto

Resumo final da recomendação:

- Windows como sistema hospedeiro
- Ubuntu no WSL como ambiente principal
- VS Code conectado ao WSL
- projeto salvo em `/home/...`
- PostgreSQL em Docker
- frontend Next.js local
- backend NestJS local
- Git e comandos operacionais no terminal do Ubuntu
- deploy em nuvem apenas depois do MVP funcional

## 20. Conclusão

Para este projeto, a melhor arquitetura local é simples, previsível e próxima do ambiente profissional real. O centro operacional deve ser o Ubuntu no WSL, com o projeto salvo dentro do Linux e os comandos de desenvolvimento executados no terminal do Ubuntu.

Essa organização reduz atrito, melhora desempenho e cria uma base adequada para construir, testar e publicar o sistema com estabilidade.
