/**
 * @description:   指定构件所属系统展示
 */

let systemFlag = false;  // 是否已经获取当前点击构件的系统列表的标记，用来控制点击构件时是否需要再次发送接口请求
// 初始化，主函数
const init = () => {
  vizbim.resize();  // 模型画布自适应窗口大小
  vizbim.showModelByDocumentId(filekey, function () {
    showSystemComponents();  // 展示构件内系统列表
    addRestorButton();    // 创建主工具栏
    /**
     * 监听构件的点击行为，如果用户选中一个构件，则用此构件的id先用
     * [数据接口：根据构件id 获取此构件所属的系统id]获取此构件所属的
     * 系统id,然后根据此系统id用[数据接口：根据构件的id，返回这个构
     * 件的基本信息]，获取此构件的system信息，内容包括此系统下所有构件
     * 的id和该系统的systemtype信息，最后将这些构件id显示在左侧系统列
     * 表控制台，并且监听点击行为如果点击该构件，就高亮聚焦此构件。

     */
    vizbim.listentoSelectObjs(function (componentId, component) {
      // console.log("componentId:",componentId);
      // console.log("component",component);
      if (componentId) {    // 如果选中构件的时候可以拿到这个构件id，则执行下面的逻辑
        vizbim.restoreObjtColor();
        vizbim.setObjtColor([componentId], [0, 1, 0]);
        if (!systemFlag) {
          getComponentSystemIdByComponentId(componentId)
            .then((data) => data.data)
            .then(systemId => {
              getComponentinformationByComponentId(systemId).then((data1) => {
                const systemInfomation = data1.data;
                const systemgroup = systemInfomation.systemgroup;  // 一个系统的构件的systemgroup属性值一样
                const systemType = systemInfomation.systemtype;  // 一个系统的构件的systemgroup属性值一样
                $("#attributeContent").children().remove();
                systemFlag = true;
                const componentIds = systemgroup;
                if (componentIds && componentIds.length > 0) {
                  $("#attributeContent").append(
                    '  <div class="layui-card-header">' +
                    systemType +
                    '</div>' +
                    '  <div id="systemComponents" class="layui-card-body">' +
                    '  </div>'
                  );
                  vizbim.hideObjs(vizbim.alloids);
                  vizbim.showObjs(componentIds);
                  componentIds.forEach(item => {
                    const idItem = item.substring(0,23) + "...";
                    const componentItem = $(`<p 
                    style="cursor: pointer;padding-right: 10px" 
                    id=${item}
                    title=${item}
                    >
                        ${idItem}
                    </p>`);
                    $("#systemComponents").append(componentItem);
                    document.getElementById(item).onclick = function () {
                      onClickComponent(item)
                    };
                  })
                }
              })
            });
        }
      }
    });
  });
}

// 构件点击事件，当点击左侧系统树控制台时，将对应的构件回复高亮并且聚焦
const onClickComponent = (componentId) => {
  $("#systemComponents").find("p").css('background', '');
  document.getElementById(componentId).style.background = '#70b1c5';
  const comArray = [componentId];
  vizbim.restoreObjtColor();   // 恢复构件颜色
  vizbim.setObjtColor(comArray, [0, 1, 0]);  // 设置构件颜色
  vizbim.adaptiveSize(comArray);  // 适应构件视角
}

// 数据接口：根据构件id 获取此构件所属的系统id
const getComponentSystemIdByComponentId = (componentId) => {
  return fetch(`${op.baseaddress}models/${filekey}/components/${componentId}/get/systempoint?devcode=${op.devcode}`)
    .then(response => response.json())
}


// 数据接口：根据构件的id，返回这个构件的systemtype
const getComponentinformationByComponentId = (componentId) => {
  return fetch(`${op.baseaddress}models/${filekey}/components/${componentId}/primary?devcode=${op.devcode}`)
    .then(response => response.json())
}

// 显示左侧系统树的操控台
const showSystemComponents = () => {
  // 创建指引说明
  $("body").append(
    "<div " +
    "style = 'position: absolute;" +
    "top: 20px;" +
    "left: 15px;" +
    "font-size:18px'>" +
    "先选择想要查询的构件" +
    "</div>"
  )
  const Lobibox = vizbim.Lobibox;  // vizbim框对象，目的是调用vizbim封装好的显示出一个边框容器

  // 创建边框容器的属性配置
  const attribute = {
    title: '系统内构件列表',
    width: 250,
    height: 400,
    closeOnEsc: false,
    closeButton: false,
    content: '<div id="attributeContent" class="layui-card"></div>'
  };
  attributeWindow = Lobibox.window(attribute);
  attributeWindow.setPosition({
    left: 5,
    top: 60
  });
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
    systemFlag = false;
    vizbim.resetScene();
    $("#attributeContent").children().remove();
  });
}

