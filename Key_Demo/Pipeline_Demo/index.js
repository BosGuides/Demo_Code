var op = { 
 viewport:"viewport",
 //用户devcode
 devcode:"e10e59bf0ee9721",
 baseaddress:'https://api.boswinner.com.cn/'
};

// 模型主视角
const mainView = {
  eye:[10956.515500419237,6421.674269818732,11950.580048875854],
  look:[-1445.009521484375,2938.898681640625,1635],
  up:[0,0,1],
  zoom:1
}

let systemComponents1 = [],
    systemComponents2 = [],
    systemComponents3 = [],
    systemComponents4 = [],
    systemComponents5 = [],
    systemComponents6 = [];
const arrowArray1  = new THREE.Object3D(),
      arrowArray21 = new THREE.Object3D(),
      arrowArray22 = new THREE.Object3D(),
      arrowArray23 = new THREE.Object3D(),
      arrowArray24 = new THREE.Object3D(),
      arrowArray25 = new THREE.Object3D(),
      arrowArray31 = new THREE.Object3D(),
      arrowArray32 = new THREE.Object3D(),
      arrowArray33 = new THREE.Object3D(),
      arrowArray34 = new THREE.Object3D(),
      arrowArray35 = new THREE.Object3D(),
      arrowArray36 = new THREE.Object3D(),
      arrowArray37 = new THREE.Object3D(),
      arrowArray41 = new THREE.Object3D(),
      arrowArray42 = new THREE.Object3D(),
      arrowArray43 = new THREE.Object3D(),
      arrowArray44 = new THREE.Object3D(),
      arrowArray45 = new THREE.Object3D(),
      arrowArray51 = new THREE.Object3D(),
      arrowArray52 = new THREE.Object3D(),
      arrowArray53 = new THREE.Object3D(),
      arrowArray54 = new THREE.Object3D(),
      arrowArray55 = new THREE.Object3D(),
      arrowArray56 = new THREE.Object3D(),
      arrowArray61 = new THREE.Object3D(),
      arrowArray62 = new THREE.Object3D(),
      arrowArray63 = new THREE.Object3D(),
      arrowArray64 = new THREE.Object3D(),
      arrowArray65 = new THREE.Object3D(),
      arrowArray66 = new THREE.Object3D(),
      arrowArray67 = new THREE.Object3D(),
      arrowArray68 = new THREE.Object3D(),
      arrowArray69 = new THREE.Object3D(),
      textMark = new THREE.Object3D(),
      textMark1 = new THREE.Object3D(),
      textMark2 = new THREE.Object3D(),
      textMark3 = new THREE.Object3D(),
      textMark4 = new THREE.Object3D(),
      textMark5 = new THREE.Object3D(),
      textMark6 = new THREE.Object3D();
let font;

const arrowArray =  [
  arrowArray1,arrowArray21,arrowArray22,arrowArray23,
  arrowArray24,arrowArray25, arrowArray31,arrowArray32,
  arrowArray33,arrowArray34,arrowArray35,arrowArray36,
  arrowArray37,arrowArray41, arrowArray42, arrowArray43,
  arrowArray44,arrowArray45,arrowArray51,arrowArray52,
  arrowArray53,arrowArray54, arrowArray55,arrowArray56,
  arrowArray61, arrowArray62,arrowArray63,arrowArray64,
  arrowArray65,arrowArray66,arrowArray67,arrowArray68,
  arrowArray69, textMark1,textMark2,textMark3,textMark4,
  textMark5,textMark6
]

var vizbim = new BIMWINNER.Viewer(op);

function init(id){
	var tool = new BIMWINNER.Tool(vizbim); 
	tool.createTool(); 
  hideBarAndTool();
  changHomeBehavior();
  getComponentBySystem(id)
    .then(()=>{
      vizbim.showModelByDocumentId(id,function(){
        let loader = new THREE.FontLoader();
        loader.load( 'http://pf6zh7nc8.bkt.clouddn.com/helvetiker_regular.typeface.json', function ( font1 ) {
          font= font1;
          vizbim.scene.add(textMark);
          addAllSystemText();
        });

        backToOrigin();
        changeSystemColor();
        vizbim.fly.flyTo(mainView);
        newCreateSystem1Arrow();
        newCreateSystem2Arrow();
        newCreateSystem3Arrow();
        newCreateSystem4Arrow();
        newCreateSystem5Arrow();
        newCreateSystem6Arrow();
        vizbim.closeHighlightObjs();
        //添加坐标系
        // var axes = new THREE.AxisHelper(200000);
        // vizbim.scene.add(axes);
        vizbim.listentoSelectObjs(function (componentId, component) {
          console.log("componentId:",componentId);
          // console.log("component",component);
        });
      });
    });
	vizbim.autoResize=true;
	vizbim.resize(); 
	showxsjTool2();
}

let description = false;
// 显示相应系统的构件
const showSystermMark = (level) => {
  vizbim.resetScene(false,true,true,true,false,true,true);
  removeArrow();
  switch (level) {
    case 1:
      vizbim.reverseTransparentObjs(systemComponents1,0.1,true);
      vizbim.scene.add(arrowArray1,textMark1);
      vizbim.setObjtColor(systemComponents1,[0,0.247,1]);
      break;
    case 2:
      vizbim.reverseTransparentObjs(systemComponents2,0.1,true);
      vizbim.setObjtColor(systemComponents2,[0,0.9,0.9]);
      vizbim.scene.add(arrowArray21,arrowArray22,arrowArray23,arrowArray24,arrowArray25,textMark2);
      break;
    case 3:
      vizbim.setObjtColor(systemComponents3,[0.476,0.214,0.543]);
      vizbim.scene.add(arrowArray31,arrowArray32,arrowArray33,arrowArray34,arrowArray35,arrowArray36,arrowArray37,textMark3);
      vizbim.reverseTransparentObjs(systemComponents3,0.1,true);
      break;
    case 4:
      vizbim.scene.add(arrowArray41,arrowArray42,arrowArray43,arrowArray44,arrowArray45,textMark4);
      vizbim.setObjtColor(systemComponents4,[0.621,0.473,0.93]);
      vizbim.reverseTransparentObjs(systemComponents4,0.1,true);
      break;
    case 5:
      vizbim.setObjtColor(systemComponents5,[198/255,230/255,19/255]);
      vizbim.scene.add(arrowArray51,arrowArray52,arrowArray53,arrowArray54,arrowArray55,arrowArray56,textMark5);
      vizbim.reverseTransparentObjs(systemComponents5,0.1,true);
      break;
    case 6:
      vizbim.setObjtColor(systemComponents6,[81/255,223/255,155/255]);
      vizbim.scene.add(arrowArray61, arrowArray62,arrowArray63, arrowArray64,
      arrowArray66,arrowArray65,arrowArray67,arrowArray68,arrowArray69,textMark6);
      vizbim.reverseTransparentObjs(systemComponents6,0.1,true);
      break;
    default:
      console.log("-------");
  }
}

// 初始状态
const backToOrigin = () =>{
  $('#button1').removeAttr("disabled");
  $('#button2').removeAttr("disabled");
  $('#button3').removeAttr("disabled");
  $('#button4').removeAttr("disabled");
  $('#button5').removeAttr("disabled");
  $('#button6').removeAttr("disabled");
  $('#button7').removeAttr("disabled");
}

// 创建左侧按钮
function showxsjTool2(){
  	var toolBarZK=$("<div id='toolBarZK' style='position:absolute;z-index:1;display:flex;flex-direction:column;left:10px;top:10px;margin-left:10px' id='toolBarZK2' ></div>");
        toolBarZK.appendTo($("#container"));
  	$(toolBarZK).append("<p id ='title' style='font-size:30px;margin-bottom: 0'> " +
			"管道系统模型 " +
			"<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()' onmousemove=''></i>" +
			"</p>");
  $(container).append("<div id='descriptionContainer' style='display:none'> </div>")
		$(descriptionContainer).append("<p id ='title1' style='font-size:16px;margin-bottom: 0'> " +
			"选择不同系统，将出现不同系统下管道信息 " + "</p>");
		$(toolBarZK).append("<ul id='tbZKul2' style='list-style-type:none;padding:0;'></ul>");
		$(tbZKul2).append("<li id = 'modelEdit1'><button disabled type='button' class='lyButton' id = 'button1' onclick='showSystermMark(1);'>水暖系统1</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit2'><button disabled class='lyButton' id = 'button2' onclick='showSystermMark(2);'>水暖系统2</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit3'><button disabled class='lyButton' id = 'button3' onclick='showSystermMark(3);'>水暖系统3</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit4'><button disabled class='lyButton' id = 'button4' onclick='showSystermMark(4);'>水暖系统4</button></li>");
    $(tbZKul2).append("<li id = 'modelEdit5'><button disabled class='lyButton' id = 'button5' onclick='showSystermMark(5);'>水暖系统5</button></li>");
    $(tbZKul2).append("<li id = 'modelEdit6'><button disabled class='lyButton' id = 'button6' onclick='showSystermMark(6);'>水暖系统6</button></li>");
    $(tbZKul2).append("<li id = 'modelEdit6'><button disabled class='lyButton' id = 'button7' onclick='seeTheBigPicture();'>一键观全局</button></li>");
}


const seeTheBigPicture = () =>{
  vizbim.resetScene(true,true,true,true,false,true,true);
  addAllArrow();
  vizbim.fly.flyTo(mainView);
}

// 工具栏隐藏
const hideBarAndTool = () =>{
  // 左上角的视图球
  var leftUpDiv = document.getElementsByClassName('list-item2')[0];
  leftUpDiv.style.display = 'none';
}

// 显示说明
const showDescription = () =>{
	if(!description){
    $(descriptionContainer).attr("style","position:absolute; top:50px; left:240px; background-color:white")
  }else {
    $(descriptionContainer).attr("style","display:none;")
	}
  description = !description
}

// 根据构件id获取该模型系统类型的基本信息
const getComponentBySystem = (id) =>{
  return fetch(`${op.baseaddress}models/${id}/components/IFCSYSTEM?devcode=${op.devcode}`)
    .then(response => response.json())
    .then(result=>{
      let systermComponents = JSON.parse(result.data);
      console.log("getComponentBySystem的result:",systermComponents);
      systemComponents1 = systermComponents[0].systemgroup;
      systemComponents2 = systermComponents[1].systemgroup;
      systemComponents3 = systermComponents[2].systemgroup;
      systemComponents4 = systermComponents[3].systemgroup;
      systemComponents5 = systermComponents[4].systemgroup;
      systemComponents6 = systermComponents[5].systemgroup;
    });
}

// 创建水暖系统1的构件的箭头
const newCreateSystem1Arrow = () =>{
  const position = vizbim.components["18357808_10399NMAP1GhnnFAPsqNG0"].position
  const position1={x:position.x+700,y:position.y,z:position.z};
  const position2 = vizbim.components["18357808_10399NMAP1GhnnFAPsqNH6"].position
  multipurposeCreateArrow(position1,position2,"y-",10,arrowArray1);
}

// 创建水暖系统2的构件的箭头
const newCreateSystem2Arrow = () =>{
  const position1s = vizbim.components["18357808_1MsuA5ITz2xuXdY0I7Osp_"].position
  const position1e = vizbim.components["18357808_1lhHjFwsrD2BWDV2HOvu2k"].position
  const position2s = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbuAY"].position
  const position2e = vizbim.components["18357808_1lhHjFwsrD2BWDV2HOvuwP"].position
  const position3s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8FnP"].position
  const position3e = vizbim.components["18357808_1MsuA5ITz2xuXdY0I7Ouag"].position
  const position4s = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu9q"].position
  const position4e = vizbim.components["18357808_34NcV6TFr2x9hzGbbSfCpG"].position
  const position5s = vizbim.components["18357808_1MsuA5ITz2xuXdY0I7Ouag"].position
  const position5e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbxqv"].position
  const position6s = vizbim.components["18357808_1MsuA5ITz2xuXdY0I7Ouag"].position
  let newPosition6s = Object.assign({}, position6s);
  newPosition6s.x += 500;
  const position6e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbuBh"].position
  multipurposeCreateArrow(position1s,position1e,"y+",10,arrowArray21);
  multipurposeCreateArrow(position2s,position2e,"y+",10,arrowArray21);
  multipurposeCreateArrow(position3s,position3e,"y+",10,arrowArray22);
  multipurposeCreateArrow(position4s,position4e,"y+",10,arrowArray23);
  multipurposeCreateArrow(position5s,position5e,"x-",10,arrowArray24);
  multipurposeCreateArrow(newPosition6s,position6e,"x+",10,arrowArray25);
}

// 创建水暖系统3的构件的箭头
const newCreateSystem3Arrow = () => {
  const position1s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8FcP"].position
  const position1e = vizbim.components["18357808_3eKUBOwaz1rQi0Re0ze5BB"].position
  const position2s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8FdK"].position
  const position2e = vizbim.components["18357808_3eKUBOwaz1rQi0Re0ze54_"].position
  const position3s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8EQX"].position
  const position3e = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8EVf"].position
  const position4s = vizbim.components["18357808_09OLcIiq1B3w0FVjsRtVe3"].position
  const position4e = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8FXA"].position
  const position5s = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu6Z"].position
  const position5e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu6d"].position
  const position6s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8EVf"].position
  const position6e = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8EVj"].position
  const position7s = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu6$"].position
  const position7e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu6Z"].position
  const position8s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8EQb"].position
  const position8e = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8EQX"].position
  const position9s = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu6d"].position
  const position9e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu7i"].position
  multipurposeCreateArrow(position1s,position1e,"y+",10,arrowArray31);
  multipurposeCreateArrow(position2s,position2e,"y+",10,arrowArray31);
  multipurposeCreateArrow(position3s,position3e,"y+",10,arrowArray32);
  multipurposeCreateArrow(position4s,position4e,"x-",10,arrowArray33);
  multipurposeCreateArrow(position5s,position5e,"x-",10,arrowArray34);
  multipurposeCreateArrow(position6s,position6e,"z+",10,arrowArray35);
  multipurposeCreateArrow(position7s,position7e,"z+",10,arrowArray35);
  multipurposeCreateArrow(position8s,position8e,"z-",10,arrowArray36);
  multipurposeCreateArrow(position9s,position9e,"z-",10,arrowArray37);
}

// 创建水暖系统4的构件的箭头
const newCreateSystem4Arrow = () => {
  const position1s = vizbim.components["18357808_10399NMAP1GhnnFAPsqNP$"].position
  let position1e = Object.assign({}, position1s);
  position1e.y +=4300;
  const position2s = vizbim.components["18357808_10399NMAP1GhnnFAPsqNV$"].position
  const position2e = vizbim.components["18357808_10399NMAP1GhnnFAPsqNUd"].position
  const position3s = vizbim.components["18357808_10399NMAP1GhnnFAPsqNPJ"].position
  const position3e = vizbim.components["18357808_10399NMAP1GhnnFAPsqNPR"].position
  const position4s = vizbim.components["18357808_10399NMAP1GhnnFAPsqNPZ"].position
  const position4e = Object.assign({}, position4s);
  position4e.y += 2200;
  const position5s = vizbim.components["18357808_3yIDT8idD1Bx_jkc0mGEJS"].position
  let position5e = Object.assign({}, position5s);
  position5e.x += 1500;
  const position6s = vizbim.components["18357808_3yIDT8idD1Bx_jkc0mGEJ5"].position
  let position6e = Object.assign({}, position6s);
  position6e.z -= 1500;
  multipurposeCreateArrow(position1s,position1e,"y+",10,arrowArray41);
  multipurposeCreateArrow(position2s,position2e,"y+",10,arrowArray42);
  multipurposeCreateArrow(position3s,position3e,"y+",10,arrowArray42);
  multipurposeCreateArrow(position4s,position4e,"y+",10,arrowArray43);
  multipurposeCreateArrow(position5s,position5e,"x+",10,arrowArray44);
  multipurposeCreateArrow(position6s,position6e,"z-",10,arrowArray45);
}

// 创建水暖系统5的构件的箭头
const newCreateSystem5Arrow = () => {
  const position1s = vizbim.components["18357808_10399NMAP1GhnnFAPsqNGR"].position
  const position1e = vizbim.components["18357808_10399NMAP1GhnnFAPsqNJs"].position
  const position2s = vizbim.components["18357808_1lhHjFwsrD2BWDV2HOvurS"].position
  const position2e = vizbim.components["18357808_1MsuA5ITz2xuXdY0I7OspA"].position
  const position3s = vizbim.components["18357808_1MsuA5ITz2xuXdY0I7Ouao"].position
  const position3e = vizbim.components["18357808_10399NMAP1GhnnFAPsqNVt"].position
  const position4s = vizbim.components["18357808_1MsuA5ITz2xuXdY0I7Ospu"].position
  const position4e = vizbim.components["18357808_1lhHjFwsrD2BWDV2HOvu6H"].position
  let newPosition4e = Object.assign({}, position4e);
  newPosition4e.y += 800;
  const position5s = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbxsF"].position
  const position5e = vizbim.components["18357808_34NcV6TFr2x9hzGbbSeqLr"].position
  let newPosition5e = Object.assign({}, position5e);
  newPosition5e.y += 1000;
  const position6s = vizbim.components["18357808_10399NMAP1GhnnFAPsqNJs"].position
  const position6e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbxta"].position
  const position7s = vizbim.components["18357808_09OLcIiq1B3w0FVjsRtVe3"].position
  let position7e = Object.assign({}, position7s);
  position7e.x -= 2000;
  multipurposeCreateArrow(position1s,position1e,"y+",10,arrowArray51);
  multipurposeCreateArrow(position2s,position2e,"y+",10,arrowArray52);
  multipurposeCreateArrow(position3s,position3e,"y+",10,arrowArray53);
  multipurposeCreateArrow(position4s,newPosition4e,"y+",10,arrowArray54);
  multipurposeCreateArrow(position5s,newPosition5e,"y+",10,arrowArray54);
  multipurposeCreateArrow(position6s,position6e,"x-",10,arrowArray55);
  multipurposeCreateArrow(position7s,position7e,"x-",10,arrowArray56);
}

// 创建水暖系统6的构件的箭头
const newCreateSystem6Arrow = () => {
  const position1s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8FyU"].position
  const position1e = vizbim.components["18357808_2zrmynzlz1zwa$8yMUYDTb"].position
  const position2s = vizbim.components["18357808_1MsuA5ITz2xuXdY0I7Osp2"].position
  const position2e = vizbim.components["18357808_2zrmynzlz1zwa$8yMUYDQH"].position
  const position3s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8E5t"].position
  const position3e = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8ESv"].position
  const position4s = vizbim.components["18357808_34NcV6TFr2x9hzGbbSen63"].position
  const position4e = vizbim.components["18357808_3ONqb2XQ59uAvJbD2LvCPz"].position
  const position5s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8E5V"].position
  const position5e = vizbim.components["18357808_3ONqb2XQ59uAvJbD2LvCPz"].position
  let newPosition5e = Object.assign({}, position5e);
  newPosition5e.x += 500;
  const position6s = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu4K"].position
  const position6e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu4G"].position
  const position7s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8E5z"].position
  const position7e = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8E5x"].position
  const position8s = vizbim.components["18357808_2zrmynzlz1zwa$8yMUYFde"].position
  const position8e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu4K"].position
  const position9s = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8ESz"].position
  const position9e = vizbim.components["18357808_3UQHaVAK1Cfw0mPGem8ESv"].position
  const position10s = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu4G"].position
  const position10e = vizbim.components["18357808_1L_m7xXTj1bOTmwQPrbu4a"].position
  multipurposeCreateArrow(position1e,position1s,"y-",10,arrowArray61);
  multipurposeCreateArrow(position2e,position2s,"y-",10,arrowArray61);
  multipurposeCreateArrow(position3e,position3s,"y-",10,arrowArray62);
  multipurposeCreateArrow(position4e,position4s,"y-",10,arrowArray63);
  multipurposeCreateArrow(position5s,newPosition5e,"x-",10,arrowArray65);
  multipurposeCreateArrow(position6s,position6e,"x-",10,arrowArray66);
  multipurposeCreateArrow(position7s,position7e,"z+",10,arrowArray67);
  multipurposeCreateArrow(position8s,position8e,"z+",10,arrowArray68);
  multipurposeCreateArrow(position9s,position9e,"z-",10,arrowArray69);
  multipurposeCreateArrow(position10s,position10e,"z-",10,arrowArray69);

}

// 清空所有的箭头
const removeArrow = () =>{
  arrowArray.forEach(item=>{
    vizbim.scene.remove(item)
  });
}

// 添加所有箭头
const addAllArrow = () =>{
  arrowArray.forEach(item=>{
    vizbim.scene.add(item)
  });
}

// 创建箭头
const createArrow =(tObj,x,y,z,flowDerection) =>{
  const arrow =new THREE.Object3D();
  var geometry = new THREE.CylinderGeometry( 100, 100, 40, 3,1,false );
  var geometry2 = new THREE.CubeGeometry(40,200,40);
  // var material = new THREE.MeshBasicMaterial( {color: 0xFFA500} );
  var material = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
  var cube = window.cube =  new THREE.Mesh( geometry, material );
  var cube2  = window.cube2 = new THREE.Mesh( geometry2, material );
  switch (flowDerection) {
    case "y-":
      cube.rotation.x += (Math.PI/2);
      cube.rotation.z -= (Math.PI/2);
      cube2.position.y+=100;
      break;
    case "y+":
      cube.rotation.x += 3*(Math.PI/2);
      cube.rotation.z -= (Math.PI/2);
      cube2.position.y-=100;
      break;
    case "x-":
      cube.rotation.y -= Math.PI/2;
      cube.rotation.x -= Math.PI/2;
      cube2.rotation.z -= Math.PI/2;
      cube2.rotation.x -= Math.PI/2;
      cube2.position.x+=100;
      break;
    case "x+":
      cube.rotation.y += Math.PI/2;
      cube.rotation.x -= Math.PI/2;
      cube2.rotation.z -= Math.PI/2;
      cube2.rotation.x -= Math.PI/2;
      cube2.position.x-=100;
      break;
    case "z+":
      cube.rotation.z += Math.PI/2;
      cube2.rotation.x -= Math.PI/2;
      cube2.position.z-=100;
      break;
    case "z-":
      cube.rotation.z -= Math.PI/2;
      cube.rotation.x -= Math.PI;
      cube2.rotation.x += Math.PI/2;
      cube2.position.z+=100;
      break;
  }
  arrow.add(cube);
  arrow.add(cube2);
  arrow.position.x += 400;
  arrow.position.z += 200;
  console.log("创建arrow传递过来的x,y,z",x,y,z);
  arrow.position.set(x,y,z);
  tObj.add(arrow);
  // console.log("刚创建好箭头之后箭头的位置y:",arrow.position.y);
}

/**
 * @description:  创建一组箭头动画
 * @params:  number         {Number} : 箭头的个数
 * @params:  startPoint     {Object} : 起始点位置
 * @params:  endPoint       {Object} : 终止点位置
 * @params:  flowDerection  {String} : 箭头流动的正负方向,"y-"
 * @params:  speed          {Number} : 箭头流动速度
 * @params:  obj3D          {Object} : 接收箭头的父级three3D对象
 * @return:  None

 */
const multipurposeCreateArrow = (startPoint,endPoint,flowDerection,speed,obj3D) =>{
  const x1=startPoint.x;
  const y1=startPoint.y;
  const z1=startPoint.z;
  const x2=endPoint.x;
  const y2=endPoint.y;
  const z2=endPoint.z;
  const arrowLength = 350; //箭头长度
  let number = 0;
  let newEndPoint;
  let animationY2;
  let animationX2;
  let animationZ2;
  switch (flowDerection) {
    case "y-":
      number =  Math.ceil(Math.floor(Math.abs((y2-y1)/arrowLength))/2);
      animationY2 = y1-(number*2-1)*arrowLength    // 保证箭头动画前后间距一致
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.y = animationY2;
      console.log("y-number",number);
      for (let i =0; i<number;i++){
        createArrow(obj3D,x1+400,y1-i*arrowLength*2,z1+100,flowDerection);
      }
      break;
    case "y+":
      number =  Math.ceil(Math.floor(Math.abs((y2-y1)/arrowLength))/2);
      animationY2 = y1+(number*2-1)*arrowLength    // 保证箭头动画前后间距一致
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.y = animationY2;
      for (let i =0; i<number;i++){
        createArrow(obj3D,x1+400,y1+i*arrowLength*2,z1+100,flowDerection);
      }
      break;
    case "x-":
      number =  Math.ceil(Math.floor(Math.abs((x2-x1)/arrowLength))/2);
      animationX2 = x1-(number*2-1)*arrowLength    // 保证箭头动画前后间距一致
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.x = animationX2;
      for (let i =0; i<number;i++){
        createArrow(obj3D,x1-i*arrowLength*2,y1,z1+400,flowDerection);
      }
      break;
    case "x+":
      number =  Math.ceil(Math.floor(Math.abs((x2-x1)/arrowLength))/2);
      animationX2 = x1+(number*2-1)*arrowLength    // 保证箭头动画前后间距一致
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.x = animationX2;
      for (let i =0; i<number;i++){
        createArrow(obj3D,x1+i*arrowLength*2,y1,z1+400,flowDerection);
      }
      break;
    case "z+":
      number =  Math.ceil(Math.floor(Math.abs((z2-z1)/arrowLength))/2);
      animationZ2 = z1+(number*2-1)*arrowLength    // 保证箭头动画前后间距一致
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.z = animationZ2;
      for (let i =0; i<number;i++){
        createArrow(obj3D,x1+300,y1,z1+i*arrowLength*2,flowDerection);
      }
      break;
    case "z-":
      number =  Math.ceil(Math.floor(Math.abs((z2-z1)/arrowLength))/2);
      animationZ2 = z1-(number*2-1)*arrowLength    // 保证箭头动画前后间距一致
      newEndPoint = Object.assign({}, endPoint);
      newEndPoint.z = animationZ2;
      for (let i =0; i<number;i++){
        createArrow(obj3D,x1+300,y1,z1-i*arrowLength*2,flowDerection);
      }
      break;
    default:
      console.log("nothing happened");
  }
  moveArrowArray(obj3D,flowDerection,speed,startPoint,newEndPoint);

}

// 使一组箭头移动起来
const moveArrowArray = (obj3D,flowDerection,speed,startPoint,endPoint) =>{
  const x1=startPoint.x;
  const y1=startPoint.y;
  const z1=startPoint.z;
  const x2=endPoint.x;
  const y2=endPoint.y;
  const z2=endPoint.z;
  // console.log("obj3D.children:",obj3D.children.length);
  switch (flowDerection) {
    case "y-":
      obj3D.children.forEach((item,index)=>{
        item.position.y-=speed;
        if(item.position.y <= y2){
          if(item.rotation.z >= -Math.PI/2 ){
            item.rotation.z -= Math.PI * 0.01
            item.rotation.x -= Math.PI * 0.01
          }
          if(item.rotation.z <= -Math.PI/2 ){
            item.position.y = y1 ;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "y+":
      obj3D.children.forEach((item,index)=>{
        item.position.y+=speed;
        if(item.position.y >= y2){
          if(item.rotation.z >= -Math.PI/2 ){
            item.rotation.z -= Math.PI * 0.01
            item.rotation.x += Math.PI * 0.01
          }
          if(item.rotation.z <= -Math.PI/2 ){
            item.position.y = y1 ;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "x-":
      obj3D.children.forEach((item,index)=>{
        item.position.x-=speed;
        if(item.position.x <= x2){
          if(item.rotation.z >= -Math.PI/2 ){
            item.rotation.z -= Math.PI * 0.01
            item.rotation.x -= Math.PI * 0.01
          }
          if(item.rotation.z <= -Math.PI/2 ){
            item.position.x = x1 ;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "x+":
      obj3D.children.forEach((item,index)=>{
        item.position.x+=speed;
        if(item.position.x >= x2){
          if(item.rotation.z >= -Math.PI/2 ){
            item.rotation.z -= Math.PI * 0.01
            item.rotation.x += Math.PI * 0.01
          }
          if(item.rotation.z <= -Math.PI/2 ){
            item.position.x = x1 ;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "z+":
      obj3D.children.forEach((item,index)=>{
        item.position.z+=speed;
        if(item.position.z >= z2){
          if(item.rotation.z >= -Math.PI/2 ){
            item.rotation.z -= Math.PI * 0.01
            item.rotation.x -= Math.PI * 0.01
          }
          if(item.rotation.z <= -Math.PI/2 ){
            item.position.z = z1 ;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    case "z-":
      obj3D.children.forEach((item,index)=>{
        item.position.z-=speed;
        if(item.position.z <= z2){
          if(item.rotation.z >= -Math.PI/2 ){
            item.rotation.z -= Math.PI * 0.01
            item.rotation.x += Math.PI * 0.01
          }
          if(item.rotation.z <= -Math.PI/2 ){
            item.position.z = z1 ;
            item.rotation.z = 0;
            item.rotation.x = 0;
          }
        }
      });
      break;
    default:
      console.log("nothing happened");
  }
  requestAnimationFrame(function () {
    moveArrowArray(obj3D,flowDerection,speed,startPoint,endPoint);
  });
}

// 更改水暖系统颜色
const changeSystemColor = () =>{
  changeMaterial();
  vizbim.setObjtColor(systemComponents1,[0,0.247,1]);
  vizbim.setObjtColor(systemComponents2,[0,0.9,0.9]);
  vizbim.setObjtColor(systemComponents3,[0.476,0.214,0.543]);
  vizbim.setObjtColor(systemComponents4,[0.621,0.473,0.93]);
  vizbim.setObjtColor(systemComponents5,[198/255,230/255,19/255]);
  vizbim.setObjtColor(systemComponents6,[81/255,223/255,155/255]);
}

//改变系统材质
function changeMaterial(){
  for(var i=0;i<systemComponents1.length;i++){
    vizbim.components[systemComponents1[i]].material = new THREE.MeshStandardMaterial( { flatShading: true, side: THREE.DoubleSide ,metalness:0.4} )
  }
  for(var i=0;i<systemComponents2.length;i++){
    vizbim.components[systemComponents2[i]].material = new THREE.MeshStandardMaterial( { flatShading: true, side: THREE.DoubleSide ,metalness:0.4} )
  }
  for(var i=0;i<systemComponents3.length;i++){
    vizbim.components[systemComponents3[i]].material = new THREE.MeshStandardMaterial( { flatShading: true, side: THREE.DoubleSide ,metalness:0.4} )
  }
  for(var i=0;i<systemComponents4.length;i++){
    vizbim.components[systemComponents4[i]].material = new THREE.MeshStandardMaterial( {  flatShading: true, side: THREE.DoubleSide ,metalness:0.4} )
  }
  for(var i=0;i<systemComponents5.length;i++){
    vizbim.components[systemComponents5[i]].material = 	new THREE.MeshStandardMaterial( {color: 0x222222,side:THREE.DoubleSide ,transparent:true,metalness:0.4} );
  }
  for(var i=0;i<systemComponents6.length;i++){
    vizbim.components[systemComponents6[i]].material = 	new THREE.MeshStandardMaterial( {color: 0x222222,side:THREE.DoubleSide ,transparent:true,metalness:0.4} );
  }
}

// 更改监听的小房子点击事件
const changHomeBehavior = () =>{
  const uuid=vizbim.uuid;
  $('#home'+uuid).unbind("click");
  $('#home'+uuid).bind("click",()=>{
    vizbim.resetScene(true,true,true,true,false,true,true);
    vizbim.fly.flyTo(mainView);
    removeArrow();
  });
}

// 添加3D文字
const addText = (content,componentid,tObj) =>{
  let xMid,text, message;
  let textShape = new THREE.BufferGeometry();
  let color = 0xF08080;
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
  let shapes = font.generateShapes(message, 300, 300);

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
  newposition.y = position.y;
  newposition.z = position.z+750;
  text.position.x = newposition.x;
  text.position.y = newposition.y;
  text.position.z = newposition.z;
  text.rotation.x+=Math.PI/2;
  text.rotation.y+=Math.PI/2;
  // text.material.depthTest = false;
  text.material.opacity = 0.9;
  tObj.add(text);
  updateTextView(tObj);
  vizbim.cameraControl.addEventListener('change',function(){
    updateTextView(tObj);
  });
}

// 更新三维字体视角，始终面向相机
const updateTextView  = (tObj) =>{
  for(let i = 0;i<tObj.children.length;i++){
    tObj.children[i].rotation.x = vizbim.camera.rotation.x;
    tObj.children[i].rotation.y = vizbim.camera.rotation.y;
    tObj.children[i].rotation.z = vizbim.camera.rotation.z;
  }
}

const addAllSystemText = () =>{
  addText("12.2 °C","18357808_09OLcIiq1B3w0FVjsRtVe2",textMark5);
  addText("7.2 °C","18357808_34NcV6TFr2x9hzGbbSfCgs",textMark5);
  addText("32.1 °C","18357808_34NcV6TFr2x9hzGbbSfCpG",textMark2);
  addText("15.3 °C","18357808_34NcV6TFr2x9hzGbbSeqM$",textMark2);
  addText("15.3 °C","18357808_2zrmynzlz1zwa$8yMUYDj6",textMark2);
  addText("37.3 °C","18357808_3ONqb2XQ59uAvJbD2LvCPz",textMark6);
  addText("26.8 °C","18357808_3UQHaVAK1Cfw0mPGem8FwK",textMark6);
  addText("26.8 °C","18357808_0W$i8ROIL0bAil$b8K11Qf",textMark6);
  addText("0.86 MPa","18357808_1MsuA5ITz2xuXdY0I7Ouag",textMark5);
  addText("0.86 MPa","18357808_10399NMAP1GhnnFAPsqNVt",textMark5);
  addText("7.1 °C","18357808_34NcV6TFr2x9hzGbbSeqMb",textMark5);
  addText("7.1 °C","18357808_34NcV6TFr2x9hzGbbSeqL5",textMark5);
  addText("36 °C","18357808_3eKUBOwaz1rQi0Re0ze54u",textMark3);
  addText("36 °C","18357808_3eKUBOwaz1rQi0Re0ze5BL",textMark3);
  addText("17 °C","18357808_0W$i8ROIL0bAil$b8K11VC",textMark3);
  addText("26 °C","18357808_3eKUBOwaz1rQi0Re0ze5lJ",textMark1);
  addText("34 °C","18357808_3yIDT8idD1Bx_jkc0mGEJD",textMark4);
  addText("19 °C","18357808_10399NMAP1GhnnFAPsqNOx",textMark4);
}
