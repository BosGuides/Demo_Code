/**
 * @description:   构件关联类型系统展示
 */

let componentType = null; // 用户选择的构件类型

const componentTypeArray = ["IfcFlowSegment", "IfcFlowFitting", "IfcFlowController", "IfcFlowTerminal"];  // 默认的构件类型

// 初始化，主函数
const init = () => {
  vizbim.resize(); // 模型画布自适应窗口大小
  vizbim.showModelByDocumentId(filekey, function () {
    addSelectBox();  // 添加左侧查找框
  });
}

// 添加选择框，当用户选择一个构件，根据[数据接口:根据构件id和指定类型获取构件相关联的指定类型构件集]
// 返回的构件id，将构件高亮

const addSelectBox = () => {
  const $div = $("<div style='position: absolute; top:40px; left:53px;' >" +
    " 在点击查找前先在管道构件组中选择目标构件" +
    " </div>");
  const formContainer = $("<form id='formContainer' class='layui-form'></form>");
  $("body").append($div);
  $("#selectContainer").append(formContainer);
  const formItem1 = $("<div class='layui-form-item'>" +
    "<label class='layui-form-label'>构件类</label>" +
    "<div class='layui-input-block'>" +
    "<select name='louceng' lay-filter='louceng' id='louceng' lay-search >" +
    "<option value='disable' id='disable'>选择想要查找的构件类</option>" +
    " </select>" +
    " </div>" +
    "  </div>");
  const formItem2 = $("  <div class='layui-form-item'>" +
    "    <div class='layui-input-block'>" +
    "      <button id='searchButton' class='layui-btn layui-btn-primary '  lay-submit lay-filter='beginSearch'>查找</button>" +
    "    </div>" +
    "  </div>");
  $("#formContainer").append(formItem1);
  $("#formContainer").append(formItem2);

  // 获取当前模型的构件类别，并加入选择框里
  componentTypeArray.forEach(item => {
    const $option = $(`<option value=${item} id=${item} >${item}</option>`)
    $("#louceng").append($option);
  });

  // 监听查找按钮的点击事件
  layui.use('form', function () {
    const form = layui.form;
    const layer = layui.layer;
    //监听提交
    form.on('submit(beginSearch)', function (data) {
      const componentId = vizbim.arrayConversion();
      if ($.inArray(componentType, componentTypeArray) === -1) {
        layer.msg('请先选择想要查找的构件类型!');
      } else if (!componentId) {
        layer.msg('请先选择构件!');
      } else if (componentId.length > 1) {
        layer.msg('不能选择多个构件,只能选择一个构件!');
      } else {
        getComponentsByTypes(componentId, componentType)
          .then((data) => {
            if (data.code === 200 && typeof data.data !== "string" && data.data.length > 0) {
              const highlightComponents = data.data.concat(componentId);
              vizbim.findSceneNodes(highlightComponents);
            } else {
              layer.msg(data.data);
            }
          })
      }
      return false;
    });

    // 监听用户下拉框的选择功能
    form.on('select(louceng)', function (data) {
      componentType = data.value;
      return false;
    });
  });
}

// 数据接口:根据构件id和指定类型获取构件相关联的指定类型构件集
const getComponentsByTypes = (componentId, type) => {
  return fetch(`${op.baseaddress}models/${filekey}/components/${componentId}/type/${type}?devcode=${op.devcode}`)
    .then(response => response.json())
}
