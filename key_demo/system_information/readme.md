# [小红砖](www.bos.xyz) 示例库-系统信息 代码导航

建筑信息模型的系统信息，特指模型中的管道信息，这种关联关系在建模时已经绘制完成，是将同系统下的管道共同关联绘制。此类管道连接信息，可应用于管道系统的运营维护、监控监管等，将IoT设备监控到的数据与管线构件相关联并进行展示出来，在监控到的数据基础上进行一系列运维操作。BIM+IoT的形式，将二维监管数据和三维建筑信息模型关联起来，可以满足多人同时维护操作、全局监管等需求，减少人工定时巡查、维修报单等一系列工作。


### 在当前代码库中，提供了可以供开发者学习和使用的示例代码。  
#### 对应可视化参考，可前往[小红砖示例库-系统信息](https://www.bos.xyz/examples/#systemInformation-xhz)

---

### key_demo中存储的是核心示例中的系统信息示例可运行代码：

示例库名称 | 文件夹名称 
------------ | ------------- 
[系统信息提取与展示](https://www.bos.xyz/examples/system_extraction_display.html) | system_information_extraction_and_display 
[指定构件所属系统展示](https://www.bos.xyz/examples/specify_component_display.html) | specify_component_system_display
[构件关联类型系统展示](https://www.bos.xyz/examples/association_type_display.html) | association_type_system_display
[系统流向与数据展示](https://www.bos.xyz/examples/system_flow_data_display.html) | system_flow_and_data_display
[管道系统维修示例](https://www.bos.xyz/examples/piping_system_maintenance.html) | piping_system_maintenance_example

---
### 相关接口

[获取模型系统树列表](https://www.bos.xyz/guides/swapi/getSystemTree)

[获取模型管道连接信息](https://www.bos.xyz/guides/swapi/getPipeConnectionInfo)

[获取指定构件所属系统](https://www.bos.xyz/guides/swapi/getSystemKeyByComponentId)

[获取指定系统下所有构件列表](https://www.bos.xyz/guides/swapi/getComponentBySystemKey)

[获取构件相关联的指定类型构件集](https://www.bos.xyz/guides/swapi/getAssociatedComponentByComponentId)
