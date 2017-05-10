/**
 * Created by xwatson on 2016/12/9.
 */
import React from 'react'
import { Link, browserHistory } from 'react-router'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
const reg = /^\/(\w+)\/?/

export default class LeftMenu extends React.Component {
    static propTypes = {
        menus: React.PropTypes.array.isRequired,
        mode: React.PropTypes.string
    }
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.hasClick = false
        this.location = browserHistory.getCurrentLocation()
        this.defaultOpenKeys = []
        this.currentItem = null
    }
    state={
        current:browserHistory.getCurrentLocation().pathname,
        openKeys:[]
    }
    handleClick(e) {
        this.hasClick = true
        this.setState({
            current: e.key
        })
    }
    onOpenChange = (openKeys) => {
        try {
            const state = this.state
            const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1))
            const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1))

            let nextOpenKeys = []
            if (latestOpenKey) {
                nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey)
            }
            if (latestCloseKey) {
                nextOpenKeys = this.getAncestorKeys(latestCloseKey)
            }
            this.setState({ openKeys: nextOpenKeys })
        } catch (e) {
        }
    }
    getAncestorKeys = (key) => {
        const map = {
            sub3: ['sub2']
        }
        return map[key] || []
    }
    convertDetailPage = () => {
        this.location = browserHistory.getCurrentLocation()
        let match = location.pathname.match(reg)
        this.currentItem = null
        if (match && match[1]) {
            this.props.menus.forEach((sub) => {
                this.recursionItems(sub.child, '/' + match[1])
            })
        }
        return this.currentItem.toString()
    }
    recursionItems = (items, pathname, pre) => {
        items.forEach((item, i) => {
            if (!this.currentItem) {
                if (item.router === pathname) {
                    this.currentItem = (pre || {}).id || item.id
                    return false
                } else if (item.child) {
                    this.recursionItems(item.child, pathname, item.child)
                }
            }
        })
        if (this.currentItem) return false
    }
    _renderSubs = (menus) => {
        const _pathName = this.location.pathname
        return menus.map((item) => {
            if (item.child) {
                const title = <span><Icon type={item.icon} /><span>{item.name}</span></span>
                return (
                    <SubMenu key={item.id} name={item.name} title={title}>
                        {
                            this._renderSubs(item.child)
                        }
                    </SubMenu>
                )
            } else {
                if (_pathName === item.router) {
                    this.defaultOpenKeys = [item.key]
                }
                return (
                    <Menu.Item key={item.id}><Link to={item.router}>{item.name}</Link></Menu.Item>
                )
            }
        })
    }
    render() {
        this.hasClick = false
        let { menus } = this.props
        let current = this.hasClick ? this.state.current : this.convertDetailPage()
        return (
            <Menu onClick={this.handleClick} selectedKeys={[current]} theme="dark"
              defaultOpenKeys={this.defaultOpenKeys} mode={this.props.mode} onOpenChange={this.onOpenChange} >
                {this._renderSubs(menus)}
            </Menu>
        )
    }
}
