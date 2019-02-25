# [模型外轮廓展示示例](https://www.bos.xyz/examples/course/type=outlines_show)

## 内容描述

模型外轮廓展示示例，用于展示经过提取后的建筑外轮廓样式。通过[提取模型外轮廓接口](https://www.bos.xyz/guide/swapi/getOuter)将输入BIM 模型的建筑外轮廓提取出来后，调用[获取模型外轮廓构件集接口](https://www.bos.xyz/guide/swapi/getOuterComs)与[构件加载](https://www.bos.xyz/guide/swapi/showModelByComponentId(id,callback))接口将模型一级外轮廓展示在三维可视化界面中。用户可以将完整代码直接下载下来后，将已经提取过所有级别外轮廓的模型id和用户个人账户devcode替换上去，即可展示自有模型。

我们将被遮挡的内部构件通过算法全部筛选并过滤掉，仅保留外轮廓构件集。与此同时，由于模型建立时的精细度不用，有些模型由细小构件组成而有些模型由完整大片构件组成，我们采取不同的提取精细度来解决这一问题：

    一级：70%模型适用，提取密度低，但足以提取外轮廓80%构件，满足基本查看需求。
    二级：90%至95%模型使用，提取密度适中，足以提取建筑外轮廓中90%以上的构件，满足对外轮廓精细度要求较高的提取需求
    三级：使用于存在高密度的小型构件集的模型，提取密度最高，能够提取全部外轮廓构件集。

可以通过查看[多级外轮廓精细度对比示例](https://www.bos.xyz/examples/course/type=outlines_mutilCompared)，具体查看各个精细度之间的差异。

模型外轮廓主要应用于大场景大建筑群加载需求中，例如在智慧园区，智慧城市的展示与应用中，大部分的场景加载都是用白模代替BIM模型，严重影响了美观与3D模拟的真实性，但是如果将全部模型加载至界面中，又会导致大量不可见构件的加载从而影响使用效率，建筑外轮廓构件集则解决了上述问题，既将模型轻量化展示，又可以满足大量建筑同时展示的需求。

## 其它相关示例

[模型外轮廓对比](https://www.bos.xyz/examples/course/type=outlines_compared)

[模型外轮廓分离](https://www.bos.xyz/examples/course/type=outlines_separation)

[多级外轮廓提取与展示](https://www.bos.xyz/examples/course/type=outlines_mutilShow)

[多级外轮廓精细度对比](https://www.bos.xyz/examples/course/type=outlines_mutilCompared)

[多级外轮廓与内部构件分离](https://www.bos.xyz/examples/course/type=outlines_multiSeparation)

