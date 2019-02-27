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
  /** 调用promptingMessage函数，模型上端弹出消息提示框
  *   第一个参数用于定义当前信息类型，包括：'successful'、'info'、'warning'、'error'、'finish'
  *   第二个参数，用于描写返回内容
  *   第三个参数，用于设定提示框的持续时长(ms)，若输入false，则需手动关闭消息提示框
  */
  vizbim.promptingMessage('info','消息提示',5000);  
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