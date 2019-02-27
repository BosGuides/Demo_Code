/**
 * @description:   模型构件的移动旋转
 */

// 构件的id
const componentId = "37506143_0QbbPmKGXAWvG7_KY17I6V";

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [232.72701205828875, 488.1474857334677, 164.03828763320382],  // 相机位置
  look: [1.6325503531505783, 26.057658939632397, 23.779280822546415], // 相机焦点
  up: [0, 0, 1],                                                     // 相机正方向
}
// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 加载模型
  vizbim.showModelByDocumentId(filekey, () => {
    vizbim.fly.flyTo(mainView); // 模型加载完成后飞跃到定义的视角
    const axes = new THREE.AxisHelper(200000);  // 实例化一个坐标系
    vizbim.scene.add(axes);   // 将坐标系添加到场景内
    animate();  // 执行动画函数
  });
}

// 定义构件每次刷新移动的步长
let step = 0.001;
// 动画函数，每次刷新更新构件的位置的x值
const animate = () => {
  step += 0.01; // 每次刷新，将步长增加0.01
  const component = vizbim.components[componentId];  // 获取当前模型对象，便对其进行位置更新
  const axes = new THREE.AxisHelper(200000); // 实例化一个坐标系
  component.add(axes); // 将坐标系添加到场景内
  component.position.x = 200 * Math.sin(step); // 更新当前构件的位置的x的值
  requestAnimationFrame(animate); //  浏览器每一帧刷新时执行的函数
}
