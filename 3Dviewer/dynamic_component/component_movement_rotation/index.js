/**
 * @description:   模型构件的移动旋转
 */

// 构件的id
const componentId = "37506143_0QbbPmKGXAWvG7_KY17I6V";

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [821.3504831325733, 916.579345026761, 526.0692118751066],     // 相机位置
  look: [-295.73423556155177, 225.8353682071546, -184.6816266404186], // 相机焦点
  up: [0, 0, 1],                                                     // 相机正方向
}
// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 加载模型
  vizbim.showModelByDocumentId(filekey, () => {
    vizbim.fly.flyTo(mainView); // 加载完模型以后 视角飞跃到调整好的视角位置
    addTween()   // 构件移动动画
  });
}

// 添加模型构件移动动画,依赖tweenjs做动画，项目地址 https://github.com/sole/tween.js
const addTween = () => {
  let posSrc = {pos: 1};  // 初始化一个动画需要更新的值，tweenjs使用
  // 每次更新需要调用 TWEEN.update函数
  const animate = () => {
    TWEEN.update(); // 每次更新需要调用一下 TWEEN.update() 以更新TWEEN的值
    requestAnimationFrame(animate); //  浏览器每一帧刷新时执行的函数
  }
  // tween对象更新的回调函数
  const onUpdate = () => {
    const component = vizbim.components[componentId];               // 获取当前构件对象，以便于对它进行旋转和移动
    const componentInfo = vizbim.componentInfo[componentId].matrix; // 获取当前构件的初始旋转平移的矩阵信息
    const newZ = componentInfo[14];                                 // 设置新的构件位置的z值为初始值
    const newY = componentInfo[13] + 500 * Math.cos(posSrc.pos);    // 设置新的构件位置的y值为初始值加上变化的值
    const newX = componentInfo[12] + 500 * Math.sin(posSrc.pos);    // 设置新的构件位置的x值为初始值加上变化的值
    component.position.set(newX, newY, newZ);                       // 将构件的位置设置成新的位置
    component.rotation.x += Math.PI * posSrc.pos * 0.01;            // 将构件的位置的x轴旋转值增加0.01
    component.rotation.y += Math.PI * posSrc.pos * 0.01;            // 将构件的位置的y轴旋转值增加0.01
    component.rotation.z += Math.PI * posSrc.pos * 0.01;            // 将构件的位置的z轴旋转值增加0.01
  };
  // 实例化一个tween对象，设置它的参数posSrc在3秒内从1减到0
  const tween = new TWEEN.Tween(posSrc)
    .to({pos: 0}, 3000)      // 将posSrc.pos的值缓慢变成0
    .onUpdate(onUpdate)      // 更新时执行的函数
    .easing(TWEEN.Easing.Sinusoidal.InOut)   // posSrc变化的规律
    .start();   // 开始执行此动画
  // 实例化另一个tween对象，设置它的参数posSrc在3秒内从0加到1
  const tweenBack = new TWEEN.Tween(posSrc)
    .to({pos: 1}, 3000)  // 将posSrc.pos的值缓慢变成1
    .onUpdate(onUpdate)  // 更新时执行的函数
    .easing(TWEEN.Easing.Sinusoidal.InOut)  // posSrc变化的规律
    .chain(tween);  // 与tween衔接
  tween.chain(tweenBack);  // 与tweenBack衔接
  animate(); // 执行动画函数
}

