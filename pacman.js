var scene;
var camera;
var cameraAtual;
var renderer;
var plano;
var pacman;
var fase;
var abrir;


/*====		INICIO VAR SHADER		====*/

// String do Vertex shader
const VSHADER =	`varying vec2 v_uv;  
				void main() {
					v_uv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}`
				
// String do fragment shader
const FSHADER =	`varying vec2 v_uv;
				uniform vec2 u_mouse;
				uniform vec2 u_resolution;
				uniform vec3 u_color;
				uniform float u_time;
				
				void main() {
					vec2 v = u_mouse / u_resolution;
					vec2 uv = gl_FragCoord.xy / u_resolution;
					gl_FragColor = vec4(1.0, 0.0, sin(u_time * 5.0) + 0.5, 1.0).rgba;
				}`

	
/*
 uniform: valor que passamos para o shader que são 
 aplicados uniformemente para cada pixel
*/			
const uniforms = {
  u_time: { value: 0.0 },
  u_color: { value: new THREE.Color(0xFF0000) }
};

const clock = new THREE.Clock();

/*====		FIM VAR SHADER		====*/

// Animação do pacman
var render = function() {

	requestAnimationFrame( render );

	// seta se o pacman deve abrir ou fechar a boca, muda a cada 39 fases.
	if (fase >= 39) {
		if (abrir == 1) {
			abrir = 0;
		} else {
			abrir = 1;
		}
		fase = 0;
	} else {
		fase++;
	}

	// anima as duas partes do pacman
	this.animatePacman();

	//adiciona renderização de sombras
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// rotação do sistema
	system.rotateY(0.009);
	renderer.render( scene, camera.cameras[cameraAtual] );
	
	uniforms.u_time.value = clock.getElapsedTime();
};

/*
cria o sistema: todos os objetos e o pai
desses objetos, ao redor do qual eles orbitam
*/
var createSystem = function() {

	system = new THREE.Group();

	// criar o centro, objeto pai
	// ao redor do qual os outros orbitam
	var material_centro = new THREE.MeshLambertMaterial( { color: 'black' } );
	var geometry_centro = new THREE.SphereGeometry( 0, 32, 16, 0);
	var centro = new THREE.Mesh( geometry_centro, material_centro );

	// criando o primeiro filho: o pacman
	var pacman = createPacman();
	// pacman passa a ser objeto filho do centro
	centro.add(pacman);

	// posicao inicial do pacman: atŕas do centro e um pouco à direita
	pacman.position.x = 1;
	pacman.position.z = -3;
	// com a abertura da boca virada para o lado da tela
	pacman.rotateY(Math.PI - 0.5);

	// criando o segundo filho: o fantasma
	var fantasma = createGhost();
	// fantasma passa a ser filho do centro
	centro.add(fantasma);

	// posicao do fantasma
	fantasma.position.x = 3;

	// angulo inicial
	fantasma.rotateY(Math.PI * 0.5);
	
	// criando o shader
	
	var shader = createShader();
	centro.add(shader);

	// adicionando o centro no sistema
	system.add(centro);
	scene.add(system);
}

// cria o fantasma
var createGhost = function() {

	ghost = new THREE.Group();

	var cabeca = createGhostHead();
	var corpo = createGhostBody();
	var olho1 = createGhostEye();
	var olho2 = createGhostEye();
 
	ghost.add(cabeca);
	ghost.add(corpo);
	ghost.add(olho1);
	ghost.add(olho2);

	// posiciona os olhos
	olho1.position.set(0.7, 0, 0.4);
	olho2.position.set(0.7, 0, -0.4);

	return( ghost );

}

// cria a cabeça do fantasma
var createGhostHead = function() {

	var geometry = new THREE.SphereGeometry( 0.9, 32, 16, 0, Math.PI );
	var material = new THREE.MeshLambertMaterial( { color: 'red' } );
	var cabeca = new THREE.Mesh( geometry, material );

	// adiciona efeitos de sombras
	cabeca.castShadow = true;
	cabeca.receiveShadow = true;

	// rotaciona a metade da esfera para ficar para "cima"
	cabeca.rotation.x += Math.PI*(-0.5);
	return (cabeca);

}

// cria o corpo do fantasma
var createGhostBody = function() {

	var geometry_body = new THREE.CylinderGeometry( 0.9, 0.9, 1, 64, 64, true); 
	var material_body = new THREE.MeshLambertMaterial( {color: 'red'} ); 
	var body = new THREE.Mesh( geometry_body, material_body );

	// adiciona efeitos de sombras
	body.castShadow = true;
	body.receiveShadow = true;

	body.position.y -= 0.45; 
	return (body);

}

// cria o olho do fantasma
var createGhostEye = function() {
	olho = new THREE.Group();

	// parte branca do olho
    var geometry_olhos = new THREE.SphereGeometry( 0.2, 32, 16, 0);
	var material_olhos = new THREE.MeshLambertMaterial( { color: 'white' } );
    var parte_olhos = new THREE.Mesh( geometry_olhos, material_olhos );

    // adiciona efeitos de sombras
	parte_olhos.castShadow = true;
	parte_olhos.receiveShadow = true;

	// pupila do olho
	var geometry_pupila = new THREE.SphereGeometry( 0.1, 32, 16, 0);
	var material_pupila = new THREE.MeshLambertMaterial( { color: 'blue' } );
    var pupila = new THREE.Mesh( geometry_pupila, material_pupila );

    // adiciona efeitos de sombras
	pupila.castShadow = true;
	pupila.receiveShadow = true;

	// reposicionando a pupila
	pupila.position.set(0.12, -0.01, 0);

	olho.add(parte_olhos);
	olho.add(pupila);
    return olho;
}

// cria o pacman
var createPacman = function() {

	pacman = new THREE.Group();

	// cria a metade de uma esfera e rotaciona ela em 90º, de modo que
	//     ela fique em baixo
	var me1 = createAMidEsphere();
	me1.rotation.x += Math.PI*0.5;

	// cria um disco e rotaciona ele em 90º, de modo que ele preencha a
	//     meia esfera de baixo
	var d1 = createADisc();
	d1.rotation.x += Math.PI*0.5;

	// cria a metade de uma esfera e rotaciona ela em 90º, de modo que
	//     ela fique em cima
	var me2 = createAMidEsphere();
	me2.rotation.x -= Math.PI*0.5;

	// cria um disco e rotaciona ele em 90º, de modo que ele preencha a
	//     meia esfera de cima
	var d2 = createADisc();
	d2.rotation.x -= Math.PI*0.5;

	// cria os olhos do Pac-Man
    var olho1 = createPacmanEyes();
    olho1.position.set(-0.1, 0.4, 0.8);

    var olho2 = createPacmanEyes();
    olho2.position.set(-0.1, 0.4, -0.8);
 
	pacman.add(me1);
	pacman.add(me2);
	pacman.add(d1);
	pacman.add(d2);
    pacman.add(olho1);
    pacman.add(olho2);

	return( pacman );
}

var createPacmanEyes = function() {
	olhos = new THREE.Group();

	var geometry_olhos = new THREE.SphereGeometry( 0.2, 32, 16, 0);
	var material_olhos = new THREE.MeshLambertMaterial( { color: 'black' } );
	parte_olhos = new THREE.Mesh( geometry_olhos, material_olhos );

	// adiciona efeitos de sombras
	parte_olhos.castShadow = true;
	parte_olhos.receiveShadow = true;

	olhos.add(parte_olhos);
	return olhos;
}

// cria uma metade de esfera
var createAMidEsphere = function() {

	// material que será usado
	var material = new THREE.MeshLambertMaterial( { color: 'yellow' } );

	// cria a metade de uma esfera
	//    argumentos : escala, linhas horizontais, linhas verticais, ângulo
	//    para iniciar a figura, "o quanto da esfera desenhar, Math.PI
	//    desenha só metade"
	var geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI );
	var meia_esfera = new THREE.Mesh( geometry, material );

	// adiciona efeitos de sombras
	meia_esfera.castShadow = true;
	meia_esfera.receiveShadow = true;

	return meia_esfera;

};

// cria um disco
var createADisc = function() {

	// material que será usado
	var material = new THREE.MeshLambertMaterial( { color: 'yellow' } );

	// cria um disco
	// argumentos : escala, linhas de contorno
	var circle = new THREE.CircleGeometry( 1, 32 );
	var disco = new THREE.Mesh( circle, material );

	// adiciona efeitos de sombras
	disco.castShadow = true;
	disco.receiveShadow = true;

	return disco;

}

var createShader = function () {
	 
	var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 1, 64, 64, true); 
	var material = new THREE.ShaderMaterial({
		vertexShader: VSHADER,
		fragmentShader: FSHADER,
		uniforms
	});
	var ico = new THREE.Mesh(geometry, material);
	
	return ico;
	
}







// cria a animação do pacman
var animatePacman = function() {
	if (abrir == 1) {
		pacman.children[0].rotation.y -= 0.02;
		pacman.children[1].rotation.y -= 0.02;
		pacman.children[2].rotation.y += 0.02;
		pacman.children[3].rotation.y += 0.02;
	} else {
		pacman.children[0].rotation.y += 0.02;
		pacman.children[1].rotation.y += 0.02;
		pacman.children[2].rotation.y -= 0.02;
		pacman.children[3].rotation.y -= 0.02;
	}
}

var createDirectionalLight = function() {
	var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(5, 5, 5);
	directionalLight.name='directional';
	directionalLight.castShadow = true;
	scene.add(directionalLight);
};

var createAmbientLight = function() {
	var ambientLight = new THREE.AmbientLight(0x888888);
	ambientLight.name='ambient';
	ambientLight.castShadow = true;
	scene.add(ambientLight);
};

var createCamera = function() {
	// cria a subcâmera da esquerda
	var cameraL = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// cria a subcâmera da direita
	var cameraR = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// adiciona as duas câmeras a uma ArrayCamera (para amabas serem renderizadas)
	camera = new THREE.ArrayCamera( [cameraL, cameraR]);

	// reposiciona ambas as câmeras
	cameraL.position.set(3, 2, 6);
	cameraL.lookAt(scene.position);
	cameraL.updateMatrixWorld();// usado para atualizar a matriz de projeção da câmera
	cameraR.position.set(-3, 2, -6);
	cameraR.lookAt(scene.position);
	cameraR.updateMatrixWorld();
};

var createPlane = function() {
	var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
	var planeMaterial = new THREE.MeshPhongMaterial( { color: 0x6959CD} );

	plane = new THREE.Mesh(planeGeometry, planeMaterial);

	plane.castShadow = true;
	plane.receiveShadow = true;

	plane.rotation.x = -0.5 * Math.PI;
	plane.position.y = -1;

	plane.receiveShadow = true;

	scene.add(plane);
};

var init = function() {

	// cria a cena
	scene = new THREE.Scene();

	// cria o renderizador
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild( renderer.domElement );
	
	// adiciona a cena (objetos) e as fontes de luz à cena
	this.createSystem();
	this.createCamera();
	this.createPlane();
	this.createDirectionalLight();
	this.createAmbientLight();

	// inicializa variáveis usadas na animação
	fase = -1;
	abrir = 1;
	cameraAtual = 0;

	this.render();

};

window.onload = this.init;
