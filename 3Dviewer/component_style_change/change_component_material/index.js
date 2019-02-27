/**
 * @description:   模型构件的材质修改
 */

// 定义移动的构件数组
const componentId = ["47755136_3uXpDSeP5A_gRI8FyJJnUO"];

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [-8923.967839940955, 2409.7625005869895, 5303.804519227368],    // 相机位置
  look: [-788.3752274988785, -1360.0954690502097, -135.6878000301781], // 相机焦点
  up: [0, 0, 1],                                                       // 相机正方向
}

// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 加载模型
  vizbim.showModelByDocumentId(filekey, () => {
    changeMaterial();  // 改变构件的材质类型
    vizbim.fly.flyTo(mainView); // 加载完模型后飞跃到模型的主视角
    addButtons(); // 加载完模型以后再添加标签，防止未加载完成模型的时候，用户点击按钮，出现错误
  });
}

// 改变材质种类，此处提供了"MeshBasicMaterial","MeshStandardMaterial",
// "MeshLambertMaterial","MeshPhongMaterial"四种材质的使用，更多材质的学习
// 请去threejs官网查看
const changeMaterial = (matreial) => {
  $("#buttonDiv").find("button").addClass("layui-btn-primary");
  const cpntCorlorArray = [0.5, 0.5, 0.5];  // 定义构件的颜色数组
  const cpColor = new THREE.Color(cpntCorlorArray[0], cpntCorlorArray[1], cpntCorlorArray[2]); // 创建三维里的颜色
  const component = vizbim.components[componentId[0]]; // 拿到场景中的构件，以便于对它进行材质的修改
  switch (matreial) {
    // 将此构件的材质改成MeshBasicMaterial，
    // THREE中材质的一种，这种材质不受光照影响
    case "基础材质":
      component.material = new THREE.MeshBasicMaterial({
        color: cpColor,
      });
      $("#基础材质").removeClass("layui-btn-primary");
      break;

    // 基于物理的标准材料,在实践中，这提供了比MeshLambertMaterial或
    // MeshPhongMaterial更准确和逼真的结果，代价是计算成本更高。
    case "标准材质":
      component.material = new THREE.MeshStandardMaterial({
        color: cpColor,
        metalness: 0.6  //  这种材料多少像金属一样。 非金属材料，如木材或石材，使用0.0，金属使用1.0。
                        // 默认值为0.5。 0.0到1.0之间的值可用于生锈的金属外观。
      });
      $("#标准材质").removeClass("layui-btn-primary");
      break;

    // 将此构件的材质改成MeshStandardMaterial，
    // THREE中材质的一种，将specular属性设置成和材质color一样的颜色有类似金属的效果
    // 将specular属性设置成灰色会有类似塑料的效果
    case "锋材质":
      component.material = new THREE.MeshPhongMaterial({
        color: cpColor,
        specular: cpColor,
      });
      $("#锋材质").removeClass("layui-btn-primary");
      break;

    // 将此构件的材质改成MeshLambertMaterial，
    // THREE中材质的一种，这种材质适用于暗淡、不光亮表面。
    // 这个材质是本三维引擎默认使用的材质
    case "兰伯特材质":
      component.material = new THREE.MeshLambertMaterial({
        color: cpColor
      });
      $("#兰伯特材质").removeClass("layui-btn-primary");
    default:
  }
}

// 添加左侧的按钮操控区
const addButtons = () => {
  const materials = ["基础材质", "标准材质", "兰伯特材质", "锋材质"];
  materials.forEach(item => {
    const $buttons = $(`<button style="width: 200px" id=${item} class='layui-btn layui-btn-primary'>${item}</button>`);
    $("#buttonDiv").append($buttons);
    $("#" + item).click(() => changeMaterial(item));
  })
}

// 点击按钮后的样式
const changeButtonStyle = (id) => {
  $("#buttonDiv").find("button").removeClass("layui-btn-primary")
  $("#buttonDiv").find("button").removeClass("layui-btn-primary")
  $("#"+id).addClass("")
}