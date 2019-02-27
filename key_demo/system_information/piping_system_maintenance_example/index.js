/**
 * @description:   管道维修系统示例
 */


// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [-10093.940717209727, 77018.08452395268, 1205.1115416145367],   // 相机位置
  look: [13327.64095616095, 55634.849450471054, -19504.297039220804],  // 相机焦点
  up: [0, 0, 1]                                                        // 相机正方向
}
// 模拟现实世界里的物联网动态数据
const fakeData = [
  {
    id: THREE.Math.generateUUID(),
    status: false,
    waterPressure: "水压 0.3MPa",
    waterFlow: "水流量 10m³/s",
    componentId: "BuildingIOT_sysOperation_3A1tUV8vLDTvCpG358jmrP"
  },
  {
    id: THREE.Math.generateUUID(),
    status: false,
    waterPressure: "水压 0.32MPa",
    waterFlow: "水流量 7m³/s",
    componentId: "BuildingIOT_sysOperation_1pAU48cCLBWR4HylYWrIca"
  },
  {
    id: THREE.Math.generateUUID(),
    status: false,
    waterPressure: "水压 0.24MPa",
    waterFlow: "水流量 7m³/s",
    componentId: "BuildingIOT_sysOperation_3PnAJ4sZHAPhp8wvKk_YYw"
  },
  {
    id: THREE.Math.generateUUID(),
    status: false,
    waterPressure: "水压 0.27MPa",
    waterFlow: "水流量 6m³/s",
    componentId: "BuildingIOT_sysOperation_1Y1YcIP3v6uRlS$85y9vy9"

  },
  {
    id: THREE.Math.generateUUID(),
    status: false,
    waterPressure: "水压 0.4MPa",
    waterFlow: "水流量 20m³/s",
    componentId: "BuildingIOT_sysOperation_3A1tUV8vLDTvCpG358jm_R"
  },
  {
    id: THREE.Math.generateUUID(),
    status: false,
    waterPressure: "水压 0.34MPa",
    waterFlow: "水流量 10m³/s",
    componentId: "BuildingIOT_sysOperation_0T20EtiHbAb9MZQYCYXaJ1"
  },
  {
    id: THREE.Math.generateUUID(),
    status: false,
    waterPressure: "水压 0.26MPa",
    waterFlow: "水流量 8m³/s",
    componentId: "BuildingIOT_sysOperation_3PnAJ4sZHAPhp8wvKk_YW_"
  }
];

// 初始异常数据
const content = {
  status: false,
  waterPressure: "水压 0.3MPa",
  waterFlow: "水流量 10m³/s",
  componentId: "BuildingIOT_sysOperation_3A1tUV8vLDTvCpG358jmrP"
};

let description = false; // 详情说明的显示的flag

let form;  // layui的form

let selectComponentId = null;  // 定义选中构件的id

let startRepaireFlag = false;  // 用户是否点击开始修复的flag

let markFlag = false; // 是否添加了标签的标记

let mark = null; // 定义面板标签的变量

let intervalFlag; // 定义循环调用的interval函数的变量，用来清除该函数时使用

let yellowComponents = []; // 点击开始修复时，需要变成黄色的构件

let accomplishedComponentsList = [];  // 定义已经修复完成的构件列表

let spriteMarkArray = []; // 定义精灵标签的数组

// 初始化，主函数
const init = () => {
  addDescription(); // 显示说明提示
  addAccomplishedComponentslist(); // 显示已完成构件列表
  vizbim.resize();  // 让画布适应浏览器窗口大小
  addRestorButton();  // 创建复位按钮
  vizbim.showModelByDocumentId(fileKey, function () {  // 加载模型
    vizbim.fly.flyTo(mainView); // 模型飞跃到上面调整好的视角
    updateModelcolorByComponentStatus(); // 加载完模型后，将模型里预先定义好的问题构件设置为红色
    // 监听构件的点击行为
    vizbim.listentoSelectObjs(function (componentId, component) {
      let comFlag = false;  // 每次点击构件，设置一个标记
      if (componentId && component && Object.keys(component).length > 0) {  // 如果选中的构件不为空，则执行下面操作
        selectComponentId = componentId;  // 将当前选中的构件id赋值给selectComponentId，方便全局使用
        /**
         *  判断当前选中的构件id是否是预先设定的有问题构件
         *  如果是，则将标comFlag记设置成true,用来区分当前
         *  选中的构件是否是预先设定的问题构件
         */
        fakeData.forEach(item => {
          if (item.componentId === componentId) {
            comFlag = true;
          }
        });

        /**
         *  如果构件没有处于开始修复状态，则根据点击的构件是否是预先设定的问题构件
         *  来给构件添加标签，添加水压异常或者无异常的标签
         *  如果构件处于开始修复的状态，则禁用掉构件的点击行为
         */
        if (!startRepaireFlag) {
          if (comFlag) {
            addMark(componentId, "水压异常", content);
          } else {
            addMark(componentId, "无异常出现", content);
          }
        } else {
          vizbim.resetScene(false, true, true, true, true, true, true); // 模型复位
          vizbim.reverseTransparentObjs(yellowComponents, 0.1, true); // 将关联的构件全部反选透明
          vizbim.setObjtColor(yellowComponents, [1, 1, 0]); // 将关联的构件全部设置成黄色
        }
      } else {
        if (mark) {
          mark.remove("markid");
        }
      }
    });
  });
}

// 创建title说明的dom元素
const showDescription = () => {
  if (!description) {
    $("#demodescriptioncontainer").attr("style", "font-size:16px;margin-bottom: 0;left:330px;top:50px;background-color:white;position:absolute;width:480px");
  } else {
    $("#demodescriptioncontainer").css("display", "none");
  }
  description = !description;
}

// 创建左侧说明提示的dom元素
const addDescription = () => {
  var toolBarZK = $("<div id='toolBarZK'  id='toolBarZK2' ></div>");
  toolBarZK.appendTo($("#container"));
  $(toolBarZK).append("<p id ='title' style='font-size:30px;margin-bottom: 0'> " +
    "管道系统维修示例 " +
    "<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()' ></i>" +
    "</p>");
  $(container).append("<div id='descriptionContainer' style='margin: 20px 0;'> </div>")
  $(descriptionContainer).append("<p id ='title0' style='font-size:20px;margin-bottom: 0'> " +
    "待维护管道 " + "</p>");
  $(descriptionContainer).append("<hr>");
  $(descriptionContainer).append("<div id='piplineContainer'></div>");
  $(descriptionContainer).append("<p id ='title1' style='font-size:16px;margin-bottom: 0; text-align:center'> " +
    "请在模型中选择待维护的管道 " + "</p>");
  var descriptionBoard = $("<div id='toolBarZKdescriptionBoard' style='padding: 10px' ></div>");
  descriptionBoard.appendTo($("#demodescriptioncontainer"));
  descriptionBoard.append("<div style='font-size:16px;margin: 10px;'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "  红色区域构件为异常报警构件，点击构件显示异常信息，点击信息框内的“开始维护”按钮，进入维护状态。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    " 维护状态中，仅有被维护管道和其上下游阀门会被突出显示，并系统默认阀门关闭。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "  点击“维护完成”，当前构件将不再是异常报警构件，颜色恢复原状。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "   点击“重新选择”，将返回开始维护前模型状态。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "     在维护状态下，所有相关联阀门可通过控制区进行开关。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "  近期维护完成列表”中展示的是已维护完成的管道列表，点击构件可查看具体管道位置。 " +
    "</span></div>");

}

// 添加近期维护完成列表
const addAccomplishedComponentslist = () => {
  const board = $("<div class='layui-collapse'>" +
    "  <div class='layui-colla-item' id='accomplishedComponentsContent'> " +
    "    <h2 class='layui-colla-title' style='font-size:20px;background-color:white;'>近期维护完成列表</h2>" +
    "  <div class='layui-colla-content ' style='background-color:white'>暂无维修完成构件</div>" +
    "  </div> " +
    "</div>");
  $("#container").append($("<div id='accomplishedList'></div>"));
  $("#accomplishedList").append(board);

  //注意：折叠面板 依赖 element 模块，否则无法进行功能性操作
  layui.use('element', function () {
    var element = layui.element;
    element.on('collapse(filter)', function (data) {
      console.log(data.show); //得到当前面板的展开状态，true或者false
      console.log(data.title); //得到当前点击面板的标题区域DOM对象
      console.log(data.content); //得到当前点击面板的内容区域DOM对象
    });
  });
}

// 数据接口:获取模型构件指定type类型相近构件，这里传入IfcFlowController，即创建与管道相关联的构件
const getComponentIdByTypeId = (componentId) => {
  return fetch(`${op.baseaddress}models/${fileKey}/components/${componentId}/type/IfcFlowController?devcode=${op.devcode}`)
    .then(response => response.json());
}

/**
 * @description: 为每个点击的构件添加面板标签
 *               创建面板标签的dom元素，确定面板标签的起始位置
 *               这里的起始位置是该构件的包围盒的中心点在世界坐标下的位置
 */
const addMark = (componentId, title, content) => {
  // 如果已经创建过标签，则将该标签删除
  if (mark) {
    mark.remove("markid");
    markFlag = !markFlag;
  }
  // 面板标签的dom内容
  const cardBord = $(
    "<div class='layui-card'> " +
    "  <div class='layui-card-header' style='font-size:18px;'>" + "冷水管道" + "<i id='boardMark' class='fa fa-exclamation-triangle' style='margin:0 10px; cursor:pointer; color:#e3d515'></i>" + title + "</div> " +
    "  <div class='layui-card-body' style='font-size:15px;'> " +
    "<span style='margin-right:10px' id='waterPressure'>" + content.waterPressure + "</span>" +
    "<span style='margin:0' id='waterFlow'>" + content.waterFlow + "</span>" +
    "<div id='cardBodyButton'> </div>" +
    "  </div> " +
    "</div>"
  );
  mark = new BIMWINNER.DOMMark(vizbim);  // 面板标签主对象
  const marrix44 = vizbim.components[componentId].matrix.elements; // 模型构件在世界坐标系下的矩阵
  const boundingCenter = vizbim.components[componentId].geometry.boundingSphere.center; // 模型构件在构件坐标系下的包围盒中点
  const marrix41 = [boundingCenter.x, boundingCenter.y, boundingCenter.z, 1]; // 4*1数组，模拟行向量，便于相乘
  const position = compute4MatrixAnd1matrix(marrix44, marrix41);  // 将两个矩阵相乘，得到构件包围盒在世界坐标系下的坐标
  if (content) {
    // 创建一个面板标签和标签内容
    mark.add({
        startPosition: position,
        offsetPosition: [100, -100],
        draggable: true,
        title: "",
        id: "markid",
        domElement: cardBord
      },
      // 创建标签后的回调函数
      function (a) {
        markFlag = !markFlag;
        $("#labelLinemarkid").css("background-color", "black");
        if (title === "无异常出现") {
          $("#boardMark").removeClass();
          $("#boardMark").addClass("fas fa-check");
          $("#boardMark").css("color", "#5fb878");
        } else {
          $("#cardBodyButton").append($("<button class='lyButton' style='background-color:red; color: white' onclick='clickPipline()'>开始修复</button>"));
          $("#boardMark").removeClass();
          $("#boardMark").addClass("fa fa-exclamation-triangle");
          $("#boardMark").css("color", "#e3d515");
        }
        if (intervalFlag) {
          clearInterval(intervalFlag);
        }
        // 动态变换面板标签里面的内容
        intervalFlag = setInterval(function () {
          const content1 = fakeData[RandomNumBoth(0, fakeData.length)];
          if (content1 && content1.waterPressure && content1.waterFlow) {
            $("#waterPressure").text(content1.waterPressure);
            $("#waterFlow").text(content1.waterFlow);
          }
        }, 1500);
      });
  }
}

//  计算 4*4矩阵与4*1 向量的数乘，目的是为了算出构件包围盒中心点在世界坐标的位置
const compute4MatrixAnd1matrix = (Matrix44, Matrix41) => {
  let x = 0, y = 0, z = 0, d = 1;
  if (Matrix44.length === 16 && Matrix41.length === 4) {
    x = Matrix44[0] * Matrix41[0] + Matrix44[4] * Matrix41[1] + Matrix44[8] * Matrix41[2] + Matrix44[12] * Matrix41[3];
    y = Matrix44[1] * Matrix41[0] + Matrix44[5] * Matrix41[1] + Matrix44[9] * Matrix41[2] + Matrix44[13] * Matrix41[3];
    z = Matrix44[2] * Matrix41[0] + Matrix44[6] * Matrix41[1] + Matrix44[10] * Matrix41[2] + Matrix44[14] * Matrix41[3];
    d = Matrix44[3] * Matrix41[0] + Matrix44[7] * Matrix41[1] + Matrix44[11] * Matrix41[2] + Matrix44[15] * Matrix41[3];
  }
  return [x, y, z, d];
}

// 生成指定范围的随机数
const RandomNumBoth = (Min, Max) => {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}

/**
 * @description: 点击开始修复维修水暖系统后的操作
                 1.用[数据接口:获取模型构件指定type类型相近构件]获取与该构件相关联的构件
                 2.将该构件数组设置成黄色，并且适应构件视角
                 3.将添加了面板标签全部删除
                 4.添加开关构件的精灵标签
                 5.更新左侧的控制区域
 */
const clickPipline = () => {
  if (selectComponentId) {
    getComponentIdByTypeId(selectComponentId).then(result => {
      if (result.code === 200 && result.data instanceof (Array) && result.data.length !== 0) {
        yellowComponents = result.data.concat();
        yellowComponents.push(selectComponentId);
        vizbim.resetScene(false, true, true, true, true, true, true);
        vizbim.reverseTransparentObjs(yellowComponents, 0.1, true);
        vizbim.setObjtColor(yellowComponents, [1, 1, 0]);
        vizbim.adaptiveSize(yellowComponents);
        deleteAllMark();
        result.data.forEach(item => {
          addspriteMark(item, false);
        });
        updateLeftDerecionboardByComArray(result.data, selectComponentId, true);
      }
    });
  }
}

//更新构件颜色状态，将预先定义好的问题构件全部标记成红色
const updateModelcolorByComponentStatus = () => {
  let redComponent = [];
  fakeData.forEach(item => {
    if (item.status === false) {
      redComponent.push(item.componentId);
    }
  });
  if (redComponent.length > 0) {
    vizbim.setObjtColor(redComponent, [1, 0, 0]);
  }
}

// 添加spriteMark，精灵标签，即开关的状态，已打开/已关闭
const addspriteMark = (componentId, flag) => {
  const marrix44 = vizbim.components[componentId].matrix.elements;
  const boundingCenter = vizbim.components[componentId].geometry.boundingSphere.center;
  const marrix41 = [boundingCenter.x, boundingCenter.y, boundingCenter.z, 1];
  const position = compute4MatrixAnd1matrix(marrix44, marrix41);
  let imgurl = null;
  if (flag) {
    // imgurl = 'img/opened.png';
    imgurl = 'http://renyuan.bos.xyz/opened.png';
    vizbim.restoreObjtColor([componentId]);
  } else {
    // imgurl = 'img/closed.png';
    imgurl = 'http://renyuan.bos.xyz/closed.png';
    vizbim.setObjtColor([componentId], [1, 1, 0]);
  }
  spriteMark.add({
    position: position,
    URL: imgurl,
    scale: 10,
    id: componentId,
    alwaysVisible: false
  }, function (spriteMarkId) {
    spriteMarkArray.push(spriteMarkId);
  })
}

/**
 * @description: 更新控制面板的内容，根据用户的点击行为，更新左侧的操作面板
                 如果用户点击了开始修复，则根据构件返回的开关数量，在左侧操控区域更新开关数量
                 如果用户点击了相应的阀门开关，则更新对应构件的开关
 */
const updateLeftDerecionboardByComArray = (componentArray, componentid, isClick) => {
  $("#piplineContainer").children().remove();
  $("#title1").remove();
  if (isClick) {
    startRepaireFlag = true;
    $("#piplineContainer").append("<div> " +
      "<span style='font-size: 18px;padding: 10px'>冷水管道</span> " +
      "<button class='lyButton' id='mainComplete' style='width: 70px;height: 25px; font-size: 12px; margin-right: 10px;' >维护完成</button>" +
      " <button class='lyButton' id='reChoose' style='width: 70px;height: 25px; font-size: 12px; margin-right: 5px'>重新选择</button>" +
      " <hr>" +
      "</div>");
    $("#piplineContainer").append(
      "<form class='layui-form' id='lyform' action='' >" +
      "</form>"
    );
    if (componentArray && componentArray.length > 0) {
      componentArray.forEach((item, index) => {
        $("#lyform").append(addComponentButton(item, index + 1));
      });
    }
    layui.use('form', function () {
      const form = layui.form;
      const layer = layui.layer;
      form.render();
      //监听提交
      form.on('switch(openCloseButton)', function (data) {
        spriteMark.remove([data.elem.id]);
        addspriteMark(data.elem.id, data.elem.checked);
        return false;  // 禁止表格跳转
      });
    });
    $("#mainComplete").click(function () {
      maintainAccomplish(componentid);
    });
    $("#reChoose").click(function () {
      vizbim.resetScene(false, true, false, true, true, false, false);
      updateModelcolorByComponentStatus();
      updateLeftDerecionboardByComArray(null, null, false);
      deleteAllMark();
    });
  } else {
    startRepaireFlag = false;
    $("#descriptionContainer").append("<p id ='title1' style='font-size:16px;margin-bottom: 0; text-align:center'> " +
      "请在模型中选择待维护的管道 " + "</p>");
  }
}

// 在控制面板添加开关按钮
const addComponentButton = (componentid, index) => {
  const lybutton = $("<div class='layui-form-item'>" +
    "    <label class='layui-form-label' style='padding: 9px 9px 9px 2px;width: 50px '>阀门" + index + "</label>" +
    "    <div class='layui-input-block' style='margin-left: 200px'>" +
    "      <input type='checkbox' name='zzz' lay-skin='switch' lay-text='开启|关闭' lay-filter='openCloseButton' id=" + componentid +
    " >" +
    "    </div>" +
    "  </div>");
  return lybutton;
}

// 删除所有精灵标签
const deleteAllMark = () => {
  if (spriteMarkArray.length > 0) {
    spriteMark.remove(spriteMarkArray);
  }
}

/**
 * @description: 如果用户点击了维护完成，则
                 1. 更新近期维护完成列表
                 2. 将当前构件从问题构件里删除
                 3. 复位模型视角
 */
const maintainAccomplish = (id) => {
  vizbim.resetScene(false, true, false, true, true, false, false);
  fakeData.forEach((item, index) => {
    if (item.componentId === id) {
      fakeData.splice(index, 1);
      accomplishedComponentsList.push(item.componentId);
    }
  });
  updateModelcolorByComponentStatus();
  updateLeftDerecionboardByComArray(null, null, false);
  deleteAllMark();
  let falg = false;
  if (accomplishedComponentsList.length > 0) {
    if ($("#accomplishedComponentsContent").find("div")[0].className.length === 30) {
      falg = true;
    }
    $("#accomplishedComponentsContent").find("div").remove();
    accomplishedComponentsList.forEach((item, index) => {
      const number = index + 1;
      const $acompComponent = $(`<div class="layui-colla-content" style="cursor: pointer;background-color: white" id=${item} >管道${number}</div>`);
      $("#accomplishedComponentsContent").append($acompComponent);
      if (falg) {
        $acompComponent.addClass("layui-show");
      }
      $acompComponent.click(function () {
        vizbim.findSceneNodes([item]);
      });
      layui.form.render();
    });
  }
}

// 创建复位按钮,目的是点击按钮的时候将模型回复到初始状态
const addRestorButton = () => {
  const toolId = vizbim.uuid;
  const toolbar = $('<div style="margin-left:0" class="yj-tool" id="my-tool' + toolId + '" ></div>');
  toolbar.appendTo($("#" + vizbim.viewport));
  //group1
  const group1 = $('<div class="yj-group"></div>');
  group1.appendTo(toolbar);
  const $toolHome = $('<button type="button" class="yj-but" title="初始化" id="home' + toolId + '"><div class="yj-icon home-icon" ></div></button>');
  $toolHome.appendTo(group1);
  $toolHome.click(() => {
    vizbim.resetScene(false, true, false, true, true, false, false);
    updateModelcolorByComponentStatus();
    updateLeftDerecionboardByComArray(null, null, false);
    deleteAllMark();
    vizbim.fly.flyTo(mainView);
  });
}
