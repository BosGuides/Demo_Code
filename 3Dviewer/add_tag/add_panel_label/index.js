/**
 * @description:   添加面板标签
 */

const componentId = "BuildingIOT_instruction_0wGEmGmG528Pmpk3P8MJsl"; // 构件id

// 初始化，主函数
function init() {
  vizbim.resize();  // 模型画布自适应窗口大小
  vizbim.showModelByDocumentId(filekey, function () {
    addMark(componentId);  // 加载完模型后传入构件id，可以将面板标签的位置根据模型构件的位置微调
  });
}

// 添加标签
const addMark = (componentId) => {
  const cardBord = $("<div>这是一把人体工程学座椅</div>")  // 创建一个dom元素，添加到面板标签里
  mark = new BIMWINNER.DOMMark(vizbim);  // 实例化一个面板标签主对象
  const tPosition = vizbim.components[componentId].position; // 获取当前构件的位置
  const position = [tPosition.x, tPosition.y, tPosition.z + 400] // 设置面板标签的起始位置
  /**
   * 该方法用来添加mark
   * @method add
   * @param [options] {Object}  构建mark的参数
   * @param [options.id] {String}  mark图标的id    （默认随机生成）
   * @param [options.title] {String}  mark图标的title   （默认:mark）
   * @param [options.componentId] {String}  mark关联的构件id    （默认随机生成）
   * @param [options.draggable] {Boolean}  mark图标是否允许拖拽 （默认为true）
   * @param [options.color]{array}  mark边框的颜色 默认[1,1,1]  （如果不是1,1,1会覆盖图片本身的颜色）
   * @param [options.startPosition]{array}  mark起点所跟随的三维空间的世界坐标。 默认[0,0,0]
   * @param [options.offsetPosition]{array}  mark图标主体所处的屏幕坐标，默认[1,1]
   * @param [options.domElement]{domElement}  mark中要添加的dom元素
   * @param callback {function} 完成添加的回调函数 参数为所创建的mark的id
   */
  mark.add({
      startPosition: position,
      offsetPosition: [100, -100],
      draggable: true,
      title: "椅子",
      id: "markid",
      domElement: cardBord
    },
    function (a) {
      console.log(a);
      // $("#labelLinemarkid").css("background-color","black");
    });
}
