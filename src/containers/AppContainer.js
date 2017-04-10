/**
 * Created by xwatson on 2016/12/9.
 */
import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import LoadingBar from '../components/LoadingBar'
const config = require('../../config/config.json')
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
    // console.log("requireLogin(nextState, replace)", nextState, replace)
}
export default AppContainer
