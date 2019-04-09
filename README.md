# 在线协同文档编辑器
编辑器框架：QuillJS

前端框架：UmiJS(React)

通信：Websocket

## 启动
构建项目

    yarn

启动项目

    yarn start 或者 umi dev

> 单纯启动这个项目是没用的，只能作为一个普通的web编辑器，必须要与后台搭配启动。后台链接：https://github.com/TcPaulyue/officeol

## 协同算法

CJupiter 基于Operation Transformation

## 注意

项目只实现了具有本地编辑与在线协同编辑功能的Web编辑器，并没有完整的登录，文档管理等内容(后台暂未实现)。前端有相应界面(localhost:8000/login以及localhost:8000/workSpace)，但界面也没实现完整。

项目启动后访问连接
localhost:8000/editor/{userId}/{fileId}可打开编辑器界面。

{userId}和{fileId}都是自己定义。不同用户使用相同的fileId可以编辑同一份文档。
