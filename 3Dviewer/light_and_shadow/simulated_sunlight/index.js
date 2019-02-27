/**
 * @description:   模型场景添加太阳光
 */

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [-587.90945906395, 1469.639522592088, 544.3727611631068],       // 相机位置
  look: [-270.5182006402564, 101.01287246870771, 38.11576481541345],   // 相机焦点
  up: [0, 0, 1],                                                       // 相机正方向
}

const componentid = "37506143_0QbbPmKGXAWvG7_KY17I6V";  // 模型构件的id

// 定义光源和光源辅助的变量
let directionalLight;
let directionalLightHelper;

// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 加载模型
  vizbim.showModelByDocumentId(filekey, () => {
    vizbim.fly.flyTo(mainView); // 模型加载完成后飞跃到主视角
    addLensflareLight(); // 添加太阳光
    vizbim.scene.background = new THREE.Color(0.1, 0.1, 0.1);  // 将场景的背景设置比较暗的颜色，这样光照效果好

  });
}

/**
 * @description:  添加一个屏幕炫光到场景，因为屏幕炫光不是实际的光源，只是一个效果，因此一般配合其他光源使用。
 *                一般用此屏幕炫光来模拟太阳光源，因此配合一个平行光源使用。
 *                一般使平行光产生阴影效果分为以下几步:
 *                1. 将渲染器的阴影设置打开，即 renderer.shadowMap.enabled = true;
 *                2. 将此光源的产生阴影的属性打开，即 spotLdirectionalLightight.castShadow = true;
 *                3. 调整此光源的光源阴影范围，一般要使产生阴影的物体的位置大于阴影相机的最小值，小于最大值
 *                4. 将需要产生阴影的物体的产生阴影的属性打开，即obj.castShadow = true;
 *                5. 将要接收阴影的属性打开，即obj.receiveShadow = true;

 */
const addLensflareLight = () => {
  vizbim.renderer.shadowMap.enabled = true;  // 将渲染器的阴影设置打开，这样渲染器就可以渲染场景内物体的阴影了

  const textureLoader = new THREE.TextureLoader(); // threejs里面的加载器，用于加载图片

  // 用于模仿太阳光的图片图片,地址可以换成本地路径
  const textureFlare0 = textureLoader.load('http://renyuan.bos.xyz/lensflare0.png');
  const textureFlare3 = textureLoader.load('http://renyuan.bos.xyz/lensflare3.png');

  directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 新建一个平行光源，颜色未白色，强度为1
  directionalLight.position.set(0, 0, 200); // 将此平行光源调整到一个合适的位置
  directionalLight.castShadow = true; // 将此平行光源产生阴影的属性打开
  vizbim.components[componentid].castShadow = true;  // 将正方体产生阴影的设置属性打开
  vizbim.components[componentid].receiveShadow = false;  // 将正方体接收阴影的属性关闭

  directionalLight.target = vizbim.components[componentid]; // 将平行光源的目标设置为正方体构件

  // 设置平行光的的阴影属性，即一个长方体的长宽高，在设定值的范围内的物体才会产生阴影
  const d = 140;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;
  directionalLight.shadow.camera.near = 2;
  directionalLight.shadow.camera.far = 8000;

  directionalLight.shadow.mapSize.x = 1024;  // 定义阴影贴图的宽度和高度,必须为2的整数此幂
  directionalLight.shadow.mapSize.y = 1024;  // 较高的值会以计算时间为代价提供更好的阴影质量

  vizbim.scene.add(directionalLight);  // 将此平行光源加入场景中，我们才可以看到这个光源

  directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 300);  // 创建一个平行光源帮助器，帮助我们看到该光源的位置以及辐射范围
  vizbim.scene.add(directionalLightHelper);  // 将此帮助器添加进场景

  const lensflare = new THREE.Lensflare();  // 实例化一个屏幕炫光对象
  // 加载屏幕炫光所用的图片，并且设置它的大小，距离光源的距离，和颜色。
  // 距离光源的距离的范围值为0到1之间，0为光源位置，1为屏幕位置。
  lensflare.addElement(new THREE.LensflareElement(textureFlare0, 700, 0, directionalLight.color));
  lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
  lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7));
  lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9));
  lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1));

  directionalLight.add(lensflare); // 将屏幕炫光添加进平行光里，这样屏幕炫光的位置就是平行光源的位置，并且也加到了场景中
  addGround(); // 创建一个底面，用来接收正方体的阴影
}

// 创建一个地面,用来接收正方体的阴影
// 需要将地面接收阴影的属性打开，以接收阴影
const addGround = () => {
  const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,  // 将材质设置为双面，如果设置为单面，则只有一面能看见材质，另一面看着就是透明
    color: 0x808080,  // 将材质设置为双面，如果设置为单面，则只有一面能看见材质，另一面看着就是透明
  });
  const geometry = new THREE.PlaneGeometry(50000, 50000, 32);  // 一个长方形几何体，长宽都为100
  const cube = new THREE.Mesh(geometry, material);  // 创建这个mesh对象
  cube.position.copy(vizbim.components[componentid].position);  // 将这个矩形的位置设置为正方体物体的位置
  cube.position.z -= 100;  // 将这个正方体的位置向z轴负方向调整100
  cube.receiveShadow = true;    // 将地面接收阴影的属性打开

  vizbim.scene.add(cube);  // 将地面添加到场景中
  moveTheBox();  // 执行构件旋转动画
  animate();  // 执行光源位置移动动画
  render();  // 更新渲染值
}

// 让模型动起来
const moveTheBox = () => {
  vizbim.components[componentid].rotation.z += 0.01; // 每次让该构件饶z轴旋转的角度加0.01
  requestAnimationFrame(moveTheBox);   //  浏览器每一帧刷新时执行的函数
}


// 借助动画库tween,定义动画函数，让光源动起来
const tween = (light) => {

  // 实例化一个TWEEN对象，传入光源位置，然后随机改变他们的位置
  new TWEEN.Tween(light.position).to({
    x: (Math.random() * 600) - 100,
    y: (Math.random() * 200) - 200,
    z: (Math.random() * 600) + 250
  }, Math.random() * 3000 + 2000)
    .easing(TWEEN.Easing.Quadratic.Out).start();

}

// 执行动画函数，让光源动起来
const animate = () => {

  tween(directionalLight);    // 执行tween动画函数

  setTimeout(animate, 5000);  // 每5s执行一下动画

}

// 让场景以最佳刷新速率刷新场景，同时更新光源辅助的位置
const render = () => {

  TWEEN.update();  // 更新TWEEN的值

  if (directionalLightHelper) directionalLightHelper.update();  // 更新光源辅助器

  requestAnimationFrame(render);  //  浏览器每一帧刷新时执行的函数
}