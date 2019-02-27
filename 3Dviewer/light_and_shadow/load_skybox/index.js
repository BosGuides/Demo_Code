/**
 * @description:   模型场景的天空盒加载
 */


// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [7000.8774492970215, 7256.522122180529, 3466.2150569452942],   // 相机位置
  look: [-121.2406005859375, -283.8854064941406, 918.5107421875],      // 相机焦点
  up: [0, 0, 1],                                                      // 相机正方向
}
// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 加载模型
  vizbim.showModelByDocumentId(filekey, () => {
    vizbim.fly.flyTo(mainView); // 模型加载完成后飞跃到主视角
    addBackgroundImage();  // 添加天空盒
  });
}

// 添加天空盒背景图片
const addBackgroundImage = () => {
  // 创建一个three的正方体材质加载器
  const textureCube = new THREE.CubeTextureLoader()
  // .setPath( 'skyboxfy/')  // 设置天空盒图片所在的路径
    .setPath('http://renyuan.bos.xyz/')  // 设置天空盒图片所在的路径
    .load(['negx.jpg', 'posx.jpg', 'posz.jpg', 'negz.jpg', 'posy.jpg', 'negy.jpg',]);   // 设置天空盒依次加载的顺序
  vizbim.scene.background = textureCube;  // 将场景的背景设置为天空盒
}