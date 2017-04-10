/**
 * Created by xwatson on 2016/12/9.
 */
import React from 'react'
import { browserHistory, Link } from 'react-router'
import { Breadcrumb } from 'antd'
const reg = /^(\/)(\w*)(\/)?/

export default class Breadcrumbs extends React.Component {
    static propTypes = {
        menus: React.PropTypes.object
    }
    recursionCount = 0
    prevItems = []
    _setBreadcrumb = () => {
        this.recursionCount = 0
        let location = browserHistory.getCurrentLocation()
        let match = location.pathname.match(reg)
        let path = match ? '/' + match[2] : ''
        let _bread = [<Breadcrumb.Item key={'bread-0'}>{match ? <Link to="/">首页</Link> : '首页'}</Breadcrumb.Item>]
        let subs = this.props.menus.subs
        const _this = this
        subs.forEach(function(sub) {
            if (sub.items) {
                _this.recursionItems(sub.items, path, _bread)
            }
        })
        return _bread
    }
    recursionItems = (items, pathname, bread) => {
        items.forEach((item, i) => {
            if (item.router === pathname) {
                if (this.recursionCount === 0) {
                    bread.push(<Breadcrumb.Item key={'bread-' + i + '-' + this.recursionCount}>{item.name}</Breadcrumb.Item>)
                } else {
                    this.prevItems.forEach((p, j) => {
                        bread.push(<Breadcrumb.Item key={'bread-' + i + '-' + this.recursionCount + '-' + j}><Link to={p.router}>{p.name}</Link></Breadcrumb.Item>)
                    })
                    bread.push(<Breadcrumb.Item key={'bread-' + i + '-' + this.recursionCount}>{item.name}</Breadcrumb.Item>)
                }
                return false
            } else if (item.items) {
                this.recursionCount++
                this.prevItems.push(item)
                this.recursionItems(item.items, pathname, bread)
                this.prevItems = []
                this.recursionCount--
            }
        })
    }
    render() {
        return (
            <Breadcrumb>
                {this._setBreadcrumb()}
            </Breadcrumb>
        )
    }
}
