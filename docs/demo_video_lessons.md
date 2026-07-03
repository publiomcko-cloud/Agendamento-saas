# Aprendizados do Video Demo

## Objetivo

Este documento registra como o video demo do projeto foi produzido e quais problemas foram encontrados durante as tentativas anteriores.

O objetivo principal e evitar repetir erros em futuros videos de portfolio.

## Script final

O script final esta em:

```text
scripts/record-demo-video.js
```

Ele grava a demo publica do projeto:

```text
https://agendamento-saas-sigma.vercel.app
```

Fluxo coberto:

- login como admin
- dashboard
- usuarios
- clientes
- servicos
- agendamentos
- pagamentos
- conta
- logout
- login como cliente
- meus agendamentos
- novo agendamento
- conta do cliente

## Como rodar

O script depende do Playwright instalado no ambiente temporario usado para gravacao:

```bash
NODE_PATH=/tmp/agendamento-video/node_modules node scripts/record-demo-video.js
```

Ele gera um WebM em:

```text
docs/demo_video/agendamento-saas-demo.webm
```

Depois o arquivo pode ser convertido para MP4 com o ffmpeg temporario:

```bash
FFMPEG_PATH=$(node -e "console.log(require('/tmp/agendamento-video-convert/node_modules/@ffmpeg-installer/ffmpeg').path)")
"$FFMPEG_PATH" -y \
  -i docs/demo_video/agendamento-saas-demo.webm \
  -c:v libx264 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -preset medium \
  -crf 23 \
  -an \
  docs/demo_video/agendamento-saas-demo.mp4
```

No estado atual, o video oficial foi publicado no YouTube:

```text
https://youtu.be/TbuewDJhGYs
```

## Abordagem que funcionou

A abordagem final usa Playwright, mas nao depende do cursor nativo do sistema.

Principios usados:

- usar `recordVideo` do Playwright
- injetar um cursor visual no DOM
- manter a posicao do cursor em uma variavel do Node
- animar o cursor com `requestAnimationFrame`
- calcular o alvo com `locator.boundingBox()`
- clicar com `page.mouse.click(...)` na mesma coordenada do cursor visual
- usar `video.saveAs(...)` ao final
- converter WebM para MP4 apenas depois que a gravacao termina

O cursor visual e um elemento fixo:

```text
#portfolio-demo-cursor
```

O estilo do cursor e injetado dentro da pagina com:

```text
#portfolio-demo-cursor-style
```

Essa abordagem garante que o cursor apareca no video mesmo em gravacao headless.

## O que nao funcionou

### 1. Usar apenas o mouse normal do Playwright

O cursor nativo nem sempre aparece em videos gravados pelo browser.

O video pode registrar a tela, mas nao registrar o ponteiro do sistema.

Conclusao:

- nao confiar no cursor nativo para demo de portfolio
- sempre usar um cursor DOM customizado

### 2. Misturar cursor DOM com `locator.click()`

Uma tentativa anterior animava o cursor visual ate o alvo, mas depois chamava:

```text
locator.click()
```

Isso gerou comportamento imprevisivel, porque o Playwright pode mover o mouse internamente para realizar o clique.

Sintomas observados:

- cursor indo em diagonal para o canto superior esquerdo
- movimentos extras antes de mudar de posicao
- aparencia de cursor "nervoso"
- falta de controle visual sobre a acao real

Conclusao:

- se existe cursor visual, o clique real deve usar a mesma coordenada
- preferir `page.mouse.click(x, y)` depois de animar o cursor

### 3. Recriar ou resetar o cursor entre acoes

Algumas tentativas reinjetavam o cursor ou resetavam sua posicao depois de navegacoes.

Sintomas observados:

- cursor sumindo depois de certo tempo
- cursor reaparecendo em local inesperado
- cursor cruzando a tela em diagonal entre paginas
- movimento visual deselegante entre uma tela e outra

Conclusao:

- manter a posicao do cursor fora do DOM, em uma variavel do script
- reinjetar o elemento no DOM quando necessario, mas sem perder a posicao
- evitar transicoes CSS automaticas para `transform`

### 4. Usar transicao CSS para mover o cursor

Outra tentativa usou `transition: transform`.

Isso parece simples, mas tira controle do fluxo quando o DOM muda, quando a pagina re-renderiza ou quando o elemento e reinserido.

Sintomas observados:

- animacoes disparadas em momentos errados
- interpolacao a partir de posicoes antigas
- movimentos diagonais nao intencionais

Conclusao:

- animar manualmente com `requestAnimationFrame`
- controlar explicitamente origem, destino e duracao

### 5. Clicar no menu para toda navegacao

Navegar clicando no menu lateral/superior cria muitos movimentos longos ate a esquerda ou topo da tela.

Mesmo quando tecnicamente correto, isso deixa o video menos elegante.

Conclusao:

- clicar em elementos relevantes para demonstrar funcionalidades
- para transicoes entre paginas, usar `page.goto(...)` quando o objetivo for mostrar a proxima tela
- evitar movimentos repetitivos para o menu se eles nao agregam valor ao roteiro

## Checklist para proximos videos

Antes de gravar:

- confirmar que a demo publica esta online
- confirmar que dados sinteticos estao populados
- confirmar que login demo funciona
- deixar o roteiro curto e objetivo
- evitar acoes destrutivas reais

Durante a implementacao do script:

- usar cursor DOM customizado
- guardar a posicao do cursor em variavel do Node
- animar com `requestAnimationFrame`
- clicar com `page.mouse.click(...)`
- evitar `locator.click()` para acoes mostradas no video
- usar `.first()` quando o seletor puder encontrar mais de um elemento
- preferir labels e roles acessiveis
- usar `scrollIntoViewIfNeeded()` antes de calcular `boundingBox()`
- usar `video.saveAs(...)` no bloco `finally`

Depois de gravar:

- validar se o WebM foi gerado
- converter para MP4 com H.264
- assistir o video completo
- publicar em plataforma externa se o repositorio nao deve versionar video
- atualizar README e documentos com a URL final

## Decisao final deste projeto

O video local foi usado apenas como artefato intermediario.

A referencia publica oficial passou a ser:

```text
https://youtu.be/TbuewDJhGYs
```

Isso evita manter arquivos grandes no repositorio e facilita compartilhar a demo em portfolio, recrutamento e propostas comerciais.
