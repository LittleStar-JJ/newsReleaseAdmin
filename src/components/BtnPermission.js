/**
 * Created by xwatson on 2016/12/15.
 */
import React, { PropTypes } from 'react'
import Auth from '../utils/Auth'

// const permissionBtns = ['CREATE', 'DELETE', 'UPDATE', 'SELECT', 'REVIEW', 'SORT']
export default class BtnPermission extends React.Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        children: PropTypes.object
    }
    constructor(props) {
        super(props)
        const user = Auth.getAccount() || {}
        const operations = (user.Auth || {}).AuthOperation || []
        this.permissionBtns = []
        operations.map((item) => {
            this.permissionBtns.push(item.type)
        })
    }
    render() {
        // 如果当前按钮类型在权限内
        if (this.permissionBtns.indexOf(this.props.type) > -1) {
            return (
                this.props.children
            )
        } else {
            return (
                <span>&nbsp;</span>
            )
        }
    }
}
