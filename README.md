# pacman_threejs

## Conceito do projeto

Esse projeto consiste em uma cena baseada no jogo **Pacman** e seus
 **personagens**, implementada usando a biblioteca [**Three.js**](https://threejs.org/).

Na cena temos o _fantasminha_ perseguindo o _pacman_, enquanto esse anda
 em círculos para fugir do seu perseguidor.

## Execução

Para executar o projeto, antes é necessário fazer download do zip do
 repositório ou cloná-lo usando o comando:

```
git clone https://github.com/mutannejs/pacman_threejs.git
```

Dentro da pasta, basta abrir o documento `pacman.html` no navegador de
 sua preferência.

## Câmeras

Na parte superior da tela, temos a opção de alternar entre duas câmeras,
 cada uma com uma visualização diferente da mesma cena. Para alternar
 entre elas, basta clicar nos botões **Câmera 1** ou **Câmera 2**.

### Câmera 1

Na **câmera 1** podemos ver a cena ...

![pacman_01.js](assets/pacman_01.jpg)

### Câmera 2

Na **câmera 2** podemos ver a cena ...

![pacman_02.js](assets/pacman_02.jpg)

## Implementação

Primeiramente, modelamos nossos dois personagens principais, o _Pacman_
 e o _Fantasma_, ambos são na verdade do tipo `THREE.Group()`, que nada
 mais é que um grupo de objetos. Cada um desses objetos foi implementado
 em uma função própria, possibilitando a reutilização do código quando
 possível.

O **pacman** é formado por 6 objetos:

- seus olhos são duas esferas, modeladas usando
 `THREE.SphereGeometry()`;
- seu corpo é formado por duas meia-esferas, implementadas usando
 `THREE.SphereGeometry()` passando como parâmetro _phiLenght_ igual a
 _Math.PI_, metade do valor padrão (Math.PI*2). As duas partes foram
 rotacionadas de modo que se complementassem como uma esfera,
 possibilitando a animação que simula o abrir e fechar da boca do
 personagem;
- o interior de sua boca são dois discos, modelados usando
 `CircleGeometry()`, foram rotacionadas de modo que ficassem exatamente
 em cima da abertura das partes do corpo, cobrindo assim a abertura
 obtida ao definir o valor de _phiLenght_ como _Math.PI_.

O **fantasma** é formado por 6 objetos:

- seus olhos também são do tipo `THREE.Group()`, e cada um deles é
 formado por duas esferas, uma de cor preta, e outra azul com diâmetro
 igual a metade da outra esfera, posicionada de modo que represente
 a íris do olho, ambas modeladas usando `THREE.SphereGeometry()`;
- sua cabeça é formada por uma meia-esfera, implementada usando
 `THREE.SphereGeometry()` passando como parâmetro _phiLenght_ igual a
 _Math.PI_, metade do valor padrão (Math.PI*2). Ela foi rotacionada de
 modo que sua abertura ficasse direcionada para baixo;
- a parte de baixo do seu corpo é formado por um cilindro, modelado
 usando `THREE.CylinderGeometry()` passando como argumento _openEnded_
 igual a _true_, fazendo assim com que as extremidades do cilindro
 sejam abertas. Ele foi posicionado de modo que sua parte superior
 encostasse na borda de sua cabeça.

Todos os objetos usados na criação dos personagens são variáveis do tipo
 `THREE.Mesh()`, modelados usando formas geométricas e possuindo como
 material `THREE.MeshLambertMaterial()`, possibilitando a interação com
 as luzes e sombras definidas na cena.

A cena possui dois tipos de luzes. Uma do tipo **direcional**,
 implementada usando `THREE.DirectionalLight()`, necessária para gerar
 sombras onde a luz não bate diretamente e deixar mais claro onde isso
 ocorre, a fim de trazer maior realismo. A outra é a **luz ambiente**,
 implementada usando `THREE.AmbientLight()`, necessária para fornecer
 uma luz mínima à cena, possibilitando visualizar todos os objetos,
 mesmo que nenhuma luz direcional atinja os objetos em questão.

## Membros

Paula Caires Silva - [https://github.com/paulacaires](https://github.com/paulacaires)

Murillo Justino dos Santos - [https://github.com/mutannejs](https://github.com/mutannejs)
