const op = {
  viewport:"viewport",
  devcode:"e10e59bf0ee97213ca7104977877bd1a",
  viewController:false        //不加载左上角视图球
};
const vizbim = new BIMWINNER.Viewer(op);  // 三维主对象
const filekey = "demo_lab_fornature";  // 模型的文件key
let defaultCk;   // 默认的构件(组)id

// 初始化，主函数
const init = () => {
  vizbim.resize();
  vizbim.showModelByDocumentId(filekey, function () {
    restoralButton();  // 模型加载完成后恢复按钮的点击功能
    // 将该IfcFurnishingElement类型下的构件(组)id赋值给defaultCk
    defaultCk = vizbim.getComponentTypeArray()["IfcFurnishingElement"];
  });
}

// 点击运行触发的函数
const run = () =>{
  vizbim.isolationObjs(defaultCk);  //构件类隔离
  
  //第一个参数为选中的构件组",
  //第二个参数为构件组修改的颜色，依次为RGB对应的值，范围均为[0,1]
  vizbim.setObjtColor(defaultCk,[0/97,0.98,0.46]);	//修改当前所选中构件组的颜色
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