/**
 * @description:   模型外轮廓的内外分离
 */


// 定义外轮廓构件id的数组变量
let outComponents1 = []; // 1级外轮廓
let inlineComponents = []; // 模型除去1级外轮廓构件以外的内部的构件

// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 通过接口获取模型1级外轮廓和2级外轮廓构件，并且计算出2级外轮廓构件比1级外轮廓构件多出来的构件，以及1级外轮廓构件和2级外轮廓构件的总和
  getOutlineComponents(filekey).then(() => {
    vizbim.showModelByDocumentId(filekey, () => {
      inlineComponents = vizbim.alloids.diff(outComponents1);  // 计算出模型里除去外轮廓构件剩余的构件
      addTween();   // 构件内外分离动画
    });
  });
}

//数组求差函数，用来计算两个数组的差值
Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
}

// 获取模型1层的外轮廓
const getOutlineComponents = (id) => {
  return getOutlineComponentByLevel(id, 1)
    .then((result1) => {
      outComponents1 = result1.data;
    });
}

// 根据层级获取模型外轮廓构件
const getOutlineComponentByLevel = (id, level) => {
  return fetch(`${op.baseaddress}models/${id}/outlines?devcode=${op.devcode}&level=${level}`)
    .then(response => response.json())
    .then(data => {
      if (data.code === 200 && data.message === "成功") {
        return data;
      } else {
        vizbim.promptingMessage("error", `出错了，错误代码为:${data.code}`, false);
      }
    })
    .catch(e => console.error("出错了!错误为:", e));
}

// 添加模型构件移动动画,依赖tweenjs做动画，项目地址 https://github.com/sole/tween.js
const addTween = () => {
  let posSrc = {pos: 1};

  // 每次更新需要调用 TWEEN.update函数
  const animate = () => {
    TWEEN.update();  // 每次更新需要调用一下 TWEEN.update() 以更新TWEEN的值
    requestAnimationFrame(animate);  //  浏览器每一帧刷新时执行的函数
  }

  // tween对象更新的回调函数，每次更新需要将外轮廓构件的z值更新，以达到模型外轮廓上下分离的视觉效果
  const onUpdate = () => {
    outComponents1.forEach(item => {
      const component = vizbim.components[item];
      const componentInfo = vizbim.componentInfo[item].matrix;
      const newZ = componentInfo[14] + 30000 * (1 - posSrc.pos);
      component.position.z = newZ;
    });
  };
  // 实例化一个tween对象，设置它的参数posSrc在3秒内从1减到0
  const tween = new TWEEN.Tween(posSrc)
    .to({pos: 0}, 3000)
    .onUpdate(onUpdate)      // 更新时执行的函数
    .easing(TWEEN.Easing.Sinusoidal.InOut)   // posSrc变化的规律
    .start();   // 开始执行此动画
  // 实例化另一个tween对象，设置它的参数posSrc在3秒内从0加到1
  const tweenBack = new TWEEN.Tween(posSrc)
    .to({pos: 1}, 3000)
    .onUpdate(onUpdate)  // 更新时执行的函数
    .easing(TWEEN.Easing.Sinusoidal.InOut)  // posSrc变化的规律
    .chain(tween);  // 与tween衔接
  tween.chain(tweenBack);  // 与tweenBack衔接
  animate(); // 执行动画函数
}
