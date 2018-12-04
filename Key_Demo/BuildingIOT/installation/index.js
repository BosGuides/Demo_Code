// 初始化主对象配置
const op = {
 viewport:"viewport",
 devcode:"e10e59bf0ee97213ca7104977877bd1a",
 viewController:false        //不加载左上角视图球
};

// 模型id
const fileKey = "BuildingIOT_instruction2";

// 零件对照视角
const mainView1 = {
  eye:[-1022.2406886181494,-4236.163651050078,2251.9700468793426],
  look:[-952.3065421280197,1008.3124277323786,1768.0632080497444],
  up:[0,0,1],
  zoom:1
}

// 椅子组装视角
const mainView2 = {
  eye:[-1471.3696238996881,-1649.9214240042054,362.26143681610256],
  look:[280.67323774810427,40.2926848317442,-814.3924922436242],
  up:[0,0,1],
  zoom:1
}

// 模型广告牌主视角
const mainView = {
  eye:[-1589.0104699540257,-935.027663363265,1032.7674077093525],
  look:[-515.0093625814695,217.59890732149984,383.1486964877306],
  up:[0,0,1],
  zoom:1
}

// 构件列表
const componentkeyArray = [
  {
    componentId:"BuildingIOT_instruction2_0eCIN5ePn2fBb7wECajS9F",
    name:"坐垫×1",
    requestID:0,
    comparedPos:{x: -3200, y:20, z:2020},
    comparedScale:{x:1,y:1,z:1},
    comparedRotation:{x:0,y:0,z:0},
    highlightComponentFlag:false
  },
  {
    componentId:"BuildingIOT_instruction2_0wGEmGmG528Pmpk3P8MJsl",
    name:"靠背×1",
    requestID:1,
    comparedPos:{x: -2000, y:20, z:1620},
    comparedScale:{x:1,y:1,z:1},
    comparedRotation:{x:0,y:0,z:0},
    highlightComponentFlag:false

  },
  {
    componentId:"BuildingIOT_instruction2_0wGEmGmG528Pmpk3P8MJlb",
    name:"扶手×1",
    requestID:2,
    comparedPos:{x: -1200, y:20, z:2020},
    comparedScale:{x:1,y:1,z:1},
    comparedScale:{x:1,y:1,z:1},
    comparedRotation:{x:0,y:0,z:0},
    highlightComponentFlag:false

  },
  {
    componentId:"BuildingIOT_instruction2_0wGEmGmG528Pmpk3P8MJHw",
    name:"升降器×1",
    requestID:3,
    comparedPos:{x: -200, y:20, z:2020},
    comparedScale:{x:1,y:1,z:1},
    comparedRotation:{x:0,y:0,z:0},
    highlightComponentFlag:false

  },
  {
    componentId:"BuildingIOT_instruction2_0wGEmGmG528Pmpk3P8MJOe",
    name:"滑轮支架×1",
    requestID:4,
    comparedPos:{x: 800, y:20, z:2020},
    comparedScale:{x:1,y:1,z:1},
    comparedRotation:{x:0,y:0,z:0},
    highlightComponentFlag:false

  },
  {
    componentId:"BuildingIOT_instruction2_0wGEmGmG528Pmpk3P8MGZY",
    name:"滑轮×5",
    requestID:5,
    comparedPos:{x: -3000, y:20, z:1600},
    comparedScale:{x:1,y:1,z:1},
    comparedRotation:{x:0,y:0,z:0},
    highlightComponentFlag:false

  },
  {
    componentId:"BuildingIOT_instruction2_2jJpfKCyX2UvUwVS8EWnm1",
    name:"螺丝钉(坐垫)×4",
    requestID:6,
    comparedPos:{x: -2000, y:20, z:1600},
    comparedScale:{x:5,y:5,z:5},
    comparedRotation:{x:-Math.PI,y:0,z:-Math.PI},
    highlightComponentFlag:false

  },
  {
    componentId:"BuildingIOT_instruction2_2sqCdFPqPDcxKFpDU_ekGK",
    name:"螺丝钉(靠背)×3",
    requestID:7,
    comparedPos:{x: -500, y:20, z:1600},
    comparedScale:{x:5,y:5,z:5},
    comparedRotation:{x:3.1,y:0,z:-Math.PI},
    highlightComponentFlag:false

  },
  {
    componentId:"BuildingIOT_instruction2_2sqCdFPqPDcxKFpDU_ekur",
    name:"螺丝钉(扶手右)×3",
    requestID:8,
    comparedPos:{x: 0, y:20, z:1600},
    comparedScale:{x:5,y:5,z:5},
    comparedRotation:{x:Math.PI,y:0,z:0},
    highlightComponentFlag:false

  },
  {
    componentId:"BuildingIOT_instruction2_2sqCdFPqPDcxKFpDU_elIP",
    name:"螺丝钉(扶手左)×3",
    requestID:9,
    comparedPos:{x: 1000, y:20, z:1600},
    comparedScale:{x:5,y:5,z:5},
    comparedRotation:{x:0,y:Math.PI,z:0},
    highlightComponentFlag:false

  }
];
// 初始化三维主对象
const vizbim = new BIMWINNER.Viewer(op);

// 加载模型，初始化操作
const init = () =>{
  const tool = new BIMWINNER.Tool(vizbim);
	tool.createTool({
    modelapi:true,
    measurement:false,
    modelTree:false,
    modelphoto:false,
    attribute:false
	});
  hideBarAndTool();
  vizbim.showModelByDocumentId(fileKey,function(){
    // 视角飞跃
    vizbim.fly.flyTo(mainView);
    vizbim.listentoSelectObjs(function (componentId, component) {
      console.log("componentId:",componentId);
      // console.log("component",component);
    });
    changeNailMaterial();  // 更改钉子材质
  });
	vizbim.resize();
	showxsjTool2();
}
// 创建左侧按钮
const showxsjTool2 = () =>{
  	const toolBarZK=$("<div id='toolBarZK2'> </div>");
    toolBarZK.appendTo($("#container"));
  	$(toolBarZK).append(
  	  "<p id ='title' style='font-size:30px;" +
  "                          margin-bottom: 0'> " +
        "产品安装指南 " +
        "<i style='font-size:20px;" +
                  " cursor:pointer;'" +
        "   class='far fa-question-circle' " +
        "   onmousedown='showDescription()' >" +
        "</i>" +
			"</p>");
  $(container).append("<div id='descriptionContainer' style='display:none'> </div>")
		$("#descriptionContainer").append(
		  "<p id ='title1' " +
        " style='font-size:16px;" +
                "margin-bottom: 0'> " +
        "模拟产品的安装流程。以转椅" +
        "的安装为例，演示各个零件安" +
        "装成完整转椅的过程。"+
      "</p>");
		$(toolBarZK).append("<ul id='tbZKul2' style='list-style-type:none;padding:0;'></ul>");
		
		for (let i =0; i<7; i++){
		  const $li = $(
		    "<li id = 'modelEdit1'>" +
          "<button  class='layui-btn layui-btn-primary' " +
                    " id = 'button0' " +
                    " onclick='sparesComparing();'>" +
            "零件对照" +
          "</button>" +
        "</li>");
		  const $liId = "modelEdit" + i+1;
      $li.find("li").attr("id",$liId);
      const $buttonId = "button" + i;
      $li.find("button").attr("id",$buttonId);
      $("#tbZKul2").append($li);
      switch (i) {
        case 0:
          $li.find("button").attr("onclick","sparesComparing()");
          $li.find("button").html("零件对照")
          break;
        case 1:
          $li.find("button").attr("onclick","installPulley()");
          $li.find("button").html("安装滑轮")
          break;
        case 2:
          $li.find("button").attr("onclick","installRiser()");
          $li.find("button").html("安装升降器")
          break;
        case 3:
          $li.find("button").attr("onclick","installCushion()");
          $li.find("button").html("安装坐垫")
          break;
        case 4:
          $li.find("button").attr("onclick","installLazybackr()");
          $li.find("button").html("安装靠背")
          break;
        case 5:
          $li.find("button").attr("onclick","installHandrail()");
          $li.find("button").html("安装扶手")
          break;
        case 6:
          $li.find("button").attr("onclick","autoInstall()");
          $li.find("button").html("一键安装")
          break;
        default:

      }
    }
}

// 下方主工具栏隐藏
const hideBarAndTool = () =>{
  var toolBarDiv = document.getElementsByClassName('yj-tool')[0];
  toolBarDiv.style.display = 'none';
}

let description = false;
// 显示说明
const showDescription = () =>{
	if(!description){
    $(descriptionContainer).attr("style","position:absolute; top:25px; left:240px; background-color:white")
  }else {
    $(descriptionContainer).attr("style","display:none;")
	}
  description = !description
}

// 零件对照函数
const sparesComparing = (momentFlag,falg,whiteFlag,descriptionFlag) =>{
  vizbim.resetScene(false,false,false,true,false,false,false);
  buttonSelectedStatus(0,falg,whiteFlag);
  vizbim.fly.flyTo(mainView1);
  if(descriptionFlag === undefined){
    addSpareCompareDescription();  // 显示说明框
  }
  const promise = new Promise(function(resolve, reject){
    //做一些异步操作
    let tween;
    componentkeyArray.forEach((item,index)=>{
      const componentId = componentkeyArray[index].componentId;
      vizbim.components[componentId].scale.x = componentkeyArray[index].comparedScale.x;
      vizbim.components[componentId].scale.y = componentkeyArray[index].comparedScale.y;
      vizbim.components[componentId].scale.z = componentkeyArray[index].comparedScale.z;
      vizbim.components[componentId].rotation.x = componentkeyArray[index].comparedRotation.x;
      vizbim.components[componentId].rotation.y = componentkeyArray[index].comparedRotation.y;
      vizbim.components[componentId].rotation.z = componentkeyArray[index].comparedRotation.z;
      if(momentFlag){
        vizbim.components[componentId].position.x = componentkeyArray[index].comparedPos.x;
        vizbim.components[componentId].position.y = componentkeyArray[index].comparedPos.y;
        vizbim.components[componentId].position.z = componentkeyArray[index].comparedPos.z;
      }else{
        const endPosSrc = componentkeyArray[index].comparedPos;
        tween =  addTween(index,endPosSrc);
        if(index === 9){
          tween.onComplete(()=>{
            resolve('随便什么数据');
            $(".layui-btn-primary").removeAttr("disabled","disabled");
            $(".layui-btn-primary").removeClass("layui-btn-disabled");
          });
        }
      }
    });
  });
  return promise;
}

// 安装滑轮
const installPulley = (flag,whiteFlag) =>{
  sparesComparing(true,true,true);
  buttonSelectedStatus(1,flag,whiteFlag);
  if(attributeWindow)attributeWindow.windowHide();
  const promise = new Promise(function(resolve, reject) {
    vizbim.fly.flyTo(mainView2);
    const tween = addTween(4);
    const tweenback1 = addTweenBack(tween,5);
    tween.onComplete(()=>{
      $(".layui-btn-primary").removeAttr("disabled","disabled");
      $(".layui-btn-primary").removeClass("layui-btn-disabled");
      resolve();
    });
  });
  return promise;
}

// 安装升降器
const installRiser = (flag,whiteFlag,speed) =>{
  sparesComparing(true,true,true);
  buttonSelectedStatus(2,flag,whiteFlag);
  moveComponentsMoment([4,5]);
  if(attributeWindow)attributeWindow.windowHide();
  const promise = new Promise(
    function(resolve, reject) {
      vizbim.fly.flyTo(mainView2,()=>{
        const tween =  addTween(3,false,1500);
        if(speed === "speedup"){
          $(".layui-btn-primary").removeAttr("disabled","disabled");
          $(".layui-btn-primary").removeClass("layui-btn-disabled");
          resolve();
        }else {
          tween.onComplete(()=>{
            $(".layui-btn-primary").removeAttr("disabled","disabled");
            $(".layui-btn-primary").removeClass("layui-btn-disabled");
          });
        }
      });
    });
  return promise;
}

// 安装坐垫
const installCushion = (flag,whiteFlag) =>{
  sparesComparing(true,true,true);
  buttonSelectedStatus(3,flag,whiteFlag);
  moveComponentsMoment([3,4,5]);
  moveComponentsMoment([0,6],true);
  if(attributeWindow)attributeWindow.windowHide();
  const promise = new Promise(function(resolve, reject) {
    vizbim.fly.flyTo(mainView2,()=>{
      const tween = addTween(0);  // 移动坐垫
      // 先下移螺丝钉
      const tweenNail =  moveNail(tween,6,500);  // 移动螺丝钉到过度位置
      // 左移完螺丝钉再 移动到安装位置
      const tweenback0 = addTweenBack(tweenNail,6);  // 移动螺丝钉到安装位置
      tween.onComplete(()=>{
        setTimeout(function(){
          vizbim.fly.flyTo({
            eye:[-888.4772276666996,-253.75853126460345,-573.8706784144239],
            look:[-468.1001983131957,-868.4694381173921,-114.8672571185863],
            up:[0,0,1],
            zoom:1
          },()=>{
            // console.log("移动螺丝钉----------")
          });
        }, 1500);
      });
      tweenback0.onComplete(()=>{
        resolve();
        $(".layui-btn-primary").removeAttr("disabled","disabled");
        $(".layui-btn-primary").removeClass("layui-btn-disabled");
      });
    });
  });
  return promise;
}

// 安装靠背
const installLazybackr = (flag,whiteFlag) =>{
  sparesComparing(true,true,true);
  buttonSelectedStatus(4,flag,whiteFlag);
  moveComponentsMoment([3,4,5,0,6]);
  if(attributeWindow)attributeWindow.windowHide();
  const promise = new Promise(function(resolve, reject) {
    vizbim.components[componentkeyArray[7].componentId].rotation.x=-1.8339692559645735;
    vizbim.fly.flyTo({
      eye: [-1808.3177601896205, -1609.232575765585, 398.4829680898391],
      look: [388.84914203569167, -48.450534749034375, -516.525020235798],
      up: [0, 0, 1],
      zoom: 1
    },()=>{
      const tween = addTween(1);
      // 先下移螺丝钉
      const tweenNail =  moveNail(tween,7,500);  // 螺丝钉移动到过度位置
      // 左移完螺丝钉再 移动到安装位置
      const tweenback0 = addTweenBack(tweenNail,7);
      tweenNail.onComplete(()=> {
          vizbim.fly.flyTo({
            eye: [-1142.1538368219867, 266.1775349859457, 77.96611027709346],
            look: [-895.5594764138112, -136.96111552438103, 88.96759242031186],
            up: [0, 0, 1],
            zoom: 1
          });
      });
      tweenback0.onComplete(()=>{
        resolve();
        $(".layui-btn-primary").removeAttr("disabled","disabled");
        $(".layui-btn-primary").removeClass("layui-btn-disabled");
      });
    });
  });
  return promise;
}

// 安装扶手
const installHandrail = (flag,whiteFlag) =>{
  sparesComparing(true,true,true);
  buttonSelectedStatus(5,flag,whiteFlag);
  moveComponentsMoment([3,4,5,0,6,1,7]);
  if(attributeWindow)attributeWindow.windowHide();
  const promise = new Promise(function(resolve, reject) {
    vizbim.fly.flyTo({
      eye: [-1808.3177601896205, -1609.232575765585, 398.4829680898391],
      look: [388.84914203569167, -48.450534749034375, -516.525020235798],
      up: [0, 0, 1],
      zoom: 1
    },()=>{
      const tween = addTween(2);  // 扶手挪到安装位置
      tween.onComplete(()=>{
        vizbim.components[componentkeyArray[8].componentId].rotation.x=1.5707963267948966;
        vizbim.components[componentkeyArray[8].componentId].rotation.y=-1.5707963267948966;
        vizbim.components[componentkeyArray[9].componentId].rotation.y=1.5707963267948966;
        vizbim.components[componentkeyArray[9].componentId].rotation.x=1.5707963267948966;
        // 先下移螺丝钉
        const tweenNail =  moveNail(tween,8);  // 螺丝钉移动到过度位置
        // 左移完螺丝钉再 移动到安装位置
        const tweenback1 = addTweenBack(tweenNail,8);
        setTimeout(function(){
          vizbim.fly.flyTo({
            eye:[-1290.2033843127854,-1052.9114943748832,171.03436633308507],
            look:[124.18338978522418,15.20074842484657,-381.94888488013754],
            up:[0,0,1],
            zoom:1
          },()=>{
            const tweenback2 = addTweenBack(tweenback1,9);
            tweenback1.onComplete(()=>{
              vizbim.fly.flyTo({
                eye:[433.6740242353261,-966.1716141941026,370.1538414672631],
                look:[-695.8200475967577,-299.02406189571246,-432.6590700296615],
                up:[0,0,1],
                zoom:1
              });
            });
            tweenback2.onComplete(()=>{
              RestoreChairPposition();
              vizbim.fly.flyTo(
                {
                eye:[387.16946547507155,-1354.6722299390944,722.0464752447974],
                look:[-528.8791809082031,276.20475202798843,464.2030944824219],
                up:[0,0,1],
                zoom:1
                }
                // mainView
                ,()=>{
                resolve();
                $(".layui-btn-primary").removeAttr("disabled","disabled");
                  $(".layui-btn-primary").removeClass("layui-btn-disabled");
                });
            });
          });
        }, 2000);
      });
    });
  });
  return promise;
}

// 一键安装
const autoInstall =() =>{
  $(".layui-btn").css("background-color","white");
  buttonSelectedStatus(6,false,true);
  if(attributeWindow)attributeWindow.windowHide();
  const promise = sparesComparing(false,true,true,"false");
  promise
    .then(()=>installPulley(true,true))
    .then(()=>installRiser(true,true,"speedup"))
    .then(()=>installCushion(true,true))
    .then(()=>installLazybackr(true,true))
    .then(()=>installHandrail(true,true))
    .then(()=>{
      $(".layui-btn-primary").removeAttr("disabled","disabled");
      $(".layui-btn-primary").removeClass("layui-btn-disabled");
      // $(".layui-btn").css("background-color","white");
    });
}

// 位置移动动画
const onUpdate =  (startPosSrc,component) => {
    component.scale.x = startPosSrc.sx;
    component.scale.y = startPosSrc.sy;
    component.scale.z = startPosSrc.sz;
    component.position.x = startPosSrc.x;
    component.position.y = startPosSrc.y;
    component.position.z = startPosSrc.z;
  // console.log("posSrc---",startPosSrc);
};

// 添加tween位置补间动画
const addTween = (index,endPosSrc,animationTime) =>{
  if(!animationTime){
    animationTime = 2000;
  }
  const component = vizbim.components[componentkeyArray[index].componentId];
  // 构件初始位置矩阵
  const componentInfo = vizbim.componentInfo[componentkeyArray[index].componentId].matrix;
  if(!endPosSrc){
    endPosSrc = {x: componentInfo[12], y:componentInfo[13]-1000, z:componentInfo[14]-500, sx:1,sy:1,sz:1};
  }
  const startPosSrc = component.position;
  startPosSrc.sx = component.scale.x;
  startPosSrc.sy = component.scale.y;
  startPosSrc.sz = component.scale.z;
  const tween = new TWEEN.Tween(startPosSrc).to(endPosSrc, animationTime);
  tween.easing(TWEEN.Easing.Sinusoidal.InOut);
  tween.onUpdate(()=>{onUpdate(startPosSrc,component)});
  tween.start();
  render();
  return tween;
}

// 添加tween链接动画
const addTweenBack = (tween,index,animationTime) =>{
  if(!animationTime){
    animationTime = 2000;
  }
  const component2 = vizbim.components[componentkeyArray[index].componentId];
  // 构件初始位置矩阵
  const componentInfo2 = vizbim.componentInfo[componentkeyArray[index].componentId].matrix;
  const endPosSrc2 = {x: componentInfo2[12], y:componentInfo2[13]-1000, z:componentInfo2[14]-500, sx:1,sy:1,sz:1};
  const startPosSrc2 = component2.position;
  startPosSrc2.sx = component2.scale.x;
  startPosSrc2.sy = component2.scale.y;
  startPosSrc2.sz = component2.scale.z;
  const tweenBack = new TWEEN.Tween(startPosSrc2).to(endPosSrc2, animationTime)
  tweenBack.easing(TWEEN.Easing.Quartic.Out);
  tweenBack.onUpdate(()=>{onUpdate(startPosSrc2,component2)});
  tween.chain(tweenBack);
  return tweenBack;
}

//动画更新函数
const render = () =>{
  TWEEN.update();
  requestAnimationFrame(render);
  vizbim.renderer.render(vizbim.scene, vizbim.camera);
}

let attributeWindow;   //零件对照说明框
let attributeWindowFlag = false;   //零件对照说明框
// 添加零件对照说明
const addSpareCompareDescription = () =>{
  if(!attributeWindowFlag){
    const toolId = vizbim.uuid;
    const Lobibox = vizbim.Lobibox;
    attributeWindowFlag = true;
    const $content = $(
      '<div class="tab-body" id="tab-ModelAds'+toolId+'"> ' +
      '<table id="spareCompare" class="sx-table table-no-top">' +
      '<thead></thead>' +
      '<tbody style="background-color: rgba(247, 247, 247, 0.8)">' +
      '</tbody>' +
      '</table>' +
      '</div>'
    );
    componentkeyArray.forEach((item,index)=>{
      const $tr = $(
        '<tr >' +
          '<td style="padding: 5px 0; ' +
                      'font-size: 15px; ' +
                      'cursor:pointer;">' +
          '</td>' +
        '</tr>'
      );
      const highlightComponents = "highlightComponents("+item.componentId+")";
      $tr.find("td").attr("id",item.componentId);
      $tr.find("#"+item.componentId).attr("onclick",highlightComponents);
      $tr.find("td").html(item.name);
      $content.find("tbody").append($tr);
    });
    const attribute={
      title: '零件对照列表',
      width:200,
      height:480,
      closeOnEsc:false,
      closeButton:true,
      afterWindowHide:function (lobibox) {
        console.log("切换成功");
      },
      content:$content
    };
    attributeWindow = Lobibox.window(attribute);
    attributeWindow.setPosition({
      left:"",
      right:5,
      top:60
    });
  }else {
    attributeWindow.windowShow();
  }
}

// 零件对照点击高亮方法
const highlightComponents = (componentId) => {
  $("#spareCompare td").css("background-color", "rgba(247, 247, 247, 0.8)");
  componentId = $(componentId).attr("id");
  console.log("componentId---",componentId);
  vizbim.findSceneNodes([componentId]);
  $("#"+componentId).css("background-color", "#70b1c5");
}
// 移动钉子的动画
const moveNail = (tween,index,animationTime) =>{
  if(!animationTime){
    animationTime = 2000;
  }
  // 先下移螺丝钉
  const component2 = vizbim.components[componentkeyArray[index].componentId];
  const startPosSrc2 = component2.position;
  const endPosSrc2 = {};
  Object.assign(endPosSrc2,startPosSrc2);
  endPosSrc2.x-=1300;
  endPosSrc2.y-=500;
  endPosSrc2.z-=2000;
  const tweenBack1 = new TWEEN.Tween(startPosSrc2).to(endPosSrc2, animationTime)
  tweenBack1.easing(TWEEN.Easing.Quartic.Out);
  tweenBack1.onUpdate(()=>{onUpdate(startPosSrc2,component2)});
  tween.chain(tweenBack1);
  // 左移完螺丝钉再 移动到安装位置
  return tweenBack1;
}

// 直接将构件移动到安装位置或者零件对照位置
const moveComponentsMoment = (indexArray,flag) =>{
  indexArray.forEach(item=>{
    const componentId = componentkeyArray[item].componentId
    const componentInfo = vizbim.componentInfo[componentId].matrix;
    if(!flag){
      vizbim.components[componentId].position.set(componentInfo[12],componentInfo[13]-1000,componentInfo[14]-500);
      vizbim.components[componentId].scale.set(1,1,1);
    }else{
      vizbim.components[componentId].position.set(
        componentkeyArray[item].comparedPos.x,
        componentkeyArray[item].comparedPos.y,
        componentkeyArray[item].comparedPos.z);
      vizbim.components[componentId].scale.set(
        componentkeyArray[item].comparedScale.x,
        componentkeyArray[item].comparedScale.y,
        componentkeyArray[item].comparedScale.z);
    }
  });
  vizbim.components[componentkeyArray[7].componentId].rotation.x=-1.8339692559645735;
}

// 按钮选中状态
const buttonSelectedStatus = (index,flag,whiteFlag) =>{
  const buttonid = "#button" + index;
  if(!whiteFlag){
    $(".layui-btn").css("background-color","white");
  }
  if(!flag){
    $(buttonid).css("background-color","#70b1c5");
  }
  // $(buttonid).attr("disabled","disabled");
  $(".layui-btn-primary").attr("disabled","disabled");
  $(".layui-btn-primary").addClass("layui-btn-disabled");

}

// 复原椅子位置
const RestoreChairPposition = () =>{
  componentkeyArray.forEach((item,index)=> {
    const componentId = item.componentId
    const componentInfo = vizbim.componentInfo[componentId].matrix;
    vizbim.components[componentId].position.set(componentInfo[12]+100,componentInfo[13]-100,componentInfo[14]);
  });
}

// 更换钉子材质
const changeNailMaterial = () =>{
  const nailArray = ["BuildingIOT_instruction2_2jJpfKCyX2UvUwVS8EWnm1","BuildingIOT_instruction2_2sqCdFPqPDcxKFpDU_ekGK","BuildingIOT_instruction2_2sqCdFPqPDcxKFpDU_ekur","BuildingIOT_instruction2_2sqCdFPqPDcxKFpDU_elIP"];
  nailArray.forEach(item=> {
    vizbim.components[item].material = new THREE.MeshStandardMaterial({
      flatShading: true,
      side: THREE.DoubleSide,
      metalness: 0.4
    });
    vizbim.setObjtColor([item],[69/255,69/255,69/255]);
  });
}
