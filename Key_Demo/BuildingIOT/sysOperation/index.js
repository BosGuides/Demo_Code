const op = {
 viewport:"viewport",
 //用户开发码
 devcode:"e10e59bf0ee",
 baseaddress:'https://api.bos.xyz/'
};
const fileKey = "BuildingIOT_sysOperation";

const vizbim = new BIMWINNER.Viewer(op);
// 模型主视角
const mainView = {
  eye:[-10093.940717209727,77018.08452395268,1205.1115416145367],
  look:[13327.64095616095,55634.849450471054,-19504.297039220804],
  up:[0,0,1],
  zoom:1
}
// 模拟数据
const fakeData = window.fakeData = [
  {
    id:THREE.Math.generateUUID(),
    status:false,
    waterPressure:"0.3MPa",
    waterFlow:"10m³/s",
    componentId:"BuildingIOT_sysOperation_3A1tUV8vLDTvCpG358jmrP"
  },
  {
    id:THREE.Math.generateUUID(),
    status:false,
    waterPressure:"0.32MPa",
    waterFlow:"7m³/s",
    componentId:"BuildingIOT_sysOperation_1pAU48cCLBWR4HylYWrIca"

  },
  {
    id:THREE.Math.generateUUID(),
    status:false,
    waterPressure:"0.24MPa",
    waterFlow:"7m³/s",
    componentId:"BuildingIOT_sysOperation_3PnAJ4sZHAPhp8wvKk_YYw"
  },
  {
    id:THREE.Math.generateUUID(),
    status:false,
    waterPressure:"0.27MPa",
    waterFlow:"6m³/s",
    componentId:"BuildingIOT_sysOperation_1Y1YcIP3v6uRlS$85y9vy9"

  },
  {
    id:THREE.Math.generateUUID(),
    status:false,
    waterPressure:"0.4MPa",
    waterFlow:"20m³/s",
    componentId:"BuildingIOT_sysOperation_3A1tUV8vLDTvCpG358jm_R"

  },
  {
    id:THREE.Math.generateUUID(),
    status:false,
    waterPressure:"0.34MPa",
    waterFlow:"10m³/s",
    componentId:"BuildingIOT_sysOperation_0T20EtiHbAb9MZQYCYXaJ1"

  },
  {
    id:THREE.Math.generateUUID(),
    status:false,
    waterPressure:"0.26MPa",
    waterFlow:"8m³/s",
    componentId:"BuildingIOT_sysOperation_3PnAJ4sZHAPhp8wvKk_YW_"

  },
];

// 动态数据
const fakewaterdata = [
  {
    waterPressure:"水压: 0.301MPa",
    waterFlow:"水流量: 15m³/s",
  },
  {
    waterPressure:"水压: 0.2MPa",
    waterFlow:"水流量: 12m³/s",
  },
  {
    waterPressure:"水压: 0.305MPa",
    waterFlow:"水流量: 13m³/s",
  },
  {
    waterPressure:"水压: 0.31MPa",
    waterFlow:"水流量: 14m³/s",
  },
  {
    waterPressure:"水压: 0.32MPa",
    waterFlow:"水流量: 15m³/s",
  },
  {
    waterPressure:"水压: 0.311MPa",
    waterFlow:"水流量: 15m³/s",
  },
  {
    waterPressure:"水压: 0.29MPa",
    waterFlow:"水流量: 14m³/s",
  },
  {
    waterPressure:"水压: 0.3MPa",
    waterFlow:"水流量: 13m³/s",
  }
]


const content =  {
  status:false,
  waterPressure:"0.3MPa",
  waterFlow:"10m³/s",
  componentId:"BuildingIOT_sysOperation_3A1tUV8vLDTvCpG358jmrP"
};

// layui的form
let form;

let selectComponentId = null;

// 初始化，主函数
function init(){
	let tool = new BIMWINNER.Tool(vizbim);
	tool.createTool();
	// 隐藏工具栏
  hideBarAndTool();
  showxsjTool2(); // 显示说明提示
  showxDescriptionBoard();  //显示demo说明提示
  addAccomplishedComponentslist(); // 显示已完成构件列表
  vizbim.showModelByDocumentId(fileKey,function(){
    changHomeBehavior();
    //添加坐标系
    // let axes = new THREE.AxisHelper(200000);
    // vizbim.scene.add(axes);
    // 视角飞跃
    vizbim.fly.flyTo(mainView);

    vizbim.listentoSelectObjs(function (componentId, component) {
        // console.log("componentId:",componentId);
        // console.log("component:",component);
      let comFlag = false;
      if(componentId && component && Object.keys(component).length >0){
        // vizbim.resetScene(false,true,true,true,true,true,true);
        // vizbim.restoreObjtColor(componentId);
        console.log("componentId:",componentId);
        console.log("component:",component);
        selectComponentId = componentId;
        fakeData.forEach(item=>{
          if(item.componentId === componentId){
            comFlag = true;
          }
        });
        // 如果构件处于修复状态，其它构件不可点
        if(!startRepaireFlag){
          updateModelcolorByComponentStatus();
          vizbim.adaptiveSize([componentId]);
          console.log("------content------------",content);
          if(comFlag){
            addMark(componentId,"水压异常",content);
          }else{
            addMark(componentId,"无异常出现",content);
          }
        }else {
          vizbim.resetScene(false,true,true,true,true,true,true);
          vizbim.reverseTransparentObjs(yellowComponents,0.1,true);
          vizbim.setObjtColor(yellowComponents,[1,1,0]);
        }
      }else {
        // vizbim.resetScene(false,true,true,true,true,true,true);
        if(mark){
          mark.remove("markid");
        }
      }
    });
    updateModelcolorByComponentStatus();
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

// 详情说明的显示的flag
let description = false;

// 显示title说明
const showDescription = () =>{
  if(!description){
    $(demodescriptioncontainer).attr("style", "font-size:16px;margin-bottom: 0;left:330px;top:50px;background-color:white;position:absolute;width:480px");
  }else {
    $(demodescriptioncontainer).css("display","none");
  }
  description = !description;
}

// 创建左侧说明提示
const showxsjTool2 = () =>{
  var toolBarZK=$("<div id='toolBarZK'  id='toolBarZK2' ></div>");
  toolBarZK.appendTo($("#container"));
  $(toolBarZK).append("<p id ='title' style='font-size:30px;margin-bottom: 0'> " +
    "水暖维护平台 " +
    "<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()' ></i>" +
    "</p>");
  $(container).append("<div id='descriptionContainer' style='margin: 20px 0;'> </div>")
  $(descriptionContainer).append("<p id ='title0' style='font-size:20px;margin-bottom: 0'> " +
    "待维护管道 " + "</p>");
  $(descriptionContainer).append("<hr>");
  $(descriptionContainer).append("<div id='piplineContainer'></div>");
  $(descriptionContainer).append("<p id ='title1' style='font-size:16px;margin-bottom: 0; text-align:center'> " +
    "请在模型中选择待维护的管道 " + "</p>");
}

// 创建问号点击显示说明框
const showxDescriptionBoard = () =>{
  var descriptionBoard=$("<div id='toolBarZKdescriptionBoard' style='padding: 10px' ></div>");
  descriptionBoard.appendTo($("#demodescriptioncontainer"));
  descriptionBoard.append("<div style='font-size:16px;margin: 10px;'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "  红色区域构件为异常报警构件，点击构件显示异常信息，点击信息框内的“开始维护”按钮，进入维护状态。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    " 维护状态中，仅有被维护管道和其上下游阀门会被突出显示，并系统默认阀门关闭。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "  点击“维护完成”，当前构件将不再是异常报警构件，颜色恢复原状。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "   点击“重新选择”，将返回开始维护前模型状态。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "     在维护状态下，所有相关联阀门可通过控制区进行开关。 " +
    "</span></div>");
  descriptionBoard.append("<div style='font-size:16px;margin: 10px'><i style='margin-right:20px'/><span class ='demodescriptioncontainerp' > " +
    "  近期维护完成列表”中展示的是已维护完成的管道列表，点击构件可查看具体管道位置。 " +
    "</span></div>");

}

// 添加近期维护完成列表
const addAccomplishedComponentslist = () =>{
  const board = $("<div class=\"layui-collapse\">\n" +
    "  <div class=\"layui-colla-item\" id='accomplishedComponentsContent'>\n" +
    "    <h2 class=\"layui-colla-title\" style='font-size:20px;background-color:white;'>近期维护完成列表</h2>\n" +
    "  <div class=\"layui-colla-content \">暂无维修完成构件</div>" +
    "  </div>\n" +
    "</div>");
  $("#container").append($("<div id='accomplishedList'></div>"));
  $("#accomplishedList").append(board);

  //注意：折叠面板 依赖 element 模块，否则无法进行功能性操作
  layui.use('element', function(){
    var element = layui.element;
    element.on('collapse(filter)', function(data){
      console.log(data.show); //得到当前面板的展开状态，true或者false
      console.log(data.title); //得到当前点击面板的标题区域DOM对象
      console.log(data.content); //得到当前点击面板的内容区域DOM对象
    });
  });
}


// 获取模型构件指定type类型相近构件
const getComponentIdByTypeId = (componentId) =>{
  return fetch(`${op.baseaddress}models/${fileKey}/components/${componentId}/type/IfcFlowController?devcode=${op.devcode}`)
    .then(response => response.json());
}

let markFlag = false;
let mark = null;
let intervalFlag;
// 添加标签
const addMark = (componentId,title,content) =>{
  if(mark){
    mark.remove("markid");
    markFlag = !markFlag;
  }
  const cardBord=$(
    "<div class=\"layui-card\">\n" +
    "  <div class=\"layui-card-header\" style='font-size:18px;'>"+"冷水管道"+"<i id='boardMark' class=\"fa fa-exclamation-triangle\" style='margin:0 10px; cursor:pointer; color:#e3d515'></i>"+title+"</div>\n" +
    "  <div class=\"layui-card-body\" style='font-size:15px;'>\n" +
    "<span style='margin-right:10px' id='waterPressure'>"+"水压: "+content.waterPressure +"</span>" +
    "<span style='margin:0' id='waterFlow'>"+"水流量: "+content.waterFlow +"</span>"+
    "<div id='cardBodyButton'> </div>"+
    "  </div>\n" +
    "</div>");
  mark = new BIMWINNER.DOMMark(vizbim);
  const marrix44 = vizbim.components[componentId].matrix.elements;
  const boundingCenter = vizbim.components[componentId].geometry.boundingSphere.center;
  const marrix41 = [boundingCenter.x,boundingCenter.y,boundingCenter.z,1];

  const position = compute4MatrixAnd1matrix(marrix44,marrix41);
  // console.log("tposition:",tPosition);
  // const position = [tPosition.x,tPosition.y,tPosition.z]
  // console.log("position:",position);
  if(content){
    mark.add({
        startPosition:position,
        offsetPosition: [100,-100],
        draggable:true,
        title:"",
        id:"markid",
        domElement:cardBord
      },
      function(a){
        // console.log(a)
        markFlag = !markFlag;
        $("#labelLinemarkid").css("background-color","black");
        if(title==="无异常出现"){
          $("#boardMark").removeClass();
          $("#boardMark").addClass("fas fa-check");
          $("#boardMark").css("color","#5fb878");
        }else {
          $("#cardBodyButton").append($("<button class=\"lyButton\" style='background-color:red; color: white' onclick='clickPipline()'>开始修复</button>"));
          $("#boardMark").removeClass();
          $("#boardMark").addClass("fa fa-exclamation-triangle");
          $("#boardMark").css("color","#e3d515");
        }
        if(intervalFlag){
          clearInterval(intervalFlag);
        }
        intervalFlag = setInterval(function(){
          const content1 = fakewaterdata[RandomNumBoth(0,fakewaterdata.length)];
          if(content1 && content1.waterPressure && content1.waterFlow){
            $("#waterPressure").text(content1.waterPressure);
            $("#waterFlow").text(content1.waterFlow);
          }
        }, 1500);
      });
  }
}

//  计算 4*4矩阵与4*1 向量的数乘
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

// 生成指定范围的随机数
const RandomNumBoth = (Min,Max) =>{
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}

let yellowComponents = [];

// 开始修复维修水暖系统
const clickPipline = () =>{
  if(selectComponentId){
    getComponentIdByTypeId(selectComponentId).then(result=>{
      console.log("-getComponentIdByTypeId-",result)
      if(result.code === 200 && result.data instanceof(Array) && result.data.length !==0){
        yellowComponents = result.data.concat();
        yellowComponents.push(selectComponentId);
        vizbim.resetScene(false,true,true,true,true,true,true);
        vizbim.reverseTransparentObjs(yellowComponents,0.1,true);
        vizbim.setObjtColor(yellowComponents,[1,1,0]);
        vizbim.adaptiveSize(yellowComponents);
        deleteAllMark();
        result.data.forEach(item=>{
          addspriteMark(item,false);
        });
        updateLeftDerecionboardByComArray(result.data,selectComponentId,true);
      }
    });
  }
}

//更新构件颜色状态
const updateModelcolorByComponentStatus = () =>{
  let redComponent = [];
  fakeData.forEach(item=>{
    if(item.status === false){
      redComponent.push(item.componentId);
    };
  });
  // console.log("redComponent:",redComponent);
  if(redComponent.length >0){
    vizbim.setObjtColor(redComponent,[1,0,0]);
  }
}

let spriteMark = new BIMWINNER.SpriteMark(vizbim);
let spriteMarkArray = [];
// 添加spriteMark
const addspriteMark = (componentId,flag) =>{
  const marrix44 = vizbim.components[componentId].matrix.elements;
  const boundingCenter = vizbim.components[componentId].geometry.boundingSphere.center;
  const marrix41 = [boundingCenter.x,boundingCenter.y,boundingCenter.z,1];
  const position = compute4MatrixAnd1matrix(marrix44,marrix41);
  let imgurl = null;
  if(flag){
    imgurl = './img/opened.png';
    vizbim.restoreObjtColor([componentId]);
  }else {
    imgurl = './img/closed.png';
    vizbim.setObjtColor([componentId],[1,1,0]);
  }
  spriteMark.add({
    position:position,
    URL:imgurl,
    scale:10,
    id:componentId,
    alwaysVisible:false
  },function (spriteMarkId) {
    console.log("创建mark成功",spriteMarkId);
    spriteMarkArray.push(spriteMarkId);
  })
}


let startRepaireFlag =  false;

// 更新控制面板
const updateLeftDerecionboardByComArray = (componentArray,componentid,isClick) =>{
  $("#piplineContainer").children().remove();
  $("#title1").remove();
  if(isClick){
    startRepaireFlag = true;
    $("#piplineContainer").append("<div> " +
      "<span style='font-size: 18px;padding: 10px'>冷水管道</span> " +
      "<button class='lyButton' id='mainComplete' style='width: 70px;height: 25px; font-size: 12px; margin-right: 10px;' >维护完成</button>" +
      " <button class='lyButton' id='reChoose' style='width: 70px;height: 25px; font-size: 12px; margin-right: 5px'>重新选择</button>" +
      " <hr>" +
      "</div>");
    $("#piplineContainer").append(
      "<form class=\"layui-form\" id='lyform' action=\"\" >" +
      "</form>");
    // console.log("componentArray:",componentArray);
    if(componentArray && componentArray.length>0){
      componentArray.forEach((item,index)=>{
        $("#lyform").append(addComponentButton(item,index+1));
      });
    }
    layui.use('form', function(){
      const form = layui.form;
      const layer = layui.layer;
      form.render();
      //监听提交
      form.on('switch(openCloseButton)', function(data){
        // console.log("点击开关:",data.elem.checked);
        // console.log("点击开关:",data.elem.id);
        // console.log("点击开关stringify:",data);
        spriteMark.remove([data.elem.id]);
        addspriteMark(data.elem.id,data.elem.checked);
        return false;
      });
    });
    $("#mainComplete").click(function () {
      maintainAccomplish(componentid);
    });
    $("#reChoose").click(function () {
      vizbim.resetScene(false,true,false,true,true,false,false);
      updateModelcolorByComponentStatus();
      updateLeftDerecionboardByComArray(null,null,false);
      deleteAllMark();
    });
  }else {
    startRepaireFlag =  false;
    $(descriptionContainer).append("<p id ='title1' style='font-size:16px;margin-bottom: 0; text-align:center'> " +
      "请在模型中选择待维护的管道 " + "</p>");
  }
}

// 在控制面板添加开关按钮
const addComponentButton = (componentid,index) =>{
  const lybutton = $("<div class=\"layui-form-item\">\n" +
    "    <label class=\"layui-form-label\" style='padding: 9px 9px 9px 2px;width: 50px '>阀门"+index+"</label>\n" +
    "    <div class=\"layui-input-block\" style='margin-left: 200px'>\n" +
    "      <input type=\"checkbox\" name=\"zzz\" lay-skin=\"switch\" lay-text=\"开启|关闭\" lay-filter='openCloseButton' id="+componentid +
    " >" +
    "    </div>\n" +
    "  </div>");
  return lybutton;
}

// 删除所有精灵标签
const deleteAllMark = () =>{
  if(spriteMarkArray.length>0){
    spriteMark.remove(spriteMarkArray);
  }
}

// 更改监听的小房子点击事件
const changHomeBehavior = () =>{
  const uuid=vizbim.uuid;
  $('#home'+uuid).unbind("click");
  $('#home'+uuid).bind("click",()=>{
    // vizbim.resetScene(false,true,true,true,false,true,true);
    vizbim.resetScene(false,true,false,true,true,false,false);
    updateModelcolorByComponentStatus();
    updateLeftDerecionboardByComArray(null,null,false);
    deleteAllMark();
    vizbim.fly.flyTo(mainView);
  });
}

let accomplishedComponentsList = [];
// 维护完成
const maintainAccomplish = (id) =>{
  vizbim.resetScene(false,true,false,true,true,false,false);
  // console.log("删除之前fakeData长度:",fakeData.length);
  fakeData.forEach((item,index)=>{
    if(item.componentId === id){
      fakeData.splice(index,1);
      accomplishedComponentsList.push(item.componentId);
    }
  });
  // console.log("删除之后fakeData长度:",fakeData.length);
  updateModelcolorByComponentStatus();
  updateLeftDerecionboardByComArray(null,null,false);
  deleteAllMark();
  let falg = false;
  if(accomplishedComponentsList.length>0){
    if($("#accomplishedComponentsContent").find("div")[0].className.length ===30){
      falg = true;
    }
    $("#accomplishedComponentsContent").find("div").remove();
    accomplishedComponentsList.forEach((item,index)=>{
      const number = index+1;
      const $acompComponent = $(`<div class="layui-colla-content" style="cursor: pointer;background-color: white" id=${item} >管道${number}</div>`);
      $("#accomplishedComponentsContent").append($acompComponent);
      if(falg){
        $acompComponent.addClass("layui-show");
      }
      $acompComponent.click(function () {
        clickAccomplishedComponent(item);
      });
      layui.form.render();
    });
    // console.log("accomplishedComponentsList:",accomplishedComponentsList);
  }
}
// 点击已完成构件
const clickAccomplishedComponent = (id) =>{
  console.log("构件id:\n",id,"构件type:",typeof id);
  vizbim.findSceneNodes([id]);
}
