/**
 * @description:   空间树展示
 */

// 根据[数据接口:通过模型key获取模型空间树结构]返回的数据结构，
// 进行数据整理
const getLocationTreeNodes = (arr) => {
  const tree = [];
  for (var i = 0; i < arr.length; i++) {
    var node = {};
    node.id = arr[i].key;
    var name = "";
    switch (arr[i].type) {
      case "IFCPROJECT" :
        name = "项目(未命名)";
        break;
      case "IfcSite" :
        name = "场地(未命名)";
        break;
      case "IFCBUILDING" :
        name = "建筑(未命名)";
        break;
      case "IFCBUILDINGSTOREY" :
        name = "楼层(未命名)";
        break;
      case "IfcSpace" :
        name = "空间(未命名)";
        break;
      default:
        name = "构件(未命名)";
    }
    node.text = arr[i].name || name;
    if (arr[i].childrenResultList && arr[i].childrenResultList.length > 0) {
      node.nodes = getLocationTreeNodes(arr[i].childrenResultList);
    } else if (arr[i].childrenResultList && arr[i].childrenResultList.length === 0) {
      tree.push({text: "该模型无空间划分"});
      continue;
    }
    tree.push(node);
  }
  return tree;
};

// 初始化，主函数
const init = () => {
  vizbim.resize();  // 模型画布自适应窗口大小

  vizbim.showModelByDocumentId(filekey, function () {
    // 加载完模型之后，提示用户开始加载模型树数据
    const promptingMessage1 = vizbim.promptingMessage(
      "info",
      "空间树数据正在生成中，请稍等...",
      false
    );
    getSpaceTreeComponents(filekey)
      .then(data => {
        promptingMessage1.remove();  // 拿到模型树数据后，删除提示框
        initTree(getLocationTreeNodes(data)); // 进行过数据整理之后，生成空间树
      })
  });
}

// 添加左侧树操作区域
const initTree = (tree) => {
  $('#tree').treeview({
    data: tree,
    collapseIcon: "glyphicon glyphicon-minus", // 树节点关闭的图标
    expandIcon: 'glyphicon glyphicon-plus',  // 树节点展开的图标
    onNodeSelected: function (event, data) {
      const hightArray = ergodicLocationNodes(data); // 获取当前树节点下所有的构件id
      vizbim.resetScene(false, false, false, true, true, false); // 恢复模型到初始状态
      vizbim.adaptiveSize(hightArray);  // 让模型视角适应选择的构件数组
      vizbim.reverseTransparentObjs(hightArray, 0.4, true); // 对此构件数组进行反选透明操作
    },
    onNodeUnselected: (event, data) => {
      vizbim.resetScene(true, true, true, true, true, true); // 恢复模型到初始状态
    }
  });
  $('#tree').treeview('collapseAll', {silent: true});
}

// 数据接口:通过模型key获取模型空间树结构
const getSpaceTreeComponents = (filekey) => {
  return fetch(`${op.baseaddress}models/${filekey}/trees/location?devcode=${op.devcode}`)
    .then(response => response.json())
}

// 根据用户点击的名称，获取当前树节点下所有的构件id，并对这些构件进行反选透明操作
const ergodicLocationNodes = (nodes) => {
  var array = [];
  if (nodes.nodes) {
    for (var i = 0; i < nodes.nodes.length; i++) {
      var list = ergodicLocationNodes(nodes.nodes[i]);
      array = list.reduce(function (coll, item) {
        coll.push(item);
        return coll;
      }, array);
    }
  } else {
    array.push(nodes.id);
  }

  return array;
}
