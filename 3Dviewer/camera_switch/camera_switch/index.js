const op = {
  viewport:"viewport",
  devcode:"e10e59bf0ee97213ca7104977877bd1a",
  viewController:false        //不加载左上角视图球
};
const vizbim = new BIMWINNER.Viewer(op);  // 三维主对象
const filekey = "demo_pipeline1";  // 模型的文件key

// 初始化，主函数
const init = () => {
  vizbim.resize();  // 画布自适应
  vizbim.showModelByDocumentId(filekey, function () {
    restoralButton();  // 模型加载完成后恢复按钮的点击功能
  });  // 加载模型函数
}

// 点击运行触发的函数
const run = () =>{
  // 相机变换，首次调用当前函数，将透视相机转换为正交相机；再次调用，将正交相机转换为透视相机
  vizbim.switchCamera();  
}

// 恢复按钮的点击功能。为防止用户在未加载完成时点击按钮，造成异常
const restoralButton = () =>{
  $(".layui-btn").removeAttr("disabled");
  $(".layui-btn").removeClass("layui-btn-disabled");
  $(".layui-btn").addClass("layui-btn-primary");
}

// 主函数
init();