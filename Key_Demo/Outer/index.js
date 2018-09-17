var op = { 
 viewport:"viewport",
 //用户devcode
 devcode:"1aa6ed778a61ef60283f",
 baseaddress:'https://api.boswinner.com.cn/'
};

let outComponents1 = [];
let outComponents2 = [];
let outComponents3 = [];
let moreComponents2 = [];
let moreComponents3 = [];
let moreComponents31 = [];

// 分离视角
const splitView = {
  eye: [-84951.2964396081,560249.7254059268,63055.93255458929],
  look:[10684.83279076726, 466652.50072562625,6449.802378514152],
  up: [0,0,1],
  zoom: 1
}

// 合并视角
const addView = {
  eye: [93644.37334045093,616504.737509469, 51793.34472889908],
  look: [32603.541177980136,495442.36184862565,-445.3541810086033],
  up: [0,0,1],
  zoom: 1
}


var vizbim = new BIMWINNER.Viewer(op);

function init(id){
	var tool = new BIMWINNER.Tool(vizbim); 
	tool.createTool(); 
  hideBarAndTool();
  getOutlineComponents(id).then(()=>{
    vizbim.showModelByDocumentId(id,function(){
      backToOrigin();
      addTableMark();
      //添加坐标系
      // var axes = new THREE.AxisHelper(200000);
      // vizbim.scene.add(axes);
      vizbim.fly.flyTo(addView);
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

let mode1 = false;
let mode2 = false;
let mode3 = false;
let description = false;

// 移到一边的构件id
let movedComponents = [];

// 根据传来的参数确定构件移动的方式
const dollyComponent = (flag,level,compoennts) =>{
  var step = 5000;
  var timeLength = 15;
  vizbim.fly.flyTo(splitView);
  var time = setInterval(function (a) {
    timeLength --;
    if(timeLength > 0){
			if(flag === true){
				for(var i = 0;i<compoennts.length;i++){
					vizbim.components[compoennts[i]].position.y-=step;
				}
			}else {
				for(var i = 0;i<compoennts.length;i++){
					vizbim.components[compoennts[i]].position.y+=step;
				}
			}
		}
    else{
      vizbim.resetScene(false,true,true,true,true,true,true);
      clearInterval(time);
      if(flag === true){
        for(var i = 0;i<compoennts.length;i++){
          movedComponents.push(compoennts[i]);
        }
			}else {
        movedComponents = []
      }
    }
  }, 20);
}

// 移动构件
const moveComponents = (level) => {
  vizbim.fly.flyTo(splitView);
  if(level === 1){
    mode1 = !mode1;
		dollyComponent(true,1,outComponents1);
		$('#button1').attr("disabled","disabled");
    vizbim.resetScene(false,true,true,true,true,true,true);
  }else if(level ===2){
    mode2 = !mode2;
    vizbim.resetScene(false,true,true,true,true,true,true);
    $('#button1').attr("disabled","disabled");
    $('#button2').attr("disabled","disabled");
    if(mode1){
      dollyComponent(true,2,moreComponents2);
      vizbim.reverseTransparentObjs(moreComponents2,0.07,true);
    }else {
      dollyComponent(true,2,outComponents2);
      vizbim.reverseTransparentObjs(outComponents2,0.07,true);
    }
  }else if(level ===3){
    mode3 = !mode3;
    vizbim.resetScene(false,true,true,true,true,true,true);
    $('#button1').attr("disabled","disabled");
    $('#button2').attr("disabled","disabled");
    $('#button3').attr("disabled","disabled");
    if(!mode1 && !mode2){
      dollyComponent(true,3,outComponents3);
      vizbim.reverseTransparentObjs(outComponents3,0.07,true);
    }else if(mode1 && !mode2){
      dollyComponent(true,3,moreComponents31);
      vizbim.reverseTransparentObjs(outComponents3,0.07,true);
    }
    else {
      dollyComponent(true,3,moreComponents3);
      vizbim.reverseTransparentObjs(moreComponents3,0.07,true);
    }
  }else {
    dollyComponent(false,4,movedComponents);
    backToOrigin();
    vizbim.fly.flyTo(addView);
  }
}


// 初始状态
const backToOrigin = () =>{
  $('#button1').removeAttr("disabled");
  $('#button2').removeAttr("disabled");
  $('#button3').removeAttr("disabled");
  $('#button4').removeAttr("disabled");
  mode1 = false;
  mode2 = false;
  mode3 = false;
}

// 创建左侧按钮
function showxsjTool2(){
  	var toolBarZK=$("<div id='toolBarZK' style='position:absolute;z-index:1;display:flex;flex-direction:column;left:10px;top:10px;margin-left:10px' id='toolBarZK2' ></div>");
        toolBarZK.appendTo($("#container"));
  	$(toolBarZK).append("<p id ='title' style='font-size:30px;margin-bottom: 0'> " +
			"模型外轮廓提取示例 " +
			"<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()' onmousemove=''></i>" +
			"</p>");
  $(container).append("<div id='descriptionContainer' style='display:none'> </div>")
		$(descriptionContainer).append("<p id ='title1' style='font-size:16px;margin-bottom: 0'> " +
			"对于不同精细度的模型，提供不同精细度的外轮廓提取 " + "</p>");
  $(descriptionContainer).append("<p id ='title2' style='font-size:16px;margin-bottom: 0'> " +
    "点击 一级轮廓 按钮，将显示初级精细度下的模型外轮廓 " + "</p>");
  $(descriptionContainer).append("<p id ='title3' style='font-size:16px;margin-bottom: 0'> " +
    "点击 二级轮廓 按钮，将显示中级精细度下的模型外轮廓 " + "</p>");
  $(descriptionContainer).append("<p id ='title4' style='font-size:16px;margin-bottom: 0'> " +
    "点击 三级轮廓 按钮，将显示高级精细度下的模型外轮廓 " + "</p>");
		$(toolBarZK).append("<ul id='tbZKul2' style='list-style-type:none;padding:0;'></ul>");
		$(tbZKul2).append("<li id = 'modelEdit1'><button disabled class='lyButton' id = 'button1' onclick='moveComponents(1);'>一级轮廓</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit2'><button disabled class='lyButton' id = 'button2' onclick='moveComponents(2);'>二级轮廓</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit3'><button disabled class='lyButton' id = 'button3' onclick='moveComponents(3);'>三级轮廓</button></li>");
		$(tbZKul2).append("<li id = 'modelEdit4'><button disabled class='lyButton' id = 'button4' onclick='moveComponents(4);'>合并</button></li>");
}

const addTableMark = () =>{
  $("#toolBarZK").append("<table width=\"230\" cellpadding='20' border=\"1\" style=\"border-collapse:collapse; border-color: #d9d9d9\">\n" +
    "  <tr>\n" +
    "    <th>构件数</th>\n" +
    "    <th>提取比例</th>\n" +
    "  </tr>\n" +
    "  <tr>\n" +
    "    <td>全模型:"+vizbim.alloids.length+"</td>\n" +
    "    <td>"+"100%"+"</td>\n" +
    "  </tr>\n" +
    "  <tr>\n" +
    "    <td>一级轮廓:"+ outComponents1.length +"</td>\n" +
    "    <td>"+(100*outComponents1.length/vizbim.alloids.length).toFixed(2)+"%"+"</td>\n" +
    "  </tr>\n" +
    "  <tr>\n" +
    "    <td>二级轮廓:"+ outComponents2.length +"</td>\n" +
    "    <td>"+(100*outComponents2.length/vizbim.alloids.length).toFixed(2)+"%"+"</td>\n" +
    "  </tr>\n" +
    "  <tr>\n" +
    "    <td>三级轮廓:"+ outComponents3.length +"</td>\n" +
    "    <td>"+(100*outComponents3.length/vizbim.alloids.length).toFixed(2)+"%"+"</td>\n" +
    "  </tr>\n" +
    "</table >")
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
    $(descriptionContainer).attr("style","position:absolute; top:50px; left:330px; background-color:white")
  }else {
    $(descriptionContainer).attr("style","display:none;")
	}
  description = !description
}


//数组求差
Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
}

// 获取模型外轮廓
const getOutlineComponents = (id) =>{
  return getOutlineComponentByLevel(id,1)
    .then((result1)=> {
      outComponents1 = result1.data;
      return getOutlineComponentByLevel(id,2)
    })
    .then((result2)=> {
      outComponents2 = result2.data;
      return getOutlineComponentByLevel(id,3)
    })
    .then((result3)=> {
      outComponents3 = result3.data;
      moreComponents2 =outComponents2.diff(outComponents1)
      moreComponents3 =outComponents3.diff(outComponents1).diff(outComponents2)
      moreComponents31 =outComponents3.diff(outComponents1)
    })
}

// 根据层级获取模型外轮廓构件
const getOutlineComponentByLevel = (id,level) =>{
  return fetch(`${op.baseaddress}models/${id}/outlines?devcode=${op.devcode}&level=${level}`)
    .then(response => response.json())
}
