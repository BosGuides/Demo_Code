const op = {
 viewport:"viewport",
 //用户devcode
 devcode:"e10adc3949ba",
 baseaddress:'https://api.bos.xyz/'
};

// const fileKey = "4061074";
const fileKey = "26583488";
// const fileKey = "26583499";


const vizbim = new BIMWINNER.Viewer(op);
// 模型主视角
const mainView = {
  eye:[21245.993288067424,-37490.34493828655,12237.074569820481],
  look:[3359.1114442261874,-9330.315606417287,-839.7087337979011],
  up:[0,0,1],
  zoom:1
}

// 空间树接口拿到的
let buildingLevel = [];
// layui的form
let form;

//构件所有的类别数组
let comTypeArray = [];
// 初始化，主函数
function init(){
	let tool = new BIMWINNER.Tool(vizbim);
	tool.createTool();
	// 隐藏工具栏
  hideBarAndTool();
  // 更改小房子点击事件
  // changHomeBehavior();
  addTileandSearchBoard();
  updateLoucengInformation();
  updateComponentStyle();
  vizbim.showModelByDocumentId(fileKey,function(){
    //添加坐标系
    // let axes = new THREE.AxisHelper(200000);
    // vizbim.scene.add(axes);
    // 视角飞跃
    vizbim.fly.flyTo(mainView);
    // changHomeBehavior();
    vizbim.listentoSelectObjs(function (componentId, component) {
      console.log("componentId:",componentId);
      // console.log("component",component);
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

// 更改监听的小房子点击事件
const changHomeBehavior = () =>{
  const uuid=vizbim.uuid;
  $('#home'+uuid).unbind("click");
  $('#home'+uuid).bind("click",()=>{
    vizbim.fly.flyTo(mainView)
    vizbim.resetScene(false,true,true,true,true,true,true);
  });
}

// 详情说明的显示的flag
let description = false;
let description2 = false;

// 显示title说明
const showDescription = () =>{
  if(!description){
    $(descriptionContainer).attr("style", "font-size:16px;margin-bottom: 0;left:270px;top:10px;background-color:white;position:absolute;width:280px");
  }else {
    $(descriptionContainer).css("display","none");
  }
  description = !description;
}

// 显示构件名称输入说明
const showDescription2 = () =>{
  if(!description2){
    $("#descriptionContainer2").attr("style", "font-size:16px;margin-bottom: 0;left:240px;top:160px;background-color:white;position:absolute;width:170px");
  }else {
    $("#descriptionContainer2").css("display","none");
  }
  description2 = !description2;
}

// 创建左侧搜索框
const addTileandSearchBoard =() =>{
  var toolBarZK=$("#viewport");
  const toolContainer = $(" <div id='container'></div>");
  toolBarZK.append(toolContainer);
  $(toolContainer).append("<div id='descriptionContainer' style='display:none'> </div>")
  $(toolContainer).append("<div id='descriptionContainer2' style='display:none'> </div>")
  $("#descriptionContainer").append("<p id ='title1'>" + "对当前模型构件进行筛选，可以只选填部分参数。当前接口更多细节，请前往API页查看 " + "</p>");
  $("#descriptionContainer2").append("<p id ='title2'>" + "请输入构件名称，进行模糊查找，例如:门、窗户等 " + "</p>");
  $(toolContainer).append("<p id ='title' style='font-size:30px;margin-bottom: 21px;margin-left: 40px;'> " +
    "构件查询示例 " +
    "<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()'></i>" +
    "</p>");
  const formContainer = $("<form id=\"formContainer\" class=\"layui-form\"></form>");
  $(toolContainer).append(formContainer);
  const formItem1= $("<div class=\"layui-form-item\">\n" +
    "<label class=\"layui-form-label\">楼层</label>\n" +
    "<div class=\"layui-input-block\">\n" +
    "<select name='louceng' lay-filter='louceng' id='louceng' lay-search >\n" +
    "<option value='disable' id='disable'>数据获取中</option>"+
    // "<option value=''>--</option>"+
    " </select>\n" +
    " </div>\n" +
    "  </div>");
  const formItem2= $("<div class=\"layui-form-item\">\n" +
    "<label class=\"layui-form-label\">构件类</label>\n" +
    "<div class=\"layui-input-block\">\n" +
    "<select name='goujianlei' lay-filter='goujianlei' id='goujianlei' lay-search  >\n" +
    "<option value='disable2' id='disable2'>数据获取中</option>"+
    "<option value=''>--</option>"+
    " </select>\n" +
    " </div>\n" +
    "  </div>");
  const formItem3 = $("  <div class=\"layui-form-item\">\n" +
    "    <label class=\"layui-form-label\">构件名称</label>\n" +
    "    <div class=\"layui-input-inline\" style='width: 110px;position:absolute'>\n" +
    "      <input type='text' name='gjname' autocomplete=\"off\" class=\"layui-input\">\n" +
    "    </div>\n" +
    "    <div class=\"layui-form-mid layui-word-aux\" style='left: 210px;position: absolute'>" +
    "       <i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription2()'></i>" +
    "     </div>\n" +
    "  </div>");
  const formItem4 = $("  <div class=\"layui-form-item\">\n" +
    "    <div class=\"layui-input-block\">\n" +
    "      <button class='lyButton' disabled lay-submit lay-filter='beginSearch'>开始搜索</button>\n" +
    "    </div>\n" +
    "  </div>");
  // $(toolBarZK).append("<form id='formContainer' class='layui-form'> </form>")
  $("#formContainer").append(formItem1);
  $("#formContainer").append(formItem2);
  $("#formContainer").append(formItem3);
  $("#formContainer").append(formItem4);
  // $(toolBarZK).append("<button disabled class='lyButton' id = 'button4' onclick='moveComponents(4);'>合并</button>")
  //     "       请输入构件名称,进行模糊查找,例如:门、窗户等" +

  layui.use('form', function(){
    form = layui.form;
    //监听提交
    form.on('submit(beginSearch)', function(data){
      // const msg = layer.msg(JSON.stringify(data.field));
      // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
      // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
      console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
      const info = data.field
      updateMoelBySearchResult(info.louceng,info.goujianlei,info.gjname);
      return false;
    });

    form.on('select(louceng)', function(data){
      // const msg = layer.msg(JSON.stringify(data.field));
      // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
      // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
      console.log("select(louceng):",data); //当前容器的全部表单字段，名值对形式：{name: value}
      // const info = data.field;
      updateComponentStyleByLevelId(data.value);
      // updateMoelBySearchResult(info.louceng,info.goujianlei,info.gjname);
      return false;
    });
  });
}

// 获取模型对于的空间树的楼层信息
const getModelLoactionTree = () =>{
  return fetch(`${op.baseaddress}models/${fileKey}/trees/location?devcode=${op.devcode}`)
    .then(response => response.json());
}

//更新form的楼层信息
const updateLoucengInformation = () =>{
  getModelLoactionTree().then((result)=>{
    $("#disable").remove();
    const dataArray = result[0].childrenResultList[0].childrenResultList[0].childrenResultList;
    if(dataArray && dataArray.length !== 0 ){
      dataArray.forEach(item=>{
        if(item.type === "IFCBUILDINGSTOREY" && item.children.length > 0){
          let obj ={};
          obj.name = item.name;
          obj.key = item.key;
          buildingLevel.push(obj);
        }
      });
    }
    if(buildingLevel.length!==0){
      buildingLevel.forEach((item1,index1)=>{
        getLevelCompnentTypes(item1.key).then(data=>{
          if(data.code === 200){
            if(data.data.length!==0){
              item1.componentTypes = data.data;
              // console.log("buildingLevel:",buildingLevel);
            }
          }
        });
      });
      $("#louceng").append("<option value=''>"+"--"+"</option>");
      buildingLevel.forEach((item,index)=>{
        $("#louceng").append("<option value="+item.key+">"+item.name+"</option>");
      });
      form.render('select');
    }else {
      $("#louceng").append("<option value=''>"+"该模型无楼层信息"+"</option>");
    }
      $(".lyButton").removeAttr("disabled");
  })
}


// 根据楼层id更新构建类的option
const updateComponentStyleByLevelId = (levelid) =>{
  console.log("updateComponentStyleByLevelId---levelid:",levelid);
  $("#goujianlei").children("option").remove();
  $("#goujianlei").append("<option value=''>--</option>");
  if(levelid !== ''){
    const upArray = buildingLevel.filter(item=>item.key === levelid)[0].componentTypes;
    const withoutUpcaseArray = filterAllCapsComponentTypes(upArray);
    withoutUpcaseArray.forEach(item=>{
      $("#goujianlei").append("<option value="+item+">"+item+"</option>")
    })
  }else {
    comTypeArray.forEach((item,index)=>{
      $("#goujianlei").append("<option value="+item+">"+item+"</option>");
    })
  }
  form.render('select');
}

// 更新form的构件类信息
const updateComponentStyle = () =>{
  getAllModelComponentTypes().then(data=>{
    comTypeArray = filterAllCapsComponentTypes(data.data);
    // console.log("comTypeArray:",comTypeArray);
    comTypeArray.forEach((item,index)=>{
      $("#goujianlei").append("<option value="+item+">"+item+"</option>");
    })
    $("#disable2").remove();
    form.render('select');
  })
   // = Object.keys(vizbim.getComponentTypeArray());
}

// 搜索后的操作
const updateMoelBySearchResult = (levelId,type,name) =>{
  getModelSearchComponents(levelId,type,name).then((result)=>{
    let comArray = [];
    if(result.code === 200 ){
      if(result.data.length!==0){
        console.log("搜索后返回result:",result);
        result.data.forEach(item=>{
          if(item.children===null){
            comArray.push(item.key);
          }else if(item.children && item.children.length !== 0){
            item.children.forEach(item1=>{
              comArray.push(item1);
            })
          }
        });
        if(comArray.length !==0){
          vizbim.resetScene(false,true,true,true,true,true,true);
          vizbim.reverseTransparentObjs(comArray,0.1,true);
          vizbim.fly.flyTo(mainView);
        }
      }else {
        vizbim.reverseTransparentObjs(comArray,0.1,true);
        layer.open({
          title: '提示'
          ,content: '当前条件下无对应构件，请重新选填查找条件'
        });
      }
    }else{
      vizbim.promptingMessage("error","错误码:"+result.code+",错误内容:"+result.message);
    }
  });
}

// 获取模型空间树结构
const getModelSearchComponents = (levelId,type,name) =>{
  return fetch(`${op.baseaddress}models/${fileKey}/components/!query?devcode=${op.devcode}&component=${levelId}&type=${type}&name=${name}`)
    .then(response => response.json());
}

// 获取当前模型下所有构件类型
const getAllModelComponentTypes = () =>{
  return fetch(`${op.baseaddress}models/${fileKey}/types?devcode=${op.devcode}`)
    .then(result=>result.json());
}

// 获取指定楼层下构件类别
const getLevelCompnentTypes = (componentId) =>{
  return fetch(`${op.baseaddress}models/${fileKey}/components/${componentId}/types?devcode=${op.devcode}`)
    .then(result=>result.json());
}

// 过滤出全部大写的字母
const filterAllCapsComponentTypes = (componentTypesArray) =>{
  if(componentTypesArray && componentTypesArray.length !== 0){
    return componentTypesArray.filter(item=>{
      if(typeof item === "string"){
       return hasLowerLetter(item);
      }
    });
  }
}

// 判断一个字符串是否有小写字母
const hasLowerLetter = (str) =>{
  for(let i =0;i<str.length;i++){
    if(str[i]>='a' && str[i]<='z' ){
      return true;
    }
  }
}
