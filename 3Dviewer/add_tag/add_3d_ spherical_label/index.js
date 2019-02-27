
/**
 * @description:   添加三维球状标签
 */

const componentId = "47043446_3uXpDSeP5A_gRI8FyJJmHi"; // 构件id

// 初始化，主函数
function init() {
  vizbim.resize(); // 模型画布自适应窗口大小
  vizbim.showModelByDocumentId(filekey, function () {
    addBallMarker(componentId);  // 加载完模型后传入构件id，可以将球状标签的位置根据模型构件的位置微调
  });
}

// 添加3D文字
const addBallMarker = (componentId) =>{
  /**
   * 该方法用来添加三维圆形标签
   * @params:  componentid {string}
   * @params:  callback {function} 回调函数
   * @param [options] {object} 参数
   * @param [options.color]{16进制颜色}  球形标签的颜色 例如0xff0000
   * @param [options.offsetX]{number}  球形标签的相对于构件位置的偏移X
   * @param [options.offsetY]{number}  球形标签的相对于构件位置的偏移Y
   * @param [options.offsetZ]{number}  球形标签的相对于构件位置的偏移Z
   * @param [options.depthTest]{boolen}  是否关闭球形标签的深度测试
   * @param [options.position]{boolen}  球形标签的位置
   * @param [options.componentId]{String}  三维构件的id，如果传入，默认位置为构件位置
   * @params:[options.scale]{number}  球形标签的缩放比例
   * @return: object 三维球标签对象

   */
  const threeBallMarker = vizbim.addThreeBallMarker({
    componentId,
    offsetZ: 1750,
    scale: 0.1
  })
  // 将创建的球形标签添加进三维场景
  vizbim.scene.add(threeBallMarker);
}
