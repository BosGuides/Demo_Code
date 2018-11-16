// 初始化主对象配置
const op = {
 viewport:"viewport",
 devcode:"e10e59bf0ee97213ca7104977877bd1a",
 baseaddress:'https://api.bos.xyz/'
};

// 模型广告牌主视角
const mainView0 = {
  eye:[-1956.4878275248109,422.96389588481577,138.8076936778214],
  look:[-1657.62255859375,928.472412109375,57.5],
  up:[0,0,1],
  zoom:1
}

const mainView1 = {
  eye:[-877.8484518381277,457.9719572268193,310.1678992222952],
  look:[-829.2196128970827,701.1111474393609,18.62398291449642],
  up:[0,0,1],
  zoom:1
}

const mainView2 = {
  eye:[-154.56982717565865,-315.57100063858366,297.9240041207935],
  look:[-189.86890449496505,-470.93601490137576,14.589505258110659],
  up:[0,0,1],
  zoom:1
}

const mainView3 = {
  eye:[-565.7421979692866,529.7114520211302,172.45072415232474],
  look:[-615.7183837890625,357.97540283203125,29],
  up:[0,0,1],
  zoom:1
}

const mainView4 = {
  eye:[-2681.2822386784433,116.49965235358695,739.9785019512183],
  look:[-2172.80126953125,1118.0861043930054,300],
  up:[0,0,1],
  zoom:1
}


const filekeyArray = [
  {
  filekey:"BuildingIOT_productInfo1",
  filekeyShow:false,
  componentId:"BuildingIOT_productInfo1_1yu8NyrkPFYeIJoryPmGdl",
  adsId:"fireAdvertising1",
  requestID:null
  },
  {
  filekey:"BuildingIOT_productInfo2",
  filekeyShow:false,
  componentId:"BuildingIOT_productInfo2_2fN6PVBU57LxZqZfZ0_ZVV",
  adsId:"fireAdvertising2",
  requestID:null
  },
  {
  // filekey:"BuildingIOT_productInfo3",
  filekey:"32059432",
  filekeyShow:false,
  // componentId:"BuildingIOT_productInfo3_09cUkuWNn8ueGZTW3RMeZj",
  componentId:"32059432_1V6oFPs010bwniwVRawrVX",
  adsId:"fireAdvertising3",
  requestID:null
  },
  {
  filekey:"BuildingIOT_productinfo4",
  filekeyShow:false,
  componentId:"BuildingIOT_productinfo4_3I00DtJMH5eQjwubURmhn$",
  adsId:"fireAdvertising4",
  requestID:null
  },
  {
  filekey:"BuildingIOT_productInfo5",
  filekeyShow:false,
  componentId:"BuildingIOT_productInfo5_2xlPhmQ_D2BQXH5UJwqVxq",
  adsId:"fireAdvertising5",
  requestID:null
  }
];
let componentIds = [];
filekeyArray.forEach(item=>{
  componentIds.push(item.componentId);
})
const vizbim = new BIMWINNER.Viewer(op);
const init = () =>{
	var tool = new BIMWINNER.Tool(vizbim); 
	tool.createTool({
    modelapi:true,
    // measurement:false,
    //     // modelTree:false,
    //     // modelphoto:false,
	});
  changeHomeListen();
  hideBarAndTool();
  // showModelAds();
  // vizbim.showModelByDocumentId(fileKey1,function(){
  //   //添加坐标系
  //   let axes = new THREE.AxisHelper(200000);
    // vizbim.scene.add(axes);
    // vizbim.root.add(axes);
  //   // 视角飞跃
  //   // vizbim.fly.flyTo(mainView);
  //   // changHomeBehavior();
  //   vizbim.listentoSelectObjs(function (componentId, component) {
  //     console.log("componentId:",componentId);
  //     // console.log("component",component);
  //   });
  //   vizbim.showModelByDocumentId(fileKey2,()=>{
  //     vizbim.showModelByDocumentId(fileKey3,()=>{
  //       vizbim.showModelByDocumentId(fileKey4,()=>{
  //         vizbim.showModelByDocumentId(fileKey5,()=>{
  //           vizbim.hideObjs(componentIds);
  //         })
  //       })
  //     })
  //   })
  // });
	vizbim.autoResize=true;
	vizbim.resize(); 
	showxsjTool2();
  switchModels(0);
}
// 创建左侧按钮
function showxsjTool2(){
  	var toolBarZK=$("<div style='position:absolute;z-index:1;display:flex;flex-direction:column;left:10px;top:10px;margin-left:10px' id='toolBarZK2' ></div>");
        toolBarZK.appendTo($("#container"));
  	$(toolBarZK).append("<p id ='title' style='font-size:30px;margin-bottom: 0'> " +
			"产品信息介绍示例 " +
			"<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()' onmousemove=''></i>" +
			"</p>")
  $(container).append("<div id='descriptionContainer' style='display:none'> </div>")
		$(descriptionContainer).append("<p id ='title1' style='font-size:16px;margin-bottom: 0'> " +
			"点击不同种类的消防构件，可直接查看对应样式，以及消防构件对应信息。" + "</p>");
		$(toolBarZK).append("<ul id='tbZKul2' style='list-style-type:none;padding:0;'></ul>");
		$(tbZKul2).append("<li id = 'modelEdit1'><button  class='layui-btn layui-btn-primary' id = 'button0' onclick='switchModels(0);'>安全出口（双箭头）</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit2'><button  class='layui-btn layui-btn-primary' id = 'button1' onclick='switchModels(1);'>壁挂式扬声器</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit3'><button  class='layui-btn layui-btn-primary' id = 'button2' onclick='switchModels(2);'>火灾显示盘</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit4'><button  class='layui-btn layui-btn-primary' id = 'button3' onclick='switchModels(3);'>火灾光报警器</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit5'><button  class='layui-btn layui-btn-primary' id = 'button4' onclick='switchModels(4);'>消防设备电源状态监控器</button></li>");
}
// 工具栏隐藏
const hideBarAndTool = () =>{
  // 左上角的视图球
  var leftUpDiv = document.getElementsByClassName('list-item2')[0];
  leftUpDiv.style.display = 'none';
  var rightUpDiv = $(".yj-tool2")[0].firstChild;
  // rightUpDiv.style.display = 'none'
}
let description = false;
// 显示说明
const showDescription = () =>{
	if(!description){
    $(descriptionContainer).attr("style","position:absolute; top:25px; left:300px; background-color:white")
  }else {
    $(descriptionContainer).attr("style","display:none;")
	}
  description = !description
}

// 切换模型
const switchModels = (index) =>{
  vizbim.hideObjs(componentIds);
  currentCompId = filekeyArray[index].componentId;
  // cancelAnimationFrame(requestID);
  $(".layui-btn").css("background-color","white");
  const buttonid = "#button" + index;
  $(buttonid).css("background-color","#70b1c5");
  showModelAds(index);
  if(!filekeyArray[index].filekeyShow){
    // addProductHead();
    vizbim.showModelByDocumentId(filekeyArray[index].filekey,() =>{
      filekeyArray[index].filekeyShow = !filekeyArray[index].filekeyShow;
      $(".layui-btn").removeAttr("disabled");
      returnHomeComponent(index);
    });
  }else{
    currentCompId = filekeyArray[index].componentId;
    // console.log("第几个componentId:",index);
    vizbim.resetScene(false,true,true,true,true,true,true);
    returnHomeComponent(index)
  }
}

const toolId = vizbim.uuid;
const Lobibox = vizbim.Lobibox;
let attributeWindowFlag = false;
let attributeWindow;
let currentCompId;
// 显示广告介绍
const showModelAds = (index) =>{
  if(!attributeWindow){
    const attribute={
      title: '消防产品说明',
      width:334,
      height:480,
      closeOnEsc:false,
      closeButton:true,
      afterWindowHide:function (lobibox) {
        attributeWindowFlag = false;
        console.log("切换成功");
      },
      content:'<div class="tab-body" id="tab-ModelAds'+toolId+'"> <table id="modeladsTable" class="sx-table table-no-top"><thead></thead><tbody style="background-color: rgba(247, 247, 247, 0.8)"><tr class=\"noprop\"><td>尚未选择构件</td></tr></tbody></table></div>'
    };
    attributeWindow = Lobibox.window(attribute);
    attributeWindowFlag = true;
    attributeWindow.setPosition({
      left:"",
      right:5,
      top:60
    });
  }

  if(!attributeWindowFlag){
    attributeWindow.windowShow();
  }
  showComponentAttribute(index);
}

// 显示介绍内容
const showComponentAttribute =  (id) => {
  var containerDiv = $("#tab-ModelAds"+toolId);
  var addProperty = function (name, property, headerTr) {
    var tr = $("<tr></tr>");
    headerTr.after(tr);
    tr.prepend("<td class='td-left' style='width: 30% ; text-align:center'>" + name + "</td>");
    var td = $("<td class='td-right' style='width: 70%;'>");
    var v = property == null || undefined ? "" : property;
    var span = $("<span class=\"value nonEditable\">" + v + "</span>");
    td.append(span);
    tr.append(td);
  };
  var addTitle = function (name, attribute) {
    var headerTr = $("<tr class=\"sx-active\"></tr>");
    containerDiv.find("table tbody").prepend(headerTr);
    var headerTd = $("<td colspan=\"2\" style='font-size: 14px'></td>");
    headerTr.prepend(headerTd);
    headerTd.prepend("<b>" + name + "</b>");
    for (var p in attribute) {
      addProperty(p, attribute[p], headerTr);
    }
  };
  // containerDiv = $("#tab-ModelAds" + toolId);
  containerDiv.find("table tbody tr").remove();
  const attribute = window.fireAdvertising[filekeyArray[id].adsId];

  for (var p in attribute) {
    // 方法
    if (typeof(attribute[p]) == "object") {
      addTitle(p, attribute[p]);
    } else if (typeof(attribute[p]) == "string") {
      // console.log(p+" :"+attribute[p])
    }
  }
};

// 改写复位监听函数
const changeHomeListen = () =>{
  const uuid=vizbim.uuid;
  $('#home'+uuid).unbind("click");
  $('#home'+uuid).bind("click", ()=>{
    vizbim.resetScene(true,false,false,false,false,false,false);
    vizbim.hideObjs(componentIds);
    vizbim.showObjs([currentCompId]);
    vizbim.adaptiveSize([currentCompId]);
  });
}

// 构件旋转
const rotateComponent = (index) =>{
  filekeyArray[index].requestID = setInterval(function(){
    if(vizbim.components[currentCompId]){
      vizbim.components[currentCompId].rotation.z-=0.0003;
    }
  }, 0.0001);
}

// 构件初始化
const returnHomeComponent = (index) =>{
  vizbim.hideObjs(componentIds);
  vizbim.listentoSelectObjs(function (componentId, component) {
    // console.log("componentId:",componentId);
    // console.log("component",component);
    if(componentId !== null) {
      clearInterval(filekeyArray[index].requestID);
      filekeyArray[index].requestID = null;
    }
  });
  // showModelAds(index);
  switch (index) {
    case 0:
      vizbim.fly.flyTo(mainView0,()=>{
        vizbim.showObjs([currentCompId]);
      });
      break;
    case 1:
      vizbim.fly.flyTo(mainView1,()=>{
        vizbim.showObjs([currentCompId]);
      });
      break;
    case 2:
      vizbim.fly.flyTo(mainView2,()=>{
        vizbim.showObjs([currentCompId]);
      });
      break;
    case 3:
      vizbim.fly.flyTo(mainView3,()=>{
        vizbim.showObjs([currentCompId]);
      });
      break;
    case 4:
      vizbim.fly.flyTo(mainView4,()=>{
        vizbim.showObjs([currentCompId]);
      });
      break;
  };
  if(filekeyArray[index].requestID === null){
    rotateComponent(index);
  }
  if(vizbim.components[currentCompId]){vizbim.components[currentCompId].rotation.z=0};
}

// 添加产品描述头
const addProductHead = () =>{
  $(".layui-btn").attr("disabled",'disabled');
  // 添加加载中状态
  var containerDiv = $("#tab-ModelAds"+toolId);
  containerDiv.find("table tbody tr").remove();
  var headerTr = $("<tr class=\"sx-active\"></tr>");
  var headerTr2 = $("<tr class=\"sx-active\"></tr>");
  containerDiv.find("table tbody").prepend(headerTr);
  containerDiv.find("table tbody").append(headerTr2);
  var headerTd = $("<td colspan=\"2\" style='font-size: 14px'></td>");
  var headerTd1 = $("<td colspan=\"2\" style='font-size: 12px'>加载中...</td>");
  headerTr.prepend(headerTd);
  headerTr2.prepend(headerTd1);
  headerTd.prepend("<b>" + "产品描述" + "</b>");
}
