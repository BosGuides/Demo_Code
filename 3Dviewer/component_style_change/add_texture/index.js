/**
 * @description:   模型构件的材质修改
 */

// 定义一个主场景视角，以获得一个最佳的视点位置
// 参数的获取是通过用户在模型场景调整好模型以后，用vizbim.getModelSnapshoot()获取
const mainView = {
  eye: [-403.923757772253, 609.060642334709, 313.5295418393972],
  look: [-415.3840404738589, 138.02842769336905, 59.361168631544786],
  up: [0, 0, 1],
}

const componentid = "37506143_0QbbPmKGXAWvG7_KY17I6V";  // 模型构件的id

// 示例主函数
const init = () => {
  // 模型画布自适应窗口大小
  vizbim.resize();
  // 加载模型
  vizbim.showModelByDocumentId(filekey, () => {
    vizbim.fly.flyTo(mainView);  // 模型加载完成后飞跃到主视角
    changeMaterial();  // 添加一个带有贴图的正方体
  });
}

// 改变材质种类
const changeMaterial = () => {
  // 实例化一个加载器loader
  const loader = new THREE.TextureLoader();

// 加载一张材质图片
  loader.load(
    // 'floors/FloorsCheckerboard_S_Diffuse.jpg',   // 本地路径的图片
    'http://renyuan.bos.xyz/FloorsCheckerboard_S_Diffuse.jpg', // 远程图片的地址
    // 加载完贴图后的回调函数
    function (texture) {
      // 当材质加载完成之后，我们创建一个新的mesh对象，为这个对象创建几何和材质，为材质附上一张贴图
      const material = new THREE.MeshLambertMaterial({
        map: texture // 将材质的map属性设置为加载的图片
      });
      const geometry = new THREE.BoxGeometry(100, 100, 100);  // 一个正方体几何体，长宽高都为100
      const cube = new THREE.Mesh(geometry, material);  // 创建这个mesh对象

      // cube.position.set(-120,60,60); // 为这个新建的几何体设置一个位置，设置在场景内正方体的旁边
      cube.position.copy(vizbim.components[componentid].position); // 为这个新建的几何体设置一个位置，设置在场景内正方体的旁边
      cube.position.x -= 200;
      cube.position.z += 50;

      vizbim.scene.add(cube); // 将新创建的带贴图的几何体添加到场景内，我们就可以看到了
    },

    // 目前不支持加载贴图过程中的回调函数
    undefined,

    // 加载出错时候的回调函数
    function (err) {
      console.error('An error happened.');
    }
  );
}
