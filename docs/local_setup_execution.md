# Guia de Setup Local e Execução do Projeto

## 1. Objetivo

Este documento apresenta um roteiro sequencial para preparar o ambiente local de desenvolvimento do Projeto Âncora 3 — Agendamento SaaS e executar a base do sistema no computador.

A proposta é permitir que a instalação e a configuração sejam feitas passo a passo, com indicação clara de:

- qual aplicativo usar
- em qual ambiente executar
- em que pasta estar
- qual resultado validar antes de seguir

Este guia parte da premissa de uso de:

- Windows como sistema principal
- Ubuntu via WSL como ambiente de desenvolvimento
- VS Code como editor
- Docker Desktop para o banco de dados
- Node.js para frontend e backend

## 2. Convenção deste guia

Ao longo do documento, cada etapa informa explicitamente onde a ação deve ser feita.

### Ambientes possíveis

**No Windows**
Usar quando a ação envolver interface gráfica, instalação de programas ou abertura de aplicativos.

**No terminal do Ubuntu**
Usar quando a ação envolver comandos de desenvolvimento, criação do projeto, Git, Node.js, Docker, frontend, backend e banco.

**No VS Code**
Usar quando a ação envolver edição de arquivos.

## 3. Resultado esperado ao final

Ao concluir este guia, o ambiente local deverá estar com:

- pasta do projeto criada dentro do WSL
- Node.js funcionando
- Docker funcionando
- banco PostgreSQL rodando em container
- estrutura inicial do projeto criada
- frontend preparado para rodar
- backend preparado para rodar
- fluxo operacional básico compreendido

## 4. Etapa 1. Validar se o WSL e o Ubuntu estão disponíveis

### Onde executar
No Windows

### Ação
Abrir o menu iniciar e procurar por:

- Ubuntu
- Windows Terminal, se preferir abrir o Ubuntu por ele

### Validação
O Ubuntu deve abrir normalmente e exibir algo como:

```bash
seu-usuario@nome-da-maquina:~$
```

Se o Ubuntu ainda não estiver instalado, esta etapa precisa ser resolvida antes de continuar.

## 5. Etapa 2. Atualizar o Ubuntu

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git unzip
```

### Validação
O comando deve terminar sem erro.

### Observação
Esses pacotes preparam o ambiente para compilar dependências, usar Git e baixar arquivos necessários.

## 6. Etapa 3. Criar a pasta principal de projetos

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
mkdir -p ~/projetos
cd ~/projetos
pwd
```

### Validação
O resultado do `pwd` deve ser:

```bash
/home/seu-usuario/projetos
```

## 7. Etapa 4. Instalar o Node.js com nvm

### Onde executar
No terminal do Ubuntu

### Comando de instalação do nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### Ação após a instalação
Fechar e abrir novamente o terminal do Ubuntu.

Se preferir, recarregar manualmente:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

### Instalar a versão LTS do Node.js

```bash
nvm install --lts
nvm use --lts
node -v
npm -v
```

### Validação
Os comandos `node -v` e `npm -v` devem mostrar versões instaladas.

## 8. Etapa 5. Escolher o gerenciador de pacotes

### Onde executar
No terminal do Ubuntu

### Recomendação
Pode usar apenas `npm` no início para reduzir complexidade.

Se quiser usar `pnpm`, instalar agora:

```bash
npm install -g pnpm
pnpm -v
```

### Validação
Escolher uma das opções abaixo e manter padrão no projeto:

- usar apenas `npm`
- ou usar apenas `pnpm`

Para o início deste projeto, manteremos os exemplos com `npm`.

## 9. Etapa 6. Instalar e validar o Docker Desktop

### Onde executar
No Windows para instalar
No terminal do Ubuntu para validar

### Ação no Windows
Instalar o Docker Desktop e garantir que a integração com WSL esteja habilitada.

### Depois, validar no Ubuntu

```bash
docker --version
docker compose version
```

### Validação
Os dois comandos devem retornar versões válidas.

### Observação
Se o comando `docker` não for reconhecido, o Docker Desktop provavelmente não está integrado corretamente com o WSL.

## 10. Etapa 7. Criar a pasta do projeto

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos
mkdir agendamento-saas
cd agendamento-saas
mkdir frontend backend docs
pwd
```

### Validação
O `pwd` deve indicar:

```bash
/home/seu-usuario/projetos/agendamento-saas
```

## 11. Etapa 8. Abrir o projeto no VS Code

### Onde executar
No terminal do Ubuntu e depois no VS Code

### Comando

```bash
cd ~/projetos/agendamento-saas
code .
```

### Validação
O VS Code deve abrir a pasta do projeto conectada ao WSL.

### Observação
Se o comando `code` não funcionar, abra o VS Code manualmente e use a extensão Remote - WSL para abrir a pasta Linux.

## 12. Etapa 9. Criar o arquivo docker-compose.yml

### Onde executar
No VS Code

### Local do arquivo
Na raiz do projeto:

```text
/home/seu-usuario/projetos/agendamento-saas/docker-compose.yml
```

### Conteúdo sugerido

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
      - "${POSTGRES_PORT:-5434}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Validação
Salvar o arquivo sem erros de sintaxe.

## 13. Etapa 10. Subir o banco PostgreSQL

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos/agendamento-saas
docker compose up -d
docker ps
```

### Validação
O `docker ps` deve mostrar um container PostgreSQL em execução.

### Observação
A partir daqui o banco já deve estar disponível em:

- host: localhost
- porta: 5434
- usuário: postgres
- senha: postgres
- banco: agendamento_db

## 14. Etapa 11. Criar o frontend com Next.js

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos/agendamento-saas
rm -rf frontend
npx create-next-app@latest frontend
```

### Durante o assistente
Escolher TypeScript.
Se aparecerem perguntas adicionais, manter escolhas simples e padronizadas para começar.

### Validação
Ao final, a pasta `frontend` deve conter os arquivos do projeto Next.js.

## 15. Etapa 12. Testar o frontend

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos/agendamento-saas/frontend
npm run dev
```

### Validação
Abrir no navegador do Windows:

```text
http://localhost:3000
```

A página padrão do Next.js deve aparecer.

### Observação
Deixar esse terminal aberto enquanto o frontend estiver rodando.
Se a porta `3000` estiver ocupada, o Next.js pode abrir em `3001`.

## 16. Etapa 13. Criar o backend com NestJS

### Onde executar
No terminal do Ubuntu

### Instalar CLI do NestJS

```bash
npm install -g @nestjs/cli
```

### Criar o projeto

```bash
cd ~/projetos/agendamento-saas
rm -rf backend
nest new backend
```

### Validação
A pasta `backend` deve conter a estrutura base do NestJS.

## 17. Etapa 14. Testar o backend

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos/agendamento-saas/backend
npm run start:dev
```

### Validação
O terminal deve indicar que a aplicação está rodando.

Abrir no navegador:

```text
http://localhost:3000
```

Se houver conflito de porta com o frontend, isso precisará ser ajustado logo depois.

## 18. Etapa 15. Ajustar a porta do backend

### Onde executar
No VS Code

### Arquivo
`backend/src/main.ts`

### Ação
Alterar a porta padrão para 3333.

Exemplo:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3333);
}
bootstrap();
```

### Depois, reiniciar o backend

No terminal do backend:

```bash
Ctrl + C
npm run start:dev
```

### Validação
Abrir no navegador:

```text
http://localhost:3333
```

A resposta padrão do NestJS deve aparecer.

## 19. Etapa 16. Instalar Prisma no backend

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos/agendamento-saas/backend
npm install prisma @prisma/client
npx prisma init
```

### Validação
Devem ser criados:

- pasta `prisma`
- arquivo `.env`

## 20. Etapa 17. Configurar conexão com o banco

### Onde executar
No VS Code

### Arquivo
`backend/.env`

### Definir:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/agendamento_db?schema=public"
```

### Validação
Salvar o arquivo corretamente.

## 21. Etapa 18. Criar o primeiro schema Prisma

### Onde executar
No VS Code

### Arquivo
`backend/prisma/schema.prisma`

### Ação
Substituir o schema inicial por um modelo mínimo para teste.

Exemplo:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String
  active       Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Validação
Salvar sem erro.

## 22. Etapa 19. Executar a primeira migração

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos/agendamento-saas/backend
npx prisma migrate dev --name init
npx prisma generate
```

### Validação
A migração deve ser criada com sucesso e o cliente Prisma gerado.

## 23. Etapa 20. Abrir o Prisma Studio

### Onde executar
No terminal do Ubuntu

### Comando

```bash
cd ~/projetos/agendamento-saas/backend
npx prisma studio
```

### Validação
Abrir no navegador o endereço informado pelo comando, normalmente:

```text
http://localhost:5555
```

A interface do Prisma Studio deve aparecer.

## 24. Etapa 21. Criar um arquivo .gitignore adequado

### Onde executar
No VS Code

### Arquivo
Na raiz do projeto, criar `.gitignore`

### Conteúdo sugerido

```gitignore
node_modules
dist
.next
.env
.env.local
coverage
*.log
```

### Validação
Salvar o arquivo.

## 25. Etapa 22. Inicializar o Git

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos/agendamento-saas
git init
git status
```

### Validação
O Git deve ser inicializado na raiz do projeto.

## 26. Etapa 23. Fazer o primeiro commit

### Onde executar
No terminal do Ubuntu

### Comandos

```bash
cd ~/projetos/agendamento-saas
git add .
git commit -m "chore: setup inicial do ambiente local"
```

### Validação
O commit deve ser criado com sucesso.

## 27. Etapa 24. Fluxo diário padrão para continuar o projeto

Depois que o setup estiver concluído, o fluxo diário recomendado será este.

### Subir o banco
No terminal do Ubuntu, na raiz do projeto:

```bash
cd ~/projetos/agendamento-saas
docker compose up -d
```

### Rodar backend
Em um terminal separado:

```bash
cd ~/projetos/agendamento-saas/backend
npm run start:dev
```

### Rodar frontend
Em outro terminal separado:

```bash
cd ~/projetos/agendamento-saas/frontend
npm run dev
```

### Acessos esperados
No navegador:

- frontend: `http://localhost:3000`
- backend: `http://localhost:3333`

Se a porta `3000` estiver ocupada, usar a porta alternativa informada pelo Next.js, normalmente `3001`.

## 28. Etapa 25. Comandos importantes do dia a dia

### Conferir em que pasta você está

```bash
pwd
```

### Listar arquivos

```bash
ls
```

### Ver containers ativos

```bash
docker ps
```

### Parar banco

```bash
cd ~/projetos/agendamento-saas
docker compose down
```

### Rodar migração Prisma

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

## 29. Erros comuns e como evitar

### Erro 1. Criar o projeto em pasta do Windows
Evitar usar caminhos como:

```text
/mnt/c/Users/...
```

Sempre usar:

```text
/home/seu-usuario/projetos/...
```

### Erro 2. Rodar comando na pasta errada
Antes de qualquer comando importante, usar:

```bash
pwd
```

### Erro 3. Confundir frontend com backend
Manter sempre:

- um terminal para frontend
- um terminal para backend
- um terminal para Docker ou comandos gerais

### Erro 4. Docker não responder no Ubuntu
Revisar integração do Docker Desktop com o WSL.

### Erro 5. Porta já em uso
Confirmar que:
- frontend usa 3000 por padrao
- backend usa 3333

## 30. Checklist final de validação

Ao concluir o setup, confirmar:

- Ubuntu funcionando
- Node.js funcionando
- Docker funcionando
- projeto salvo dentro do WSL
- banco PostgreSQL rodando
- frontend rodando em `localhost:3000` ou `localhost:3001`
- backend rodando em `localhost:3333`
- Prisma conectado ao banco
- Git inicializado
- primeiro commit realizado

## 31. Conclusão

Se todas as etapas foram concluídas, o ambiente local está pronto para iniciar o desenvolvimento real do sistema.

A partir daqui, o próximo passo é começar a implementação conforme a ordem definida no backlog, iniciando por autenticação, usuários e estrutura base da API.
