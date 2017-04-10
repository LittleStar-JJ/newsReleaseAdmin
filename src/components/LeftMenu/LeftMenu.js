/**
 * Created by xwatson on 2016/12/9.
 */
import React from 'react'
import { Link, browserHistory } from 'react-router'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
const reg = /^(\/)(items)(\/)?/

export default class LeftMenu extends React.Component {
    static propTypes = {
        menus: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        // this.handleClick = this.handleClick.bind(this)
        this.hasClick = false
        this.location = browserHistory.getCurrentLocation()
        this.defaultOpenKeys = []
    }

    state={
        current:browserHistory.getCurrentLocation().pathname,
        openKeys:[this.props.menus.subs[0].key]
    }

    handleClick = (e) => {
        console.log('sssssssss1')
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
    convertDetailPage() {
        this.location = browserHistory.getCurrentLocation()
        let match = location.pathname.match(reg)
        return match && match[3] ? '/' + match[2] : location.pathname
    }
    _renderSubs(menus) {
        const _pathName = this.location.pathname
        let _this = this
        return menus.map(function(item) {
            if (item.items) {
                return (
                    <SubMenu key={item.key} name={item.name} title={item.title}>
                        {
                            item.items.map(function(item2) {
                                if (_pathName === item2.router) {
                                    _this.defaultOpenKeys = [item.key]
                                }
                                return <Menu.Item key={item2.router} name={item2.name}><Link to={item2.router}>{item2.name}</Link></Menu.Item>
                            })
                        }
                    </SubMenu>
                )
            } else {
                return (
                    <Menu.Item key={item.key}><Link to={item.router}>{item.title}</Link></Menu.Item>
                )
            }
        })
    }
    render() {
        this.hasClick = false
        let { menus } = this.props
        let current = this.hasClick ? this.state.current : this.convertDetailPage()
        const subs = this._renderSubs(menus.subs)
        return (
            <Menu onClick={this.handleClick} selectedKeys={[current]} theme={menus.theme} mode="inline"
              defaultOpenKeys={this.defaultOpenKeys} onOpenChange={this.onOpenChange} >
                {subs}
            </Menu>
        )
    }
}
