/**
 * @description:   模型外轮廓的展示
 *                 外轮廓相关示例，对于每个模型，在提取外轮廓之前需要先调用接口提取外轮廓
 *                 本demo使用的模型已经提前提取过了，因此不需要再次提取
 *                 提取示例：fetch(`${op.baseaddress}models/
 *                         ${id}/outlines/!parse?devcode=
 *                         ${op.devcode}&level=${level}&enforce=false`)
 *                 详细接口说明请在开放平台API页面查看:
 *                 https://www.bos.xyz/guide/swapi/getOuter
 */

// 主函数
const init = (filekey) => {

  // 模型画布自适应窗口大小
  vizbim.resize();

  // 获取模型外轮廓构件
  getOutlineComponentByLevel(filekey, 1).then((data) => {
    vizbim.showModelByComponentId(data.data);  // 获取外轮廓的构件值以后，用vizbim.showModelByComponentId方法来加载指定构件
  });
}

// 数据接口:根据层级获取模型外轮廓构件
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
