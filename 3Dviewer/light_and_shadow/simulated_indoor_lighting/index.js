/**
 * @description:   模型场景添加室内灯光
 */

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [1319.7981738001472, -851.2974352549426, 974.2026617888678],     // 相机位置
  look: [-504.49014252742813, 125.64502947929917, -418.1489413094777],  // 相机焦点
  up: [0, 0, 1],                                                        // 相机正方向
}

const componentid = "37506143_0QbbPmKGXAWvG7_KY17I6V";  // 模型构件的id

// 定义光源和光源辅助的变量
let spotLight1;
let spotLight2;
let spotLight3;
let lightHelper1;
let lightHelper2;
let lightHelper3;

// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 加载模型
  vizbim.showModelByDocumentId(filekey, () => {
    vizbim.fly.flyTo(mainView); // 模型加载完成后飞跃到主视角
    addSpotLights(); // 添加室内灯光
    vizbim.scene.background = new THREE.Color(0.1, 0.1, 0.1);  // 改变场景的背景颜色，以突出灯光效果
  });
}


// 添加spotlight聚光灯，模拟室内光
const addSpotLights = () => {
  vizbim.renderer.shadowMap.enabled = true;  // 将渲染器的阴影设置打开，这样渲染器就可以渲染场景内物体的阴影了
  vizbim.components[componentid].position.set(0, 0, -300)

  spotLight1 = createSpotLight(0xFF7F00);
  spotLight2 = createSpotLight(0x00FF7F);
  spotLight3 = createSpotLight(0x7F00FF);

  vizbim.components[componentid].castShadow = true;  // 将正方体产生阴影的设置属性打开

  addGround(); // 创建一个矩形模仿地面，用来接收正方体的阴影

  lightHelper1 = new THREE.SpotLightHelper(spotLight1);
  lightHelper2 = new THREE.SpotLightHelper(spotLight2);
  lightHelper3 = new THREE.SpotLightHelper(spotLight3);
  vizbim.scene.add(spotLight1, spotLight2, spotLight3, lightHelper1, lightHelper2, lightHelper3,);  // 将聚光灯添加到场景里
  animate(); // 让灯光动起来
  render();
}


/**
 * @description:  添加spotlight聚光灯，模拟室内光。spotlight可以理解成一个聚光灯。
 *                一般使聚光灯产生阴影效果分为以下几步:
 *                1. 将渲染器的阴影设置打开，即 renderer.shadowMap.enabled = true;
 *                2. 将此光源的产生阴影的属性打开，即 spotLight.castShadow = true;
 *                3. 调整此光源的光源阴影范围，一般要使产生阴影的物体的位置大于阴影相机的最小值
 *                4. 将需要产生阴影的物体的产生阴影的属性打开，即obj.castShadow = true;
 *                5. 将要接收阴影的属性打开，即obj.receiveShadow = true;

 */
const createSpotLight = (corlor) => {
  const spotLight = new THREE.SpotLight(corlor, 1);  // 实例化一个spotlight聚光灯
  // 将聚光灯的位置调整到正方体左上方一点
  spotLight.position.copy(vizbim.components[componentid].position);  // 将聚光灯的位置设置为正方体的位置
  spotLight.position.z += 300;  // 将聚光灯的位置向z轴方向调整300
  // spotLight.position.x += 200;

  spotLight.angle = Math.PI / 4; // 聚光灯的扩散范围，最大为Math.PI / 2
  spotLight.penumbra = 0.05;  // 由于半影而衰减的聚光锥的百分比。取值介于0和1之间。默认值为零
  spotLight.decay = 2;  // 光线沿光线距离变暗的量, 可理解为衰减速率
  spotLight.distance = 3000; // 最大范围的光

  spotLight.castShadow = true;  // 将光源能产生阴影的属性设置为true
  spotLight.shadow.mapSize.width = 1024;    // 定义阴影贴图的宽度和高度,必须为2的整数此幂
  spotLight.shadow.mapSize.height = 1024;   // 较高的值会以计算时间为代价提供更好的阴影质量
  spotLight.shadow.camera.near = 100;     // 光源在世界坐标内的视角，物体的位置必须大于此最小值才能产生阴影
  spotLight.shadow.camera.far = 500;
  spotLight.target = vizbim.components[componentid];  // Spotlight从其位置指向target.position。将聚光灯的方向设置为正方体的位置

  return spotLight;
}


// 创建一个地面,用来接收正方体的阴影
const addGround = () => {
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,  // 将材质设置为双面，如果设置为单面，则只有一面能看见材质，另一面看着就是透明
    color: 0x808080,  // 将材质设置为双面，如果设置为单面，则只有一面能看见材质，另一面看着就是透明
  });
  const geometry = new THREE.PlaneGeometry(10000, 10000, 32);  // 一个长方形几何体，长宽都为100
  const cube = new THREE.Mesh(geometry, material);  // 创建这个mesh对象
  cube.position.copy(vizbim.components[componentid].position);  // 将这个矩形的位置设置为正方体物体的位置
  cube.position.z -= 200;  // 将这个正方体的位置向z轴负方向调整600
  cube.receiveShadow = true;    // 将地面接收阴影的属性打开
  vizbim.scene.add(cube);  // 将地面添加到场景中
}

// 借助动画库tween,定义动画函数，让光源动起来
const tween = (light) => {

  new TWEEN.Tween(light).to({
    angle: (Math.random() * 0.8) + 0.1,
    penumbra: Math.random() + 1
  }, Math.random() * 3000 + 2000)
    .easing(TWEEN.Easing.Quadratic.Out).start();

  new TWEEN.Tween(light.position).to({
    x: (Math.random() * 600) - 100,
    y: (Math.random() * 200) - 200,
    z: (Math.random() * 600) + 15
  }, Math.random() * 3000 + 2000)
    .easing(TWEEN.Easing.Quadratic.Out).start();

}

// 执行动画函数，让光源产生动画效果
const animate = () => {

  tween(spotLight1);
  tween(spotLight2);
  tween(spotLight3);

  setTimeout(animate, 5000);  // 每5s执行一次动画

}

// 让场景以最佳刷新速率刷新场景，同时更新光源辅助的位置
const render = () => {

  TWEEN.update();

  // 更新光源辅助的位置
  if (lightHelper1) lightHelper1.update();
  if (lightHelper2) lightHelper2.update();
  if (lightHelper3) lightHelper3.update();
  requestAnimationFrame(render);  //  浏览器每一帧刷新时执行的函数
}