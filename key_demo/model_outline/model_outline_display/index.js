/**
 * @description:   多级外轮廓提取与展示
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
let allOutlineComponents = []; // 定义1、2、3级外轮廓构件

// 分离视角,模型构件分离时候的视角，参数获取通过在前端界面调整好视角后，用vizbim.getModelSnapshoot()函数获取
const mainView = {
  eye: [72102.79812797421, 385417.72565133544, 47508.52787360696],  // 相机位置
  look: [35517.3725969067, 483846.3554570255, 7343.552624408278],    // 相机焦点
  up: [0, 0, 1]                                                   // 相机正方向
}


// 主函数
const init = () => {
  addButtons();   // 创建左侧按钮
  getOutlineComponents(filekey).then(() => {
    // 只加载所有的外轮廓构件数组
    vizbim.showModelByComponentId(allOutlineComponents, function () {
      vizbim.fly.flyTo(mainView);
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

// 数组去重函数，用来去除数组里重复的值
const uniq = (array) => {
  const temp = []; //一个新的临时数组
  for (let i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  }
  return temp;
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
        $li.find("button").html("模型一级轮廓");
        break;
      case 2:
        $li.find("button").html("模型二级轮廓");
        break;
      default:
        $li.find("button").html("模型三级轮廓");
    }
    $("#tbZKul2").append($li);
  }
}

// 获取模型外轮廓  数据接口。 获取该模型的三级外轮廓后，计算出2级比1级多的构件，3级比2级多的构件以及3级比1级多的构件
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
      moreComponents2 = outComponents2.diff(outComponents1);
      moreComponents3 = outComponents3.diff(outComponents1).diff(outComponents2);
      moreComponents31 = outComponents3.diff(outComponents1);
      allOutlineComponents = uniq(outComponents1.concat(outComponents2).concat(outComponents3));
    })
}

// 根据层级获取模型外轮廓构件 数据接口
const getOutlineComponentByLevel = (id, level) => {
  return fetch(`${baseaddress}models/${id}/outlines?devcode=${op.devcode}&level=${level}`)
    .then(response => response.json());
}

// 添加模型构件移动动画,依赖tweenjs做动画，项目地址 https://github.com/sole/tween.js
const addTween = (tobeMovedComponents, animateFlag) => {
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
      const newZ = componentInfo[14] + 50000 - 50000 * (1 - posSrc.pos);
      component.position.z = newZ;
    });
  };

  const posSrc = {pos: 1};  // 定义动画更新要改变的变量
  // 实例化一个tween对象，设置它的参数posSrc在3秒内从1减到0
  const tween = new TWEEN.Tween(posSrc)
    .to({pos: 0}, 1000)      // 1s钟之内将pos的值从1变成0
    .onUpdate(onUpdate)      // 更新时执行的函数
    .easing(TWEEN.Easing.Sinusoidal.InOut)   // posSrc变化的规律
    .start();   // 开始执行此动画
  if (animateFlag !== false) {
    animate();  // 开始动画
  }
  return tween;
}

// 按钮点击事件
const buttonClick = (level) => {
  vizbim.hideObjs(vizbim.alloids);  //  隐藏所有构件
  vizbim.showObjs(outComponents1);  //  显示1级外轮廓构件
  forbiddenButtton(level);
  $("#button" + level).removeClass("layui-btn-primary");  // 按钮设置成选中状态
  $("#button" + level).removeClass("layui-btn-disabled");  // 按钮设置成选中状态
  if (level === 1) {
    addTween(outComponents1)
      .onComplete(() => {
        backToOrigin();   //  按钮回到初始状态
        $("#button" + level).removeClass("layui-btn-primary");  // 按钮设置成选中状态
      });
  } else if (level === 2) {
    addTween(outComponents1)
      .onComplete(() => {
        vizbim.showObjs(outComponents2);  //  隐藏所有构件
        addTween(moreComponents2, false)
          .onComplete(() => {
            backToOrigin();   //  按钮回到初始状态
            $("#button" + level).removeClass("layui-btn-primary");  // 按钮设置成选中状态
          });
      });
  } else {
    addTween(outComponents1)
      .onComplete(() => {
        vizbim.showObjs(outComponents2);  //  显示2级外轮廓构件
        addTween(moreComponents2, false)
          .onComplete(() => {
            vizbim.showObjs(outComponents3);  //  显示3级外轮廓构件
            addTween(moreComponents3, false)
              .onComplete(() => {
                backToOrigin();   //  按钮回到初始状态
                $("#button" + level).removeClass("layui-btn-primary");  // 按钮设置成选中状态
              });
          });
      });
  }
}

// 左侧按钮的初始状态
const backToOrigin = () => {
  $("#toolBarZK").find("button").removeAttr("disabled");
  $("#toolBarZK").find("button").removeClass("layui-btn-disabled");
  $("#toolBarZK").find("button").addClass("layui-btn-primary");
}

// 禁用按钮
const forbiddenButtton = () => {
  $("#toolBarZK").find("button").attr("disabled", "disabled");
  $("#toolBarZK").find("button").removeClass("layui-btn-primary");
  $("#toolBarZK").find("button").addClass("layui-btn-disabled");
}

