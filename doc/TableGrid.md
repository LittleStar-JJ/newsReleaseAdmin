# TableGrid
### 列表组件

#### 使用场景
* 列表

#### 配置项
* columns 列表配置
* dataSource 数据
* rowSelection 列表项是否可选择（与ant一致）
* pagination 分页器（与ant一致）
* expandedRowKeys 展开的行，控制属性（与ant一致）
* expandedRowRender 额外的展开行（与ant一致）
* scroll 横向或纵向支持滚动（与ant一致）
* isClearRowKeys 是否清除已勾选的数据

#### editable配置项
* type 类型
* rules 验证
* editable 编辑状态
#### type支持的组件
* input 输入框
* select 下拉框
* inputSearch 搜索
* operation 操作项

### 使用说明

#### columns
> 普通文本
```
{
    title: '商品货号（SKU）', // 标题
    dataIndex: 'consignorSn', // 绑定字段
    width:'20%' // 列宽
}
```
> input
```
{
    title: '商品货号（SKU）',
    dataIndex: 'consignorSn',
    editable:{
        type:'input',
        rules:[{ required:true, message:'请输入数量' }],
        editable:true, // 是否启用编辑状态
        onChange:(key, index, value) => {} // change事件（字段，行索引，值）
    }
}
```
> inputSearch（与QueryList中配置统一）
```
{
    title: '商品货号（SKU）',
    dataIndex: 'consignorSn',
    editable:{
        type:'inputSearch', 
        rules:[{ required:true, message:'请输入数量' }],
        editable:false,
        option: {
                valueField: 'id',
                textField: 'cname',
                placeholder:'输入关区',
                initialValue:'',
                options:[]
        },
        onChange:(key, index, value) => {
        },
        onSearch:(key, index, value, callback) => {
            recordList[index][key] = value
            if (value === '') return false
            this.props.getCustomSet({ cname: value })
            this.customSetCallBack = callback
        }
    }
}
```
### operation 操作项
> 配置列
```
{
    title: '操作',
    type:'operation',
    dataIndex: 'operation',
    btns:[...]
}
```
### btns，操作项按钮
> link 普通跳转 
```
{
    type:'link', // type
    text:'查看', // 显示
    onClick:(index) => { // 参数：当前行索引
    }
}
```
> edit 编辑项 
```
{
    type:'edit', // type
    text:'编辑', // 显示
    onSave:(index) => {}, // 保存触发
    onCancel:(index) => {} // 取消触发
}
```
> popConfirm 气泡提示确认 
```
{
    type:'popConfirm',
    text:'删除', // 显示
    title:'确定删除？', // 提示信息
    onClick:(index) => { // 确定触发
    }
}
```
### 工具类 TableGridTools
* 清除列表勾选 
> ```TableGridTools.clearRowSelection(this.refs['TableGrid1'])```
* 验证table可编辑项 return true | false 
> ```TableGridTools.validate(this.refs['TableGrid1'])```

### rules 验证与query中验证一致
* 自定义验证函数参数:(值，行下标，当前key),通过判断value，如返回true则通过验证 返回字符串则失败并显示返回的字符串
> ```{ customize:(value, index, key) => { return true | return '验证失败' } }```