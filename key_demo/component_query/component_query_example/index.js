/**
 * @description:   构件查询示例
 */


// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [21245.993288067424, -37490.34493828655, 12237.074569820481],   // 相机位置
  look: [3359.1114442261874, -9330.315606417287, -839.7087337979011],  // 相机焦点
  up: [0, 0, 1],                                                       // 相机正方向
}

// 空间树接口拿到的
let buildingLevel = [];
// layui的form
let form = layui.form;

//构件所有的类别数组
let comTypeArray = [];
// 初始化，主函数
const init = (fileKey) => {
  // 创建工具栏
  let tool = new BIMWINNER.Tool(vizbim);
  tool.createTool();
  addTileandSearchBoard(fileKey);    //  创建左侧的搜索区域
  updateLoucengInformation(fileKey); //  根据[数据接口:获取模型对于的空间树的楼层信息]更新楼层选项的值
  updateComponentStyle(fileKey);     //  根据选择的楼层信息更新构件类的值
  vizbim.showModelByDocumentId(fileKey, function () {
    vizbim.fly.flyTo(mainView);     // 模型加载完成后飞跃到事先调整好视角
  });
  vizbim.resize();                  // 模型画布自适应窗口大小
}

// 控制详情说明的显示的flag
let description = false;
let description2 = false;

// 显示title说明
const showDescription = () => {
  if (!description) {
    $(descriptionContainer).attr("style", "font-size:16px;margin-bottom: 0;left:270px;top:10px;background-color:white;position:absolute;width:150px");
  } else {
    $(descriptionContainer).css("display", "none");
  }
  description = !description;
}

// 显示构件名称输入说明
const showDescription2 = () => {
  if (!description2) {
    $("#descriptionContainer2").attr("style", "font-size:16px;margin-bottom: 0;left:240px;top:160px;background-color:white;position:absolute;width:170px");
  } else {
    $("#descriptionContainer2").css("display", "none");
  }
  description2 = !description2;
}

// 创建左侧搜索框
const addTileandSearchBoard = (fileKey) => {
  var toolBarZK = $("#viewport");
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
  const formContainer = $("<form id='formContainer' class='layui-form'></form>");
  $(toolContainer).append(formContainer);
  const formItem1 = $("<div class='layui-form-item'>" +
    "<label class='layui-form-label'>楼层</label>" +
    "<div class='layui-input-block'>" +
    "<select name='louceng' lay-filter='louceng' id='louceng' lay-search >" +
    "<option value='disable' id='disable'>数据获取中</option>" +
    " </select>" +
    " </div>" +
    "  </div>");
  const formItem2 = $("<div class='layui-form-item'>" +
    "<label class='layui-form-label'>构件类</label>" +
    "<div class='layui-input-block'>" +
    "<select name='goujianlei' lay-filter='goujianlei' id='goujianlei' lay-search  >" +
    "<option value='disable2' id='disable2'>数据获取中</option>" +
    "<option value=''>--</option>" +
    " </select>" +
    " </div>" +
    "  </div>");
  const formItem3 = $("  <div class='layui-form-item'>" +
    "    <label class='layui-form-label'>构件名称</label>" +
    "    <div class='layui-input-inline' style='width: 110px;position:absolute'>" +
    "      <input type='text' name='gjname' autocomplete='off' class='layui-input'>" +
    "    </div>" +
    "    <div class='layui-form-mid layui-word-aux' style='left: 210px;position: absolute'>" +
    "       <i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription2()'></i>" +
    "     </div>" +
    "  </div>");
  const formItem4 = $("  <div class='layui-form-item'>" +
    "    <div class='layui-input-block'>" +
    "      <button id='searchButton' class='lyButton' disabled lay-submit lay-filter='beginSearch'>开始搜索</button>" +
    "    </div>" +
    "  </div>");

  $("#formContainer").append(formItem1);
  $("#formContainer").append(formItem2);
  $("#formContainer").append(formItem3);
  $("#formContainer").append(formItem4);

  layui.use('form', function () {
    form = layui.form;
    //监听提交
    form.on('submit(beginSearch)', function (data) {
      const info = data.field;
      updateMoelBySearchResult(fileKey, info.louceng, info.goujianlei, info.gjname);
      return false;   // 阻止表单跳转
    });

    form.on('select(louceng)', function (data) {
      updateComponentStyleByLevelId(data.value);
      return false; // 阻止表单跳转
    });
  });
}

//更新form的楼层信息
const updateLoucengInformation = (fileKey) => {
  // 利用[数据接口:获取模型对于的空间树的楼层信息] 将返回的数据更新表单的楼层信息
  getModelLoactionTree(fileKey).then((result) => {
    $("#disable").remove();
    const dataArray = result[0].childrenResultList[0].childrenResultList[0].childrenResultList;
    if (dataArray && dataArray.length !== 0) {
      dataArray.forEach(item => {
        if (item.type === "IFCBUILDINGSTOREY" && item.children.length > 0) {
          let obj = {};
          obj.name = item.name;
          obj.key = item.key;
          buildingLevel.push(obj);
        }
      });
    }
    if (buildingLevel.length !== 0) {
      buildingLevel.forEach((item1, index1) => {
        getLevelCompnentTypes(fileKey, item1.key).then(data => {
          if (data.code === 200) {
            if (data.data.length !== 0) {
              item1.componentTypes = data.data;
            }
          }
        });
      });
      $("#louceng").append("<option value=''>" + "--" + "</option>");
      buildingLevel.forEach((item, index) => {
        $("#louceng").append("<option value=" + item.key + ">" + item.name + "</option>");
      });
      if (form) form.render('select');
    } else {
      $("#louceng").append("<option value=''>" + "该模型无楼层信息" + "</option>");
    }
    $(".lyButton").removeAttr("disabled");
  })
}


// 根据楼层id更新构建类的option
const updateComponentStyleByLevelId = (levelid) => {
  $("#goujianlei").children("option").remove();
  $("#goujianlei").append("<option value=''>--</option>");
  if (levelid !== '') {
    const upArray = buildingLevel.filter(item => item.key === levelid)[0].componentTypes;
    const withoutUpcaseArray = filterAllCapsComponentTypes(upArray);
    withoutUpcaseArray.forEach(item => {
      $("#goujianlei").append("<option value=" + item + ">" + item + "</option>")
    })
  } else {
    comTypeArray.forEach((item, index) => {
      $("#goujianlei").append("<option value=" + item + ">" + item + "</option>");
    })
  }
  if (form) form.render('select');
}

// 更新form的构件类信息
const updateComponentStyle = (fileKey) => {
  getAllModelComponentTypes(fileKey).then(data => {
    comTypeArray = filterAllCapsComponentTypes(data.data);
    comTypeArray.forEach((item, index) => {
      $("#goujianlei").append("<option value=" + item + ">" + item + "</option>");
    })
    $("#disable2").remove();
    if (form) form.render('select');
  })
}

// 用户点击搜索后的操作，将用户选择的楼层和构件类还有构件名称利用[数据接口:获取模型空间树结构]返回的构件id
// 将这些构件反选透明
const updateMoelBySearchResult = (fileKey, levelId, type, name) => {
  $("#searchButton").prepend("<i id='searchingIcon' class='layui-icon layui-icon-loading-1 layui-icon layui-anim layui-anim-rotate layui-anim-loop'></i>");
  $("#searchButton").attr("disabled", 'disabled');
  getModelSearchComponents(fileKey, levelId, type, name).then((result) => {
    let comArray = [];
    if (result.code === 200) {
      $("#searchingIcon").remove();
      $("#searchButton").removeAttr("disabled");
      if (result.data.length !== 0) {
        result.data.forEach(item => {
          if (item.children === null) {
            comArray.push(item.key);
          } else if (item.children && item.children.length !== 0) {
            item.children.forEach(item1 => {
              comArray.push(item1);
            })
          }
        });
        if (comArray.length !== 0) {
          vizbim.resetScene(false, true, true, true, true, true, true);
          vizbim.reverseTransparentObjs(comArray, 0.1, true);
          vizbim.fly.flyTo(mainView);
        }
      } else {
        vizbim.reverseTransparentObjs(comArray, 0.1, true);
        layer.open({
          title: '提示'
          , content: '当前条件下无对应构件，请重新选填查找条件'
        });
      }
    } else {
      vizbim.promptingMessage("error", "错误码:" + result.code + ",错误内容:" + result.message);
    }
  });
}

// 数据接口:获取模型对于的空间树的楼层信息
const getModelLoactionTree = (fileKey) => {
  return fetch(`${op.baseaddress}models/${fileKey}/trees/location?devcode=${op.devcode}`)
    .then(response => response.json());
}

// 数据接口:获取模型空间树结构
const getModelSearchComponents = (fileKey, levelId, type, name) => {
  return fetch(`${op.baseaddress}models/${fileKey}/components/!query?devcode=${op.devcode}&component=${levelId}&type=${type}&name=${name}`)
    .then(response => response.json());
}

// 数据接口:获取当前模型下所有构件类型
const getAllModelComponentTypes = (fileKey) => {
  return fetch(`${op.baseaddress}models/${fileKey}/types?devcode=${op.devcode}`)
    .then(result => result.json());
}

// 数据接口:获取指定楼层下构件类别
const getLevelCompnentTypes = (fileKey, componentId) => {
  return fetch(`${op.baseaddress}models/${fileKey}/components/${componentId}/types?devcode=${op.devcode}`)
    .then(result => result.json());
}

// 过滤出全部大写的字母，将返回的构件类别的结果里全部是大写的类别过滤掉
const filterAllCapsComponentTypes = (componentTypesArray) => {
  if (componentTypesArray && componentTypesArray.length !== 0) {
    return componentTypesArray.filter(item => {
      if (typeof item === "string") {
        return hasLowerLetter(item);
      }
    });
  }
}

// 判断一个字符串是否有小写字母，供filterAllCapsComponentTypes使用
const hasLowerLetter = (str) => {
  for (let i = 0; i < str.length; i++) {
    if (str[i] >= 'a' && str[i] <= 'z') {
      return true;
    }
  }
}