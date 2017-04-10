/**
 * Created by xwatson on 2016/12/22.
 */
import '../styles/TableEdit.scss'
import React from 'react'
import baseComponent from './baseComponent'
import { Input, Icon } from 'antd'

export default class TableEditInput extends baseComponent {
    static propTypes = {
        value: React.PropTypes.any,
        editable: React.PropTypes.bool,
        restorePrevValue: React.PropTypes.bool,
        independent: React.PropTypes.bool,
        status: React.PropTypes.string,
        rules: React.PropTypes.array,
        bindValidate: React.PropTypes.func,
        dataIndex: React.PropTypes.number,
        dataKey: React.PropTypes.string
    }
    state = {
        value: this.props.value || '',
        editable: this.props.editable,
        independentEdit: false,
        validateMessage:''
    }
    constructor(props) {
        super(props)
        this.isEdit = false
        this.unmount = false
        this.catchValue = props.value
    }
    componentWillMount() {
        if (this.props.bindValidate instanceof Function) {
            this.props.bindValidate(this.handleValidate)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable })
        }
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value })
        }
        if (nextProps.restorePrevValue && !nextProps.editable) {
            this.setState({ value: this.catchValue })
            if (this.props.onChange) {
                this.props.onChange(this.catchValue)
            }
        }
    }
    handleValidate = (value) => {
        if (!this.unmount) {
            const { rules, dataIndex, dataKey } = this.props
            value = typeof value !== 'undefined' ? value : this.state.value
            const _msg = this.handleValidateValue(value, rules, dataIndex, dataKey)
            this.setState({ validateMessage: _msg })
            return _msg === '' || false
        } else {
            return true
        }
    }
    handleChange(e) {
        const value = e.target.value
        this.handleValidate(value)
        this.setState({ value })
        this.props.onChange(value)
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
        const { value, editable, independentEdit, validateMessage } = this.state
        const { independent } = this.props
        return (
            <div className={'editable-cell' + (validateMessage !== '' ? ' editable-cell-error' : '')}>
                {
                    editable || this.isEdit ?
                        <div>
                            <Input value={value} onChange={e => this.handleChange(e)} />
                            {
                                independent && independentEdit && !editable ?
                                    <Icon type="check" className="editable-cell-icon-check" onClick={this.check} /> :
                                    ''
                            }
                            <p className="editable-validate-msg" title={validateMessage}>{validateMessage}</p>
                        </div> :
                        <div className="editable-row-text">
                            {value || ' '}
                            {
                                independent ?
                                    <Icon type="edit" className="editable-cell-icon" onClick={this.edit} /> :
                                    ''
                            }
                        </div>
                }
            </div>
        )
    }
    componentWillUnmount() {
        this.unmount = true
    }
}
