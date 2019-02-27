const op = {
  viewport:"viewport",
  devcode:"e10e59bf0ee97213ca7104977877bd1a",
  viewController:false        //不加载左上角视图球
};
const vizbim = new BIMWINNER.Viewer(op);  // 三维主对象
const filekey = "demo_fornature_simple";  // 模型的文件key
const newView = {
  eye: [265.36527903582,278.71123164421306,8632.858247746743],
  look:[152.66395568847656,200.12606811523438,3444.5],
  up: [0,0,1]
} // 给模型设置一个初始的视角，为了展示adaptiveSize()方法可让模型飞跃至合适大小

// 初始化，主函数
const init = () => {
  vizbim.resize();  // 画布自适应
  vizbim.showModelByDocumentId(filekey, function () {
    restoralButton();  // 模型加载完成后恢复按钮的点击功能
    vizbim.fly.flyTo(newView); //将模型飞跃至设置的初始视角
  });  // 加载模型函数
}

// 点击运行触发的函数
const run = () =>{
  /**
 * adaptiveSize()用来聚焦模型达到合适的大小
 * 如果传了参数即构件id(组)，那么按给定的构件处理。
 * 如果没有传参，但有构件被选中，那么按照被选中的构件进行处理。
 * 如果没有传参并且没有构件被选中，那么将处理所有构件即整个模型。
 */
  vizbim.adaptiveSize(); //模型聚焦
}

// 点击复位触发的函数
const reset = () =>{
  vizbim.resetScene();  // 复位
  vizbim.fly.flyTo(newView); //将模型飞跃至设置的初始视角
}

// 恢复按钮的点击功能。为防止用户在未加载完成时点击按钮，造成异常
const restoralButton = () =>{
  $(".layui-btn").removeAttr("disabled");
  $(".layui-btn").removeClass("layui-btn-disabled");
  $(".layui-btn").addClass("layui-btn-primary");
}

// 主函数
init();