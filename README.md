# :space_invader: Projeto CG | **Pac-Man Three Js**

Esse projeto consiste em uma cena inspirada no jogo **Pacman** e seus **personagens**, implementada usando a biblioteca [**Three.js**](https://threejs.org/).
Na cena, tentamos simular o _fantasma_ perseguindo o _pacman_, enquanto esse anda em círculos para fugir do seu perseguidor.

![Funcionamento das câmeras](assets/cameras_gif.gif)

[**:arrow_forward: Como executar**](https://github.com/mutannejs/pacman_threejs#arrow_forward-como-executar) : uma breve descrição de como baixar e executar o projeto.

[**:computer: Implementação**](https://github.com/mutannejs/pacman_threejs#computer-implementação) : descreve como os principais elementos da cena foram implementados.

- [**Pac-Man**](https://github.com/mutannejs/pacman_threejs#pac-man) : como o personagem Pac-Man foi modelado.

- [**Fantasma**](https://github.com/mutannejs/pacman_threejs#fantasma) : como o Fantasma foi modelado.

[**:bulb: Iluminação**](https://github.com/mutannejs/pacman_threejs#bulb-ilumina%C3%A7%C3%A3o) : os diferentes tipos de luzes usadas na cena.

[**:movie_camera: Câmeras**](https://github.com/mutannejs/pacman_threejs#movie_camera-c%C3%A2meras) : descreve como as duas câmeras foram inseridas na cena para ser possível visualizar a cena a partir de dois pontos diferentes.

- [**Câmera 01**](https://github.com/mutannejs/pacman_threejs#c%C3%A2mera-01) : uma maior descrição de como a primeira câmera foi implementada e como uma `PerspectiveCamera` funciona.

- [**Câmera 02**](https://github.com/mutannejs/pacman_threejs#c%C3%A2mera-02) : uma maior descrição de como a segunda câmera foi implementada e como uma `OrthographicCamera` funciona.

[**:walking: Animação**](https://github.com/mutannejs/pacman_threejs#walking-anima%C3%A7%C3%A3o) : como a animação dos personagens foram criadas.

[**:house_with_garden: Plano e Shader**](https://github.com/mutannejs/pacman_threejs#house_with_garden-plano-e-shader) : como o plano foi implementado e também como o shader usado foi desenvolvido.

[**:busts_in_silhouette: Membros**](https://github.com/mutannejs/pacman_threejs#busts_in_silhouette-membros) : membros envolvidos no projeto.

## :arrow_forward: Como executar

Para executar o projeto é necessário fazer o download do zip do repositório ou cloná-lo usando o comando:

```
git clone https://github.com/mutannejs/pacman_threejs.git
```

Dentro da pasta, basta abrir o documento `pacman.html` no navegador de sua preferência.

Na parte superior da tela, temos a opção de alternar entre duas câmeras,  cada uma com uma visualização diferente da mesma cena. Para alternar entre elas, basta clicar nos botões **Câmera 1** ou **Câmera 2**.

## :computer: Implementação

Primeiramente, modelamos nossos dois personagens principais, o _Pacman_  e o _Fantasma_, ambos são na verdade do tipo `THREE.Group()`, que nada mais é que um grupo de objetos. Cada um desses objetos foi implementado em uma função própria, possibilitando a reutilização do código quando possível.

### Pac-Man
O **Pac-Man** é formado por 6 objetos:

- seus olhos são duas esferas, modeladas usando
 `THREE.SphereGeometry()`;
- seu corpo é formado por duas meia-esferas, implementadas usando
 `THREE.SphereGeometry()` passando como parâmetro _phiLenght_ igual a
 _Math.PI_, metade do valor padrão (Math.PI*2). As duas partes foram
 rotacionadas de modo que se complementassem como uma esfera inteira,
 possibilitando a animação que simula o abrir e fechar da boca do
 personagem;
- o interior de sua boca são dois discos, modelados usando
 `CircleGeometry()`, foram rotacionadas de modo que ficassem exatamente
 em cima da abertura das partes do corpo, cobrindo assim a abertura
 obtida ao definir o valor de _phiLenght_ como _Math.PI_.

### Fantasma
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
 encostasse na borda da cabeça do personagem.

Todos os objetos usados na criação dos personagens são do tipo
 `THREE.Mesh()`, o qual usa modelos geométricos e possui como
 material `THREE.MeshLambertMaterial()`, possibilitando a interação dos
 objetos com as luzes e sombras definidas na cena.
 
## :bulb: Iluminação

A cena possui dois tipos de luzes.

Uma do tipo **direcional**, implementada usando `THREE.DirectionalLight()`, necessária para gerar sombras onde a luz não bate diretamente e deixar mais claro onde isso ocorre, a fim de trazer maior realismo.
 
A outra é a **luz ambiente**, implementada usando
 `THREE.AmbientLight()`, necessária para fornecer uma luz mínima à cena,
 possibilitando visualizar todos os objetos, mesmo que nenhuma luz
 direcional atinja os objetos em questão.

Para ser possível visualizar as sombras geradas a partir da utilização
 da luz direcional, foi necessário reposicioná-la em um local afastado
 da câmera, pois se ambos os elementos estivessem na mesma direção em
 relação à cena, as sombras se projetariam atrás dos objetos, onde a
 câmera não pudesse capturá-las.

## :movie_camera: Câmeras

Como mencionado na descrição de como executar o projeto, a cena possui
 duas câmeras que podem ser escolhidas para gerar imagens diferentes
 da cena. Ambas após serem cridas, foram inseridas em um elemento do
 tipo `THREE.ArrayCamera`, possibilitando e facilitando a escolha de
 apenas uma câmera para gerar imagem durante a renderização da cena.

### Câmera 01
A **primeira câmera** foi implementada usando
 `THREE.PerspectiveCamera()`, e mostra a cena do modo como os seres
 humanos enxergam, ou seja, com perspectiva. Essa escolha faz com que
 ao decorrer da animação, os objetos em cena fiquem maiores ou menores
 dependendo da distância que estão da câmera, podendo até mesmo ficarem
 distorcidos.
 
Ao reposicionar a câmera na cena, foi necessário usar o método
 `lookAt(scene.position)` para redirecioná-la ao
 centro da cena, centralizando a imagem em relação ao local onde os
 personagens se encontram, sem que sumam da tela durante a animação.

 ![Primeira câmera](assets/pacman_01.png)

### Câmera 02

A segunda câmera tem a perspectiva ortográfica. Nesse modo de projeção, o tamanho dos objetos são constantes independente da distância da câmera. Sabendo disso, para os objetos não ficarem muito pequenos, a propriedade `.zoom` foi alterada de 1 (Default) para 90. Essa câmera dá ênfase nas ondulações e na animação do plano em relação aos personagens. 

 ![Segunda câmera](assets/pacman_02.png)

## :walking: Animações

Para criar a animação da cena e dos personagens, primeiramente foi
 criado outro elemento do tipo `THREE.Group()` chamado de _system_, ao
 qual foi adicionado o pacman e o fantasma. Os personagens foram
 reposicionados e rotacionados para que ficassem um pouco distantes do
 centro do _system_ e para que o fantasma ficasse atrás do pacman.

O movimento de **"andar"** dos personagens, foi implementado como o
 rotacionamento de _system_ em torno do _eixo Y_, assim, o pacman e o
 fantasma parecem rodar em círculos, enquanto um persegue o outro sem
 nunca alcançá-lo.

O movimento de **"comer"** do pacman, foi implementado como o
 rotacionamento das duas partes do corpo do pacman (considerando uma
 parte a junção de uma meia-esfera e de um disco) em torno do _eixo Y_,
 porém, como os objetos que compõem o personagem foram rotacionados
 exatamente _Math.PI*0.5_ em torno do _eixo X_, esse rotacionamento
 parece estar sendo feito em torno do _eixo Z_ ou do _eixo X_ dependendo
 do momento. Lembrando que os eixos X e Y do pacman estão sempre
 mundando de posição durante a animação.

## :house_with_garden: Plano e Shader

Na cena, há um plano posicionado em baixo dos personagens para o qual escolhemos utilizar um shader.

- Vertex Shader

O vertex shader é o responsável pela posição de cada pixel. No trabalho, definimos o a posição como um movimento senoidal em função da posição em z e em função do tempo. 

- Fragment Shader

O fragment shader é responsável pela cor. Escolhemos o tom azul para a variável `gl_FragColor`.

- Uniforms

Uniforms são variáveis que podem ser passadas da aplicação para o programa de shader. Essa variável foi definida para definir as propriedades do tempo, já que o movimento senoidal do vertex shader depende disso.

## :busts_in_silhouette: Membros

Paula Caires Silva - [https://github.com/paulacaires](https://github.com/paulacaires)

Murillo Justino dos Santos - [https://github.com/mutannejs](https://github.com/mutannejs)
