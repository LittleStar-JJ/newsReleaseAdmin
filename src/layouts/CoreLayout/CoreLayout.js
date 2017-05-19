/**
 * Created by xwatson on 2016/12/8.
 */
import React from 'react'
import { Icon, Dropdown, Menu } from 'antd'
import LeftMenu from '../../components/LeftMenu'
import Breadcrumb from '../../components/Breadcrumb'
import BaseLayout from '../Base/BaseLayout'
import Auth from '../../utils/Auth'
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
                    name: '角色列表',
                    items:[
                        {
                            router: '/authorityEdit',
                            name: '角色编辑'
                        }
                    ]
                },
                {
                    router: '/menuList',
                    name: '菜单列表',
                    items:[
                        {
                            router: '/menuEdit',
                            name: '菜单编辑'
                        }
                    ]
                },
                {
                    router: '/operationList',
                    name: '操作项列表',
                    items:[
                        {
                            router: '/operationEdit',
                            name: '菜单编辑'
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
                            router: '/commentEdit',
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
                },
                {
                    router: '/siteConfig',
                    name: '站点配置',
                    items:[]
                }
            ]
        }
    ]
}
export class CoreLayout extends BaseLayout {
    loginOut = () => {
        Auth.loginOut()
        Auth.dispatchAuthExpiredAction()
    }
    render() {
        // 获取当前登录用户
        const user = Auth.getAccount() || {}
        // 格式菜单结构
        const menuData = this.recursiveMenu((user.Auth || {}).AuthMenu || [])
        // let meuns = lMeuns
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
                    {/* 菜单组件 */}
                    <LeftMenu menus={menuData} mode="inline" />
                    <div className="user-bar">
                        <p>
                            <Dropdown overlay={DropdownMenu} trigger={['click']}>
                                <a><Icon type="user" />&nbsp;&nbsp;<span className="nav-text">{user.adminName || ''}</span><Icon className="dd-up" type="up" /></a>
                            </Dropdown>
                        </p>
                    </div>
                </aside>
                <div className="ant-layout-main">
                    {/* <div className="ant-layout-header"></div> */}
                    <div className="ant-layout-breadcrumb">
                        {/* <LangSwitch changeLocale={this.changeLocale} /> */}
                        <Breadcrumb menus={menuData} />
                    </div>
                    <div className="ant-layout-container">
                        <div className="ant-layout-content">
                            {this.props.children}
                        </div>
                    </div>
                    <div className="ant-layout-footer">
                        <p className="copyright">xlj© 2017</p>
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
