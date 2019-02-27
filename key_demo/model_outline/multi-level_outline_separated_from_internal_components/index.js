/**
 * @description:   多级外轮廓与内部构件分离
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
let mode1 = false;  // 定义是否点击过按钮1的flag
let mode2 = false;  // 定义是否点击过按钮2的flag


// 定义一个分离场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const splitView = {
  eye: [-105355.61866498036, 523543.95140837756, 73318.18738203985],
  look: [8968.454966856434, 462887.17837725964, 7274.824890353988],
  up: [0, 0, 1]
}


// 主函数
const init = () => {
  addButtons();   // 创建左侧按钮
  getOutlineComponents(filekey).then(() => {
    vizbim.showModelByDocumentId(filekey, function () {
      backToOrigin();  // 左侧按钮取消禁用
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
  mode1 = false;
  mode2 = false;
}

// 创建左侧按钮操控区，调整样式
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
    const addTween = "addTween(" + i + ")";
    $li.find("button").attr("onclick", addTween);
    switch (i) {
      case 1:
        $li.find("button").html("一级轮廓");
        break;
      case 2:
        $li.find("button").html("二级轮廓");
        break;
      default:
        $li.find("button").html("三级轮廓");
    }
    $("#tbZKul2").append($li);
  }
}

// 数据接口:获取模型外轮廓。获取该模型的三级外轮廓后，计算出2级比1级多的构件，3级比2级多的构件以及3级比1级多的构件
const getOutlineComponents = (id) => {
  return getOutlineComponentByLevel(id, 1)
    .then((result1) => {
      outComponents1 = result1.data;
      return getOutlineComponentByLevel(id, 2)
    })
    .then((result2) => {
      outComponents2 = result2.data;
      return getOutlineComponentByLevel(id, 3)
    })
    .then((result3) => {
      outComponents3 = result3.data;
      moreComponents2 = outComponents2.diff(outComponents1)
      moreComponents3 = outComponents3.diff(outComponents1).diff(outComponents2)
      moreComponents31 = outComponents3.diff(outComponents1)
    })
}

// 根据层级获取模型外轮廓构件 数据接口
const getOutlineComponentByLevel = (id, level) => {
  return fetch(`${baseaddress}models/${id}/outlines?devcode=${op.devcode}&level=${level}`)
    .then(response => response.json())
}

// 添加模型构件移动动画,依赖tweenjs做动画，项目地址 https://github.com/sole/tween.js
const addTween = (level) => {
  vizbim.fly.flyTo(splitView); // 飞跃到模型分离视角
  let posSrc = {pos: 1};  // 定义动画更新要改变的变量
  let tobeMovedComponents = [];  // 定义动画构件
  forbiddenButtton(level);  // 禁用按钮
  componentsToOrigin(vizbim.alloids, true);  // 所有模型构件回到初始位置
  // 每次更新需要调用 TWEEN.update函数
  const animate = () => {
    TWEEN.update();
    requestAnimationFrame(animate);
  }
  // tween对象更新的回调函数
  const onUpdate = () => {
    tobeMovedComponents.forEach(item => {
      const component = vizbim.components[item];
      const componentInfo = vizbim.componentInfo[item].matrix;
      const newY = componentInfo[13] - 50000 * (1 - posSrc.pos);
      component.position.y = newY;
    });
  };
  // 实例化一个tween对象，设置它的参数posSrc在3秒内从1减到0
  const tween = new TWEEN.Tween(posSrc)
    .to({pos: 0}, 1000)
    .onUpdate(onUpdate)      // 更新时执行的函数
    .easing(TWEEN.Easing.Sinusoidal.InOut)   // posSrc变化的规律
    .start();   // 开始执行此动画
  switch (level) {
    case 1:
      mode1 = true;
      tobeMovedComponents = outComponents1;
      break;
    case 2:
      mode2 = true;
      if (mode1) {
        tobeMovedComponents = moreComponents2;
        componentsToOrigin(outComponents1, false);
      } else {
        tobeMovedComponents = outComponents2;
      }
      break;
    default:
      if (mode2) {
        tobeMovedComponents = moreComponents3;
        componentsToOrigin(outComponents2, false);
      } else if (mode1) {
        tobeMovedComponents = moreComponents31;
        componentsToOrigin(outComponents1, false);
      } else {
        tobeMovedComponents = outComponents3;
      }
      tween.onComplete(() => {
        backToOrigin();
      });
  }
  animate();  // 开始动画
}

// 禁用按钮的样式
const forbiddenButtton = (level) => {
  for (let i = 1; i < level + 1; i++) {
    const buttonId = i;
    const $button = $('#button' + buttonId);
    $button.attr("disabled", "disabled");
    $button.removeClass("layui-btn-primary");
    $button.addClass("layui-btn-disabled");
  }
}

// 构件回到初始位置或者移动到末尾位置
const componentsToOrigin = (components, flag) => {
  components.forEach(item => {
    const componentInfo = vizbim.componentInfo[item].matrix;
    if (flag) {
      vizbim.components[item].position.set(componentInfo[12], componentInfo[13], componentInfo[14]);
    } else {
      vizbim.components[item].position.set(componentInfo[12], componentInfo[13] - 50000, componentInfo[14]);
    }
  });
}
