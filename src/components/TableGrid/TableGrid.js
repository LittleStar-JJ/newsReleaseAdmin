/**
 * Created by xwatson on 2016/12/31.
 */
import './TableGrid.scss'
import React from 'react'
import { Table, Popconfirm, Icon, Popover } from 'antd'
import TableEditInput from '../../components/TableEditInput'
import TableEditSelect from '../../components/TableEditSelect'
import TableEditInputSearch from '../../components/TableEditInputSearch'

export default class TableGrid extends React.Component {
    static propTypes = {
        columns: React.PropTypes.array.isRequired,
        dataSource: React.PropTypes.array,
        rowSelection: React.PropTypes.object,
        pagination: React.PropTypes.object,
        expandedRowKeys: React.PropTypes.array,
        expandedRowRender: React.PropTypes.any,
        scroll: React.PropTypes.object,
        // clearCallBack: React.PropTypes.func,
        isClearRowKeys: React.PropTypes.bool // 是否清除选择的数据
    }
    constructor(props) {
        super(props)
        this.dataCatch = []
        this.isOnExpand = false
        this.gridPaginPage = {}
        this.gridPaginPageNum = 1
        this.catchColumns = props.columns
        this.initState(true, props.dataSource)
        this.editInputValidates = {}
        this.catchClearRowKeys = props.isClearRowKeys
    }
    initState(init, data) {
        const columns = this.catchColumns
        if (!data || !(data instanceof Array)) data = []
        let editable = {}
        this.dataCatch.forEach((item, i) => {
            if (data.indexOf(item) === -1) {
                this.dataCatch.splice(i, 1)
            }
        })
        data.forEach((item, i) => {
            item['key'] = item.id || i
            editable[i] = {}
            if (this.dataCatch.indexOf(item) === -1) {
                this.dataCatch.push(item)
            }
            columns.forEach((col) => {
                editable[i][col.dataIndex] = {
                    editable: this.dataCatch[i].OBORGridEditable === undefined ? col.editable ? col.editable.editable || false : undefined : this.dataCatch[i].OBORGridEditable
                }
            })
        })
        if (init) {
            this.state = {
                editable: editable,
                data: data,
                rowSelectCount:0,
                expandedRowKeys: this.props.expandedRowKeys || [],
                selectedRowKeys:[]
            }
        } else {
            this.setState({ editable:editable, data: data, expandedRowKeys: this.props.expandedRowKeys || [] })
        }
    }
    componentWillMount() {
        // this.props.clearCallBack(this.clearSelectedAll)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.dataSource) {
            this.catchColumns = nextProps.columns
            this.initState(false, nextProps.dataSource)
        }
        if (nextProps.isClearRowKeys && this.catchClearRowKeys !== nextProps.isClearRowKeys) {
            this.catchClearRowKeys = nextProps.isClearRowKeys
            this.setState({ selectedRowKeys:[], rowSelectCount:0 })
        } else {
            this.catchClearRowKeys = nextProps.isClearRowKeys
        }
    }

    /**
     * 编辑框验证
     * @returns {boolean} 返回验证结果
     */
    handleValidateEditInput = () => {
        let isValidate = true
        Object.keys(this.editInputValidates).forEach((key) => {
            if (isValidate) {
                isValidate = this.editInputValidates[key]()
            } else {
                // 继续验证其他输入框
                this.editInputValidates[key]()
            }
        })
        return isValidate
    }
    _setColumns(columns, data) {
        columns.forEach((item) => {
            const editable = item.editable
            if (editable && !item.render) {
                switch (editable.type) {
                    case 'input':
                        item['render'] = (text, record, index) => this._renderInput(editable, data, index, item.dataIndex, text)
                        break
                    case 'select':
                        item['render'] = (text, record, index) => this._renderSelect(editable, data, index, item.dataIndex, text)
                        break
                    case 'inputSearch':
                        item['render'] = (text, record, index) => this._renderInputSearch(editable, data, index, item.dataIndex, text)
                        break
                    case 'btn':
                        item['render'] = (text, record, index) => this._renderBtns(item.btns, data, index, item.dataIndex, text)
                        break
                    default:
                        item['render'] = (text, record, index) => this._renderText(editable, data, index, item.dataIndex, text)
                        break
                }
            } else if (item.type === 'operation' && !item.render) {
                item['render'] = (text, record, index) => this._renderBtns(item.btns, data, index, item.dataIndex, text)
            } else if (!item.render) {
                item['render'] = (text, record, index) => this._renderText(item, data, index, item.dataIndex, text)
            }
        })
        return columns
    }
    _renderBtns(btns, data, index, key, text) {
        let doms = []
        btns.forEach((btn) => {
            const attr = this.getStatusActions(btn, data, index)
            if (Object.keys(attr).length > 0) {
                if (!attr.show) return false
            }
            if (btn.type === 'link') {
                doms.push(this._renderOperationLink(btn, data, index, key, text))
            } else if (btn.type === 'edit') {
                doms.push(this._renderOperationEdit(btn, data, index, key, text))
            } else if (btn.type === 'popConfirm') {
                doms.push(this._renderOperationPopConfirm(btn, data, index, key, text))
            }
        })
        return doms
    }
    _renderOperationLink(btn, data, index, key, text) {
        return (
            <span key={Math.random()} className="table-grid-operation"><a onClick={() => btn.onClick(index)}>{btn.text}</a></span>
        )
    }
    _renderOperationPopConfirm(btn, data, index, key, text) {
        return (
            <span key={Math.random()} className="table-grid-operation"><Popconfirm title={btn.title} onConfirm={() => btn.onClick(index)}><a>{btn.text}</a></Popconfirm></span>
        )
    }
    _renderOperationEdit(btn, data, index, key) {
        const { editable } = this.state.editable[index][key]
        return (
            editable ?
                <span key={Math.random()}>
                    <a onClick={() => this.editDone(index, 'save', btn)}>{btn.saveText ? btn.saveText : '保存'}</a>&nbsp;&nbsp;
                    <Popconfirm title={btn.cancelMessage ? btn.cancelMessage : '确定取消吗'} onConfirm={() => this.editDone(index, 'cancel', btn)}>
                        <a>{btn.cancelText ? btn.cancelText : '取消'}</a>
                    </Popconfirm>
                </span> :
                <span key={Math.random()}>
                    <a onClick={() => this.edit(index)}>{btn.text}</a>
                </span>
        )
    }
    edit(index) {
        const { editable } = this.state
        Object.keys(editable[index]).forEach((key) => {
            editable[index][key].editable = true
            this.dataCatch[index]['OBORGridEditable'] = true
        })
        this.setState({ editable })
    }
    editDone(index, type, btn, data) {
        // 验证通过后
        if (type !== 'cancel' && this.handleValidateEditInput()) {
            this.setEditable(index, type, btn, data)
            if (type === 'save') {
                if (btn.onSave instanceof Function) {
                    btn.onSave(index)
                }
            }
        }
        if (type === 'cancel') {
            this.setEditable(index, type, btn, data, true)
            if (btn.onCancel instanceof Function) {
                btn.onCancel(index)
            }
        }
    }
    setEditable = (index, type, btn, data, restorePrevValue) => {
        const { editable } = this.state
        Object.keys(editable[index]).forEach((key) => {
            if (editable[index][key] && typeof editable[index][key].editable !== 'undefined') {
                editable[index][key].editable = false
                editable[index][key].restorePrevValue = restorePrevValue
                this.dataCatch[index]['OBORGridEditable'] = false
            }
        })
        this.setState({ editable })
    }
    getStatusActions(column, data, index) {
        let attr = {}
        if (column.status) {
            column.status.actions.forEach((s) => {
                Object.keys(s).forEach((ac) => {
                    if (data[index][column.status.field] === ac) {
                        Object.assign(attr, s[ac])
                    }
                })
            })
        }
        return attr
    }
    _renderText(columnsEditable, data, index, key, text) {
        const popovers = []
        if (columnsEditable.popover && columnsEditable.popover.length) {
            columnsEditable.popover.forEach((item, i) => {
                popovers.push(<p key={'Popover' + item.id + '-' + i}>{item.label}：{eval('data[index].' + item.field)}</p>)
            })
        }
        return (
            <span {...this.getStatusActions(columnsEditable, data, index)} >
                {text}&nbsp;
                {
                    popovers.length ?
                        <Popover content={<div>{popovers}</div>} placement="right">
                            <Icon type="question-circle" style={{ cursor: 'pointer' }} />
                        </Popover> : ''
                }
            </span>
        )
    }
    _renderInput(columnsEditable, data, index, key, text) {
        const { editable } = this.state.editable[index][key]
        if (typeof editable === 'undefined') {
            return text
        }
        const editInputRef = 'TableEditInput-' + index + '-' + key
        return <TableEditInput editable={editable} bindValidate={(callback) => { this.editInputValidates[editInputRef] = callback }}
          independent={columnsEditable.independent} value={text} dataIndex={index} dataKey={key} restorePrevValue={this.state.editable[index][key].restorePrevValue}
          onChange={value => columnsEditable.onChange(key, index, value)} onBlur={input => columnsEditable.onBlur && columnsEditable.onBlur(key, index, input)} rules={columnsEditable.rules || []} />
    }
    _renderInputSearch(columnsEditable, data, index, key, text) {
        const { editable } = this.state.editable[index][key]
        if (typeof editable === 'undefined') {
            return text
        }
        const editInputRef = 'TableEditInputSearch-' + index + '-' + key
        return (
            <TableEditInputSearch style={{ width:'80%' }} editable={editable} independent={columnsEditable.independent} option={columnsEditable.option}
              onSearch={(value, callback) => columnsEditable.onSearch(key, index, value, callback)} value={text} bindValidate={callback => { this.editInputValidates[editInputRef] = callback }}
              onChange={value => columnsEditable.onChange(key, index, value)} rules={columnsEditable.rules || []} restorePrevValue={this.state.editable[index][key].restorePrevValue} />
        )
    }
    _renderSelect(columnsEditable, data, index, key, text) {
        const { editable } = this.state.editable[index][key]
        if (typeof editable === 'undefined') {
            return text
        }
        const editSelectRef = 'TableEditSelect-' + index + '-' + key
        return (
            <TableEditSelect editable={editable} option={columnsEditable.option} independent={columnsEditable.independent}
              bindValidate={callback => { this.editInputValidates[editSelectRef] = callback }} rules={columnsEditable.rules || []}
              value={eval('data[index].' + columnsEditable.option.selected)} onChange={value => columnsEditable.onChange(key, index, value)} />
        )
    }
    render() {
        const { columns, rowSelection, expandedRowKeys, pagination } = this.props
        const eEowKeys = this.isOnExpand ? this.state.expandedRowKeys : expandedRowKeys || []
        this.isOnExpand = false
        const { data } = this.state
        // 处理CheckBox选择
        const _rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ rowSelectCount:selectedRowKeys.length, selectedRowKeys:selectedRowKeys })
                if (this.props.rowSelection && this.props.rowSelection.onChange instanceof Function) {
                    this.props.rowSelection.onChange(selectedRowKeys, selectedRows)
                }
            }
        }
        if (rowSelection && !rowSelection.selectedRowKeys) {
            _rowSelection.selectedRowKeys = this.state.selectedRowKeys
        }
        const gridRowSelection = Object.assign({}, rowSelection, rowSelection && rowSelection.selectedRowKeys ? {} : _rowSelection)
        if (data) {
            const _columns = this._setColumns(columns, data)
            return (
                <div>
                    {
                        rowSelection &&
                        <div className="table-row-selection">
                            <Icon type="info-circle" style={{ color:'#108ee9' }} />&nbsp;
                            已选择 {rowSelection && rowSelection.selectedRowKeys ? rowSelection.selectedRowKeys.length : this.state.rowSelectCount} 项数据。
                            <a style={{ float:'right' }} onClick={this.clearSelectedAll}>清除 <Icon type="close" /></a>
                        </div>
                    }
                    <Table className="table-grid" ref="Tableqq" pagination={pagination || false} expandedRowKeys={eEowKeys} onExpand={this._onExpand}
                      expandedRowRender={this.props.expandedRowRender} scroll={this.props.scroll} rowSelection={rowSelection && gridRowSelection} dataSource={data} columns={_columns} />
                </div>
            )
        } else {
            return <div>请稍后...</div>
        }
    }
    clearSelectedAll = () => {
        const { rowSelection } = this.props
        if (rowSelection.onChange) {
            rowSelection.onChange([], null)
        } else if (rowSelection.onSelect) {
            rowSelection.onSelect({}, false, [])
        } else if (rowSelection.onSelectAll) {
            rowSelection.onSelectAll(false, [], [])
        }
        this.setState({ rowSelectCount:0, selectedRowKeys:[] })
    }
    _onExpand = (expanded, record) => {
        if (!this.props.expandedRowKeys) {
            this.isOnExpand = true
            expanded ? this.state.expandedRowKeys = [record.id] : this.state.expandedRowKeys = []
            this.setState({ expandedRowKeys: this.state.expandedRowKeys })
        }
    }
}
