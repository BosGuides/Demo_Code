/**
 * @description:   多级外轮廓精细度对比
 *                 外轮廓相关示例，对于每个模型，在提取外轮廓之前需要先调用接口提取外轮廓
 *                 本demo使用的模型已经提前提取过了，因此不需要再次提取
 *                 提取示例：fetch(`${op.baseaddress}models/
 *                         ${id}/outlines/!parse?devcode=
 *                         ${op.devcode}&level=${level}&enforce=false`)
 *                 详细接口说明请在开放平台API页面查看:
 *                 https://www.bos.xyz/guide/swapi/getOuter
 */


let outComponents1 = [];  // 定义1级外轮廓构件数组变量
let outComponents2 = [];  // 定义2级外轮廓构件数组变量
let outComponents3 = [];  // 定义3级外轮廓构件数组变量
let moreComponents2 = [];  // 定义2级外轮廓构件比1级外轮廓构件多出来的构件变量
let moreComponents3 = [];  // 定义3级外轮廓构件比2级外轮廓构件多出来的构件变量
let moreComponents31 = []; // 定义3级外轮廓构件比1级外轮廓构件多出来的构件变量

// 主函数
const init = (filekey) => {
  addButtons();   // 创建左侧按钮
  getOutlineComponents(filekey).then(() => {
    vizbim.showModelByDocumentId(filekey, function () {
      buttonClick(1);   // 加载完模型默认选中按钮1
    });
    vizbim.listentoSelectObjs(function (componentId, component) {
      console.log("componentId:", componentId);
      console.log("component", component);
    });
  });
  vizbim.resize();  // 模型自适应窗口大小
}

//数组求差函数，用来计算两个数组的差值
Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
}

// 左侧按钮的初始状态
const backToOrigin = () => {
  $("#toolBarZK").find("button").removeAttr("disabled");
  $("#toolBarZK").find("button").removeClass("layui-btn-disabled");
  $("#toolBarZK").find("button").addClass("layui-btn-primary");
}

// 创建左侧按钮
const addButtons = () => {
  var toolBarZK = $("<div id='toolBarZK'> </div>");
  toolBarZK.appendTo($("#container"));
  $(toolBarZK).append("<ul id='tbZKul2' style='list-style-type:none;padding:0px;'></ul>");
  for (let i = 1; i < 4; i++) {
    const $li = $(
      "<li style='margin: 10px 0px'>" +
      "<button disabled class='layui-btn layui-btn-radius layui-btn-disabled'>" +
      "</button>" +
      "</li>"
    );
    const liId = "modelEdit" + i;
    const buttonId = "button" + i;
    $li.attr("id", liId);
    $li.find("button").attr("id", buttonId);
    const buttonClick = "buttonClick(" + i + ")";
    $li.find("button").attr("onclick", buttonClick);
    switch (i) {
      case 1:
        $li.find("button").html("一级与二级对比");
        break;
      case 2:
        $li.find("button").html("一级与三级对比");
        break;
      default:
        $li.find("button").html("二级与三级对比");
    }
    $("#tbZKul2").append($li);
  }
}

// 获取模型外轮廓  数据接口。 获取该模型的三级外轮廓后，计算出2级比1级多的构件，3级比2级多的构件以及3级比1级多的构件
const getOutlineComponents = (id) => {
  return getOutlineComponentByLevel(id, 1)
    .then((result1) => {
      outComponents1 = result1.data;
      return getOutlineComponentByLevel(id, 2);
    })
    .then((result2) => {
      outComponents2 = result2.data;
      return getOutlineComponentByLevel(id, 3);
    })
    .then((result3) => {
      outComponents3 = result3.data;
      moreComponents2 = outComponents2.diff(outComponents1);   // 2级外轮廓比1级外轮廓多出来的构件
      moreComponents3 = outComponents3.diff(outComponents2);   // 3级外轮廓比2级外轮廓多出来的构件
      moreComponents31 = outComponents3.diff(outComponents1);  // 3级外轮廓比1级外轮廓多出来的构件
    });
}

// 根据层级获取模型外轮廓构件 数据接口
const getOutlineComponentByLevel = (id, level) => {
  return fetch(`${baseaddress}models/${id}/outlines?devcode=${op.devcode}&level=${level}`)
    .then(response => response.json());
}

// 左侧按钮点击事件
const buttonClick = (level) => {
  backToOrigin();   //  按钮回到初始状态
  $("#button" + level).removeClass("layui-btn-primary");  // 按钮设置成选中状态
  vizbim.resetScene(false);  // 将所有构件复原
  vizbim.hideObjs(vizbim.alloids);  //  隐藏所有构件
  if (level === 1) {   // 一级与二级对比，显示1级外轮廓构件与2级外轮廓构件，并且将2级比1级多出的构件设置红色
    vizbim.showObjs(outComponents1);
    vizbim.showObjs(outComponents2);
    vizbim.setObjsColor(moreComponents2, [1, 0, 0]);
    vizbim.transparentObjs(outComponents1, 0.2, true);
  } else if (level === 2) {   // 一级与三级对比，显示1级外轮廓构件与3级外轮廓构件，并且将3级比1级多出的构件设置红色
    vizbim.showObjs(outComponents1);
    vizbim.showObjs(outComponents3);
    vizbim.setObjsColor(moreComponents31, [1, 0, 0]);
    vizbim.transparentObjs(outComponents1, 0.2, true);
  } else {  // 二级与三级对比，显示2级外轮廓构件与3级外轮廓构件，并且将3级比2级多出的构件设置红色
    vizbim.showObjs(outComponents2);
    vizbim.showObjs(outComponents3);
    vizbim.setObjsColor(moreComponents3, [1, 0, 0]);
    vizbim.transparentObjs(outComponents2, 0.2, true);
  }
}
