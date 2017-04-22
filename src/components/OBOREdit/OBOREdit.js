/**
 * 编辑列表
 * Created by xwatson on 2017/1/10.
 */
import React from 'react'
import QueryList from '../QueryList'

export default class OBOREdit extends React.Component {
    static propTypes = {
        options: React.PropTypes.array,
        colSpan: React.PropTypes.number,
        style: React.PropTypes.object,
        edit: React.PropTypes.bool
    }
    /**
     * 调用验证
     * @param e 事件对象
     * @param callback 回调函数
     */
    handleValidator = (e, callback) => {
        // 查找到QueryList里的handleSearch并调用
        this.refs.QueryList.refs.wrappedComponent.refs.formWrappedComponent.handleSearch(e, callback)
    }
    render() {
        console.log('啊啊啊', this.props.edit)
        return (
            <QueryList style={this.props.style} queryOptions={this.props.options} colSpan={this.props.colSpan} showSearch={false} ref="QueryList"
              edit={this.props.edit} />
        )
    }
}
