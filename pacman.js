var scene;
var camera;
var renderer;
var base;
var base2;
var fase;
var abrir;

var render = function() {
	requestAnimationFrame( render );

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
	this.animateBase();
	this.animateBase2();

	renderer.render( scene, camera );
};

// cria a base do pacman
var createABase = function() {
	// argumentos : escala, linhas horizontais, linhas verticais, "o quanto da esfera desenhar, com Math.PI desenha só metade"
	var geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI );
	var material = new THREE.MeshBasicMaterial( { color: 'yellow' } );
	base = new THREE.Mesh( geometry, material );
	// rotaciona a metade da esfera 45º em torno do eixo x
	base.rotation.x += Math.PI*0.5;
	scene.add( base );
};

var createASecondBase = function() {
	var geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI );
	var material = new THREE.MeshBasicMaterial( { color: 'yellow' } );
	base2 = new THREE.Mesh( geometry, material );
	base2.rotation.x -= Math.PI*0.5;
	scene.add( base2 );
};

// cria a animação da base
var animateBase = function() {
	if (abrir == 1) {
		base.rotation.y -= 0.02;// rotaciona em torno de y
	} else {
		base.rotation.y += 0.02;
	}
}

var animateBase2 = function() {
	if (abrir == 1) {
		base2.rotation.y -= 0.02;
	} else {
		base2.rotation.y += 0.02;
	}
}

var init = function() {

	scene = new THREE.Scene();

	camera = new THREE.OrthographicCamera(//usando essa câmera só para a aimagem não distorcer por causa da perspectiva
		-window.innerWidth/512,
		window.innerWidth/512,
		window.innerHeight/512,
		-window.innerHeight/512,
		0,
		100
	);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera.position.z = 2;
	camera.lookAt(scene.position);

	fase = -1;
	abrir = 1;
	this.createABase();
	this.createASecondBase();

	this.render();

};

window.onload = this.init;
