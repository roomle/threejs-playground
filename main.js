if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats, controls;
var camera, scene, renderer, light;

init();
animate();


function gltfLoadedCallback( gltf, envMap, position, rotation ) {

	gltf.scene.traverse( function ( child ) {

		if ( child.isMesh ) {

			child.material.envMap = envMap;
			child.material.needsUpdate = true;
			child.castShadow = true;

		}

	} );
	gltf.scene.position.copy( position );
	gltf.scene.rotation.y = rotation;
	scene.add( gltf.scene );
}

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
	camera.position.set( -1.8, 0.9, 2.7 );

	controls = new THREE.OrbitControls( camera );
	controls.target.set( 0, 0.5, -0.2 );
	controls.update();

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x443333 );
	// scene.fog = new THREE.Fog( 0x443333, 2, 10 );

	light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	light.position.set( 0, 2, 0 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 2, 1 );
	// light.castShadow = true;
	// light.shadow.camera.top = 1.8;
	// light.shadow.camera.bottom = -1.8;
	// light.shadow.camera.left = -1.2;
	// light.shadow.camera.right = 1.2;
	scene.add( light );

	// ground
	var plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 20, 20 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
		);
	plane.rotation.x = - Math.PI / 2;
	// plane.position.y = -1;
	plane.receiveShadow = true;
	scene.add(plane);

	// var grid = new THREE.GridHelper( 20, 20, 0x000000, 0x000000 );
	// grid.position.y = -0.99;
	// grid.material.opacity = 0.2;
	// grid.material.transparent = true;
	// scene.add( grid );

	// envmap
	var path = 'skybox/';
	var format = '.jpg';
	var envMap = new THREE.CubeTextureLoader().load( [
		path + 'px' + format, path + 'nx' + format,
		path + 'py' + format, path + 'ny' + format,
		path + 'pz' + format, path + 'nz' + format
		] );

	// scene.background = envMap;
	scene.background = new THREE.Color(.95,.95,.95);

	// model
	var loader = new THREE.GLTFLoader();
	loader.load(
		'models/EamesLoungeChair/EamesLoungeChair.glb',
		function ( gltf ) {
			gltfLoadedCallback(
				gltf,
				envMap,
				new THREE.Vector3(-1.5,0,-0.5),
				Math.PI*0.2
				);
		} );

	loader.load(
		'models/USM/USM-config-gltf.glb',
		function ( gltf ) {
			gltfLoadedCallback(
				gltf,
				envMap,
				new THREE.Vector3(1.85,0,.75),
				Math.PI*-0.5
				);
		} );
	
	loader.load(
		'models/vitra-chair/vitra-chair.glb',
		function ( gltf ) {
			gltfLoadedCallback(
				gltf,
				envMap,
				new THREE.Vector3(-2.25,0,0),
				Math.PI*0.4
				);
		} );

	loader.load(
		'models/SitzfeldPanama/SitzfeldPanama.glb',
		function ( gltf ) {
			gltfLoadedCallback(
				gltf,
				envMap,
				new THREE.Vector3(2,0,-1),
				Math.PI
				);
		} );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaOutput = true;
	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	// stats
	stats = new Stats();
	container.appendChild( stats.dom );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );

	renderer.render( scene, camera );

	stats.update();

}