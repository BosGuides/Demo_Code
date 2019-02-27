/**
 * @description:   太阳光影变化示例
 */


// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [21250.730456669953, 56558.733818670524, 38764.98889777429],   // 相机位置
  look: [-1368.19189453125, 269.634765625, 2550.011276245117],  // 相机焦点
  up: [0, 0, 1] // 相机正方向
}

let description = false; // 用户是否点击了问号说明框的标记

let directionalLight; // 声明一个平行光源的变量
// 初始化，主函数
function init() {
  const tool = new BIMWINNER.Tool(vizbim);  // 创建工具栏
  tool.createTool();   // 配置工具栏选项
  vizbim.resize(); // 模型画布自适应窗口大小
  vizbim.showModelByDocumentId(filekey, function () {
    setupInset();  // 创建帮助器
    addDescreption()  // 创建左侧帮助说明
    addLocationForm(); // 添加更新地点的展示框
    // 添加天空盒
    addBackgroundImage();
    // 添加指北针
    addPointNorth();
    // 视角飞跃
    vizbim.fly.flyTo(mainView);
    // 添加光源 平行光，屏幕炫光，模拟太阳光
    addDirectionalLight();
  });
}

//加载背景图片，创建天空盒
const addBackgroundImage = () => {
  const textureCube = window.textureCube = new THREE.CubeTextureLoader()
    .setPath('textures/skyboxfy/')
    .load(['negx.jpg', 'posx.jpg', 'posz.jpg', 'negz.jpg', 'posy.jpg', 'negy.jpg',]);   // fy的正确的盒子
  vizbim.scene.background = textureCube;  // 将背景天空盒设置成加载的图片
}

// 创建标题和问号的帮助说明
const addDescreption = () => {
  var toolBarZK = $("<div id='toolBarZK' style='position:absolute;z-index:1;display:flex;flex-direction:column;left:10px;top:10px;margin-left:10px' id='toolBarZK2' ></div>");
  toolBarZK.appendTo($("#container"));
  $(toolBarZK).append("<p id ='title' class='noport' style='font-size:30px;margin-bottom: 0'> " +
    "太阳光影变化示例 " +
    "<i style='font-size:20px;cursor:pointer;'class='far fa-question-circle' onmousedown='showDescription()' onmousemove=''></i>" +
    "</p>");
  $("#container").append("<div id='descriptionContainer' style='display:none'> </div>")
  $("#descriptionContainer").append("<p class ='descriptionp'> " +
    "<i style=\"margin-right:30px\"></i>模拟太阳光影在不同地理位置、日期、时间下的变化，展示建筑物接收太阳光线与产生阴影的真实效果。 " + "</p>");
  $("#descriptionContainer").append("<p class ='descriptionp'> " +
    "<i style=\"margin-right:30px\"></i>在省市选择框选择省市名称，点击更新地点(默认为北京市)；在日期选择框选择日期(默认为当天时间)；通过滑动时间轴来确定时间并模拟太阳光影的变化。 " + "</p>");
}

// 显示说明
const showDescription = () => {
  if (!description) {
    $("#descriptionContainer").attr("style", "position:absolute; top:15px; left:350px; background-color:white; width:400px; padding:10px")
  } else {
    $("#descriptionContainer").attr("style", "display:none;")
  }
  description = !description
}

//添加DirectionalLight，用来模拟太阳光
const addDirectionalLight = () => {
  vizbim.renderer.shadowMap.enabled = true;   // 将渲染器阴影渲染的属性打开
  // 添加一个水平角度转轴
  const pivotPoint2 = window.pivotPoint2 = new THREE.Object3D();
  vizbim.root.add(pivotPoint2);

  // 添加一个时间转轴 竖直转轴
  const pivotPoint = window.pivotPoint = new THREE.Object3D();
  pivotPoint2.add(pivotPoint);

  const pointColor = "#ffffff"; // 将点光源的颜色设置成白色
  directionalLight = new THREE.DirectionalLight(pointColor); // 平行光
  directionalLight.castShadow = true; // 将平行光产生阴影的属性打开

  //设置地面不产生阴影
  vizbim.components["BuildingAI_lightingEffect_0MCQCRssH0svCvV4FN424A"].receiveShadow = true;
  vizbim.components["BuildingAI_lightingEffect_0MCQCRssH0svCvV4FN424A"].castShadow = false;

  // 设置平行光源的产生阴影的范围参数
  directionalLight.shadow.camera.near = 0;
  directionalLight.shadow.camera.far = 50000;
  directionalLight.shadow.camera.left = -20000;
  directionalLight.shadow.camera.right = 20000;
  directionalLight.shadow.camera.top = 20000;
  directionalLight.shadow.camera.bottom = -20000;
  directionalLight.distance = 1110;
  directionalLight.intensity = 0.1;
  directionalLight.shadow.mapSize.height = 2560;
  directionalLight.shadow.mapSize.width = 2560;

  let sphereLight = new THREE.SphereGeometry(5, 32, 32);  // 创建一个球形mesh，用来存放点光源
  let sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
  let sphereLightMesh = window.sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = false;   //将这个球形mesh的产生阴影和接收阴影参数打开
  sphereLightMesh.receiveShadow = false; //将这个球形mesh的产生阴影和接收阴影参数打开
  sphereLightMesh.position.set(-25000, 0, 0); //  设置此球形mesh的位置

  pivotPoint.add(sphereLightMesh);  // 将球形mesh添加到点光源里
  pivotPoint.add(directionalLight); // 将平行光源添加到点光源里
  directionalLight.position.copy(sphereLightMesh.position);

  // 创建屏幕炫光，模拟太阳
  addFlensflare();
}

/**
 * @description:  添加一个屏幕炫光到场景，因为屏幕炫光不是实际的光源，只是一个效果，因此一般配合其他光源使用。
 *                一般用此屏幕炫光来模拟太阳光源，因此配合一个平行光源使用。
 *                一般使平行光产生阴影效果分为以下几步:
 *                1. 将渲染器的阴影设置打开，即 renderer.shadowMap.enabled = true;
 *                2. 将此光源的产生阴影的属性打开，即 spotLdirectionalLightight.castShadow = true;
 *                3. 调整此光源的光源阴影范围，一般要使产生阴影的物体的位置大于阴影相机的最小值，小于最大值
 *                4. 将需要产生阴影的物体的产生阴影的属性打开，即obj.castShadow = true;
 *                5. 将要接收阴影的属性打开，即obj.receiveShadow = true;

 */
const addFlensflare = () => {

  vizbim.renderer.gammaInput = true;
  vizbim.renderer.gammaOutput = true;

  // lensflares
  let textureLoader = new THREE.TextureLoader();

  let textureFlare0 = textureLoader.load('lensflare/lensflare0.png');
  let textureFlare3 = textureLoader.load('lensflare/lensflare3.png');

  addLight(0.55, 0.9, 0.5, -25000, 0, 0);
  addLight(0.995, 0.9, 0.5, -25000, 0, 0);

  function addLight(h, s, l, x, y, z) {

    let light = new THREE.PointLight(0xffffff, 1.5, 200, 10);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    pivotPoint.add(light);

    let lensflare = new THREE.Lensflare();
    lensflare.addElement(new THREE.LensflareElement(textureFlare0, 300, 0, light.color, THREE.AdditiveBlending));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.1, light.color, THREE.AdditiveBlending));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.12, light.color, THREE.AdditiveBlending));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.3, light.color, THREE.AdditiveBlending));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.4, light.color, THREE.AdditiveBlending));
    lensflare.position.set(x, y, z);
    light.add(lensflare);
    pivotPoint.add(light);

  }
}

let shadowPosition = {lng: 116.403849, lat: 39.915446}; // 地点信息  lat 纬度  lng 经度  默认天安门经纬度
const myDate = new Date();//获取系统当前时间
let shadowDate = myDate.Format("yyyy/MM/dd");
let shadowDays = 1;  // 距离年初的天数
let shadowTime = 6;
// shadowTime = parseInt(value.split("点")[0])+parseInt(value.split("点")[1].split("分")[0])/60;
let realSunhour = computeRealSunHour(shadowDate, shadowTime); // 真太阳时
let myGeo = new BMap.Geocoder();
// 将地址解析结果显示在地图上,并调整地图视野
/**
 * @description:  渲染监听layui表单
 * @params:
 * @params:
 * @return:
 * @example:

 */

let lastProvince = window.lastProvince = "北京市"; // 默认地点

// 监听用户对选择框的操作，如果用户点击了省市或者日期，弹出对应的选择项
const listenForm = () => {
  layui.use('laydate', function () {
    let laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
      elem: '#date' //指定元素
      , type: 'date'
      , format: 'yyyy/MM/dd'
      , done: function (value, date, endDate) {
        shadowDate = value;
        shadowDays = getDaysFromNowToByear(shadowDate) + 1;
        updateShaowBySunDegree(realSunhour);
      }
    });
  });

  layui.use('form', function () {
    let form = layui.form;
    //监听提交 更新地点按钮
    form.on('submit(*)', function (data) {
      $("#updateLocationButton").attr("disabled", "disabled");
      $("#updateLocationButton").addClass("layui-btn-disabled");
      if (lastProvince !== finalCityValue) {
        lastProvince = finalCityValue;
        myGeo.getPoint(finalCityValue, function (point) {
          console.log("finalCityValue-----", finalCityValue);
          if (point) {
            console.log("point:", point)
            shadowPosition = point;
            layer.msg("更新成功!");
            updateShaowBySunDegree(realSunhour);
            // sliderControl.setValue(720);
          } else {
            layer.msg("您选择地址没有解析到结果!");
          }
        });
      }
      return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
  });

  let sliderControl;
  layui.use('slider', function () {
    let slider = layui.slider;
    //渲染
    sliderControl = slider.render({
      elem: '#slideTest1'  //绑定元素
      , max: 24 * 60
      , showstep: true
      , step: 1
      , setTips: function (value) { //自定义提示文本
        return parseInt(value / 60) + '点' + value % 60 + "分";
      }
      , change: function (value) {
        shadowTime = parseInt(value.split("点")[0]) + parseInt(value.split("点")[1].split("分")[0]) / 60;
        realSunhour = computeRealSunHour(shadowDate, shadowTime); // 真太阳时
        updateShaowBySunDegree(realSunhour);
      }
    });
    sliderControl.setValue(720);
  });

  $("#city").click(function (e) {
    SelCity(this, e);
  });
  $("s").click(function (e) {
    SelCity(document.getElementById("city"), e);
  });

}

/**
 * @description:  根据地点纬度，时间来算出太阳高度角和方位角
 * @params:
 * @params:
 * @return:
 * @example:

 */
const updateShaowBySunDegree = (realSunhour) => {
  const sunHourangle = computeSunHourangle(realSunhour);  // 太阳时角
  const sunDeclination = computeSunDeclination(shadowDays);  // 太阳赤纬
  const solarAltitude = computeSolarAltitude(shadowPosition.lat, sunDeclination, sunHourangle, realSunhour);  // 太阳高度角， 弧度
  const solarAzimuth = computeSolarAzimuth(shadowPosition.lat, sunDeclination, solarAltitude, realSunhour); // 太阳方位角 弧度
  vizbim.lights.children[0].intensity = solarAltitude * 6 / Math.PI;
  // 如果太阳高度角为负数则关闭阴影效果
  if (solarAltitude < 0) {
    directionalLight.castShadow = false;  // 平行光
    pivotPoint.children[2].children[0].material.visible = false;  // 屏幕炫光
    pivotPoint.children[3].children[0].material.visible = false;
    vizbim.lights.children[0].intensity = 0
  } else {
    directionalLight.castShadow = true;
    pivotPoint.children[2].children[0].material.visible = true;
    pivotPoint.children[3].children[0].material.visible = true;
  }
  pivotPoint.rotation.y = solarAltitude;  // 太阳高度角
  pivotPoint2.rotation.z = -solarAzimuth + Math.PI / 2;   // 太阳方位角 弧度
  vizbim.renderer.shadowMap.needsUpdate = true;
  vizbim.renderer.render(vizbim.scene, vizbim.camera);
}


/**
 * @description:  添加地点日期时间选择表单

 */
const addLocationForm = () => {
  const $form = $("<div class='layui-form-item'>" +
    "<label class='layui-form-label noport' >省市</label>" +
    "<div class='layui-input-block' style='display: flex'>" +
    "<div ><input class='layui-input'  id='city' type='text' placeholder='北京市' autocomplete='off' readonly='true'/></div>" +
    "<button id='updateLocationButton' class='layui-btn layui-btn-disabled' disabled lay-submit lay-filter='*' style='margin-left: 10px'>更新地点</button>\n" +
    "</div>" +
    "</div>" +
    "<div class='layui-form-item'>" +
    "<label class='layui-form-label noport'>日期</label>" +
    "<div class='layui-inline layui-form-item' >" +
    "<input type='text' class='layui-input'  id='date' autocomplete='off' placeholder=" + shadowDate + ">" +
    "</div>" +
    "</div>" +
    "<div class='layui-form-item'>" +
    "<label class='layui-form-label noport'>时间</label>" +
    "<div class='layui-input-block'>" +
    "<div id='slideTest1' lay-submit></div>" +
    "</div>" +
    "</div>"
  )

  $("#myForm").append($form);  // 将创建好的表单添加进网页

  listenForm();  // 监听laui表单
}

// 添加指南针
const addPointNorth = () => {
  let textureLoader = new THREE.TextureLoader();
  let zhinanzhen = textureLoader.load('textures/zhinanzhen2.jpg',
    function (texture) {
      let geometry = new THREE.PlaneGeometry(200, 200, 32);
      let material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: texture
      });
      let plane = new THREE.Mesh(geometry, material);
      plane.rotation.z = Math.PI;
      plane.position.set(0, 0, 0);
      scene2.add(plane);
    });
}

let camera2;  // 定义指南针的相机
let renderer2; // 定义指南针的渲染器

// 创建一个容纳指南针的canvas
const setupInset = () => {
  const insetWidth = 150,
    insetHeight = 150;
  const container2 = document.getElementById('inset');
  container2.width = insetWidth;
  container2.height = insetHeight;

  // 实例化指南针的渲染器
  renderer2 = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer2.setClearColor(0x000000, 0);
  renderer2.setSize(insetWidth, insetHeight);
  container2.appendChild(renderer2.domElement);

  // scene,创建指南针的场景
  const scene2 = window.scene2 = new THREE.Scene();

  // camera,创建指南针的相机
  camera2 = new THREE.PerspectiveCamera(50, insetWidth / insetHeight, 1, 1000000);
  camera2.up = vizbim.camera.up; // important!

  animateScene2();  // 将指南针与主场景同步操作
}

// 指南针同步
const animateScene2 = () => {
  requestAnimationFrame(animateScene2);
  // 将主场景的相机的位置同步进指南针的场景
  camera2.position.copy(vizbim.camera.position);
  camera2.position.sub(vizbim.cameraControl.target);
  camera2.position.setLength(300);
  camera2.lookAt(scene2.position);
  renderer2.render(scene2, camera2);
}

