/**
 * @description:   产品信息介绍
 */

let description = false; // 是否点击标题问号显示说明的flag

let attributeWindowFlag = false; // 右侧消防显示说明的容器框是否关闭的flag

let attributeWindow;   // 右侧消防显示说明的容器框的变量

let currentCompId;   // 当前的构件id
// 初始化函数
const init = () => {
  toolId = vizbim.uuid;  // 定义当前工具栏的uuid
  Lobibox = vizbim.Lobibox;   // 定义当前vizbim的外轮廓容器
  const tool = new BIMWINNER.Tool(vizbim);  // 定义工具栏
  tool.createTool();   // 创建工具栏
  changeHomeListen();  // 重写home键的点击事件
  vizbim.resize();     // 模型画布自适应窗口大小
  showxsjTool2();     // 创建左侧按钮操作区
  switchModels(0);   // 初始化的时候默认用户点击了第一个按钮
}
// 创建左侧按钮操作区,点击不同的按钮会切换成不同的模型
const showxsjTool2 = () => {
  const toolBarZK = $("<div style='position:absolute;z-index:1;display:flex;flex-direction:column;left:10px;top:10px;margin-left:10px' id='toolBarZK2' ></div>");
  toolBarZK.appendTo($("#container"));
  $(toolBarZK).append("<p id ='title' style='font-size:30px;margin-bottom: 0'> " +
    "产品信息介绍示例 " +
    "<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()'></i>" +
    "</p>")
  $(container).append("<div id='descriptionContainer' style='display:none'> </div>")
  $(descriptionContainer).append("<p id ='title1' style='font-size:16px;margin-bottom: 0'> " +
    "点击不同种类的消防构件，可直接查看对应样式，以及消防构件对应信息。" + "</p>");
  $(toolBarZK).append("<ul id='tbZKul2' style='list-style-type:none;padding:0;'></ul>");
  $(tbZKul2).append("<li id = 'modelEdit1'><button  class='layui-btn layui-btn-primary' id = 'button0' onclick='switchModels(0);'>安全出口（双箭头）</button></li>");
  $(tbZKul2).append("<li id = 'modelEdit2'><button  class='layui-btn layui-btn-primary' id = 'button1' onclick='switchModels(1);'>壁挂式扬声器</button></li>");
  $(tbZKul2).append("<li id = 'modelEdit3'><button  class='layui-btn layui-btn-primary' id = 'button2' onclick='switchModels(2);'>火灾显示盘</button></li>");
  $(tbZKul2).append("<li id = 'modelEdit4'><button  class='layui-btn layui-btn-primary' id = 'button3' onclick='switchModels(3);'>火灾光报警器</button></li>");
  $(tbZKul2).append("<li id = 'modelEdit5'><button  class='layui-btn layui-btn-primary' id = 'button4' onclick='switchModels(4);'>消防设备电源状态监控器</button></li>");
}

// 当用户点击标题问号的，显示帮助说明
const showDescription = () => {
  if (!description) {
    $(descriptionContainer).attr("style", "position:absolute; top:25px; left:300px; background-color:white")
  } else {
    $(descriptionContainer).attr("style", "display:none;")
  }
  description = !description
}

// 切换模型时候的函数，根据用户点击不同的按钮，切换成不同的模型
// 首先隐藏所有的构件，然后获取当前模型的构件id
const switchModels = (index) => {
  vizbim.hideObjs(componentIds);
  currentCompId = filekeyArray[index].componentId;
  // 设置用户点击的按钮的样式
  $(".layui-btn").css("background-color", "white");
  const buttonid = "#button" + index;
  $(buttonid).css("background-color", "#70b1c5");
  // 显示相应的模型信息
  showModelAds(index);

  // 如果用户点击了正在旋转的构件，则停止旋转
  if (!filekeyArray[index].filekeyShow) {
    vizbim.showModelByDocumentId(filekeyArray[index].filekey, () => {
      filekeyArray[index].filekeyShow = !filekeyArray[index].filekeyShow;
      $(".layui-btn").removeAttr("disabled");
      returnHomeComponent(index);
    });
  } else {
    currentCompId = filekeyArray[index].componentId;
    vizbim.resetScene(false, true, true, true, true, true, true);
    returnHomeComponent(index)
  }
}


// 显示广告介绍
// 创建右侧消防产品说明框
const showModelAds = (index) => {
  if (!attributeWindow) {
    const attribute = {
      title: '消防产品说明', // 标题
      width: 350,           // 宽度
      height: 400,          // 高度
      closeOnEsc: false,    // 是否点击键盘esc关闭
      closeButton: true,    // 显示关闭按钮
      afterWindowHide: function (lobibox) {
        attributeWindowFlag = false;   // 关闭容器框后进行一个标记，这样下次就不需要再创建
      },
      content: '<div class="tab-body" id="tab-ModelAds' + toolId + '"> <table id="modeladsTable" class="sx-table table-no-top"><thead></thead><tbody style="background-color: rgba(247, 247, 247, 0.8)"><tr class="noprop"><td>尚未选择构件</td></tr></tbody></table></div>'
    };
    attributeWindow = Lobibox.window(attribute);
    attributeWindowFlag = true;
    attributeWindow.setPosition({    // 设置属性框的位置
      left: '',
      right: 5,
      top: 60
    });
  }
  if (!attributeWindowFlag) {
    attributeWindow.windowShow();
  }
  showComponentAttribute(index);
}

// 显示介绍内容,当用户点击左侧按钮时，更新右侧消防产品说明的内容
const showComponentAttribute = (id) => {
  const containerDiv = $("#tab-ModelAds" + toolId);
  const addProperty = (name, property, headerTr) => {
    const tr = $("<tr></tr>");
    headerTr.after(tr);
    tr.prepend("<td class='td-left' style='width: 30% ; text-align:center'>" + name + "</td>");
    const td = $("<td class='td-right' style='width: 70%;'>");
    const v = property == null || undefined ? "" : property;
    const span = $("<span class='value nonEditable'>" + v + "</span>");
    td.append(span);
    tr.append(td);
  };
  const addTitle = (name, attribute) => {
    const headerTr = $("<tr class='sx-active'></tr>");
    containerDiv.find("table tbody").prepend(headerTr);
    const headerTd = $("<td colspan='2' style='font-size: 14px'></td>");
    headerTr.prepend(headerTd);
    headerTd.prepend("<b>" + name + "</b>");
    for (let p in attribute) {
      addProperty(p, attribute[p], headerTr);
    }
  };
  containerDiv.find("table tbody tr").remove();
  const attribute = window.fireAdvertising[filekeyArray[id].adsId];

  for (let p in attribute) {
    // 方法
    if (typeof(attribute[p]) == "object") {
      addTitle(p, attribute[p]);
    } else if (typeof(attribute[p]) == "string") {
    }
  }
};

// 改写复位监听函数, 用户点击的时候可以隐藏除了当前构件以外的其他构件
const changeHomeListen = () => {
  const uuid = vizbim.uuid;
  $('#home' + uuid).unbind("click");
  $('#home' + uuid).bind("click", () => {
    vizbim.resetScene(true, false, false, false, false, false, false);  // 模型复位
    vizbim.hideObjs(componentIds);  // 隐藏所有构件
    vizbim.showObjs([currentCompId]); // 显示当前构件
    vizbim.adaptiveSize([currentCompId]); // 飞跃到当前构件的视角
  });
}

// 构件旋转函数，以构件坐标系的z轴为旋转轴旋转起来
const rotateComponent = (index) => {
  filekeyArray[index].requestID = setInterval(function () {
    if (vizbim.components[currentCompId]) {
      vizbim.components[currentCompId].rotation.z -= 0.0003;
    }
  }, 0.0001);
}

// 构件初始化，点击不同的按钮，是对应的模型飞跃到相应的视角
// 如果在构建旋转的过程中用户点击了模型构件，就让构件停止旋转
const returnHomeComponent = (index) => {
  vizbim.hideObjs(componentIds);
// 如果在构建旋转的过程中用户点击了模型构件，就让构件停止旋转
  vizbim.listentoSelectObjs(function (componentId, component) {
    if (componentId !== null) {
      clearInterval(filekeyArray[index].requestID);
      filekeyArray[index].requestID = null;
    }
  });
  // 根据传递的不同的按钮，飞跃到相应的模型视角，并且显示当前模型
  switch (index) {
    case 0:
      vizbim.fly.flyTo(mainView0, () => {
        vizbim.showObjs([currentCompId]);
      });
      break;
    case 1:
      vizbim.fly.flyTo(mainView1, () => {
        vizbim.showObjs([currentCompId]);
      });
      break;
    case 2:
      vizbim.fly.flyTo(mainView2, () => {
        vizbim.showObjs([currentCompId]);
      });
      break;
    case 3:
      vizbim.fly.flyTo(mainView3, () => {
        vizbim.showObjs([currentCompId]);
      });
      break;
    case 4:
      vizbim.fly.flyTo(mainView4, () => {
        vizbim.showObjs([currentCompId]);
      });
      break;
  }
  if (filekeyArray[index].requestID === null) {
    rotateComponent(index);
  }
  // 使当前模型的旋转z轴的值复位
  if (vizbim.components[currentCompId]) {
    vizbim.components[currentCompId].rotation.z = 0
  }
}
