# OBOREdit
### 编辑组件
> 基于QueryList再次封装，取消了查询按钮功能，提供验证函数

#### 使用场景
* 修改编辑页面

#### 配置项
* options 与QueryList的queryOptions一致
* colSpan 每列占用栅格数（默认8,分3列展示）

#### 使用说明
* 主动验证
> 配置组件ref值，如：ref="OBOREdit1" 

> 使用：
```
this.refs.OBOREdit1.handleValidator(e, (value) => { // 参数：event, (返回配置的字段和值:object)
    
})
```