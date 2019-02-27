const op = {
  viewport:"viewport",
  devcode:"e10e59bf0ee97213ca7104977877bd1a",
  viewController:false        //不加载左上角视图球
};
const vizbim = new BIMWINNER.Viewer(op);  // 三维主对象
const filekey = "demo_pipeline1";  // 模型的文件key
let defaultCk = ["demo_pipeline1_0t$E0E3eLClxdQIGeSiIpB"];   // 默认的构件id

// 初始化，主函数
const init = () => {
  vizbim.resize();
  vizbim.showModelByDocumentId(filekey, function () {
    restoralButton();  // 模型加载完成后恢复按钮的点击功能
    // listentoSelectObjs() 用来监听构件点击行为,返回构件id和构件对象
    vizbim.listentoSelectObjs(function (componentId, component) {
      if(componentId&&component){
        console.log("componentId:",componentId);   // 在控制台打印出构件id
        console.log("component",component);       // 在控制台打印出构件对象
      }
    });
  });
}

// 点击运行触发的函数
const run = () =>{
  vizbim.highlightObjs(defaultCk);  //构件高亮
}

// 点击复位触发的函数
const reset = () =>{
  vizbim.resetScene();  // 复位
}

// 恢复按钮的点击功能。为防止用户在未加载完成时点击按钮，造成异常
const restoralButton = () =>{
  $(".layui-btn").removeAttr("disabled");
  $(".layui-btn").removeClass("layui-btn-disabled");
  $(".layui-btn").addClass("layui-btn-primary");
}

// 主函数
init();