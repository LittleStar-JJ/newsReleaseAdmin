/**
 * Created by xwatson on 2016/12/9.
 */
import React, { Component, PropTypes } from 'react'
import { message } from 'antd'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import LoadingBar from '../components/LoadingBar'
import Auth from '../utils/Auth'
const config = require('../../config/config.json')
const reg = /^\/(\w+)\/?/

class AppContainer extends Component {
    static propTypes = {
        routes : PropTypes.any,
        store  : PropTypes.object.isRequired
    }

    static host = {
        BASE_API_URL:config[NODE_ENV.toUpperCase()].apiHost
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        const { routes, store } = this.props
        const requireRoutes = routes[0]
        // 追加主路由权限校验
        requireRoutes.onEnter = requireLogin
        requireRoutes.childRoutes.forEach((item) => {
            item.onEnter = requireLogin
        })
        return (
            <Provider store={store}>
                <div style={{ height: '100%' }}>
                    <LoadingBar />
                    <Router history={browserHistory} children={routes} />
                </div>
            </Provider>
        )
    }
}

function requireLogin(nextState, replace) {
    if (nextState.location.pathname !== '/') {
        const meuns = (Auth.getAccount() || {}).Auth.AuthMenu || []
        let authRouter = false
        let match = nextState.location.pathname.match(reg)
        match = (match && match[0]) ? match[0] : ''
        if (match.lastIndexOf('/') > 0) {
            match = match.substr(0, match.length - 1)
        }
        meuns.forEach((item) => {
            if (match === item.router && !authRouter) {
                authRouter = true
            }
        })
        if (!authRouter) {
            message.error('您没有权限访问此页面！', 3)
            replace({
                pathname: '/'
            })
        }
    }
}
export default AppContainer
