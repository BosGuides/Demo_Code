/**
 * @description:   系统流向与数据展示
 */

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [10956.515500419237, 6421.674269818732, 11950.580048875854],   // 相机位置
  look: [-1445.009521484375, 2938.898681640625, 1635],                // 相机焦点
  up: [0, 0, 1]                                                       // 相机正方向
}

const init = (id) => {
  const tool = new BIMWINNER.Tool(vizbim);  // 创建工具栏
  tool.createTool({
    modelTree: false  // 不显示右上角模型树
  }); // 创建工具栏， 将模型右上角api功能调整出来,同时隐藏右上角模型树
  changHomeBehavior();  // 改写复位函数，复位时也清空场景里的箭头和字体
  getComponentBySystem(id)  // 首先用[数据接口:根据模型id获取该模型系统类型的基本信息] 获取每个系统的构件id
    .then(() => {
      vizbim.showModelByDocumentId(id, function () {
        vizbim.scene.add(textMark); // 模型加载完成后，将箭头的父级对象添加进场景，便于管理
        addAllSystemText(); // 添加场景里的三维字体
        backToOrigin();  // 加载完模型后 移除按钮的禁点功能
        changeSystemColor(); // 加载完模型后，将模型的各个系统管道的颜色和材质进行调整
        vizbim.fly.flyTo(mainView); // 加载完模型后，场景飞跃到上面设置好的视角
        newCreateSystem1Arrow();  // 创建系统1的所有的箭头
        newCreateSystem2Arrow();  // 创建系统2的所有的箭头
        newCreateSystem3Arrow();  // 创建系统3的所有的箭头
        newCreateSystem4Arrow();  // 创建系统4的所有的箭头
        newCreateSystem5Arrow();  // 创建系统5的所有的箭头
        newCreateSystem6Arrow();  // 创建系统6的所有的箭头
      });
    });
  vizbim.resize(); // 将模型画板调整到屏幕大小
  showxsjTool2();  // 展示左侧的按钮操控区
}

let description = false; // 显示帮助说明与否的flag

/**
 * @description:显示相应系统的构件
 *              首先将模型复位，消除之前的效果，然后将场景内的箭头全部移除
 *              然后反选透明选中的系统，再将对应的系统的颜色设置成改变的颜色
 *              然后在场景里添加显示该系统的箭头

 */
const showSystermMark = (level) => {
  vizbim.resetScene(false, true, true, true, false, true, true);   // 复位模型场景
  removeArrow(); // 移除场景内的箭头
  backToOrigin();
  $("#button" + level).removeClass("layui-btn-primary");
  switch (level) {
    case 1:
      vizbim.reverseTransparentObjs(systemComponents1, 0.1, true); // 反选透明选中的系统
      vizbim.scene.add(arrowArray1, textMark1);  // 添加该系统的箭头和三维文字
      vizbim.setObjtColor(systemComponents1, [0, 0.247, 1]); // 将对应的系统的颜色设置成改变的颜色
      break;
    case 2:
      vizbim.reverseTransparentObjs(systemComponents2, 0.1, true); // 反选透明选中的系统
      vizbim.setObjtColor(systemComponents2, [0, 0.9, 0.9]);// 将对应的系统的颜色设置成改变的颜色
      vizbim.scene.add(arrowArray21, arrowArray22, arrowArray23, arrowArray24, arrowArray25, textMark2);// 添加该系统的箭头和三维文字
      break;
    case 3:
      vizbim.setObjtColor(systemComponents3, [0.476, 0.214, 0.543]);// 将对应的系统的颜色设置成改变的颜色
      vizbim.scene.add(arrowArray31, arrowArray32, arrowArray33, arrowArray34, arrowArray35, arrowArray36, arrowArray37, textMark3);// 添加该系统的箭头和三维文字
      vizbim.reverseTransparentObjs(systemComponents3, 0.1, true);// 反选透明选中的系统
      break;
    case 4:
      vizbim.scene.add(arrowArray41, arrowArray42, arrowArray43, arrowArray44, arrowArray45, textMark4);// 添加该系统的箭头和三维文字
      vizbim.setObjtColor(systemComponents4, [0.621, 0.473, 0.93]);// 将对应的系统的颜色设置成改变的颜色
      vizbim.reverseTransparentObjs(systemComponents4, 0.1, true);// 反选透明选中的系统
      break;
    case 5:
      vizbim.setObjtColor(systemComponents5, [198 / 255, 230 / 255, 19 / 255]);// 将对应的系统的颜色设置成改变的颜色
      vizbim.scene.add(arrowArray51, arrowArray52, arrowArray53, arrowArray54, arrowArray55, arrowArray56, textMark5);// 添加该系统的箭头和三维文字
      vizbim.reverseTransparentObjs(systemComponents5, 0.1, true);// 反选透明选中的系统
      break;
    case 6:
      vizbim.setObjtColor(systemComponents6, [81 / 255, 223 / 255, 155 / 255]);// 将对应的系统的颜色设置成改变的颜色
      vizbim.scene.add(arrowArray61, arrowArray62, arrowArray63, arrowArray64,
        arrowArray66, arrowArray65, arrowArray67, arrowArray68, arrowArray69, textMark6);// 添加该系统的箭头和三维文字
      vizbim.reverseTransparentObjs(systemComponents6, 0.1, true);// 反选透明选中的系统
      break;
    default:
      seeTheBigPicture(); // 一键观全局，将视角飞跃到设置视角，添加显示所有箭头和三维字体
  }
}

// 按钮初始状态
const backToOrigin = () => {
  $('#tbZKul2').find("button").removeAttr("disabled");  // 移除按钮禁止点击功能
  $('#tbZKul2').find("button").addClass("layui-btn-primary"); // 将按钮底色设置成绿色
  $('#tbZKul2').find("button").removeClass("layui-btn-disabled"); // 将按钮的禁点效果移除
}

// 创建左侧按钮的操控区域
const showxsjTool2 = () => {
  const toolBarZK = $("<div id='toolBarZK' style='position:absolute;z-index:1;display:flex;flex-direction:column;left:10px;top:10px;margin-left:10px' id='toolBarZK2' ></div>");
  toolBarZK.appendTo($("#container"));
  $(toolBarZK).append("<p id ='title' style='font-size:30px;margin-bottom: 0'> " +
    "系统流向与数据展示 " +
    "<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()'></i>" +
    "</p>");
  $(container).append("<div id='descriptionContainer' style='display:none'> </div>")
  $(descriptionContainer).append("<p id ='title1' style='font-size:16px;margin-bottom: 0'> " +
    "选择不同系统，将出现不同系统下管道信息 " + "</p>");
  $(toolBarZK).append("<div id='tbZKul2' class='layui-btn-container' style='width: 100px;margin-top: 50px'></div>");

  $(tbZKul2).append("<button disabled class='layui-btn layui-btn-disabled' id = 'button1' onclick='showSystermMark(1);'>水暖系统1</button>");
  $(tbZKul2).append("<button disabled class='layui-btn layui-btn-disabled' id = 'button2' onclick='showSystermMark(2);'>水暖系统2</button>");
  $(tbZKul2).append("<button disabled class='layui-btn layui-btn-disabled' id = 'button3' onclick='showSystermMark(3);'>水暖系统3</button>");
  $(tbZKul2).append("<button disabled class='layui-btn layui-btn-disabled' id = 'button4' onclick='showSystermMark(4);'>水暖系统4</button>");
  $(tbZKul2).append("<button disabled class='layui-btn layui-btn-disabled' id = 'button5' onclick='showSystermMark(5);'>水暖系统5</button>");
  $(tbZKul2).append("<button disabled class='layui-btn layui-btn-disabled' id = 'button6' onclick='showSystermMark(6);'>水暖系统6</button>");
  $(tbZKul2).append("<button disabled class='layui-btn layui-btn-disabled' id = 'button7' onclick='showSystermMark(7);'>一键观全局</button>");
}

// 一键观全局,复位模型视角，添加所有箭头，飞跃到设定的模型视角
const seeTheBigPicture = () => {
  vizbim.resetScene(true, true, true, true, false, true, true);  // 模型视角复位
  addAllArrow();  // 添加所有箭头
  vizbim.fly.flyTo(mainView); // 飞跃到固定视角
}


// 右上角标题的显示说明
const showDescription = () => {
  if (!description) {
    $("#descriptionContainer").attr("style", "position:absolute; top:23px; left:330px; background-color:white; padding:10px")
  } else {
    $("#descriptionContainer").attr("style", "display:none;")
  }
  description = !description
}

// 数据接口:根据模型id获取该模型系统类型的基本信息
// 获取信息后将该系统的构件id获取到，便于后面调整
const getComponentBySystem = (id) => {
  return fetch(`${op.baseaddress}models/${id}/components/IFCSYSTEM?devcode=${op.devcode}`)
    .then(response => response.json())
    .then(result => {
      console.log("getComponentBySystem的result:", result);
      let systermComponents = result.data;
      systemComponents1 = systermComponents[5].systemgroup;
      systemComponents2 = systermComponents[1].systemgroup;
      systemComponents3 = systermComponents[4].systemgroup;
      systemComponents4 = systermComponents[0].systemgroup;
      systemComponents5 = systermComponents[3].systemgroup;
      systemComponents6 = systermComponents[2].systemgroup;
    });
}

/**
 * @description:创建水暖系统1的构件的箭头
 *              首先确定此系统的箭头的初始和终止位置，选定这个系统的一个构件
 *              然后将箭头的初始位置和终止位置以这个构件为中心进行调整
 *              设定箭头移动的方向

 */
const newCreateSystem1Arrow = () => {
  const position = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNG0"].position
  const position1 = {x: position.x + 700, y: position.y, z: position.z};
  const position2 = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNH6"].position
  multipurposeCreateArrow(position1, position2, "y-", 10, arrowArray1);
}

/**
 * @description:创建水暖系统2的构件的箭头
 *              首先确定此系统的箭头的初始和终止位置，选定这个系统的一个构件
 *              然后将箭头的初始位置和终止位置以这个构件为中心进行调整
 *              设定箭头移动的方向
 *              此系统的箭头分为6组箭头，因此每组箭头的位置要首先调整好

 */
const newCreateSystem2Arrow = () => {
  const position1s = vizbim.components["BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7Osp_"].position
  const position1e = vizbim.components["BuildingIOT_sysSupervise_1lhHjFwsrD2BWDV2HOvu2k"].position
  const position2s = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbuAY"].position
  const position2e = vizbim.components["BuildingIOT_sysSupervise_1lhHjFwsrD2BWDV2HOvuwP"].position
  const position3s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8FnP"].position
  const position3e = vizbim.components["BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7Ouag"].position
  const position4s = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu9q"].position
  const position4e = vizbim.components["BuildingIOT_sysSupervise_34NcV6TFr2x9hzGbbSfCpG"].position
  const position5s = vizbim.components["BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7Ouag"].position
  const position5e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbxqv"].position
  const position6s = vizbim.components["BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7Ouag"].position
  let newPosition6s = Object.assign({}, position6s);
  newPosition6s.x += 500;
  const position6e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbuBh"].position
  multipurposeCreateArrow(position1s, position1e, "y+", 10, arrowArray21);
  multipurposeCreateArrow(position2s, position2e, "y+", 10, arrowArray21);
  multipurposeCreateArrow(position3s, position3e, "y+", 10, arrowArray22);
  multipurposeCreateArrow(position4s, position4e, "y+", 10, arrowArray23);
  multipurposeCreateArrow(position5s, position5e, "x-", 10, arrowArray24);
  multipurposeCreateArrow(newPosition6s, position6e, "x+", 10, arrowArray25);
}

/**
 * @description:创建水暖系统3的构件的箭头
 *              首先确定此系统的箭头的初始和终止位置，选定这个系统的一个构件
 *              然后将箭头的初始位置和终止位置以这个构件为中心进行调整
 *              设定箭头移动的方向
 *              此系统的箭头分为9组箭头，因此每组箭头的位置要首先调整好

 */
const newCreateSystem3Arrow = () => {
  const position1s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8FcP"].position
  const position1e = vizbim.components["BuildingIOT_sysSupervise_3eKUBOwaz1rQi0Re0ze5BB"].position
  const position2s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8FdK"].position
  const position2e = vizbim.components["BuildingIOT_sysSupervise_3eKUBOwaz1rQi0Re0ze54_"].position
  const position3s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8EQX"].position
  const position3e = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8EVf"].position
  const position4s = vizbim.components["BuildingIOT_sysSupervise_09OLcIiq1B3w0FVjsRtVe3"].position
  const position4e = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8FXA"].position
  const position5s = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu6Z"].position
  const position5e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu6d"].position
  const position6s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8EVf"].position
  const position6e = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8EVj"].position
  const position7s = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu6$"].position
  const position7e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu6Z"].position
  const position8s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8EQb"].position
  const position8e = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8EQX"].position
  const position9s = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu6d"].position
  const position9e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu7i"].position
  multipurposeCreateArrow(position1s, position1e, "y+", 10, arrowArray31);
  multipurposeCreateArrow(position2s, position2e, "y+", 10, arrowArray31);
  multipurposeCreateArrow(position3s, position3e, "y+", 10, arrowArray32);
  multipurposeCreateArrow(position4s, position4e, "x-", 10, arrowArray33);
  multipurposeCreateArrow(position5s, position5e, "x-", 10, arrowArray34);
  multipurposeCreateArrow(position6s, position6e, "z+", 10, arrowArray35);
  multipurposeCreateArrow(position7s, position7e, "z+", 10, arrowArray35);
  multipurposeCreateArrow(position8s, position8e, "z-", 10, arrowArray36);
  multipurposeCreateArrow(position9s, position9e, "z-", 10, arrowArray37);
}

/**
 * @description:创建水暖系统4的构件的箭头
 *              首先确定此系统的箭头的初始和终止位置，选定这个系统的一个构件
 *              然后将箭头的初始位置和终止位置以这个构件为中心进行调整
 *              设定箭头移动的方向
 *              此系统的箭头分为4组箭头，因此每组箭头的位置要首先调整好

 */
const newCreateSystem4Arrow = () => {
  const position1s = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNP$"].position
  let position1e = Object.assign({}, position1s);
  position1e.y += 4300;
  const position2s = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNV$"].position
  const position2e = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNUd"].position
  const position3s = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNPJ"].position
  const position3e = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNPR"].position
  const position4s = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNPZ"].position
  const position4e = Object.assign({}, position4s);
  position4e.y += 2200;
  const position5s = vizbim.components["BuildingIOT_sysSupervise_3yIDT8idD1Bx_jkc0mGEJS"].position
  let position5e = Object.assign({}, position5s);
  position5e.x += 1500;
  const position6s = vizbim.components["BuildingIOT_sysSupervise_3yIDT8idD1Bx_jkc0mGEJ5"].position
  let position6e = Object.assign({}, position6s);
  position6e.z -= 1500;
  multipurposeCreateArrow(position1s, position1e, "y+", 10, arrowArray41);
  multipurposeCreateArrow(position2s, position2e, "y+", 10, arrowArray42);
  multipurposeCreateArrow(position3s, position3e, "y+", 10, arrowArray42);
  multipurposeCreateArrow(position4s, position4e, "y+", 10, arrowArray43);
  multipurposeCreateArrow(position5s, position5e, "x+", 10, arrowArray44);
  multipurposeCreateArrow(position6s, position6e, "z-", 10, arrowArray45);
}

/**
 * @description:创建水暖系统5的构件的箭头
 *              首先确定此系统的箭头的初始和终止位置，选定这个系统的一个构件
 *              然后将箭头的初始位置和终止位置以这个构件为中心进行调整
 *              设定箭头移动的方向
 *              此系统的箭头分为7组箭头，因此每组箭头的位置要首先调整好

 */
const newCreateSystem5Arrow = () => {
  const position1s = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNGR"].position
  const position1e = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNJs"].position
  const position2s = vizbim.components["BuildingIOT_sysSupervise_1lhHjFwsrD2BWDV2HOvurS"].position
  const position2e = vizbim.components["BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7OspA"].position
  const position3s = vizbim.components["BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7Ouao"].position
  const position3e = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNVt"].position
  const position4s = vizbim.components["BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7Ospu"].position
  const position4e = vizbim.components["BuildingIOT_sysSupervise_1lhHjFwsrD2BWDV2HOvu6H"].position
  let newPosition4e = Object.assign({}, position4e);
  newPosition4e.y += 800;
  const position5s = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbxsF"].position
  const position5e = vizbim.components["BuildingIOT_sysSupervise_34NcV6TFr2x9hzGbbSeqLr"].position
  let newPosition5e = Object.assign({}, position5e);
  newPosition5e.y += 1000;
  const position6s = vizbim.components["BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNJs"].position
  const position6e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbxta"].position
  const position7s = vizbim.components["BuildingIOT_sysSupervise_09OLcIiq1B3w0FVjsRtVe3"].position
  let position7e = Object.assign({}, position7s);
  position7e.x -= 2000;
  multipurposeCreateArrow(position1s, position1e, "y+", 10, arrowArray51);
  multipurposeCreateArrow(position2s, position2e, "y+", 10, arrowArray52);
  multipurposeCreateArrow(position3s, position3e, "y+", 10, arrowArray53);
  multipurposeCreateArrow(position4s, newPosition4e, "y+", 10, arrowArray54);
  multipurposeCreateArrow(position5s, newPosition5e, "y+", 10, arrowArray54);
  multipurposeCreateArrow(position6s, position6e, "x-", 10, arrowArray55);
  multipurposeCreateArrow(position7s, position7e, "x-", 10, arrowArray56);
}

/**
 * @description:创建水暖系统6的构件的箭头
 *              首先确定此系统的箭头的初始和终止位置，选定这个系统的一个构件
 *              然后将箭头的初始位置和终止位置以这个构件为中心进行调整
 *              设定箭头移动的方向
 *              此系统的箭头分为10组箭头，因此每组箭头的位置要首先调整好

 */
const newCreateSystem6Arrow = () => {
  const position1s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8FyU"].position
  const position1e = vizbim.components["BuildingIOT_sysSupervise_2zrmynzlz1zwa$8yMUYDTb"].position
  const position2s = vizbim.components["BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7Osp2"].position
  const position2e = vizbim.components["BuildingIOT_sysSupervise_2zrmynzlz1zwa$8yMUYDQH"].position
  const position3s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8E5t"].position
  const position3e = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8ESv"].position
  const position4s = vizbim.components["BuildingIOT_sysSupervise_34NcV6TFr2x9hzGbbSen63"].position
  const position4e = vizbim.components["BuildingIOT_sysSupervise_3ONqb2XQ59uAvJbD2LvCPz"].position
  const position5s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8E5V"].position
  const position5e = vizbim.components["BuildingIOT_sysSupervise_3ONqb2XQ59uAvJbD2LvCPz"].position
  let newPosition5e = Object.assign({}, position5e);
  newPosition5e.x += 500;
  const position6s = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu4K"].position
  const position6e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu4G"].position
  const position7s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8E5z"].position
  const position7e = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8E5x"].position
  const position8s = vizbim.components["BuildingIOT_sysSupervise_2zrmynzlz1zwa$8yMUYFde"].position
  const position8e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu4K"].position
  const position9s = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8ESz"].position
  const position9e = vizbim.components["BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8ESv"].position
  const position10s = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu4G"].position
  const position10e = vizbim.components["BuildingIOT_sysSupervise_1L_m7xXTj1bOTmwQPrbu4a"].position
  multipurposeCreateArrow(position1e, position1s, "y-", 10, arrowArray61);
  multipurposeCreateArrow(position2e, position2s, "y-", 10, arrowArray61);
  multipurposeCreateArrow(position3e, position3s, "y-", 10, arrowArray62);
  multipurposeCreateArrow(position4e, position4s, "y-", 10, arrowArray63);
  multipurposeCreateArrow(position5s, newPosition5e, "x-", 10, arrowArray65);
  multipurposeCreateArrow(position6s, position6e, "x-", 10, arrowArray66);
  multipurposeCreateArrow(position7s, position7e, "z+", 10, arrowArray67);
  multipurposeCreateArrow(position8s, position8e, "z+", 10, arrowArray68);
  multipurposeCreateArrow(position9s, position9e, "z-", 10, arrowArray69);
  multipurposeCreateArrow(position10s, position10e, "z-", 10, arrowArray69);

}

// 清空所有的箭头
const removeArrow = () => {
  arrowArray.forEach(item => {
    vizbim.scene.remove(item)
  });
}

// 添加所有箭头
const addAllArrow = () => {
  arrowArray.forEach(item => {
    vizbim.scene.add(item)
  });
}

// 创建箭头
const createArrow = (tObj, x, y, z, flowDerection) => {
  /**
   * 该方法用来添加三维箭头
   * @params:  componentid {string}
   * @param [options] {object} 参数
   * @param [options.color]{16进制颜色}  箭头的颜色 例如0xff0000
   * @param [options.depthTest]{boolen}  是否关闭标签的深度测试
   * @param [options.id]{String}  箭头的key，默认为随机
   * @param [options.flowDerection]{String}  标签的朝向， 'x+', 'x-', 'y+', 'y-', 'z+', 'z-', 默认为'y+'
   * @params:
   * @return: arrow { Three的Object3D }

   */
  const arrow = vizbim.createArrow({
    flowDerection: flowDerection,
    scale: 1,
  });
  arrow.position.set(x, y, z);
  tObj.add(arrow);
}


/**
 * @description:  创建一组箭头动画
 * @params:  number         {Number} : 箭头的个数
 * @params:  startPoint     {Object} : 起始点位置
 * @params:  endPoint       {Object} : 终止点位置
 * @params:  flowDerection  {String} : 箭头流动的正负方向,"y-"
 * @params:  speed          {Number} : 箭头流动速度
 * @params:  obj3D          {Object} : 接收箭头的父级three3D对象
 * @return:  None

 */
const multipurposeCreateArrow = (startPoint, endPoint, flowDerection, speed, obj3D) => {
  const x1 = startPoint.x;
  const y1 = startPoint.y;
  const z1 = startPoint.z;
  const x2 = endPoint.x;
  const y2 = endPoint.y;
  const z2 = endPoint.z;
  const arrowLength = 350; //箭头长度
  let number = 0;
  let newEndPoint;
  let animationY2;
  let animationX2;
  let animationZ2;
  switch (flowDerection) {
    case "y-":
      number = Math.ceil(Math.floor(Math.abs((y2 - y1) / arrowLength)) / 2);   // 根据起始点和终止点中间的位置计算出箭头的个数
      animationY2 = y1 - (number * 2 - 1) * arrowLength    // 根据箭头数量算出箭头终点位置
      newEndPoint = Object.assign({}, endPoint);  // 深复制一个对象
      newEndPoint.y = animationY2;  // 更新箭头终点位置
      for (let i = 0; i < number; i++) {  // 根据算出来的箭头数量创建多个箭头
        createArrow(obj3D, x1 + 400, y1 - i * arrowLength * 2, z1 + 100, flowDerection);
      }
      break;
    case "y+":
      number = Math.ceil(Math.floor(Math.abs((y2 - y1) / arrowLength)) / 2);  // 根据起始点和终止点中间的位置计算出箭头的个数
      animationY2 = y1 + (number * 2 - 1) * arrowLength    // 根据箭头数量算出箭头终点位置
      newEndPoint = Object.assign({}, endPoint); // 深复制一个对象
      newEndPoint.y = animationY2;// 更新箭头终点位置
      for (let i = 0; i < number; i++) {  // 根据算出来的箭头数量创建多个箭头
        createArrow(obj3D, x1 + 400, y1 + i * arrowLength * 2, z1 + 100, flowDerection);
      }
      break;
    case "x-":
      number = Math.ceil(Math.floor(Math.abs((x2 - x1) / arrowLength)) / 2); // 根据起始点和终止点中间的位置计算出箭头的个数
      animationX2 = x1 - (number * 2 - 1) * arrowLength    // 根据箭头数量算出箭头终点位置
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.x = animationX2;// 更新箭头终点位置
      for (let i = 0; i < number; i++) {// 根据算出来的箭头数量创建多个箭头
        createArrow(obj3D, x1 - i * arrowLength * 2, y1, z1 + 400, flowDerection);
      }
      break;
    case "x+":
      number = Math.ceil(Math.floor(Math.abs((x2 - x1) / arrowLength)) / 2); // 根据起始点和终止点中间的位置计算出箭头的个数
      animationX2 = x1 + (number * 2 - 1) * arrowLength    // 根据箭头数量算出箭头终点位置
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.x = animationX2;// 更新箭头终点位置
      for (let i = 0; i < number; i++) {// 根据算出来的箭头数量创建多个箭头
        createArrow(obj3D, x1 + i * arrowLength * 2, y1, z1 + 400, flowDerection);
      }
      break;
    case "z+":
      number = Math.ceil(Math.floor(Math.abs((z2 - z1) / arrowLength)) / 2); // 根据起始点和终止点中间的位置计算出箭头的个数
      animationZ2 = z1 + (number * 2 - 1) * arrowLength   // 根据箭头数量算出箭头终点位置
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.z = animationZ2;// 更新箭头终点位置
      for (let i = 0; i < number; i++) {// 根据算出来的箭头数量创建多个箭头
        createArrow(obj3D, x1 + 300, y1, z1 + i * arrowLength * 2, flowDerection);
      }
      break;
    case "z-":
      number = Math.ceil(Math.floor(Math.abs((z2 - z1) / arrowLength)) / 2); // 根据起始点和终止点中间的位置计算出箭头的个数
      animationZ2 = z1 - (number * 2 - 1) * arrowLength   // 根据箭头数量算出箭头终点位置
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.z = animationZ2;// 更新箭头终点位置
      for (let i = 0; i < number; i++) {// 根据算出来的箭头数量创建多个箭头
        createArrow(obj3D, x1 + 300, y1, z1 - i * arrowLength * 2, flowDerection);
      }
      break;
    default:
      console.log("nothing happened");
  }
  moveArrowArray(obj3D, flowDerection, speed, startPoint, newEndPoint);   // 创建好对应系统的箭头以后是他们沿着给定的方向移动
}

// 使一组箭头移动起来，根据 移动方向的不同，使箭头沿着不同的方向移动
const moveArrowArray = (obj3D, flowDerection, speed, startPoint, endPoint) => {
  // 首先获取起始好终点位置的坐标值
  const x1 = startPoint.x;
  const y1 = startPoint.y;
  const z1 = startPoint.z;
  const x2 = endPoint.x;
  const y2 = endPoint.y;
  const z2 = endPoint.z;
  // 根据不同的流向，使箭头沿着不同方向移动
  switch (flowDerection) {
    case "y-":
      obj3D.children.forEach((item) => {            // 将该系统内所有的箭头进行移动
        item.position.y -= speed;                   // 移动每一个箭头在y方向的位置
        if (item.position.y <= y2) {                // 当箭头的位置移动到给定的终点时，将箭头向里旋转，然后再将箭头复位成原来位置
          if (item.rotation.z >= -Math.PI / 2) {    // 如果箭头还没有旋转到90°，就每次旋转0.01*Math.PI
            item.rotation.z -= Math.PI * 0.01       // 每次旋转0.01*Math.PI
            item.rotation.x -= Math.PI * 0.01       // 每次旋转0.01*Math.PI
          }
          if (item.rotation.z <= -Math.PI / 2) {    // 旋转到90度以后，则让该箭头复位，包括位置和旋转角度
            item.position.y = y1;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "y+":
      obj3D.children.forEach((item) => {            // 将该系统内所有的箭头进行移动
        item.position.y += speed;                   // 移动每一个箭头在y方向的位置
        if (item.position.y >= y2) {                // 当箭头的位置移动到给定的终点时，将箭头向里旋转，然后再将箭头复位成原来位置
          if (item.rotation.z >= -Math.PI / 2) {    // 如果箭头还没有旋转到90°，就每次旋转0.01*Math.PI
            item.rotation.z -= Math.PI * 0.01       // 每次旋转0.01*Math.PI
            item.rotation.x += Math.PI * 0.01       // 每次旋转0.01*Math.PI
          }
          if (item.rotation.z <= -Math.PI / 2) {
            item.position.y = y1;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "x-":
      obj3D.children.forEach((item) => {            // 将该系统内所有的箭头进行移动
        item.position.x -= speed;                   // 移动每一个箭头在x方向的位置
        if (item.position.x <= x2) {                // 当箭头的位置移动到给定的终点时，将箭头向里旋转，然后再将箭头复位成原来位置
          if (item.rotation.z >= -Math.PI / 2) {    // 如果箭头还没有旋转到90°，就每次旋转0.01*Math.PI
            item.rotation.z -= Math.PI * 0.01       // 每次旋转0.01*Math.PI
            item.rotation.x -= Math.PI * 0.01       // 每次旋转0.01*Math.PI
          }
          if (item.rotation.z <= -Math.PI / 2) {
            item.position.x = x1;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "x+":
      obj3D.children.forEach((item) => {           // 将该系统内所有的箭头进行移动
        item.position.x += speed;                  // 移动每一个箭头在x方向的位置
        if (item.position.x >= x2) {               // 当箭头的位置移动到给定的终点时，将箭头向里旋转，然后再将箭头复位成原来位置
          if (item.rotation.z >= -Math.PI / 2) {   // 如果箭头还没有旋转到90°，就每次旋转0.01*Math.PI
            item.rotation.z -= Math.PI * 0.01      // 每次旋转0.01*Math.PI
            item.rotation.x += Math.PI * 0.01      // 每次旋转0.01*Math.PI
          }
          if (item.rotation.z <= -Math.PI / 2) {
            item.position.x = x1;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "z+":
      obj3D.children.forEach((item) => {          // 将该系统内所有的箭头进行移动
        item.position.z += speed;                 // 移动每一个箭头在z方向的位置
        if (item.position.z >= z2) {              // 当箭头的位置移动到给定的终点时，将箭头向里旋转，然后再将箭头复位成原来位置
          if (item.rotation.z >= -Math.PI / 2) {  // 如果箭头还没有旋转到90°，就每次旋转0.01*Math.PI
            item.rotation.z -= Math.PI * 0.01     // 每次旋转0.01*Math.PI
            item.rotation.x -= Math.PI * 0.01     // 每次旋转0.01*Math.PI
          }
          if (item.rotation.z <= -Math.PI / 2) {
            item.position.z = z1;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "z-":
      obj3D.children.forEach((item) => {          // 将该系统内所有的箭头进行移动
        item.position.z -= speed;                 // 移动每一个箭头在z方向的位置
        if (item.position.z <= z2) {              // 当箭头的位置移动到给定的终点时，将箭头向里旋转，然后再将箭头复位成原来位置
          if (item.rotation.z >= -Math.PI / 2) {  // 如果箭头还没有旋转到90°，就每次旋转0.01*Math.PI
            item.rotation.z -= Math.PI * 0.01     // 每次旋转0.01*Math.PI
            item.rotation.x += Math.PI * 0.01     // 每次旋转0.01*Math.PI
          }
          if (item.rotation.z <= -Math.PI / 2) {
            item.position.z = z1;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    default:
      console.log("nothing happened");
  }
  requestAnimationFrame(function () {      // 利用requestAnimationFrame函数一帧一帧渲染动画
    moveArrowArray(obj3D, flowDerection, speed, startPoint, endPoint);
  });
}

// 更改水暖系统颜色，以区分不同的系统
const changeSystemColor = () => {
  changeMaterial();  // 更改水暖系统的材质后在更改他们的颜色
  vizbim.setObjtColor(systemComponents1, [0, 0.247, 1]);
  vizbim.setObjtColor(systemComponents2, [0, 0.9, 0.9]);
  vizbim.setObjtColor(systemComponents3, [0.476, 0.214, 0.543]);
  vizbim.setObjtColor(systemComponents4, [0.621, 0.473, 0.93]);
  vizbim.setObjtColor(systemComponents5, [198 / 255, 230 / 255, 19 / 255]);
  vizbim.setObjtColor(systemComponents6, [81 / 255, 223 / 255, 155 / 255]);
}

//改变系统材质，使得该系统的材质变成类似金属一样的材质
const changeMaterial = () => {
  const allSystemArray = [systemComponents1, systemComponents2, systemComponents3, systemComponents4, systemComponents5, systemComponents6];
  allSystemArray.forEach(item => {
    item.forEach(item1 => {
      //  此参数配置可以使管道有类似金属的材质的效果
      vizbim.components[item1].material = new THREE.MeshStandardMaterial({
        flatShading: true,
        side: THREE.DoubleSide,
        metalness: 0.4
      })
    })
  });
}

// 更改复位的小房子点击事件，添加模型场景复位和视角飞跃到给定视角的事件，并且移除场景内箭头
const changHomeBehavior = () => {
  const uuid = vizbim.uuid;
  $('#home' + uuid).unbind("click");
  $('#home' + uuid).bind("click", () => {
    vizbim.resetScene(true, true, true, true, false, true, true);   // 复位场景
    vizbim.fly.flyTo(mainView);                                     // 飞跃到主视角
    removeArrow();
    changeSystemColor();
  });
}


// 添加3D文字
const addText = (content, componentId, textFather) => {
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
    content,
    componentId,
    scale: 0.4,
    textpath: "fonts/helvetiker_regular.typeface.json", // 三维字体路径
  }, (text) => {
    textFather.add(text); // 创建字体后，将三维字体添加进三维场景
  });
}


// 添加文字标签,传入构件id，三维字体就会默认在该构件的位置，然后再根据参数调整距离此位置的上下左右
const addAllSystemText = () => {
  addText("12.2 °C", "BuildingIOT_sysSupervise_09OLcIiq1B3w0FVjsRtVe2", textMark5);
  addText("7.2 °C", "BuildingIOT_sysSupervise_34NcV6TFr2x9hzGbbSfCgs", textMark5);
  addText("32.1 °C", "BuildingIOT_sysSupervise_34NcV6TFr2x9hzGbbSfCpG", textMark2);
  addText("15.3 °C", "BuildingIOT_sysSupervise_34NcV6TFr2x9hzGbbSeqM$", textMark2);
  addText("15.3 °C", "BuildingIOT_sysSupervise_2zrmynzlz1zwa$8yMUYDj6", textMark2);
  addText("37.3 °C", "BuildingIOT_sysSupervise_3ONqb2XQ59uAvJbD2LvCPz", textMark6);
  addText("26.8 °C", "BuildingIOT_sysSupervise_3UQHaVAK1Cfw0mPGem8FwK", textMark6);
  addText("26.8 °C", "BuildingIOT_sysSupervise_0W$i8ROIL0bAil$b8K11Qf", textMark6);
  addText("0.86 MPa", "BuildingIOT_sysSupervise_1MsuA5ITz2xuXdY0I7Ouag", textMark5);
  addText("0.86 MPa", "BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNVt", textMark5);
  addText("7.1 °C", "BuildingIOT_sysSupervise_34NcV6TFr2x9hzGbbSeqMb", textMark5);
  addText("7.1 °C", "BuildingIOT_sysSupervise_34NcV6TFr2x9hzGbbSeqL5", textMark5);
  addText("36 °C", "BuildingIOT_sysSupervise_3eKUBOwaz1rQi0Re0ze54u", textMark3);
  addText("36 °C", "BuildingIOT_sysSupervise_3eKUBOwaz1rQi0Re0ze5BL", textMark3);
  addText("17 °C", "BuildingIOT_sysSupervise_0W$i8ROIL0bAil$b8K11VC", textMark3);
  addText("26 °C", "BuildingIOT_sysSupervise_3eKUBOwaz1rQi0Re0ze5lJ", textMark1);
  addText("34 °C", "BuildingIOT_sysSupervise_3yIDT8idD1Bx_jkc0mGEJD", textMark4);
  addText("19 °C", "BuildingIOT_sysSupervise_10399NMAP1GhnnFAPsqNOx", textMark4);
}

