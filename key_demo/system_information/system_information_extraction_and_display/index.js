/**
 * @description:   系统信息提取与展示
 */

// 初始化，主函数
const init = () => {
  vizbim.resize();
  vizbim.showModelByDocumentId(filekey, function () {
    const promptingMessage1 = vizbim.promptingMessage(
      "info", "系统数据获取中，请稍等...",
      false
    );    // 模型弹出框
    getSystemTreeComponents(filekey)
      .then(data => {
        promptingMessage1.remove();
        initTree(getSystemTreeNodes(data.data));
      })
  });
}

// 添加左侧树
const initTree = (tree) => {
  $('#tree').treeview({
    data: tree,
    collapseIcon: "glyphicon glyphicon-minus",
    expandIcon: 'glyphicon glyphicon-plus',
    onNodeSelected: function (event, data) {
      console.log("点中的data--", data);
      const hightArray = data.componentArray;
      vizbim.resetScene(false, false, false, true, true, false);
      vizbim.adaptiveSize(hightArray);
      vizbim.reverseTransparentObjs(hightArray, 0.4, true);
    },
    onNodeUnselected: (event, data) => {
      vizbim.resetScene(true, true, true, true, true, true);
    }
  });
  $('#tree').treeview('collapseAll', {silent: true});
}

// 获取模型系统树结构
const getSystemTreeComponents = (filekey) => {
  return fetch(`${op.baseaddress}models/${filekey}/components/system?devcode=${op.devcode}`)
    .then(response => response.json())
}

// 将系统树接口返回的数据加工成bootstraptreeview所需要的node数据结构
const getSystemTreeNodes = (arr) => {
  var tree = [];
  for (var i = 0; i < arr.length; i++) {
    var node = {};
    node.id = arr[i].key;
    node.text = arr[i].systemtype;
    node.componentArray = arr[i].systemgroup;
    tree.push(node);
  }
  return tree;
};
