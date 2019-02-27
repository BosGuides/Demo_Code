const op = {
  viewport:"viewport",
  devcode:"e10e59bf0ee97213ca7104977877bd1a",
  viewController:false        //不加载左上角视图球
};
const vizbim = new BIMWINNER.Viewer(op);  // 三维主对象
const filekey = "demo_fornature_simple";  // 模型的文件key

// 初始化，主函数
const init = () => {
  vizbim.resize();  // 画布自适应
  vizbim.showModelByDocumentId(filekey, function () {
    restoralButton();  // 模型加载完成后恢复按钮的点击功能
  });  // 加载模型函数
}

// 点击运行触发的函数
const run = () =>{
  // 如果用户点击了构件，则把选中的构件id赋值给defaultCk，否则就是默认的构件id值
  defaultCk = vizbim.arrayConversion()
    ? vizbim.arrayConversion()
    : ["demo_fornature_simple_35mRxI2L175Qq8uVbXI6Nw"];
  vizbim.isolationObjs(defaultCk); // 隔离选中的构件
  vizbim.modelCutting(); //模型剖切
}

// 点击复位触发的函数
const reset = () =>{
  vizbim.resetScene();  // 复位  
  if(vizbim.Flag.clip){
      vizbim.modelCutting();
    }  // 取消剖切
}

// 恢复按钮的点击功能。为防止用户在未加载完成时点击按钮，造成异常
const restoralButton = () =>{
  $(".layui-btn").removeAttr("disabled");
  $(".layui-btn").removeClass("layui-btn-disabled");
  $(".layui-btn").addClass("layui-btn-primary");
}

// 主函数
init();