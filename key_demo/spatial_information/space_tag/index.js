/**
 * @description:   为空间添加标签
 */

// 创建一个threejs的obj对象，用来作为三维标签的父级，便于标签的管理
const threeBallMarkers = new THREE.Object3D();
const spaceTreeData = {}  // 定义空间树数据
// 初始化，主函数
function init() {
  vizbim.resize(); // 模型画布自适应窗口大小
  vizbim.scene.add(threeBallMarkers); // 将三维标签的父级添加进场景
  vizbim.showModelByDocumentId(filekey, function () {
    const promptingMessage1 =
      vizbim.promptingMessage("info", "楼层数据获取中，请稍等...", false);  // 加载完模型提示用户
    getSpaceTreeComponents(filekey)
      .then(data=>{
        promptingMessage1.remove();  // 获取数据后移除提示框
        initSpaceTreeData(data);    //  初始化空间树所需数据
        initTree(getLocationTreeNodes(data)); //  初始化空间树操作区
      })
  });
}

// 添加左侧树
const initTree = (tree) =>{
  $('#tree').treeview({
    data: tree,
    collapseIcon:"glyphicon glyphicon-minus", // 树节点关闭的图标
    expandIcon:'glyphicon glyphicon-plus', // 树节点展开的图标
    onNodeSelected: function(event, data) {
      removeMarker(threeBallMarkers,'test1'); // 移除上次的标签
      const hightArray = getComponentArrayByButton(data.text);  // 获取当前层级构件数组
      const starPositionBox = getBoundingBoxByComponents(hightArray); // 获取当前层级包围盒
      const starPosition = starPositionBox.getCenter(); // 获取当前包围盒位置
      // 添加三维标签
      /**
       * 该方法用来添加三维线段面板和图片
       * @params:  componentid {string}
       * @params:  callback {function} 回调函数
       * @param [options] {object} 参数
       * @param [options.color]{16进制颜色}  球形标签的颜色 例如0xff0000
       * @param [options.offsetX]{number}  标签的终点相对于构件位置的偏移X
       * @param [options.offsetY]{number}  标签的终点相对于构件位置的偏移Y
       * @param [options.offsetZ]{number}  标签的终点相对于构件位置的偏移Z
       * @param [options.depthTest]{boolen}  是否关闭标签的深度测试
       * @param [options.startPosition]{Object}  标签的起始位置
       * @params:
       * @return:

       */
      vizbim.addThreeWordMarker({
        startPosition:starPosition,
        offsetX:-30000,
        offsetY:30000,
        offsetZ:20000,
        content:data.text,
        scale:200,
        id:'test1'
      },(threeBallMarker)=>{
        threeBallMarkers.add(threeBallMarker);  // 创建完成以后将三维标签添加到模型场景中
      });
      vizbim.resetScene(false,false,false,true,true,false);  // 恢复模型到初始状态
      vizbim.adaptiveSize(hightArray);  // 让模型视角适应选择的构件数组
      vizbim.reverseTransparentObjs(hightArray,0.4,true);  // 对此构件数组进行反选透明操作
      },
    onNodeUnselected: (event, data)=>{
      vizbim.resetScene(true,true,true,true,true,true); // 恢复模型到初始状态
    }
  });
  $('#tree').treeview('collapseAll', { silent: true });
}

// 根据[数据接口:通过模型key获取模型空间树结构]返回的数据结构，
// 进行数据整理
const getLocationTreeNodes=(arr) => {
  var tree=[];
  for(var i=0;i<arr.length;i++){
    var node={};
    node.id=arr[i].key;
    var name="";
    switch (arr[i].type) {
      case "IFCPROJECT" :
        name = "项目(未命名)";
        break;
      case "IfcSite" :
        name = "场地(未命名)";
        break;
      case "IFCBUILDING" :
        name = "建筑（未命名）";
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
    node.text=arr[i].name||name;
    if(arr[i].childrenResultList&&arr[i].childrenResultList.length>0&&arr[i].childrenResultList[0].childrenResultList){
      node.nodes=getLocationTreeNodes(arr[i].childrenResultList);
    } else if(arr[i].childrenResultList&&arr[i].childrenResultList.length === 0){
      tree.push({text:"该模型无空间划分"});
      continue;
    }
    tree.push(node);
  }
  return tree;
};

// 数据接口:通过模型key获取模型空间树结构
const getSpaceTreeComponents = (filekey) =>{
  return fetch(`${op.baseaddress}models/${filekey}/trees/location?devcode=${op.devcode}`)
    .then(response => response.json())
}

//  初始化空间树数据
const initSpaceTreeData = (treeData) =>{
  const array=treeData[0].childrenResultList[0].childrenResultList[0].childrenResultList;
  array.forEach(item=>spaceTreeData[item.name]
    =item.children.filter(item1=>vizbim.components[item1]!== undefined))
  return spaceTreeData;
}

// 传入构件数组，返回包围盒
const getBoundingBoxByComponents = (components) =>{
  let box = window.box =new THREE.Box3();
  // 先将每一个构件的包围盒更新成世界坐标下的包围盒，再融合
  components.forEach(item=>{
    const boundingBox = vizbim.components[item].geometry.boundingBox;  // 获取当前构件的空间包围盒
    // 获取包围盒的最小值
    const minArray = [
      boundingBox.min.x,
      boundingBox.min.y,
      boundingBox.min.z,
      1
    ];
    // 获取包围盒的最大值
    const maxArray = [
      boundingBox.max.x,
      boundingBox.max.y,
      boundingBox.max.z,
      1
    ];

    // 计算出构件的包围盒的最小值在世界坐标里的位置
    const boxMin = compute4MatrixAnd1matrix(
      vizbim.components[item].matrix.elements,
      minArray
    );

    // 计算出构件的包围盒的最大值在世界坐标里的位置
    const boxMax = compute4MatrixAnd1matrix(
      vizbim.components[item].matrix.elements,
      maxArray
    );
    // 根据包围盒的最小值和最大值，创建世界坐标下的包围盒
    const boxWorld = new THREE.Box3(
      new THREE.Vector3(boxMin[0],boxMin[1],boxMin[2]),
      new THREE.Vector3(boxMax[0],boxMax[1],boxMax[2])
    );
    // 融合成世界坐标下的包围盒
    box=box.union(boxWorld);
  });
  return box;
}

//  计算 4*4矩阵与4*1 向量的数乘,目的是将构件的包围盒的局部坐标更新为世界坐标
const compute4MatrixAnd1matrix = (Matrix44,Matrix41) =>{
  let x = 0,y=0,z=0,d=1;
  if(Matrix44.length === 16 && Matrix41.length ===4){
    x = Matrix44[0]*Matrix41[0] +  Matrix44[4]*Matrix41[1] +  Matrix44[8]*Matrix41[2] +  Matrix44[12]*Matrix41[3];
    y = Matrix44[1]*Matrix41[0] +  Matrix44[5]*Matrix41[1] +  Matrix44[9]*Matrix41[2] +  Matrix44[13]*Matrix41[3];
    z = Matrix44[2]*Matrix41[0] +  Matrix44[6]*Matrix41[1] +  Matrix44[10]*Matrix41[2] +  Matrix44[14]*Matrix41[3];
    d = Matrix44[3]*Matrix41[0] +  Matrix44[7]*Matrix41[1] +  Matrix44[11]*Matrix41[2] +  Matrix44[15]*Matrix41[3];
  }
  return [x,y,z,d];
}

// 根据点击按钮返回对应数组
const getComponentArrayByButton = (text) =>{
  if(spaceTreeData[text]){
    return spaceTreeData[text]
  }else {
    return vizbim.alloids
  }
}

// 移除标签
const removeMarker = (threeObj,markerkey)=> {
  threeObj.children.forEach(item => {
    if (item.key === markerkey) {
      threeObj.remove(item)
    }
  });
}
