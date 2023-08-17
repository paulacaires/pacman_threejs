var scene;
var camera;
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

	renderer.render( scene, camera );

};

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

	scene.add( pacman );
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

    
    //pacman.translate( 10 / 2, 10 / 2, 10 / 2 );
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

var init = function() {

	// cria a cena
	scene = new THREE.Scene();

	// cria a câmera
	camera = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	// reposiciona a câmera
	camera.position.x = 2;
	camera.position.y = 1;
	camera.position.z = 5;
	camera.lookAt(scene.position);

	// cria o renderizador
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild( renderer.domElement );

	// adiciona o pacman e as fontes de luz à cena
	this.createPacman();
	this.createDirectionalLight();
	this.createAmbientLight();

	// inicializa variáveis usadas na animação
	fase = -1;
	abrir = 1;

	this.render();

};

window.onload = this.init;
