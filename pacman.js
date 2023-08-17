var scene;
var camera;
var cameraAtual;
var renderer;
var pacman;
var fase;
var abrir;

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

	// rotação do sistema
	system.rotateY(0.009);
	renderer.render( scene, camera.cameras[cameraAtual] );
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

	// posicao inicial do pacman: a esquerda do centro
	pacman.position.x = -2;
	// com a abertura da boca virada para fora da tela
	pacman.rotateY(-Math.PI / 2);

	// criando o segundo filho: o fantasma
	var fantasma = createGhost();
	// fantasma passa a ser filho do centro
	centro.add(fantasma);

	// posicao do fantasma
	fantasma.position.x = 2;

	// angulo inicial
	fantasma.rotateY(Math.PI * 0.5);

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
	var material = new THREE.MeshBasicMaterial( { color: 'red' } );
    var cabeca = new THREE.Mesh( geometry, material );
	// rotaciona a metade da esfera para ficar para "cima"
	cabeca.rotation.x += Math.PI*(-0.5);    
	return (cabeca);

}

// cria o corpo do fantasma
var createGhostBody = function() {

	var geometry_body = new THREE.CylinderGeometry( 0.9, 0.9, 1, 64, 64, true); 
    var material_body = new THREE.MeshBasicMaterial( {color: 'red'} ); 
    var body = new THREE.Mesh( geometry_body, material_body );
    body.position.y -= 0.45; 
    return (body);

}

// cria o olho do fantasma
var createGhostEye = function() {
	olho = new THREE.Group();

	// parte branca do olho
    var geometry_olhos = new THREE.SphereGeometry( 0.2, 32, 16, 0);
	var material_olhos = new THREE.MeshBasicMaterial( { color: 'white' } );
    var parte_olhos = new THREE.Mesh( geometry_olhos, material_olhos );

    // adiciona efeitos de sombras
	parte_olhos.castShadow = true;
	parte_olhos.receiveShadow = true;

	// pupila do olho
	var geometry_pupila = new THREE.SphereGeometry( 0.1, 32, 16, 0);
	var material_pupila = new THREE.MeshBasicMaterial( { color: 'blue' } );
    var pupila = new THREE.Mesh( geometry_pupila, material_pupila );	
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
	var material_olhos = new THREE.MeshBasicMaterial( { color: 'black' } );
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
	//    argumentos : escala, linhas de contorno
	var circle = new THREE.CircleGeometry( 1, 32 );
	var disco = new THREE.Mesh( circle, material );

	// adiciona efeitos de sombras
	disco.castShadow = true;
	disco.receiveShadow = true;

	return disco;

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
	// posiciona a subcâmera na tela
	cameraL.viewport = new THREE.Vector4(0, 0, window.innerWidth*0.5, window.innerHeight);

	// cria a subcâmera da direita
	var cameraR = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	// posiciona a subcâmera na tela
	cameraR.viewport = new THREE.Vector4(window.innerWidth*0.5, 0, window.innerWidth*0.5, window.innerHeight);

	// adiciona as duas câmeras a uma ArrayCamera (para amabas serem renderizadas)
	camera = new THREE.ArrayCamera( [cameraL, cameraR]);

	// reposiciona ambas as câmeras
	cameraL.position.x = 3;
	cameraL.position.y = 2;
	cameraL.position.z = 5;
	cameraL.lookAt(scene.position);
	cameraL.updateMatrixWorld();// usado para atualizar a matriz de projeção da câmera
	cameraR.position.x = -3;
	cameraR.position.y = 2;
	cameraR.position.z = 5;
	cameraR.lookAt(scene.position);
	cameraR.updateMatrixWorld();
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

	// adiciona o pacman e as fontes de luz à cena
	this.createSystem();
	this.createCamera();
	this.createDirectionalLight();
	this.createAmbientLight();

	// inicializa variáveis usadas na animação
	fase = -1;
	abrir = 1;
	cameraAtual = 0;

	this.render();

};

window.onload = this.init;
