const op = {
  viewport:"viewport",
  devcode:"e10e59bf0ee97213ca7104977877bd1a",
  viewController:false        //不加载左上角视图球
};
const vizbim = new BIMWINNER.Viewer(op);  // 三维主对象
const filekey = "demo_house_fornature";  // 模型的文件key

// 初始化，主函数
const init = () => {
  vizbim.resize();  // 画布自适应
  vizbim.showModelByDocumentId(filekey, function () {
    restoralButton();  // 模型加载完成后恢复按钮的点击功能
  });  // 加载模型函数
}

let flag = false;
// 点击运行触发的函数
const run = () =>{
  // 调用theFirstPerspective函数，进入漫游模式；点击ESC可显示鼠标光标，再次调用当前函数，退出漫游模式
  vizbim.theFirstPerspective();
  flag = true;
}

// 点击复位触发的函数
const reset = () =>{
  if(flag){
    vizbim.theFirstPerspective();//再次调用漫游函数，退出漫游模式
  }
  vizbim.resetScene();  // 复位
  flag = false;
}

// 恢复按钮的点击功能。为防止用户在未加载完成时点击按钮，造成异常
const restoralButton = () =>{
  $(".layui-btn").removeAttr("disabled");
  $(".layui-btn").removeClass("layui-btn-disabled");
  $(".layui-btn").addClass("layui-btn-primary");
}

// 主函数
init();