/**
 * Created by xwatson on 2017/1/23.
 */
import './NotFound.scss'
import React from 'react'
import { Icon } from 'antd'

export default class NotFound extends React.Component {
    render() {
        return (
            <div className="page-not-found"><Icon type="smile-o" />&nbsp;敬请期待...</div>
        )
    }
}
