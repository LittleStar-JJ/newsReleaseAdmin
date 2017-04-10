/**
 * Created by xwatson on 2017/1/9.
 */
import './OBORCascader.scss'
import React from 'react'
import { Cascader, Select } from 'antd'
import Cascade from '../../utils/Cascade'
const Option = Select.Option

export default class OBORCascader extends React.Component {
    static propTypes = {
        style: React.PropTypes.object,
        onChange: React.PropTypes.func,
        CascaderArea: React.PropTypes.object,
        country: React.PropTypes.object,
        getAllArea: React.PropTypes.func,
        getCountryList: React.PropTypes.func,
        clearCascadeState: React.PropTypes.func,
        clearWarehouse: React.PropTypes.func,
        defaultValue: React.PropTypes.any,
        placeholder: React.PropTypes.any,
        validator: React.PropTypes.any
    }
    state = {
        options : undefined,
        hasValidator: true,
        validatorMsg: '',
        value:[],
        country:[],
        countrySelect:undefined
    }
    constructor(props) {
        super(props)
        this.isGetArea = false
        this.cascadeValue = this.props.defaultValue
        this.cascadeDefaultValue = null
        this.validator = this.props.validator
        this.isCurrentCountry = true
    }
    onChange = (value) => {
        this.setState({ hasValidator: true, value: value })
        this.cascadeValue = value
        if (this.props.onChange instanceof Function) {
            let _country = {}
            this.state.country.forEach((item) => {
                const _countrySelect = parseInt(this.state.countrySelect)
                if (item.code === _countrySelect) {
                    _country = { label:item.name, value:item.code }
                }
            })
            const _val = Cascade.getArea(this.state.options, Object.assign([], [], value))
            _val.unshift(_country)
            this.props.onChange(_val)
        }
    }
    handleValidator = () => {
        let isValidator = this.cascadeValue
        if (this.validator.rules) {
            this.validator.rules.forEach((item) => {
                if (item.required) {
                    if (!(this.cascadeValue && this.cascadeValue.length > 0)) {
                        isValidator = false
                        this.setState({ hasValidator: false, validatorMsg: item.message })
                        return false
                    }
                }
            })
        }
        return isValidator
    }
    handleSelectChange = (value) => {
        this.isGetArea = true
        this.cascadeValue = []
        this.setState({ countrySelect:value, options:[] })
        this.props.getAllArea(value)
    }
    componentWillMount() {
        this.props.getCountryList('')
    }
    componentWillReceiveProps(nextProps) {
        if (this.cascadeDefaultValue !== nextProps.defaultValue) {
            this.cascadeDefaultValue = nextProps.defaultValue
            this.getAreaCode(nextProps.defaultValue)
        }
        if (nextProps.country && this.isCurrentCountry) {
            this.setState({ country: nextProps.country.content })
            this.isCurrentCountry = false
        }
        if (nextProps.CascaderArea.area && this.isGetArea && nextProps.CascaderArea.area.length) {
            if (!nextProps.CascaderArea.area.length) {
                this.cascadeValue = [this.state.countrySelect]
                if (this.props.onChange instanceof Function) {
                    let _val = {}
                    this.state.country.forEach((item) => {
                        if (item.code === parseInt(this.state.countrySelect)) {
                            _val = item
                        }
                    })
                    this.props.onChange(_val)
                }
            }
            this.isGetArea = false
            this.setState({ options: nextProps.CascaderArea.area })
            this.props.clearCascadeState()
        }
    }
    getAreaCode(code) {
        let _area = []
        let start = 4
        if (code && code !== '') {
            let countrySelect = parseInt(code / 1000000) + '000000'
            this.setState({ countrySelect })
            this.isGetArea = true
            this.props.getAllArea(countrySelect)
            code = code.toString()
            for (let i = 0; i < code.length / 2 - 1; i++) {
                let _str = code.substr(0, start)
                let _len = code.length - _str.length
                for (let j = 0; j < _len; j++) {
                    _str += '0'
                }
                _area.push(parseInt(_str))
                start += 2
            }
            this.cascadeValue = _area
            this.setState({ value: _area })
        } else if (code instanceof Array) {
            this.cascadeValue = code
            this.setState({ value: code })
        } else {
            this.setState({ value: [], countrySelect:undefined })
        }
    }
    render() {
        const { style, placeholder } = this.props
        const cascadeStyle = style || {}
        cascadeStyle.width = '70%'
        const { options, country, value } = this.state
        return (
            <div className={'obor-cascade' + (this.state.hasValidator ? '' : ' cascade-has-error')}>
                <Select placeholder="国家" value={this.state.countrySelect} style={{ width:'29%', marginRight:'1%' }} onChange={this.handleSelectChange} dropdownMatchSelectWidth={false}>
                    {
                        country.map((item, i) => {
                            return <Option value={item.code + ''} key={i}>{item.name}</Option>
                        })
                    }
                </Select>
                <Cascader options={options} style={cascadeStyle} value={value} onChange={this.onChange} placeholder={placeholder} />
                <div className="obor-cascade-validator">{this.state.validatorMsg}</div>
            </div>
        )
    }
}
