/**
 * Created by xwatson on 2016/12/23.
 */
import './TableGrid/TableGrid.scss'
import React from 'react'
import { Input, Select, Button, Icon } from 'antd'
const Option = Select.Option
import classNames from 'classnames'
import baseComponent from './baseComponent'

export default class TableEditInputSearch extends baseComponent {
    static propTypes = {
        value: React.PropTypes.string,
        editable: React.PropTypes.bool,
        restorePrevValue: React.PropTypes.bool,
        independent: React.PropTypes.bool,
        status: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onSearch: React.PropTypes.func,
        rules: React.PropTypes.array,
        bindValidate: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        option: React.PropTypes.object
    }
    constructor(props) {
        super(props)
        this.handleChangeTimer = null
        this.isSelect = false
        this.isEdit = false
        this.unmount = false
        this.handleBlur = this.handleBlur.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.catchValue = props.value
    }
    componentWillMount() {
        if (this.props.bindValidate instanceof Function) {
            this.props.bindValidate(this.handleValidate)
        }
    }
    state = {
        data: this.props.option.options || [],
        value: this.props.value || '',
        focus: false,
        editable: this.props.editable || false,
        independentEdit: false,
        validateMessage:''
    }

    handleValidate = (value) => {
        if (!this.unmount) {
            const { rules } = this.props
            value = typeof value !== 'undefined' ? value : this.state.value
            let _msg = this.handleValidateValue(value, rules)
            this.setState({ validateMessage:_msg })
            return _msg === '' || false
        } else {
            return true
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable })
            /* if (nextProps.editable) {
                this.isSelect = false
                this.handleChange(this.state.value, true)
            } */
        }
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value })
        }
        /* if (nextProps.restorePrevValue && !nextProps.editable) {
            this.setState({ value: this.catchValue })
        } */
    }
    handleChange(value, isValidate) {
        const { onSearch, option } = this.props
        // 验证
        if (!isValidate && !this.handleValidate(value)) {
            this.setState({ value })
            return false
        }
        if (!this.isSelect) {
            if (this.handleChangeTimer) clearTimeout(this.handleChangeTimer)
            this.setState({ value })
            this.handleChangeTimer = setTimeout(() => {
                onSearch(value, (items) => {
                    this.setState({ data:items })
                })
            }, 400)
        } else {
            var _val = this.state.data.filter((item) => {
                return (item[option.valueField].toString() === value)
            })
            this.setState({ value: _val[0][option.textField] })
            this.isSelect = false
        }
    }
    handleSubmit() {
        console.log('输入框内容是: ', this.state.value)
    }
    handleFocus() {
        this.setState({ focus: true })
    }
    handleBlur() {
        this.setState({ focus: false })
    }
    handleSelect(value) {
        this.isSelect = true
        const { onChange, option } = this.props
        const { data } = this.state
        if (onChange instanceof Function) {
            var _val = data.filter((item) => {
                return (item[option.valueField].toString() === value)
            })
            onChange(..._val)
        }
    }
    check = () => {
        this.isEdit = false
        this.setState({ independentEdit: false })
        if (this.props.onChange) {
            this.props.onChange(this.state.value)
        }
    }
    edit = () => {
        this.isEdit = true
        this.setState({ independentEdit: true })
    }
    render() {
        const { independent, option } = this.props
        const { value, editable, data, independentEdit, validateMessage } = this.state
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!(this.state.value || '').trim()
        })
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus
        })
        const options = data.map((d, i) => {
            let val = d[option.valueField] ? d[option.valueField].toString() : d.value.toString()
            let text = d[option.textField] ? d[option.textField].toString() : d.text
            return <Option key={val + '-' + i} value={val}>{text}</Option>
        })
        return (
            editable || this.isEdit ?
                <div className={'editable-cell ant-search-input-wrapper' + (validateMessage !== '' ? ' editable-cell-error' : '')}
                  style={this.props.style}>
                    <Input.Group className={searchCls}>
                        <Select combobox value={this.state.value} placeholder={this.props.placeholder} notFoundContent=""
                          defaultActiveFirstOption={false} showArrow={false} filterOption={false}
                          onChange={this.handleChange}
                          onFocus={this.handleFocus}
                          onBlur={this.handleBlur}
                          onSelect={this.handleSelect}
                        >
                            {options}
                        </Select>
                        <div className="ant-input-group-wrap">
                            <Button className={btnCls} onClick={e => this.handleSubmit}>
                                <Icon type="search" />
                            </Button>
                        </div>
                    </Input.Group>
                    {
                        independent && independentEdit && !editable ?
                            <Icon type="check" className="editable-cell-icon-check" onClick={this.check} /> :
                            ''
                    }
                    <p className="editable-validate-msg">{validateMessage}</p>
                </div> :
                <div className="editable-cell editable-row-text">
                    {value || ' '}
                    {
                        independent ?
                            <Icon type="edit" className="editable-cell-icon" onClick={this.edit} /> :
                            ''
                    }
                </div>
        )
    }
    componentWillUnmount() {
        this.unmount = true
    }
}
