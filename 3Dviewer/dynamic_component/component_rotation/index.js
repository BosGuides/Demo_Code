/**
 * @description:   模型构件的移动旋转
 */

// 构件的id
const componentId = "37506143_0QbbPmKGXAWvG7_KY17I6V";

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [-92.35042481659175, 288.2099500195063, 282.2959299192064],  // 相机位置
  look: [-313.0838928222656, 59.76995086669922, 50],                 // 相机焦点
  up: [0, 0, 1],                                                    // 相机正方向
}
// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 加载模型
  vizbim.showModelByDocumentId(filekey, () => {
    vizbim.fly.flyTo(mainView);  // 加载完模型以后 视角飞跃到调整好的视角位置
    animate();   // 构件移动动画
  });
}

// 动画函数
const animate = () => {
  const component = vizbim.components[componentId];  // 获取当前构件对象，以便于对它进行旋转和移动
  component.rotation.z += Math.PI * 0.005;           // 将构件z轴旋转值增加Math.PI*0.005，达到旋转效果
  requestAnimationFrame(animate);                    //  浏览器每一帧刷新时执行的函数
}

