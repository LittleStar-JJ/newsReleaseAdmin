# QueryList
### 查询组件

#### 使用场景
* 列表搜索

#### 支持组件
* [text](#text) 普通可输入文本
* [select](#select) 普通下拉框
* [selectSearch](#selectSearch) 带搜索下拉框（搜索下拉框中已有数据）
* [inputSearch](#inputSearch) 搜索框（请求搜索）
* [datePicker](#datePicker) 日期选择
* [rangePicker](#rangePicker) 日期区域选择
* [textArea](#textArea) 文本域
* [textGroup](#textGroup) 多个文本
* [cascader](#cascader) 地区级联
* [searchCountry](#searchCountry) 国家搜索
* [switch](#switch) 切换
* [file](#file) 文件上传
* [placeholder](#placeholder) 占位

### 使用说明

#### [text](id:text)
```
{
    type:'text', // 指定类型
    disabled:true, // 禁用/启用（通用）
    style:{}, // 设置样式（通用）
    rules:[{ required:true, message:'请输入' }], // 验证(通用)
    fieldLabel:'商户订单号', // 显示label
    fieldName:'outSn', // 绑定的字段
    initialValue:'', // 默认值
    placeholder:'', // 提示信息
    onChange:(value) => {} // 输入触发（参数：值）
}
```
#### [select](id:select)
```
{
    type:'select', // 指定类型
    rules:[{ required:true, message:'请选择销售渠道' }], // 验证
    option:{ // 参数配置
        valueField:'id', // 绑定value字段
        textField:'storeName', // 绑定text字段
        placeholder:'选择销售渠道', // 提示信息
        options: this.state.salesChannels, // 下拉框option数据 (array)
        selected: '' // 选中数据（value[string]）
    },
    fieldLabel:'销售渠道', // 显示label
    fieldName:'channel' // 绑定的字段
}
```
#### [selectSearch](id:selectSearch) (与select一致)
```
{
    type:'selectSearch',
    rules:[],
    option:{
        valueField:'id',
        textField:'name',
        placeholder:'选择仓库名称',
        options: this.state.warehouse,
        selected: '',
        onChange:(value) => { }
    },
    fieldLabel:'仓库名称',
    fieldName:'warehouse'
}
```
#### [inputSearch](id:inputSearch)
```
{
    type:'inputSearch', // 类型
    option:{
        valueField:'id', 
        textField:'name',
        placeholder:'输入交货仓库',
        options:[],
        onChange:(value) => { this.warehouseName = value.name }, // 选择触发(value[object])
        onSearch:(value, callback) => { // 输入触发(value[string],callback[fuc])
            this.warehouseName = value
            if (value === '') return false
            // 这里发起请求
            this.props.getWarehouseList({ name: value })
                // 设置回调通知，在组件componentWillReceiveProps拿到返回数据时
                // 调用此回调并传入数组，列:
                // this.warehouseCallBack(nextProps.warehouse)
                this.warehouseCallBack = callback
            }
        },
    initialValue:'',
    fieldLabel:'交货仓库',
    fieldName:'warehouseName'
}
```
#### [datePicker](id:datePicker)
```
{
    type:'datePicker',
    rules:[{ required:true, message:'请输入开航日期' }],
    fieldLabel:'开航日期',
    fieldName:'sailBDate',
    initialValue:customsDetail.sailBDate,
    placeholder:'请选择开航日期',
    onChange:() => {}
}
```
#### [rangePicker](id:rangePicker)
```
{
    type:'rangePicker',
    rules:[{ required:true, message:'请选择预期到货时间' }],
    initialValue:[new Date(), new Date()], // 默认时间（两个时间）
    onChange:(val) => { console.log(val) },
    fieldLabel:'预期到货时间',
    fieldName:'times'
}
```
#### [textArea](id:textArea)
```
{
    type:'textArea',
    style:{ height:'60px' }, // 通常需要设置高度
    fieldLabel:'备注',
    fieldName:'remarks',
    placeholder:'请输入',
    initialValue:notice.remarks,
    onChange:() => {}
}
```
#### [textGroup](id:textGroup)
```
{
    type:'textGroup', 
    fieldLabel:'长*宽*高(cm)',
    fieldName:['dimensionsLength', 'dimensionsWidth', 'dimensionsHeight'],// 绑定字段，多个字段组成
    placeholder:['长', '宽', '高'],
    initialValue:[size.length, size.width, size.high],
    onChange:(val) => { console.log(val) }
}
```
#### [cascader](id:cascader)
```
{
    type:'cascader',
    rules:[{ required:true, message:'请选择公司所在地' }],
    fieldLabel:'公司所在地',
    fieldName:'areaCode',
    placeholder:'请选择公司所在地',
    initialValue:86010101, //选中的区域代码，类型：number
    onChange:(val) => { console.log(val) } // 返回值:数组对象，包含了国家,省,市，区对象:{label:'中国', value:86000000}
}
```
#### [searchCountry](id:searchCountry)
```
{
    type:'searchCountry',
    fieldLabel:'发件地',
    fieldName:'origin',
    initialValue:'',
    placeholder:'输入搜索发件地',
    onChange:(val) => {}
}
```
#### [switch](id:switch)
```
{
    type:'switch',
    fieldLabel:'状态',
    fieldName:'status',
    option:{
        checked:'启用', // 启用显示文本
        unChecked:'禁用', // 关闭显示文本
        initialValue: false, // 默认值（true/false）
        onChange:(val) => {} 
    }
}
```
#### [file](id:file)
```
{
    type:'file',
    fieldLabel:'上传附件',
    fieldName:'file',
    uploadProps:{ // 配置（请参考antd的Upload官方文档）
        ...
    }
}
```
#### [placeholder](id:placeholder)
```
{
    type:'placeholder',
    style:{ height:'60px' }, // 支持样式
    text:'', // 显示文本（可空）
}
```
### rules验证
* 非空验证
> ```{ required:true, message:'请选择类型' }```
* 正则验证
> ```{ validate:'reg=^[\\d]{11}$', message:'请输入11位手机号' }```
* 自定义验证函数（通过判断value，如返回true则通过验证 返回字符串则失败并显示返回的字符串）
> ```{ customize:(value) => { return true | return '验证失败' } }```
* 其他 ```ant``` 默认