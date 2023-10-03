import * as THREE from 'three';
import * as TWEEN from 'tween';

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

var chapter = 1;
var lastChapter = 1;


const light = new THREE.PointLight(0xffffff);
light.position.set(5, -10, 0);
light.intensity = 25;
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
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const earthAlbedo = new THREE.TextureLoader().load('assets/earth/albedo.jpg');
const earthNormal = new THREE.TextureLoader().load('assets/earth/normalmap.png');
const earthRough = new THREE.TextureLoader().load('assets/earth/roughness.png');


const earth = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshStandardMaterial({ map: earthAlbedo, normalMap: earthNormal, roughnessMap: earthRough }));
scene.add(earth);
earth.position.z = -5;
earth.position.x = 5;
earth.position.y = -15;
earth.material.transparent = true;
earth.material.opacity = 1;
earth.radius = 6;
earth.rotation.x = 6.008348552048004;


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

	lastChapter = chapter;
	chapter = setChapter(scrollPercentage);
	if(lastChapter != chapter)
	{
		fadeOutThenIn(document.getElementById("bg"), 1000);
	}

	switch(chapter)
	{
		case 1:
			document.getElementById("bg").style.backgroundImage = "url('assets/sky/sky.jpg')";
			break;
		
		case 2:
				document.getElementById("bg").style.backgroundImage = "url('assets/sky/sky_chapter2.jpg')";
				break;

		case 3:
			document.getElementById("bg").style.backgroundImage = "url('assets/sky/sky_chapter3.jpg')";
			break;
		
		case 4:
			document.getElementById("bg").style.backgroundImage = "url('assets/sky/sky_chapter4.jpg')";
			break;

		default:
			break;
	}



	earth.rotation.y = (scrollPercentage * 0.2);
	var scale = scrollPercentage * 0.06; // adjust the multiplier to whatever
	earth.scale.setScalar(scale);

	
	//console.log("Earth pos: " + earth.position.z);

	//console.log(scrollPercentage);
	renderer.render(scene, camera);
}

animate();

function setChapter(scrollPercentage)
{
	var chapter;
	scrollPercentage = Math.round(scrollPercentage);
	if(scrollPercentage > 0 && scrollPercentage < 30)
	{
		chapter = 1;
	}
	else if(scrollPercentage >= 30 && scrollPercentage <= 54)
	{
		chapter = 2;
	}
	else if(scrollPercentage >= 54 && scrollPercentage <= 75)
	{
		chapter = 3;
	}
	else if(scrollPercentage > 75)
	{

		chapter = 4;
	}
	else
	{
		chapter = 1;
	}

	return chapter;
	
	
}



function fadeOutThenIn(element, delay) {
    const originalOpacity = parseFloat(getComputedStyle(element).opacity);

    // Fade out
    element.style.transition = `opacity ${delay / 2}ms`;
    element.style.opacity = 0;

    // After the specified delay, fade back in
    setTimeout(() => {
        element.style.transition = `opacity ${delay / 2}ms`;
        element.style.opacity = originalOpacity;
    }, delay / 2);
}