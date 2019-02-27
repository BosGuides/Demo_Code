/**
 * @description:   室内灯光管控
 *
 */


// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [53754.16922126576, -205328.8628039831, 28707.484219371774],
  look: [60928.89189313368, -187922.08006115214, -2252.8623185414663],
  up: [0, 0, 1]
}

// 模型里灯的存储数据
const state = {
  // 工作区筒灯
  workAreaDownlight: {
    switchFlag: false,
    components: workAreaDownlight,
    name: '工作区筒灯',
    id: 'workAreaDownlight'
  },
  // 工作区盏灯
  workAreaXenonLamp: {
    switchFlag: false,
    components: workAreaXenonLamp,
    name: '工作区盏灯',
    id: 'workAreaXenonLamp'
  },
  // 走廊灯
  corridorLight: {
    switchFlag: false,
    components: corridorLight,
    name: '走廊灯',
    id: 'corridorLight'
  },
  // 会客灯
  visitorLight: {
    switchFlag: false,
    components: visitorLight,
    name: '会客灯',
    id: 'visitorLight'
  },
  // 大会议室
  largeConferenceRroomLight: {
    switchFlag: false,
    components: largeConferenceRroomLight,
    name: '大会议室',
    id: 'largeConferenceRroomLight'
  },
  // 小会议室
  smallMeetingRoomLight: {
    switchFlag: false,
    components: smallMeetingRoomLight,
    name: '小会议室',
    id: 'smallMeetingRoomLight'
  }
}

// 主函数
const init = () => {
  vizbim.showModelByDocumentId(filekey, function () {
    vizbim.fly.flyTo(mainView);  // 加载完模型飞跃到主视角
    vizbim.lights.children[0].visible = false;  // 模型默认的spotlight不可见， 为了更好的灯光展示
    changeModelMaterial(); // 更改构件材质，以对光源做出更好的反应
    addLights(); // 添加场景里的所有光源
    addButtons(); // 创建左侧控制面板
    addRestorButton(); // 创建复位按钮
  });
  vizbim.resize();  // 模型自适应窗口大小
  vizbim.setSceneBackGroundColor([10/255,10/255,49/255]);  // 将场景背景色调暗，以获得更好的光照效果
}

// 更改模型材质
const changeModelMaterial = () => {
  // 获取模型里这三类构件的id,修改他们的材质以使得这些构件能够对光源做出更好的反应
  const ifcplateArray = vizbim.queryObjectIdByType('IfcPlate');
  const ifcWallStandardCase = vizbim.queryObjectIdByType('IfcWallStandardCase');
  const ifcSlab = vizbim.queryObjectIdByType('IfcSlab');

  // 合并数组
  const materialArray = ifcplateArray
    .concat(ifcWallStandardCase)
    .concat(ifcSlab);

  // 修改数组材质，这里改为了标准材质
  materialArray.forEach(item => {
    const matStdObjects = new THREE.MeshStandardMaterial({
      color: 0xA00000,
      roughness: 0,
      metalness: 0
    });
    vizbim.components[item].material = matStdObjects;
  });
  vizbim.restoreObjtColor(vizbim.alloids);
}

// 创建光源
const addLights = () => {

  // 创建spotlight
  createSpotLight(spotLight,0xF5DEB3);  // 为筒灯添加暖黄色光源
  createSpotLight(pointLightArray,0xFFFFFF); // 为走廊灯添加暖白色光源

  // 创建RectAreaLight
  createRectLight(reactLightArray);  // 为盏灯添加矩形光源
}

// 创建spotlight
const createSpotLight = (spotLight,color) =>{
  spotLight.forEach(item => {
    /**
     * @description: spotlight的构造函数
     * @params: color { Integer } 光源的16进制颜色，默认是白色
     * @params: intensity { Float } 光源的强度或者亮度，默认是1

     */
    if(vizbim.components[item]) {
      const spotLight = new THREE.SpotLight(color, 1);
      // 创建一个Object3D， 将位置设置在次筒灯的下面4000的位置，作为此spotlight的target
      const spotTarget = new THREE.Object3D(); //  创建一个three对象，用作光源的target
      spotTarget.position.copy(vizbim.components[item].position);
      spotTarget.position.z -= 4000;  // 将这个target物体的位置设置为该灯的位置的下方
      vizbim.scene.add(spotTarget);

      spotLight.angle = Math.PI / 10; // 设置spotlight的角度
      spotLight.intensity = 3;  // 设置spotlight的强度
      spotLight.penumbra = 0.05; // 设置spotlight由于半影而衰减的聚光锥的百分比,值在0与1之间
      spotLight.decay = 2;  // 设置光线沿光线距离变暗的量，设置成2有很好的屋里效果
      spotLight.distance = 5000; // 光线的最大范围
      spotLight.target = spotTarget; // 设置spotlight的聚光灯的焦点
      spotLight.visible = false;
      vizbim.components[item].add(spotLight); // 将此聚光灯添加到该筒灯的场景下
    }
  });
}

// 创建RectAreaLight
const createRectLight = (reactLightArray) =>{
  reactLightArray.forEach(item => {
    /**
     * @description: 创建RectAreaLight的构造函数
     * @params: color { Integer } 光源的16进制颜色，默认是白色
     * @params: intensity { Float } 光源的强度或者亮度，默认是1
     * @params: width { Float } 光源的宽度，默认是10
     * @params: height { Float } 光源的高度，默认是10

     */
    if(vizbim.components[item]){
      const rectLight = new THREE.RectAreaLight(0xffffff, 10, 1100, 540);
      rectLight.position.set(0, 0, -58);
      rectLight.intensity = 20;
      rectLight.visible = false;

      // 创建一个长方形mesh，添加到光源里，这样就可以看到光源
      const rectLightMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1, 1, 1, 1),
        new THREE.MeshBasicMaterial({
          side: THREE.BackSide
        })
      );
      // 将此mesh的宽高设置成与光源的宽高一样
      rectLightMesh.scale.x = rectLight.width;
      rectLightMesh.scale.y = rectLight.height;
      rectLight.add(rectLightMesh);
      // 将光源添加到此构件下，这样在世界坐标系下，此构件的的位置就和此光源的位置一样
      vizbim.components[item].add(rectLight);
    }
  });
}

// 开启/关闭走廊灯
const turnOnAndOffTheLight = (light,onOff) => {
  const lightArray = state[light].components;
  const id = state[light].id;
  const iconId = "icon" + id;
  if (lightArray && lightArray.length > 0) {
    if (onOff) {
      $("#" + light).removeClass("layui-btn-primary");
      $("#" + iconId).removeClass("lightoff");
      $("#" + iconId).addClass("lighton");
      vizbim.setObjtColor(lightArray,[0,1,0]);
      // vizbim.adaptiveSize(lightArray);
    } else {
      $("#" + iconId).removeClass("lighton");
      $("#" + iconId).addClass("lightoff");
      $("#" + light).addClass("layui-btn-primary");
    }
    lightArray.forEach(item => {
      const lightIdArray = vizbim.components[item].children;
      if (lightIdArray && lightIdArray.length > 0) {
        lightIdArray.forEach(item=>{
          item.visible = onOff;
        });
      }
    });
    state[light].switchFlag = onOff;
  }
}

let lastSwitch; // 定义上次点击的按钮

// 创建左侧按钮操控区，调整样式
const addButtons = () => {
  const $outDiv = $("<div id='container' ></div>");
  $("body").append($outDiv);
  let $divContainer;
  $("#container").append("<p class='title'>控制面板</p>");
  Object.keys(state).forEach((item, index) => {
    const id = state[item].id;
    const iconId = "icon" + id;
    const name = state[item].name;
    const $div = $(
      "<div >" +
      "<div class='iconContainer'>" +
      "<i id=" + iconId +
      " class='icon lightoff'></i>" +
      "</div>" +
      "<button id=" + id + " class='layui-btn layui-btn-primary'>" + name + "</button>" +
      "</div>"
    );
    if ((index + 1) % 2 === 0) {
      $divContainer.append($div);
      $("#container").append($divContainer);
    } else {
      $divContainer = $("<div class='itemContainer'></div>");
      $divContainer.append($div);
    }
  });
  // 监听按钮点击事件
  Object.keys(state).forEach((item, index) => {
    const id = state[item].id;
    $("#" + id).click(
      () => {
        vizbim.restoreObjtColor(vizbim.alloids);
        if(lastSwitch && lastSwitch !== id){
          turnOnAndOffTheLight(lastSwitch,false);
          turnOnAndOffTheLight(id,true);
        }else {
          state[id].switchFlag = !state[id].switchFlag;
          turnOnAndOffTheLight(id,state[id].switchFlag);
        }
        lastSwitch =  id;
      }
    );
  });
}

// 将所有开关和灯复原
const restoreAllButton = () =>{
  vizbim.restoreObjtColor(vizbim.alloids);
  Object.keys(state).forEach((item, index) => {
    state[item].switchFlag = false;
    const id = state[item].id;
    turnOnAndOffTheLight(id,false);
  });
}

// 创建复位按钮,目的是点击按钮的时候将模型回复到初始状态
const addRestorButton = () => {
  const toolId = vizbim.uuid;
  const toolbar = $('<div style="margin-left:0" class="yj-tool" id="my-tool' + toolId + '" ></div>');
  toolbar.appendTo($("#" + vizbim.viewport));
  //group1
  const group1 = $('<div class="yj-group" style="background:rgba(128,128,128,0.8)"></div>');
  group1.appendTo(toolbar);
  const $toolHome = $('<button type="button" class="yj-but" title="初始化" id="home' + toolId + '"><div class="yj-icon home-icon" ></div></button>');
  $toolHome.appendTo(group1);
  $toolHome.click(() => {
    vizbim.resetScene(true,true,true,true,true,true,true);
    restoreAllButton();
    vizbim.fly.flyTo(mainView);
  });
}