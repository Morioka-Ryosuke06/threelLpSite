import './style.css'
import * as THREE from "three";
import * as dat from "lil-gui";

/**
 * UIデバッグ
 */

const gui = new dat.GUI();

//キャンバスの取得
const canvas = document.querySelector('canvas');

//サイズ管理
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


/*
 * 必須の三要素
 */


//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

/**
 * オブジェクト作成
 */

//マテリアル
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true,
});

gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);


//メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

//回転ように配置
// mesh1.position.set(1.2, 0, 0);
// mesh2.position.set(-1.5, 0, 0);
// mesh3.position.set(3, 0, -6);
// // mesh4.position.set(5, 0, 3);

scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4]

/**
 * パーティクルの追加
 */

//ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const paticlesCount = 700;

const positionArray = new Float32Array(paticlesCount * 3);

for (let i = 0; i < paticlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
)

//マテリアル
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: "#fff"
});

//メッシュ化
const paticles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(paticles);


/**
 * ライト追加
 */
const directionalLight = new THREE.DirectionalLight("#fff", 4);
directionalLight.position.set(0.5, 1, 0); //ライトの位置
scene.add(directionalLight)

//ブラウザのリサイズ操作
window.addEventListener('resize', () => {
  //サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //カメラのアスペクト比
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); //必須

  //レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//ホイール
let speed = 0;
let rotation = 0;
window.addEventListener('wheel', (event) => {
  speed += event.deltaY * 0.0002;
});

function rot() {
  rotation += speed;
  speed *= 0.93;

  //全体を回転
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));

  window.requestAnimationFrame(rot)
}

rot();

//カーソルの位置を取得
const cursol = {};
cursol.x = 0;
cursol.y = 0;

window.addEventListener('mousemove', (event) => {
  cursol.x = event.clientX / sizes.width - 0.5;
  cursol.y = event.clientY / sizes.height - 0.5;
});


//アニメーション
const clock = new THREE.Clock();


const animate = () => {
  renderer.render(scene, camera);

  let getDeltatime = clock.getDelta();


  //メッシュの回転
  for (const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDeltatime;
    mesh.rotation.y += 0.12 * getDeltatime;
  }

  //カメラの制御
  camera.position.x += cursol.x * getDeltatime * 2;
  camera.position.y += -cursol.y * getDeltatime * 2;



  window.requestAnimationFrame(animate);
}

animate();