/**
 * Created by xwatson on 2016/12/29.
 */
import './QueryList.scss'
import React from 'react'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Switch, Radio, Upload, Checkbox, Popover } from 'antd'
const InputGroup = Input.Group
import moment from 'moment'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
import OBORCascader from '../OBORCascader'
import InputSearch from '../InputSearch'
import SearchCountry from '../SearchCountry'

const INPUTSEARCHREF = 'INPUTSEARCHREF_'
class QueryForm extends React.Component {
    static propTypes = {
        style           : React.PropTypes.object,
        form            : React.PropTypes.object,
        queryOptions    : React.PropTypes.array.isRequired, // 查询配置
        colSpan         : React.PropTypes.number, // 每列占用栅格数（默认8,分3列展示）
        onSearchChange  : React.PropTypes.func, // 查询按钮回调
        edit            : React.PropTypes.bool, // 是否编辑状态(默认true)
        showSearch      : React.PropTypes.bool, // 是否显示搜索
        totalElement    : React.PropTypes.number // 总条数
    }
    state = {
        isClear         : false,
        expand          : false,
        switchs         : null,
        textGroupValidate : '', // 组合框验证
        ordinaryOptions : [], // 普通搜索配置项
        advancedOptions : [] // 高级搜索配置项
    }
    constructor(props) {
        super(props)
        this.handleInputSearchChangeTimer = null
        this.isInputSearchSelect = false
        this.isInit = true
        this.isFirstSetFieldsValue = true
        this.inputSearchFields = []
        this.cascaders = []
        this.inputSearch = []
        this.searchCountry = []
        this.catchOptions = props.queryOptions
        this.customizeRules = []
        this.rangePickeRepeat = [] // 重复的时间区间需要转换
    }
    /**
     * 点击查询按钮
     * @param e 事件
     * @param callback 回调（外界函数调用时回调）
     */
    handleSearch = (e, callback) => {
        if (e) e.preventDefault()
        let isCascade = true
        const { onSearchChange } = this.props
        const { setFieldsValue, getFieldsValue } = this.props.form
        if (this.customizeRules.length) {
            const _newCustomizeRules = []
            const _group = []
            this.customizeRules.forEach((item, i) => {
                if (typeof item === 'string') {
                    _newCustomizeRules.push(item)
                }
            })
            // 获取自定义验证的字段值
            const customizeFieldsValue = getFieldsValue(_newCustomizeRules)
            // 重新设置表单值，解决已经验证过的不再调用验证函数问题
            setFieldsValue(customizeFieldsValue)
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            // 验证区域级联
            this.cascaders.forEach((cas) => {
                let casVal = this.refs[cas].refs.wrappedInstance.handleValidator()
                if (!casVal) {
                    isCascade = false
                    return false
                }
                values[cas] = casVal
            })
            // 获取inputSearch字段
            this.inputSearch.forEach((s) => {
                let _v = this.refs[s].handleValidator()
                values[s.replace(INPUTSEARCHREF, '')] = _v
            })
            // 验证组合输入框
            if (this.state.textGroupValidate !== '') return false
            if (!isCascade) return false
            if (!err) {
                // 绑定国家搜索字段
                this.searchCountry.forEach((s) => {
                    let _v = this.refs[s].refs.wrappedInstance.handleValidator()
                    values[s] = _v
                })
                const rangePickeRepeatValue = getFieldsValue(this.rangePickeRepeat)
                Object.keys(rangePickeRepeatValue).forEach((key) => {
                    const _datas = rangePickeRepeatValue[key]
                    if (_datas && _datas.length) {
                        if (_datas[0].format('x') === _datas[1].format('x')) {
                            _datas[0].set({ hour:0, minute:0, second:0, millisecond:0 })
                            // _datas[1].add(1, 'days')
                            _datas[1].set({ hour:23, minute:59, second:59, millisecond:0 })
                        }
                    }
                })
                /* this.inputSearchFields.forEach((item) => {
                    values[item] = this.state[item + '_inputSearchValue']
                }) */
                if (onSearchChange instanceof Function) {
                    onSearchChange(values)
                }
                if (callback instanceof Function) {
                    callback(values)
                }
            }
        })
    }
    /**
     * 重置按钮
     */
    handleReset = () => {
        this.props.form.resetFields()
        this.setState({ isClear:true, textGroupValidate:'' })
    }
    /**
     * 展开，收起
     */
    toggle = () => {
        const { expand } = this.state
        this.setState({ expand: !expand })
    }
    /**
     * 高级搜索 展开，收起
     */
    advancedToggle = () => {
        const { expand, ordinaryOptions, advancedOptions } = this.state
        if (!expand) {
            this.isInit = true
            this.state.ordinaryOptions = ordinaryOptions.concat(advancedOptions)
            this.setState({ ordinaryOptions:this.state.ordinaryOptions })
        } else {
            const _options = []
            ordinaryOptions.forEach((item) => {
                if (!item.advancedSearch) {
                    _options.push(item)
                }
                if (item.advancedSearch) {
                    let _index = this.inputSearch.indexOf(INPUTSEARCHREF + item.fieldName)
                    if (_index > -1) {
                        this.inputSearch.splice(_index, 1)
                    }
                    _index = this.cascaders.indexOf(item.fieldName)
                    if (_index > -1) {
                        this.cascaders.splice(_index, 1)
                    }
                    _index = this.searchCountry.indexOf(item.fieldName)
                    if (_index > -1) {
                        this.searchCountry.splice(_index, 1)
                    }
                }
            })
            this.setState({ ordinaryOptions:_options })
        }
        this.setState({ expand: !expand })
    }

    /**
     * 统一验证Handel
     * @param validates 验证参数
     * @param messages 验证日提示
     * @param rule
     * @param value 输入框的值
     * @param callback 回调通知ant显示验证消息
     */
    handleValidator(item, validates, messages, rule, value, callback) {
        let isValidate = false
        if (validates && value !== '') {
            let _keyVal = validates.split('=')
            switch (_keyVal[0]) {
                case 'reg':
                    this._regValidator(item, _keyVal[1], value, messages, callback)
                    isValidate = true
                    break
            }
        }
        if (!isValidate) {
            callback()
        }
    }
    /**
     * 自定义验证处理函数
     * @param customize 自定义回调函数（返回true验证成功，返回字符串则为失败提示信息）
     * @param rule
     * @param value
     * @param callback
     */
    handleCustomize = (item, customize, rule, value, callback) => {
        if (value && value.toString().trim() !== '' && customize instanceof Function) {
            const msg = customize(value, this.props.form)
            if (item.type === 'textGroup') {
                if (msg !== true) {
                    this.setState({ textGroupValidate:msg })
                } else {
                    this.setState({ textGroupValidate:'' })
                }
                callback()
                return false
            }
            if (msg !== true) {
                callback(msg)
            } else {
                callback()
            }
        } else {
            callback()
        }
    }
    /**
     * 日期区间组件验证
     * @param rule
     * @param value
     * @param callback
     */
    handleValidatorRangePicker = (rule, value, callback) => {
        if (value && value.length > 0) {
            if (value[0].format('YYYY-MM-DD') === value[1].format('YYYY-MM-DD')) {
                callback('创建时间区间不可重复')
            } else {
                callback()
            }
        } else callback()
    }
    /**
     * 国家搜索change
     * @param val
     * @param field
     */
    handleSearchCountryChange = (val, field, callback) => {
        if (typeof val === 'object') {
            val = val.name
        }
        this.searchCountry[field] = val
        if (callback instanceof Function) {
            callback(val)
        }
    }
    /**
     * 正则验证
     * @param reg 正则
     * @param value 值
     * @param msg 提示消息
     * @param callback 回调通知ant
     * @private
     */
    _regValidator = (item, reg, value, msg, callback) => {
        let _reg = new RegExp(reg)
        if (item.type === 'textGroup') {
            const { getFieldValue } = this.props.form
            let _isValidator = true
            item.fieldName.forEach((name) => {
                let _value = getFieldValue(name)
                if (_value && _value !== '') {
                    if (!_reg.test(_value)) {
                        _isValidator = false
                    }
                }
            })
            if (!_isValidator) {
                this.setState({ textGroupValidate:msg })
            } else {
                this.setState({ textGroupValidate:'' })
            }
            callback()
            return false
        }
        if (!_reg.test(value)) {
            callback(msg)
        } else {
            callback()
        }
    }
    getInitialValue = (next) => {
        let fieldsValue = {}
        if (this.catchOptions && this.catchOptions !== next) {
            this.catchOptions.forEach((item) => {
                next.forEach((item2) => {
                    if (item.fieldName === item2.fieldName) {
                        switch (item2.type) {
                            case 'text':
                            case 'textArea':
                                if (item.initialValue !== item2.initialValue) {
                                    fieldsValue[item2.fieldName] = item2.initialValue
                                }
                                break
                            case 'select':
                            case 'inputSearch':
                            case 'selectSearch':
                                if (item.option.selected !== item2.option.selected) {
                                    fieldsValue[item2.fieldName] = item2.option.selected
                                }
                                if (item.option.options !== item2.option.options) {
                                    // fieldsValue['selectUpdate'] = true
                                }
                                break
                            case 'rangePicker':
                                if (JSON.stringify(item.initialValue) !== JSON.stringify(item2.initialValue)) {
                                    let initia = []
                                    if (item2.initialValue && item2.initialValue instanceof Array) {
                                        item2.initialValue.forEach((inv) => {
                                            initia.push(moment(inv))
                                        })
                                    }
                                    fieldsValue[item2.fieldName] = initia
                                }
                                break
                            case 'datePicker':
                                if (item.initialValue && item.initialValue !== '' && item.initialValue !== item2.initialValue) {
                                    fieldsValue[item2.fieldName] = moment(item2.initialValue)
                                }
                                break
                            case 'switch':
                                if (item.option.initialValue !== item2.option.initialValue) {
                                    this.state.switchs[item.fieldName] = item2.option.initialValue
                                }
                                break
                            case 'html':
                                if (item.text !== item2.text) {
                                    // fieldsValue['htmlUpdate'] = true
                                }
                                break
                        }
                    }
                })
            })
        }
        if (!Object.keys(fieldsValue).length) return null
        return fieldsValue
    }
    componentWillMount() {
        this.setQueryOptions(this.props.queryOptions)
    }
    setQueryOptions(queryOptions) {
        const { expand } = this.state
        if (expand) {
            this.state.ordinaryOptions = queryOptions
        } else {
            this.state.advancedOptions = []
            this.state.ordinaryOptions = []
            queryOptions.forEach((item) => {
                if (item.advancedSearch) {
                    this.state.advancedOptions.push(item)
                } else {
                    this.state.ordinaryOptions.push(item)
                }
            })
        }
        // this.isInit = true
    }
    componentWillReceiveProps(nextProps) {
        const { setFieldsValue } = this.props.form
        let fieldsValue = this.getInitialValue(nextProps.queryOptions)
        // 如果查询配置有更改
        if (fieldsValue) {
            this.setQueryOptions(nextProps.queryOptions)
            this.catchOptions = nextProps.queryOptions
            this.isFirstSetFieldsValue = true
        }
        // 动态设置字段值
        if (fieldsValue && this.isFirstSetFieldsValue) {
            setFieldsValue(fieldsValue)
            this.isFirstSetFieldsValue = false
        }
    }
    /**
     * 渲染表单
     * @param item 配置项
     * @returns {*}
     * @private
     */
    _renderFormItem = (item) => {
        const { getFieldDecorator } = this.props.form
        const rulesClone = Object.assign([], item.rules)
        const Option = Select.Option
        const { RangePicker } = DatePicker
        let validators = []
        rulesClone.forEach((rule) => {
            if (rule.validate) {
                validators.push({
                    validator : this.handleValidator.bind(this, item, rule.validate, rule.message)
                })
            } else if (rule.customize) {
                if (this.isInit) {
                    if (this.customizeRules.indexOf(item.fieldName) === -1) {
                        this.customizeRules.push(item.fieldName)
                    }
                }
                validators.push({
                    validator : this.handleCustomize.bind(this, item, rule.customize)
                })
            } else if (rule instanceof Array) {
                rule.forEach((r) => {
                    if (r.validate) {
                        validators.push({
                            validator: this.handleValidator.bind(this, item, r.validate, r.message)
                        })
                    } else {
                        validators.push(r)
                    }
                })
            } else {
                validators.push(rule)
            }
        })
        let rules = {}
        if (validators.length > 0) {
            rules = {
                rules: validators
            }
        }
        switch (item.type) {
            // 普通下拉框
            case 'select':
                item.option.options = item.option.options || []
                return getFieldDecorator(item.fieldName, {
                    initialValue:item.option.selected === '' ? undefined : item.option.selected,
                    ...rules
                })(
                    <Select disabled={item.disabled} size="large" style={item.option.style} placeholder={item.option.placeholder} onChange={(val) => this.handleSelectChange(item.option, val)}>
                        {
                            item.option.options.map((o) => {
                                let val = o[item.option.valueField] ? o[item.option.valueField].toString() : o.value.toString()
                                let text = o[item.option.textField] ? o[item.option.textField].toString() : o.text
                                return <Option value={val} key={val} disabled={o.disabled}>{text}</Option>
                            })
                        }
                    </Select>
                )
            // 下拉框带搜索
            case 'selectSearch':
                return getFieldDecorator(item.fieldName, {
                    initialValue:item.option.selected === '' ? undefined : item.option.selected,
                    ...rules
                })(
                    <Select disabled={item.disabled} style={item.option.style} showSearch placeholder={item.option.placeholder} optionFilterProp="children"
                      onChange={(val) => this.handleSelectSearchChange(item.option, val)}>
                        {
                            item.option.options.map((o) => {
                                let val = o[item.option.valueField] ? o[item.option.valueField].toString() : o.value.toString()
                                let text = o[item.option.textField] ? o[item.option.textField].toString() : o.text
                                return <Option value={val} key={val} disabled={o.disabled}>{text}</Option>
                            })
                        }
                    </Select>
                )
            // 搜索框
            case 'inputSearch':
                if (this.isInit) {
                    if (this.inputSearch.indexOf(INPUTSEARCHREF + item.fieldName) === -1) {
                        this.inputSearch.push(INPUTSEARCHREF + item.fieldName)
                    }
                }
                const searchOptions = {
                    placeholder: item.option.placeholder,
                    initialValue:item.initialValue,
                    clearValue:this.state.isClear,
                    option: {
                        valueField: item.option.valueField, // 绑定下拉框数据value字段
                        textField: item.option.textField, // 绑定下拉框数据text字段
                        options:item.option.options
                    },
                    onSearch: item.option.onSearch,
                    onChange: item.option.onChange
                }
                return (
                    <InputSearch {...searchOptions} ref={INPUTSEARCHREF + item.fieldName} />
                )
            // 日期选择
            case 'datePicker':
                item.initialValue = item.initialValue && item.initialValue !== '' ? moment(item.initialValue) : ''
                return getFieldDecorator(item.fieldName, {
                    initialValue:item.initialValue,
                    ...rules
                })(
                    <DatePicker style={item.style || { width:'100%' }} placeholder={item.placeholder === '' ? '请选择日期' : item.placeholder}
                      disabled={item.disabled} onChange={(val) => item.onChange(val)} />
                )
            // 日期区域选择
            case 'rangePicker':
                let initia = {}
                if (item.initialValue && item.initialValue instanceof Array) {
                    let invs = []
                    item.initialValue.forEach((inv) => {
                        invs.push(moment(inv))
                    })
                    initia = {
                        initialValue: invs
                    }
                }
                if (typeof item.allowRepeat !== 'undefined' && !item.allowRepeat) {
                    if (!rules.rules) {
                        rules.rules = []
                    }
                    rules.rules.push({
                        validator : this.handleValidatorRangePicker.bind(this)
                    })
                }
                let format = 'YYYY-MM-DD'
                if (item.showTime) {
                    format = 'YYYY-MM-DD HH:mm'
                }
                if (!item.showTime && (typeof item.allowRepeat === 'undefined' || item.allowRepeat) &&
                    this.rangePickeRepeat.indexOf(item.fieldName) === -1) {
                    this.rangePickeRepeat.push(item.fieldName)
                }
                return getFieldDecorator(item.fieldName, {
                    ...initia,
                    ...rules
                })(
                    <RangePicker style={item.style || { width:'100%' }} showTime={item.showTime ? { format:'HH:mm' } : false} format={format}
                      disabled={item.disabled} onChange={(val) => item.onChange(val)} />
                )
            // 文本区
            case 'textArea':
                return getFieldDecorator(item.fieldName, {
                    initialValue:item.initialValue,
                    ...rules
                })(
                    <Input type="textarea" disabled={item.disabled} style={item.style}
                      placeholder={item.placeholder || ''} rows={item.rows ? item.rows : 4} onChange={(e) => item.onChange(e.target.value)} />
                )
            // 一行多个文本
            case 'textGroup':
                const _span = 24 / item.fieldName.length
                return (
                    <InputGroup>
                        {
                            item.fieldName.map((gps, i) => {
                                if (validators[i]) {
                                    rules = {
                                        rules: [validators[i]]
                                    }
                                }
                                if (!validators[i]) validators[i] = {}
                                return (
                                    <Col span={_span} key={'text-group-' + i} className={this.state.textGroupValidate !== '' && 'has-error'}>
                                        {
                                            getFieldDecorator(gps, {
                                                initialValue: item.initialValue ? item.initialValue[i] : '',
                                                ...rules
                                            }
                                            )(
                                                <Input placeholder={item.placeholder ? item.placeholder[i] : ''} onClick={(e) => {
                                                    if (item.onClick instanceof Function) {
                                                        item.onClick(e)
                                                    }
                                                }} onFocus={(e) => {
                                                    if (item.onFocus instanceof Function) {
                                                        item.onFocus(e, i)
                                                    }
                                                }} onBlur={(e) => {
                                                    if (item.onBlur instanceof Function) {
                                                        item.onBlur(e, i)
                                                    }
                                                }} onChange={(e) => {
                                                    if (item.onChange instanceof Function) {
                                                        item.onChange(e, i)
                                                    }
                                                }} />
                                            )
                                        }
                                    </Col>
                                )
                            })
                        }
                        {
                            this.state.textGroupValidate !== '' &&
                                <div className="ant-form-explain" style={{ color:'#f04134' }}>{this.state.textGroupValidate}</div>
                        }
                    </InputGroup>
                )
            // 区域选择
            case 'cascader':
                if (this.isInit) {
                    if (this.cascaders.indexOf(item.fieldName) === -1) {
                        this.cascaders.push(item.fieldName)
                    }
                }
                return getFieldDecorator(item.fieldName, {
                    initialValue: 1,
                    ...rules
                })(
                    <div>
                        <OBORCascader onChange={item.onChange} placeholder={item.placeholder} defaultValue={item.initialValue} validator={{ ...rules }} style={item.style} ref={item.fieldName} />
                    </div>
                )
            // 国家搜索
            case 'searchCountry':
                if (this.isInit) {
                    if (this.searchCountry.indexOf(item.fieldName) === -1) {
                        this.searchCountry.push(item.fieldName)
                    }
                }
                return getFieldDecorator(item.fieldName, {
                    initialValue: 1,
                    ...rules
                })(
                    <div>
                        <SearchCountry placeholder={item.placeholder} clearValue={this.state.isClear} onChange={(value) => this.handleSearchCountryChange(value, item.fieldName, item.onChange)}
                          onSearch={(value) => this.handleSearchCountryChange(value, item.fieldName, item.onChange)} initialValue={item.initialValue} ref={item.fieldName} />
                    </div>
                )
            // 切换
            case 'switch':
                if (this.isInit) {
                    this.state.switchs = Object.assign({}, this.state.switchs || {}, { [item.fieldName]: item.option.initialValue })
                }
                return getFieldDecorator(item.fieldName, {
                    ...rules
                })(
                    <Switch checked={this.state.switchs[item.fieldName]} checkedChildren={item.option.checked} unCheckedChildren={item.option.unChecked} onChange={(val) => {
                        this.state.switchs[item.fieldName] = val
                        this.setState({ switchs:this.state.switchs })
                        item.option.onChange(val)
                    }} disabled={item.disabled} />
                )
            // radioButton
            case 'radioButton':
                item.option.options = item.option.options || []
                return getFieldDecorator(item.fieldName, {
                    initialValue:item.option.selected === '' ? undefined : item.option.selected,
                    ...rules
                })(
                    <RadioGroup disabled={item.disabled} size="large" style={item.option.style} placeholder={item.option.placeholder} onChange={(val) => this.handleSelectChange(item.option, val)}>
                        {
                            item.option.options.map((o) => {
                                let val = o[item.option.valueField] ? o[item.option.valueField].toString() : o.value.toString()
                                let text = o[item.option.textField] ? o[item.option.textField].toString() : o.text
                                return <Radio value={val} key={val} disabled={o.disabled}>{text}</Radio>
                            })
                        }
                    </RadioGroup>
                )
            // checkboxGroup
            case 'checkboxGroup':
                const options = []
                item.option.options.map((o) => {
                    let val = o[item.option.valueField] ? o[item.option.valueField].toString() : o.value.toString()
                    let text = o[item.option.textField] ? o[item.option.textField].toString() : o.text
                    options.push({
                        label:text,
                        value:val
                    })
                })
                return getFieldDecorator(item.fieldName, {
                    initialValue:item.option.selected === '' ? undefined : item.option.selected,
                    ...rules
                })(
                    <CheckboxGroup options={options} disabled={item.disabled} size="large" style={item.option.style} onChange={(val) => this.handleSelectChange(item.option, val)} />
                )
            case 'file':
                return getFieldDecorator(item.fieldName, {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                    ...rules
                })(
                    <Upload {...item.uploadProps}>
                        <Button>
                            <Icon type="upload" /> 上传
                        </Button>
                    </Upload>
                )
            case 'placeholder':
                return <div style={item.style}>{item.text || ''}</div>
            // 其他默认为普通input
            default:
                return getFieldDecorator(item.fieldName, {
                    initialValue: item.initialValue || '',
                    ...rules
                })(
                    <Input type={item.type} placeholder={item.placeholder || ''} disabled={item.disabled} onChange={(e) => item.onChange(e.target.value)} onClick={(e) => {
                        if (item.onClick instanceof Function) {
                            item.onClick(e)
                        }
                    }} onFocus={(e) => {
                        if (item.onFocus instanceof Function) {
                            item.onFocus(e)
                        }
                    }} onBlur={(e) => {
                        if (item.onBlur instanceof Function) {
                            item.onBlur(e)
                        }
                    }} />
                )
        }
    }
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }
    _renderChildren(options) {
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 }
        }
        const { colSpan, edit } = this.props
        let children = []
        options.forEach((item, i) => {
            const popovers = []
            if (item.popover && item.popover.length) {
                item.popover.forEach((item1, i) => {
                    popovers.push(<p key={'Popover' + item1.id + '-' + i}>{item1.label}：{item1.value}</p>)
                })
            }
            if (typeof item.display === 'undefined' || item.display) {
                children.push(
                    <Col span={colSpan || 8} key={i}>
                        <FormItem {...formItemLayout} label={item.fieldLabel}>
                            {
                                !edit ? this._renderFormItem(item) : <div style={item.style}>
                                    {item.text}
                                    {popovers.length ? <Popover content={<div>{popovers}</div>} placement="right">
                                        <Icon type="question-circle" style={{ cursor: 'pointer' }} />
                                    </Popover> : ''}
                                </div>
                            }
                        </FormItem>
                    </Col>
                )
            }
        })
        this.isInit = false
        this.state.isClear = false
        return children
    }
    render() {
        const showCols = 6
        const { showSearch, totalElement } = this.props
        const { advancedOptions, ordinaryOptions } = this.state
        const expand = this.state.expand
        const children = this._renderChildren(ordinaryOptions)
        const shownCount = expand ? children.length : showSearch === undefined ? showCols : children.length
        if (ordinaryOptions && ordinaryOptions.length > 0) {
            return (
                <Form style={this.props.style} className={showSearch === undefined ? 'ant-advanced-search-form query-list-from' : 'ant-advanced-search-form query-list-from query-list-from-edit'}
                  onSubmit={this.handleSearch} >
                    <Row>
                        {
                            !ordinaryOptions.length ?
                                children.slice(0, shownCount) :
                                children
                        }
                    </Row>
                    {
                        showSearch === undefined &&
                            <Row>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    {
                                        totalElement ?
                                            <span style={{ float:'left', fontSize:12, color:'#ababab' }}>共搜索到 {totalElement} 条数据</span> : ''
                                    }
                                    <Button type="primary" htmlType="submit">搜索</Button>
                                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                        清除
                                    </Button>
                                    {
                                        (children.length > showCols && !advancedOptions.length) &&
                                            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                                                {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
                                            </a>
                                    }
                                    {
                                        advancedOptions.length ?
                                            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.advancedToggle}>
                                                {expand ? '收起' : '高级搜索'} <Icon type={expand ? 'up' : 'down'} />
                                            </a> :
                                            ''
                                    }
                                </Col>
                            </Row>
                    }
                </Form>
            )
        } else {
            return (<div>Loading...</div>)
        }
    }
    // 普通下拉框选择
    handleSelectChange(option, val) {
        if (option.onChange instanceof Function) {
            let _val = option.options.filter((item) => {
                return (item[option.valueField].toString() === val)
            })
            option.onChange(..._val)
        }
    }
    // 查询下拉框
    handleSelectSearchChange(option, val) {
        if (option.onChange instanceof Function) {
            let _val = option.options.filter((item) => {
                return (item[option.valueField].toString() === val)
            })
            option.onChange(..._val)
        }
    }
}
export default Form.create({ withRef:true })(QueryForm)
