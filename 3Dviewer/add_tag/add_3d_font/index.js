/**
 * @description:   添加三维字体
 */

const componentId = "46636599_3uXpDSeP5A_gRI8FyJJmvJ"; // 构件id

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [-161.4060789070836, 1382.2486366748449, 3149.083276437334], // 相机位置
  look: [-1517.527099609375, -1234.53466796875, 2013.2177734375],   // 相机焦点
  up: [0, 0, 1],                                                    // 相机正方向
}

// 初始化，主函数
function init() {
  vizbim.resize(); // 模型画布自适应窗口大小
  vizbim.showModelByDocumentId(filekey, function () {
    addText("Festive lantern", componentId);  // 在构件旁边添加三维字体标签
    vizbim.fly.flyTo(mainView); // 视角飞跃到合适位置
  });
}

// 添加3D文字
const addText = (content, componentId) => {
  /**
   * 该方法用来通过给出内容加载出来3d字体，暂不支持中文
   * @params:  componentid {string}
   * @params:  callback {function} 回调函数
   * @param [options] {object} 参数
   * @param [options.color]{16进制颜色}  字体的颜色 例如0xff0000
   * @param [options.content]{String}  三维字体的内容
   * @param [options.textpath]{String}  三维字体的路径
   * @param [options.offsetX]{number}  三维字体的相对于构件位置的偏移X
   * @param [options.offsetY]{number}  三维字体的相对于构件位置的偏移Y
   * @param [options.offsetZ]{number}  三维字体的相对于构件位置的偏移Z
   * @param [options.depthTest]{boolen}  是否关闭字体的深度测试
   * @param [options.textLength]{number}  三维字体的长度
   * @param [options.textWidth]{boolen}  三维字体的宽度
   * @param [options.componentId]{String}  三维构件的id，如果传入，默认位置为构件位置
   * @params:
   * @return:

   */
  vizbim.addThreeDimensionalText({
    offsetZ: 600,
    offsetY: 100,
    offsetX: 600,
    content,
    componentId,
    scale: 0.05,
    textpath: "https://www.bos.xyz/vizbim/fonts/helvetiker_regular.typeface.json", // 三维字体路径，可以换成本地的
  }, (text) => {
    vizbim.scene.add(text); // 创建字体后，将三维字体添加进三维场景
  });
}
