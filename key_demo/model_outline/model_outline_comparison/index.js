/**
 * @description:   模型1级外轮廓与2级外轮廓对比
 *                 外轮廓相关示例，对于每个模型，在提取外轮廓之前需要先调用接口提取外轮廓
 *                 本demo使用的模型已经提前提取过了，因此不需要再次提取
 *                 提取示例：fetch(`${op.baseaddress}models/
 *                         ${id}/outlines/!parse?devcode=
 *                         ${op.devcode}&level=${level}&enforce=false`)
 *                 详细接口说明请在开放平台API页面查看:
 *                 https://www.bos.xyz/guide/swapi/getOuter
 */

// 定义外轮廓构件id的数组变量
let outComponents1 = []; // 1级外轮廓
let outComponents2 = []; // 2级外轮廓
let outComponents12 = []; // 1级外轮廓与2级外轮廓总和
let moreComponents2 = []; // 2级外轮廓减去1级外轮廓的剩余的构件

// 主函数
const init = () => {

  // 模型画布自适应窗口大小
  vizbim.resize();

  // 通过接口获取模型1级外轮廓和2级外轮廓构件，并且计算出2级外轮廓构件比1级外轮廓构件多出来的构件，以及1级外轮廓构件和2级外轮廓构件的总和
  getOutlineComponents(filekey).then(() => {
    vizbim.showModelByComponentId(outComponents12, function () {
      vizbim.transparentObjs(outComponents1, 0.6, false);   // 改变构件透明度
      vizbim.setObjtColor(outComponents1, [204 / 255, 204 / 255, 204 / 255]);  // 改变构件颜色
      vizbim.setObjtColor(moreComponents2, [112 / 255, 177 / 255, 197 / 255]);  // 改变构件颜色
    });
  });
}

//数组求差函数，用来计算数个数组的差值
Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
}

//数组去重函数，用来去除数组中重复的值
const uniq = (array) => {
  const temp = []; //一个新的临时数组
  for (let i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}

// 获取模型1层和2层的外轮廓
const getOutlineComponents = (id) => {
  return getOutlineComponentByLevel(id, 1)
    .then((result1) => {
      outComponents1 = result1.data;
      return getOutlineComponentByLevel(id, 2)
    })
    .then((result2) => {
      outComponents2 = result2.data;
      moreComponents2 = outComponents2.diff(outComponents1);   // 计算2级外轮廓构件比1级外轮廓构件多出来的构件
      outComponents12 = uniq(outComponents1.concat(outComponents2));   // 计算1级外轮廓构件和2级外轮廓构件的总和
    });
}

// 根据层级获取模型外轮廓构件 数据接口
const getOutlineComponentByLevel = (id, level) => {
  return fetch(`${op.baseaddress}models/${id}/outlines?devcode=${op.devcode}&level=${level}`)
    .then(response => response.json())
    .then(data => {
      if (data.code === 200 && data.message === "成功") {
        return data;
      } else {
        vizbim.promptingMessage("error", `出错了，错误代码为:${data.code}`, false);
      }
    })
    .catch(e => console.error("出错了!错误为:", e))
}
