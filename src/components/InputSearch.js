/**
 * Created by xwatson on 2017/1/13.
 */
import React from 'react'
import { Button, Input, Select, Icon } from 'antd'
const Option = Select.Option
import classNames from 'classnames'

export default class InputSearch extends React.Component {
    static propTypes = {
        style: React.PropTypes.object,
        placeholder: React.PropTypes.string,
        initialValue: React.PropTypes.string,
        option: React.PropTypes.object,
        onSearch: React.PropTypes.func,
        onChange: React.PropTypes.func,
        clearValue: React.PropTypes.bool
    }
    state = {
        inputSearchValue: this.props.initialValue || '',
        inputSearchData: this.props.option.options || [],
        inputSearchFocus: false
    }
    constructor(props) {
        super(props)
        this.isInputSearchChange = false
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.clearValue) {
            this.setState({ inputSearchValue:'' })
            this.handleInputSearchSelect(this.state.inputSearchValue)
        }
        if (!this.isInputSearchChange && nextProps.initialValue && nextProps.initialValue !== this.state.inputSearchValue) {
            this.setState({ inputSearchValue:nextProps.initialValue })
        }
        if (!this.isInputSearchChange && nextProps.option && nextProps.option.options && nextProps.option.options !== this.state.inputSearchData) {
            this.setState({ inputSearchData:nextProps.option.options || [] })
        }
    }
    // 搜索下拉框
    handleInputSearchChange = (value) => {
        const { onSearch, option } = this.props
        this.isInputSearchChange = true
        if (!this.isInputSearchSelect) {
            if (this.handleInputSearchChangeTimer) clearTimeout(this.handleInputSearchChangeTimer)
            this.setState({ inputSearchValue: value })
            this.handleInputSearchChangeTimer = setTimeout(() => {
                onSearch(value, (items) => {
                    this.setState({ inputSearchData:items })
                })
            }, 400)
        } else {
            var _val = this.state.inputSearchData.filter((item) => {
                return (item[option.valueField].toString() === value)
            })
            this.setState({ inputSearchValue: (_val[0] || {})[option.textField] || value })
            this.isInputSearchSelect = false
        }
    }
    handleInputSearchSubmit = () => {
        console.log('输入框内容是: ', this.state.inputSearchValue)
    }
    handleInputSearchFocus = () => {
        this.setState({ inputSearchFocus: true })
    }
    handleInputSearchBlur = () => {
        this.setState({ inputSearchFocus: false })
    }
    handleInputSearchSelect = (value) => {
        const { onChange, option } = this.props
        this.isInputSearchSelect = true
        if (onChange instanceof Function) {
            let _val = this.state.inputSearchData.filter((item) => {
                return (item[option.valueField].toString() === value)
            })
            onChange(_val[0] || {})
        }
    }
    handleValidator = () => {
        return this.state.inputSearchValue
    }
    render() {
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.inputSearchValue.trim()
        })
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.inputSearchFocus
        })
        const { style, placeholder, option } = this.props
        const options = this.state.inputSearchData.map((d, i) => {
            let val = d[option.valueField] ? d[option.valueField].toString() : d.value.toString()
            let text = d[option.textField] ? d[option.textField].toString() : d.text
            return <Option key={val + '-' + i} value={val + ''}>{text}</Option>
        })
        return (
            <div style={style}>
                <Input.Group className={searchCls}>
                    <Select value={this.state.inputSearchValue} combobox placeholder={placeholder} notFoundContent=""
                      defaultActiveFirstOption={false} showArrow={false} filterOption={false}
                      onChange={this.handleInputSearchChange}
                      onFocus={this.handleInputSearchFocus}
                      onBlur={this.handleInputSearchBlur}
                      onSelect={this.handleInputSearchSelect} >
                        {options}
                    </Select>
                    <div className="ant-input-group-wrap">
                        <Button className={btnCls} onClick={this.handleInputSearchSubmit}>
                            <Icon type="search" />
                        </Button>
                    </div>
                </Input.Group>
            </div>
        )
    }
}
