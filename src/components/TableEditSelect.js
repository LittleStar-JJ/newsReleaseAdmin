/**
 * Created by xwatson on 2016/12/22.
 */
import React, { PropTypes } from 'react'
import { Select, Icon } from 'antd'
const Option = Select.Option

export default class TableEditSelect extends React.Component {
    static propTypes = {
        value: PropTypes.string,
        editable: PropTypes.bool,
        independent: React.PropTypes.bool,
        status: PropTypes.string,
        onChange: PropTypes.func,
        showSearch: PropTypes.bool,
        options: PropTypes.array
    }
    state = {
        value: this.props.value,
        editable: this.props.editable || false,
        independentEdit: false
    }
    constructor(props) {
        super(props)
        this.isEdit = false
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.editable !== this.state.editable) {
            this.setState({ editable: nextProps.editable })
        }
    }

    handleChange(value) {
        // const { onChange, options } = this.props
        const { onChange } = this.props
        this.setState({ value })
        if (onChange instanceof Function) {
            /* let _val = options.filter((item) => {
                return (item.value === value)
            }) */
            onChange(value)
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
        const { value, editable, independentEdit } = this.state
        const { showSearch, options, independent } = this.props
        return (<div className="editable-cell">
            {
                editable || this.isEdit ?
                    <div>
                        <Select showSearch={showSearch} style={{ width: 200 }} placeholder="Select a person"
                          optionFilterProp="children"
                          onChange={(value) => this.handleChange.call(this, value)}>
                            {
                                options.map((item, i) => {
                                    return <Option key={'select-option-' + i} value={item.value}>{item.text}</Option>
                                })
                            }
                        </Select>
                        {
                            independent && independentEdit && !editable ?
                                <Icon type="check" className="editable-cell-icon-check" onClick={this.check} /> :
                                ''
                        }
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
        </div>)
    }
}
