const op = {
  viewport:"viewport",
  devcode:"e10e59bf0ee97213ca7104977877bd1a",
  viewController:false        //不加载左上角视图球
};
const vizbim = new BIMWINNER.Viewer(op);  // 三维主对象
const filekey = "demo_pipeline_simple";  // 模型的文件key

// 初始化，主函数
const init = () => {
  vizbim.resize();  // 画布自适应
  vizbim.showModelByDocumentId(filekey, function () {
    restoralButton();  // 模型加载完成后恢复按钮的点击功能
  });  // 加载模型函数
}

// 点击运行触发的函数
const run = () =>{
  // 修改当前模型背景颜色，参数依次对应RGB值，范围均为[0,1]
  vizbim.setSceneBackGroundColor([0.95, 0.98, 0.56]);  
}

// 点击复位触发的函数
const reset = () =>{
  vizbim.resetScene();  // 复位
  const a = (14*16+14)/(16*16);  // 因背景颜色为十六进制的0xEEEEEE，需要换算成十进制的RGB
  vizbim.setSceneBackGroundColor([a, a, a]);  // 为直观显示，恢复成初始加载模型的背景颜色
}

// 恢复按钮的点击功能。为防止用户在未加载完成时点击按钮，造成异常
const restoralButton = () =>{
  $(".layui-btn").removeAttr("disabled");
  $(".layui-btn").removeClass("layui-btn-disabled");
  $(".layui-btn").addClass("layui-btn-primary");
}

// 主函数
init();