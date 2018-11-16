const op = {
  viewport:"viewport",
  devcode:"e10e59bf0ee97213ca7104977877bd1a",  // admin账号
  baseaddress:'https://api.bos.xyz/',
  viewController:false
};

const filekey = "26886809"; //admin账号 小卖部
const vizbim = new BIMWINNER.Viewer(op);
// 模型主视角
const mainView = {
  eye:[21250.730456669953,56558.733818670524,38764.98889777429],
  look:[-1368.19189453125,269.634765625,2550.011276245117],
  up:[0,0,1],
  zoom:1
}

// 初始化，主函数
function init() {
  // const tool = new BIMWINNER.Tool(vizbim);
  // tool.createTool({
  //   modelapi:true,
  // });
  // hideBarAndTool();
  vizbim.autoResize = true;
  vizbim.resize();

  vizbim.showModelByDocumentId(filekey, function () {
    setupInset();  // 创建帮助器
    addDescreption()  // 创建左侧帮助说明
    addLocationForm();
    // 添加天空盒
    addBackgroundImage();
    // 添加指北针
    addPointNorth();
    // 视角飞跃
    vizbim.fly.flyTo(mainView);
    // 更改小房子点击事件
    // changHomeBehavior();
    vizbim.listentoSelectObjs(function (componentId, component) {
      console.log("componentId:", componentId);
      // console.log("component",component);
    });
    // 添加光源 平行光，屏幕炫光
    addDirectionalLight();
  });
}

//加载背景图片
const addBackgroundImage = () =>{
  const textureCube = window.textureCube = new THREE.CubeTextureLoader()
    .setPath( 'textures/skyboxfy/')
    .load( [  'negx.jpg', 'posx.jpg', 'posz.jpg', 'negz.jpg','posy.jpg',  'negy.jpg',] );   // fy的正确的盒子
    vizbim.scene.background = textureCube;
}

// 创建左侧按钮
const addDescreption =() =>{
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

let description = false;

// 显示说明
const showDescription = () =>{
  if(!description){
    $("#descriptionContainer").attr("style","position:absolute; top:15px; left:350px; background-color:white; width:400px; padding:10px")
  }else {
    $("#descriptionContainer").attr("style","display:none;")
  }
  description = !description
}

let directionalLight;

//添加DirectionalLight
const addDirectionalLight = () =>{
  vizbim.renderer.shadowMap.enabled = true;
  vizbim.renderer.shadowMap.autoUpdate = false;
  vizbim.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // 添加一个水平角度转轴
  const pivotPoint2 =window.pivotPoint2 =new THREE.Object3D();
  vizbim.root.add(pivotPoint2);

  // 添加一个时间转轴 竖直转轴
  const pivotPoint =window.pivotPoint =new THREE.Object3D();
  pivotPoint2.add(pivotPoint);

  const pointColor = "#ffffff";
  directionalLight = new THREE.DirectionalLight(pointColor); // 平行光
  directionalLight.castShadow = true;

  //设置地面不产生阴影
  vizbim.components["26886809_0MCQCRssH0svCvV4FN424A"].receiveShadow = true;
  vizbim.components["26886809_0MCQCRssH0svCvV4FN424A"].castShadow = false;

  // 迪斯尼小卖部
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

  let sphereLight = new THREE.SphereGeometry(5,32,32);  // 迪思泥小卖部
  let sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
  let sphereLightMesh = window.sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = false;
  sphereLightMesh.receiveShadow = false;
  sphereLightMesh.position.set(-25000, 0, 0); //  小房子

  pivotPoint.add(sphereLightMesh);
  pivotPoint.add(directionalLight);
  directionalLight.position.copy(sphereLightMesh.position);

  // 添加模拟太阳
  addFlensflare();

  vizbim.renderer.shadowMap.needsUpdate = true;
  vizbim.renderer.render(vizbim.scene,vizbim.camera);
}

// 添加屏幕炫光，模拟太阳
const addFlensflare = () =>{

  vizbim.renderer.gammaInput = true;
  vizbim.renderer.gammaOutput = true;

  // lensflares
  let textureLoader = new THREE.TextureLoader();

  let textureFlare0 = textureLoader.load( 'lensflare/lensflare0.png' );
  let textureFlare3 = textureLoader.load( 'lensflare/lensflare3.png' );

  addLight( 0.55, 0.9, 0.5, -25000, 0, 0 );
  addLight( 0.995, 0.9, 0.5, -25000, 0, 0 );

  function addLight( h, s, l, x, y, z ) {

    let light = new THREE.PointLight( 0xffffff, 1.5, 200, 10 );
    light.color.setHSL( h, s, l );
    light.position.set( x, y, z );
    pivotPoint.add( light );

    let lensflare = new THREE.Lensflare();
    lensflare.addElement( new THREE.LensflareElement( textureFlare0, 300, 0, light.color,THREE.AdditiveBlending ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 60, 0.1, light.color,THREE.AdditiveBlending ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 0.12, light.color,THREE.AdditiveBlending ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 120, 0.3, light.color,THREE.AdditiveBlending ) );
    lensflare.addElement( new THREE.LensflareElement( textureFlare3, 60, 0.4, light.color,THREE.AdditiveBlending ) );
    lensflare.position.set( x, y, z );
    light.add( lensflare );
    pivotPoint.add( light );

  }
}

let sinSundegree;
/**
 * @description: 计算太阳赤纬公式
 * @params:  { n } : number , 每年从1月1日起，距离计算日的天数
 * @return:  太阳赤维 角度
 * @example:

 */
const computeSunDeclination = (n) =>{
  // 公式2
  sinSundegree = 0.39795 * Math.cos(0.98563 * (n -173)/180 * Math.PI);
  const sundegree = Math.asin(sinSundegree);
  return sundegree;
}


/**
 * @description:  计算太阳时角
 * @params:  { realSunHour } : number 真太阳时
 * @params:  太阳时角(degree)
 * @return:
 * @example:

 */
const computeSunHourangle = (realSunHour) =>{
  return (realSunHour - 12) * 15
}

/**
 * @description: 计算真太阳时
 * @params:  { sunHour } 平太阳时，日常时间  "13.45"
 * @params:  { date } 平太阳时，日常时间  "2018/10/29"
 * @return:
 * @example:

 */
const computeRealSunHour = (date,sunHour) =>{
  const dateStringArray = date.split("/");
  const dateString = dateStringArray[1] + "月" + dateStringArray[2] + "日";
  const timeDifference = window.sunRealHour.filter(item=>item.name === dateString)[0].value;
  const symbol = timeDifference.substr(0,1);
  const fen = timeDifference.substr(1,2);
  let miao;
  if(fen.length === 7){
    miao = timeDifference.substr(4,2);
  }else {
    miao = timeDifference.substr(4,1);
  }

  let fenmiao = parseInt(fen) + parseInt(miao)/60;
  let shifenmiao = null;

  if(symbol === "+"){
     shifenmiao = sunHour + fenmiao/60;
  }else{
    shifenmiao = sunHour - fenmiao/60;
  }
  return shifenmiao;
}


/**
 * @description:  太阳高度角计算公式
 * @params: { dimension } : number  地理纬度  角度
 * @params: { sunDeclination } : number 太阳赤纬  角度
 * @params: { t } : 太阳时角  角度
 * @return: 太阳高度角

 */
const computeSolarAltitude = (dimension,sunDeclination,t) =>{
  const hdT = t * (Math.PI/180);  // 角度转弧度
  const hdSunDeclination = sunDeclination;  // 角度转弧度 太阳赤纬
  const hdDimension = dimension * (Math.PI/180);  // 角度转弧度
  const sinSolarAltitude = Math.sin(hdDimension) * Math.sin(hdSunDeclination)
                          + Math.cos(hdDimension) * Math.cos(hdSunDeclination) * Math.cos(hdT);
  const solarAltitude =  Math.asin(sinSolarAltitude);  // 输出太阳高度角的弧度角度
  // const jdSolarAltitude = (180/Math.PI)*solarAltitude; // 转换成角度
  return solarAltitude;
}

/**
 * @description:  太阳方位角计算公式
 * @params: { dimension } : number  地理纬度
 * @params: { sunDeclination } : number 太阳赤纬
 * @params: { h }         : number  太阳高度角
 * @return:
 * @example:

 */
const computeSolarAzimuth = (dimension,sunDeclination,h,realSunhour) =>{
  const hdSunDeclination = sunDeclination;  // 角度转弧度  太阳赤纬
  const hdDimension = dimension * (Math.PI/180);  // 角度转弧度  纬度
  const solarAzimuth = ( -Math.sin(h) * Math.sin(hdDimension) + Math.sin(hdSunDeclination))/(Math.cos(h)*Math.cos(hdDimension))
  let solarAltitude
  if(realSunhour<12){
     solarAltitude = Math.acos(solarAzimuth); // 太阳方位角的弧度角度
  }else {
    solarAltitude = 2*Math.PI - Math.acos(solarAzimuth); // 太阳方位角的弧度角度
  }
  // const jdSolarAltitude = (180/Math.PI)*solarAltitude; // 转换成角度
  return solarAltitude;
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
let shadowPosition = {lng: 116.403849, lat: 39.915446}; // 地点信息  lat 纬度  lng 经度  默认天安门经纬度
const myDate = new Date();//获取系统当前时间
let shadowDate = myDate.Format("yyyy/MM/dd");
let shadowDays = 1;  // 距离年初的天数
let shadowTime = 6;
// shadowTime = parseInt(value.split("点")[0])+parseInt(value.split("点")[1].split("分")[0])/60;
let realSunhour = computeRealSunHour(shadowDate,shadowTime); // 真太阳时
let myGeo = new BMap.Geocoder();
// 将地址解析结果显示在地图上,并调整地图视野
/**
 * @description:  渲染监听laui表单
 * @params:
 * @params:
 * @return:
 * @example:

 */
const listenForm = () =>{
  layui.use('laydate', function(){
    let laydate = layui.laydate;
    //执行一个laydate实例
    laydate.render({
      elem: '#date' //指定元素
      ,type: 'date'
      ,format: 'yyyy/MM/dd'
      ,done: function(value, date, endDate){
        // console.log("当前选择时间",value); //得到日期生成的值，如：2017-08-18
        // console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
        shadowDate = value;
        shadowDays = getDaysFromNowToByear(shadowDate) + 1;
      }
    });
  });

  layui.use('form', function(){
    let form = layui.form;

    //监听提交
    form.on('submit(*)', function(data){
      // const province = data.field.title.substr(0,3);
      // console.log("province----:",province);
      // finalCityValue
      // myGeo.getPoint(data.field.title, function(point){
      myGeo.getPoint(finalCityValue, function(point){
        if (point) {
          console.log("point:",point)
          shadowPosition = point;
          layer.msg("更新成功!");
          updateShaowBySunDegree(realSunhour);
          // sliderControl.setValue(720);
        }else{
          layer.msg("您选择地址没有解析到结果!");
        }
      });
      return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
  });

  let sliderControl;
  layui.use('slider', function(){
    let slider = layui.slider;

    //渲染
    sliderControl = slider.render({
      elem: '#slideTest1'  //绑定元素
      ,max:24 * 60
      ,showstep:true
      ,step:1
      ,setTips: function(value){ //自定义提示文本
        return parseInt(value/60) + '点'+value%60+"分";
      }
      ,change: function(value){
        shadowTime = parseInt(value.split("点")[0])+parseInt(value.split("点")[1].split("分")[0])/60;
        realSunhour = computeRealSunHour(shadowDate,shadowTime); // 真太阳时
        updateShaowBySunDegree(realSunhour);
      }
    });
    sliderControl.setValue(720);
  });

  $("#city").click(function (e) {
    SelCity(this,e);
  });
  $("s").click(function (e) {
    SelCity(document.getElementById("city"),e);
  });

}

/**
 * @description:  根据地点纬度，时间来算出太阳高度角和方位角
 * @params:
 * @params:
 * @return:
 * @example:

 */
const updateShaowBySunDegree = (realSunhour) =>{
  const sunHourangle = computeSunHourangle(realSunhour);  // 太阳时角
  const sunDeclination = computeSunDeclination(shadowDays);  // 太阳赤纬
  const solarAltitude = computeSolarAltitude(shadowPosition.lat,sunDeclination,sunHourangle,realSunhour);  // 太阳高度角， 弧度
  const solarAzimuth = computeSolarAzimuth(shadowPosition.lat,sunDeclination,solarAltitude,realSunhour); // 太阳方位角 弧度
  vizbim.lights.children[0].intensity=solarAltitude*6/Math.PI;
  // 如果太阳高度角为负数则关闭阴影效果
  if(solarAltitude<0){
    directionalLight.castShadow = false;  // 平行光
    pivotPoint.children[2].children[0].material.visible = false;  // 屏幕炫光
    pivotPoint.children[3].children[0].material.visible = false;
    // vizbim.scene.background = new THREE.Color(0.1,0.1,0.1;);   // 黑色背景
    vizbim.lights.children[0].intensity=0
  }else {
    directionalLight.castShadow = true;
    pivotPoint.children[2].children[0].material.visible = true;
    pivotPoint.children[3].children[0].material.visible = true;
    // vizbim.scene.background = textureCube;   // 天空盒背景
    // vizbim.lights.children[0].intensity=1;
  }
  pivotPoint.rotation.y = solarAltitude;  // 太阳高度角
  pivotPoint2.rotation.z = -solarAzimuth+Math.PI/2;   // 太阳方位角 弧度
  vizbim.renderer.shadowMap.needsUpdate = true;
  vizbim.renderer.render(vizbim.scene,vizbim.camera);
}


// 计算当前时间距离年初的天数    2018/10/30
const getDaysFromNowToByear = (nowDate) =>{
  const beginYearDate = nowDate.split("/")[0] + "/1/1";
  const dayBeginYearDate = new Date(beginYearDate);
  const dayNowYearDate = new Date(nowDate);
  const intDays = (dayNowYearDate.getTime()-dayBeginYearDate.getTime())/(24 * 3600 * 1000);
  return intDays;
}

/**
 * @description:  添加地点日期时间选择表单
 * @params:
 * @params:
 * @return:
 * @example:

 */
const addLocationForm = () =>{
  const $form = $("    <div class=\"layui-form-item\">\n" +
    "        <label class=\"layui-form-label noport\" >省市</label>\n" +
    "        <div class=\"layui-input-block\" style='display: flex'>\n" +
    // "            <input type=\"text\" name=\"title\"   \n" +
    // "                   placeholder=\"北京\" autocomplete=\"off\" class=\"layui-input\" id='city'>\n" +
    "<div ><input class=\"layui-input\" name=\"\" id=\"city\" type=\"text\" placeholder=\"北京市\" autocomplete=\"off\" readonly=\"true\"/></div>"+
    "             <button class=\"layui-btn\" lay-submit lay-filter=\"*\" style='margin-left: 10px'>更新地点</button>\n" +
    // "             <button type=\"reset\" class=\"layui-btn layui-btn-primary\">重置</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"layui-form-item\">\n" +
    "        <label class=\"layui-form-label noport\">日期</label>\n" +
    "        <div class=\"layui-inline layui-form-item\" > <!-- 注意：这一层元素并不是必须的 -->\n" +
    "            <input type=\"text\" class=\"layui-input\"  id=\"date\" autocomplete=\"off\" placeholder="+shadowDate+">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"layui-form-item\">\n" +
    "        <label class=\"layui-form-label noport\">时间</label>\n" +
    "        <div class=\"layui-input-block\">\n" +
    "            <div id=\"slideTest1\" lay-submit></div>\n" +
    "        </div>\n" +
    "    </div>\n"
 )

  $("#myForm").append($form);

  listenForm();  // 监听laui表单
}

// 添加指北针
const addPointNorth = () =>{
  let textureLoader = new THREE.TextureLoader();
  let zhinanzhen = textureLoader.load( 'textures/zhinanzhen2.jpg',
    function (texture) {
      let geometry = new THREE.PlaneGeometry(200,200, 32);
      let material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map:texture
      });
      let plane = new THREE.Mesh(geometry, material);
      plane.rotation.z = Math.PI;
      plane.position.set(0,0,0);
      scene2.add(plane);
    });
}

let camera2;
let renderer2;
const setupInset = () =>{
  var insetWidth = 150,
    insetHeight = 150;
  const container2 = document.getElementById('inset');
  container2.width = insetWidth;
  container2.height = insetHeight;

  // renderer
  renderer2 = new THREE.WebGLRenderer({
    alpha : true,
    antialias: true
  });
  renderer2.setClearColor( 0x000000, 0 );
  renderer2.setSize( insetWidth, insetHeight );
  container2.appendChild( renderer2.domElement );

  // scene
  const scene2 = window.scene2 =new THREE.Scene();

  // camera
  camera2 = new THREE.PerspectiveCamera( 50, insetWidth / insetHeight, 1, 1000000 );
  camera2.up = vizbim.camera.up; // important!

  // scene2.background = new THREE.Color(0.5,0.6,0.7)
  // renderer2.render(scene2,camera2)
  animateScene2();
}

// 指南针同步
const animateScene2 = () =>{
  requestAnimationFrame( animateScene2 );
  //copy position of the camera into inset
  camera2.position.copy( vizbim.camera.position );
  camera2.position.sub( vizbim.cameraControl.target );
  camera2.position.setLength( 300 );
  camera2.lookAt( scene2.position );
  renderer2.render( scene2, camera2);
}
