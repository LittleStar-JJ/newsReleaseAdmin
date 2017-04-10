/**
 * Created by xwatson on 2016/12/8.
 */
import React from 'react'
import { Icon, Dropdown, Menu } from 'antd'
import LeftMenu from '../../components/LeftMenu'
import Breadcrumb from '../../components/Breadcrumb'
import BaseLayout from '../Base/BaseLayout'
// import Auth from '../../utils/Auth'
import './CoreLayout.scss'
import '../../styles/main.scss'

const lMeuns = {
    theme: 'dark', // 主题
    subs: [
        {
            key: 'meter',
            name: '仪表盘',
            router:'/Dashboard',
            title: <span><Icon type="pie-chart" /><span>仪表盘</span></span>
        },
        {
            key: 'account',
            name: '账号管理',
            title: <span><Icon type="usergroup-add" /><span>账号管理</span></span>,
            items: [
                {
                    router: '/adminList',
                    name: '管理员管理',
                    items:[]
                },
                {
                    router: '/userList',
                    name: '会员管理',
                    items:[
                        {
                            router: '/userEdit',
                            name: '会员编辑'
                        }
                    ]
                }
            ]
        },
        {
            key: 'authority',
            name: '权限管理',
            title: <span><Icon type="switcher" /><span>权限管理</span></span>,
            items: [
                {
                    router: '/authorityList',
                    name: '权限列表',
                    items:[
                        {
                            router: '/authorityEdit',
                            name: '权限编辑'
                        }
                    ]
                }
            ]
        },
        {
            key: 'classify',
            name: '分类管理',
            title: <span><Icon type="switcher" /><span>分类管理</span></span>,
            items: [
                {
                    router: '/classifyList',
                    name: '分类列表',
                    items:[
                        {
                            router: '/classifyEdit',
                            name: '分类编辑'
                        }
                    ]
                }
            ]
        },
        {
            key: 'news',
            name: '新闻管理',
            title: <span><Icon type="code-o" /><span>新闻管理</span></span>,
            items: [
                {
                    router: '/newsList',
                    name: '新闻列表',
                    items:[
                        {
                            router: '/newsEdit',
                            name: '新闻编辑'
                        }
                    ]
                }
            ]
        },
        {
            key: 'comment',
            name: '评论管理',
            title: <span><Icon type="edit" /><span>评论管理</span></span>,
            items: [
                {
                    router: '/commentList',
                    name: '评论列表',
                    items:[
                        {
                            router: '/newsDetail',
                            name: '评论查看'
                        }
                    ]
                }
            ]
        },
        {
            key: 'websitSet',
            name: '网站设置',
            title: <span><Icon type="setting" /><span>网站设置</span></span>,
            items: [
                {
                    router: '/linksList',
                    name: '友情链接',
                    items:[
                        {
                            router: '/newsDetail',
                            name: '友情链接编辑'
                        }
                    ]
                }
            ]
        }
    ]
}
export class CoreLayout extends BaseLayout {
    render() {
        let meuns = lMeuns
        const DropdownMenu = (
            <Menu>
                <Menu.Item>
                    <a rel="noopener noreferrer" onClick={this.loginOut} ><Icon type="poweroff" />&nbsp;退出登录</a>
                </Menu.Item>
            </Menu>
        )
        return (
            <div className="ant-layout-aside">
                <aside className="ant-layout-sider">
                    <div className="ant-layout-logo">&nbsp;</div>
                    <LeftMenu menus={meuns} />
                    <div className="user-bar">
                        <p>
                            <Dropdown overlay={DropdownMenu} trigger={['click']}>
                                <a><Icon type="user" />&nbsp;&nbsp;<Icon className="dd-up" type="up" /></a>
                            </Dropdown>
                        </p>
                    </div>
                </aside>
                <div className="ant-layout-main">
                    {/* <div className="ant-layout-header"></div> */}
                    <div className="ant-layout-breadcrumb">
                        {/* <LangSwitch changeLocale={this.changeLocale} /> */}
                        <Breadcrumb menus={meuns} />
                    </div>
                    <div className="ant-layout-container">
                        <div className="ant-layout-content">
                            {this.props.children}
                        </div>
                    </div>
                    <div className="ant-layout-footer">
                        <p className="copyright">OBORCloud 版权所有 © 2016</p>
                    </div>
                </div>
            </div>
        )
    }
}

CoreLayout.propTypes = {
    children: React.PropTypes.element.isRequired
}

export default CoreLayout
