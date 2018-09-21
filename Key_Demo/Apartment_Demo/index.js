const op = {
 viewport:"viewport",
 //用户开发码
 devcode:"c65b2f5f8f854",
 baseaddress:'http://47.94.145.153:9090/',
};
const vizbim = new BIMWINNER.Viewer(op);
let ballMark = new THREE.Object3D();
let textMark = new THREE.Object3D();
let ballTextMark = new THREE.Object3D();
let threeBallTextMark = new THREE.Object3D();
const mainView = {
  eye:[61315.67262933799,36822.58786974741,24853.612364662054],
  look:[4549.756218968891,-2611.13324081467,7805.0001220703125],
  up:[0,0,1],
  zoom:1
}
let component2 = [];
let component3 = [];
let component4 = [];

const allComponents = window.allComponents = {}

function init(id){
	let tool = new BIMWINNER.Tool(vizbim); 
	tool.createTool();
  vizbim.scene.add(ballTextMark);
  vizbim.scene.add(threeBallTextMark);
  ballTextMark.add(textMark);
  ballTextMark.add(ballMark);
  hideBarAndTool();
  // 获取每一层构件I，初始化模型
  getSpaceTreeComponents(id).then((result)=>{
    const dataArray = result[0].childrenResultList[0].childrenResultList[0].childrenResultList;
    allComponents.component2 = get234Compoennts(dataArray,"2F");
    allComponents.component3 = get234Compoennts(dataArray,"3F");
    allComponents.component4 = get234Compoennts(dataArray,"4F");
    tree.forEach((item,index)=>{
      if(index === 0){
        item.componentId = allComponents.component2;
      }else if(index === 1){
        item.componentId = allComponents.component3;
      }else if(index === 2){
        item.componentId = allComponents.component4;
      }
    });
    initTree();
    vizbim.showModelByDocumentId(id,function(){
      //添加坐标系
      // let axes = new THREE.AxisHelper(200000);
      // vizbim.scene.add(axes);
      // 视角飞跃
      vizbim.fly.flyTo(mainView);
      // 更改小房子点击事件
      changHomeBehavior();
      vizbim.listentoSelectObjs(function (componentId, component) {
        // console.log("componentId:",componentId);
        // console.log("component",component);
      });
    });
  });
	vizbim.autoResize=true;
	vizbim.resize();
}

// 工具栏隐藏
const hideBarAndTool = () =>{
  // 左上角的视图球
  let leftUpDiv = document.getElementsByClassName('list-item2')[0];
  leftUpDiv.style.display = 'none';
}

let mark

// 添加标签
const addMark = (componentId,title) =>{
  const level = title.substring(0,1);
  const cardBord=$(
    "<div class=\"layui-card\">\n" +
    "  <div class=\"layui-card-header\" style='font-size:18px;'>"+"<i class=\"fas fa-arrow-left\" style='padding-right:50px; cursor:pointer' onmousedown='showballMark("+level+")'></i>"+title+"</div>\n" +
    "  <div class=\"layui-card-body\" style='font-size:15px;'>\n" +
    "<p style='margin:10px 0'>入住人数: 6</p>" +
    "<p style='margin:10px 0'>所属专业: 数学系</p>\n" +
    "<p style='margin:10px 0'>电费剩余: 10元</p>\n" +
    "<p style='margin:10px 0'>保修清单: 灯管损坏   <span style='padding-left:10px;'>已解决</span></p>\n" +
    "<p style='padding-left:70px;margin:10px 0'> 跳 闸 <span style='padding-left:35px;'>未解决</span></p>"+
    "<p style='padding-left:70px;margin:10px 0'> 门锁损坏 <span style='padding-left:10px;'>未解决</span></p>"+
    "  </div>\n" +
    "</div>")
  mark = new BIMWINNER.DOMMark(vizbim);
  const tPosition = vizbim.components[componentId].position;
  const position = [tPosition.x,tPosition.y,tPosition.z]
  // console.log("position:",position);
  mark.add({
    startPosition:position,
    offsetPosition: [100,-100],
    draggable:true,
    title:"",
    id:"markid",
    domElement:cardBord
  },
    function(a){
    console.log(a)
  });
}

const tree = [
  {
    text: "二层",
    type:'home',
    state: {
      checked: true,
      expanded: true,
    },
    tags: ['available'],
    level:2,
    componentId:[],
    nodes: [
      {
        text: "201宿舍",
        info:'1',
        componentId:'3779371_2RF45eFAPD0OOgj$vCE2w4',
        guid:1,
        type:'switch',
      },
      {
        text: "203宿舍",
        info:'2',
        guid:5,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE2w6',
        type:'switch',
      },
      {
        text: "205宿舍",
        info:'3',
        guid:12,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE2w0',
        type:'switch',
      },
      {
        text: "207宿舍",
        info:'4',
        guid:34,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE2w2',
        type:'switch',
      }
    ]
  },
  {
    text: "三层",
    type:'home',
    state: {
      checked: true,
      expanded: true,
    },
    tags: ['available'],
    level:3,
    componentId:[],
    nodes: [
      {
        text: "301宿舍",
        info:'1',
        componentId:'3779371_2RF45eFAPD0OOgj$vCE2ws',
        guid:1,
        type:'switch',
      },
      {
        text: "304宿舍",
        info:'2',
        guid:5,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE2wp',
        type:'switch',
      },
      {
        text: "305宿舍",
        info:'3',
        guid:12,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE2wo',
        type:'switch',
      },
      {
        text: "308宿舍",
        info:'4',
        guid:34,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE2w$',
        type:'switch',
      }
    ]
  },
  {
    text: "四层",
    type:'home',
    state: {
      checked: true,
      expanded: true,
    },
    tags: ['available'],
    level:4,
    componentId:[],
    nodes: [
      {
        text: "401宿舍",
        info:'1',
        componentId:'3779371_2RF45eFAPD0OOgj$vCE37q',
        guid:1,
        type:'switch',
      },
      {
        text: "402宿舍",
        info:'2',
        guid:5,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE37t',
        type:'switch',
      },
      {
        text: "403宿舍",
        info:'3',
        guid:12,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE37s',
        type:'switch',
      },
      {
        text: "405宿舍",
        info:'4',
        guid:34,
        componentId:'3779371_2RF45eFAPD0OOgj$vCE37m',
        type:'switch',
      }
    ]
  }
];
// 添加左侧树
const initTree = () =>{
  $('#tree').treeview({
    data: tree,
    collapseIcon:"glyphicon glyphicon-folder-open",
    expandIcon:'glyphicon glyphicon-folder-close',
    onNodeSelected: function(event, data) {
      textMark.children=[];
      ballMark.children=[];
      threeBallTextMark.children=[];
      if(data.type === "home"){
        showballMark(data.level);
        vizbim.resetScene(false,true,true,true,true,true,true);
        vizbim.hideObjs(vizbim.alloids);
        vizbim.showObjs(data.componentId);
      }else{
        addMark(data.componentId,data.text)
        if(data.parentId === 0 ){
          vizbim.hideObjs(vizbim.alloids);
          vizbim.showObjs(allComponents.component2);
        }else if(data.parentId === 5){
          vizbim.hideObjs(vizbim.alloids);
          vizbim.showObjs(allComponents.component3);
        }else {
          vizbim.hideObjs(vizbim.alloids);
          vizbim.showObjs(allComponents.component4);
        }
      }
      vizbim.hideObjs(["3779371_1mPxx$mUnDPebB6XlyJxQM","3779371_2tfyzEGf1Dg9mRmsgVgP7n"]);
    },
    onNodeUnselected: (event, data)=>{
      textMark.children=[];
      ballMark.children=[];
      threeBallTextMark.children=[];
      if(data.type === "home") {
        vizbim.resetScene(true,true,true,true,true,true,true);
        vizbim.fly.flyTo(mainView);
      }else {
        const level = parseInt(data.text.substring(0,1));
        console.log("level",level);
      }
      if(mark){
        mark.remove("markid")
      }
      vizbim.hideObjs(["3779371_1mPxx$mUnDPebB6XlyJxQM","3779371_2tfyzEGf1Dg9mRmsgVgP7n"]);
    }
  })
  $('#tree').treeview('collapseAll', { silent: true });

}


// 更改监听的小房子点击事件
const changHomeBehavior = () =>{
  const uuid=vizbim.uuid;
  $('#home'+uuid).unbind("click");
  $('#home'+uuid).bind("click",()=>{
    vizbim.fly.flyTo(mainView)
    vizbim.resetScene(false,true,true,true,true,true,true);
    if(mark){
      mark.remove("markid");
    }
    textMark.children=[];
    ballMark.children=[];
    threeBallTextMark.children=[];
  });
}

// 添加3D文字
const addText = (content,componentid) =>{
  let xMid,text, message;
  let loader = new THREE.FontLoader();
  loader.load( 'http://pf6zh7nc8.bkt.clouddn.com/helvetiker_regular.typeface.json', function ( font ) {

    let textShape = new THREE.BufferGeometry();

    let color = 0xFF0000;

    let matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });

    let matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });

    if(content){
      message = content
    }else {
      message = "   Three.js\nSimple text.";
    }

    let shapes = font.generateShapes(message, 1000, 1000);

    let geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();

    xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    geometry.translate(xMid, 0, 0);

    // make shape ( N.B. edge view not visible )

    textShape.fromGeometry(geometry);

    text = window.text = new THREE.Mesh(textShape, matLite) ;
    let position = vizbim.components[componentid].position;
    let newposition = {}
    newposition.x = position.x;
    // newposition.y = position.y + 7000;
    // newposition.z = position.z + 7500;
    newposition.y = position.y;
    newposition.z = position.z+7500;
    text.position.x = newposition.x;
    text.position.y = newposition.y;
    text.position.z = newposition.z;
    text.rotation.x+=Math.PI/2;
    text.rotation.y+=Math.PI/2;
    textMark.add(text);
    updateTextView();
    vizbim.cameraControl.addEventListener('change',function(){
      updateTextView();
    });
    addThreeBallMarker(newposition);
  });
}

// 更新三维字体视角，始终面向相机
const updateTextView  = () =>{
  for(let i = 0;i<textMark.children.length;i++){
    textMark.children[i].rotation.x = vizbim.camera.rotation.x;
    textMark.children[i].rotation.y = vizbim.camera.rotation.y;
    textMark.children[i].rotation.z = vizbim.camera.rotation.z;
  }
}

// 三维圆形标签
const addThreeBallMarker = (position) =>{

  let ballMarkItem = new THREE.Object3D();

  var geometry1 = new THREE.SphereGeometry( 700, 32, 32);
  var material1 = new THREE.MeshBasicMaterial( {color: 0x6495ED,side:THREE.DoubleSide} );
  var sphere = window.sphere= new THREE.Mesh( geometry1, material1 );
  sphere.position.set(30,-1100,12000);

  ballMarkItem.add( sphere );

  var geometry2 = new THREE.CylinderGeometry( 700,-1, 1300,32);
  var material2 = new THREE.MeshBasicMaterial( {color: 0x6495ED,side:THREE.DoubleSide} );
  var cylinder = window.cylinder =new THREE.Mesh( geometry2, material2 );
  cylinder.position.set(30,-1100,11250);
  cylinder.rotation.x+=Math.PI/2
  ballMarkItem.add( cylinder );


  ballMarkItem.position.z=position.z-13000;
  ballMarkItem.position.x=position.x;
  ballMarkItem.position.y=position.y;

  threeBallTextMark.add(ballMarkItem);

  // console.log("ballMark:",ballMark);
  //
  // console.log("addBallMarker--textMark:",textMark.children.length);
  // console.log("addBallMarker--ballMark:",ballMark.children.length);


}

//  显示圆形和文字标签
const showballMark = (level) =>{
  textMark.children=[];
  ballMark.children=[];
  threeBallTextMark.children=[];
  if(mark){
    mark.remove("markid");
  }
  if(level === 2){
    createBallMark("二层");
  }else if(level === 3){
    createBallMark("三层");
  }else if(level === 4){
    createBallMark("四层");
  }
}

// 根据层级创建圆形标签
const createBallMark = (level) =>{
  tree.forEach(item=>{
    if(item.text === level){
      item.nodes.forEach(item1=>{
        addText(item1.text.substring(0,3),item1.componentId);
      })
    }
  });
}

// 获取模型空间树结构
const getSpaceTreeComponents = (id) =>{
  return fetch(`${op.baseaddress}models/${id}/trees/location?devcode=${op.devcode}`)
    .then(response => response.json());
}

// 根据楼层名称获取对应楼层下的构件id数组,如果构件type为IfcSpace，则将此构件下的children放入数组，否则只放入此构件的key
const get234Compoennts = (componentArray,level) =>{
  let levelComponent = []
  componentArray.forEach(item=>{
    if(item.name === level){
      item.childrenResultList.forEach(item2F=>{
        if(item2F.children === null && item2F.type !=="IfcSpace" ){
          levelComponent.push(item2F.key);
        }else if(item2F.children !== null && item2F.type ==="IfcSpace"){
          item2F.children.forEach(itemc=>levelComponent.push(itemc));
        }
      });
    }
  });
  return levelComponent;
}
