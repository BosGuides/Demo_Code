/**
 * @description:   箭头的移动消失
 */

let arrow; // 存放箭头的变量

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [60.906862150171605, 114.77369801059345, 16.472481321581935], // 相机位置
  look: [-292.72766362636935, 89.01953833345439, -4.05842224177415],  // 相机焦点
  up: [0, 0, 1],                                                     // 相机正方向
}

// 初始化，主函数
function init() {
  vizbim.resize(); // 模型画布自适应窗口大小
  vizbim.showModelByDocumentId(filekey, function () {
    vizbim.fly.flyTo(mainView); // 加载完模型以后 视角飞跃到调整好的视角位置
    /**
     * 该方法用来添加三维线段面板和图片
     * @params:  componentid {string}
     * @params:  callback {function} 回调函数
     * @param [options] {object} 参数
     * @param [options.color]{16进制颜色}  箭头的颜色 例如0xff0000
     * @param [options.depthTest]{boolen}  是否关闭标签的深度测试
     * @param [options.id]{String}  箭头的key，默认为随机
     * @param [options.flowDerection]{String}  标签的朝向， 'x+', 'x-', 'y+', 'y-', 'z+', 'z-', 默认为'y+'
     * @params:
     * @return: arrow { Three的Object3D }

     */
    arrow = vizbim.createArrow({
      flowDerection: "y+",
      scale: 0.1,
      id: 'arrow1'
    });
    vizbim.scene.add(arrow);         // 将创建的箭头添加进场景视图里
    arrow.position.x = -250;         // 调整箭头的位置
    moveArrows();                    // 移动箭头
    vizbim.hideObjs(vizbim.alloids); // 将模型隐藏，以直观的看见箭头
  });
}

//让箭头移动
const moveArrows = () => {
  let posSrc = {pos: 0}; // 初始化一个动画需要更新的值，tweenjs使用
  // 每次更新需要调用 TWEEN.update函数
  const animate = () => {
    TWEEN.update();    // 每次更新需要调用一下 TWEEN.update() 以更新TWEEN的值
    requestAnimationFrame(animate);  //  浏览器每一帧刷新时执行的函数
  }

  // tween的更新函数，先移动箭头，再缓慢消失箭头
  const onUpdate = () => {
    if (posSrc.pos < 0.5) {
      arrow.position.y += 8 * posSrc.pos;  // 当posSrc.pos < 0.5时，将箭头位置的y值增加，达到移动效果
    } else {
      arrow.children.forEach(item => {
        item.material.opacity = 1 - posSrc.pos // 当posSrc.pos>0.5时，将箭头的透明度变化，达到构件消失效果
      });
    }
  };

  // tweenBack的更新函数，当箭头移动到特定位置，消失后，恢复它的初始位置，并且恢复透明度
  const onUpdate2 = () => {
    arrow.position.y = 0;     // 将箭头的位置复原
    arrow.children.forEach(item => {
      item.material.opacity = 1; // 将箭头的透明度复原
    });
  };

  // 实例化一个tween对象，设置它的参数posSrc在3秒内从0到1
  const tween = new TWEEN.Tween(posSrc)
    .to({pos: 1}, 3000)      // 将posSrc.pos的的值在3s中增加到1
    .onUpdate(onUpdate)      // 更新时执行的函数
    .easing(TWEEN.Easing.Sinusoidal.InOut)   // posSrc变化的规律
    .start();   // 开始执行此动画

  // 实例化另一个tween对象，设置它的参数posSrc在3秒内从1到0
  const tweenBack = new TWEEN.Tween(posSrc)
    .to({pos: 0}, 30)     // 将posSrc.pos的的值在3s中从1减少到0
    .onUpdate(onUpdate2)  // 更新时执行的函数
    .easing(TWEEN.Easing.Sinusoidal.InOut)  // posSrc变化的规律
    .chain(tween);  // 与tween衔接
  tween.chain(tweenBack);  // 与tweenBack衔接

  animate(); // 执行动画函数
}
