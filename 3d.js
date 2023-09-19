import * as THREE from 'three';

function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}


function lerpNum (start, end, amt){
	return (1-amt)*start+amt*end
  }

var scrollPercentage = 0;

const scene = new THREE.Scene();


const light = new THREE.PointLight(0xffffff);
light.position.set(5, -10, 0);
light.intensity = 100;
scene.add(light);

const ambLight = new THREE.AmbientLight(0X6d6d6d);

scene.add(ambLight);

const camera = new THREE.PerspectiveCamera(
	40,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.z = 3

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({
	canvas,
	alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const earthAlbedo = new THREE.TextureLoader().load('assets/earth/albedo.jpg');
const earthNormal = new THREE.TextureLoader().load('assets/earth/normalmap.png');
const earthRough = new THREE.TextureLoader().load('assets/earth/roughness.png');


const earth = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshStandardMaterial({ map: earthAlbedo, normalMap: earthNormal, roughnessMap: earthRough }));
scene.add(earth);
earth.position.z = -15;
earth.position.x = 5;
earth.position.y = -10;
earth.material.transparent = true;
earth.material.opacity = 1;

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	render()
}

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;

	//camera.position.z = t * -0.01;
	//camera.position.x = t * -0.0002;
	camera.rotation.x = t * 0.0004;
}

document.body.onscroll = moveCamera;
moveCamera();


function animate() {
	
	requestAnimationFrame(animate)



	render();

}

function render() {
	scrollPercentage = getScrollPercent();


	earth.rotation.y -= 0.01;

	console.log(scrollPercentage);
	renderer.render(scene, camera);
}

animate();