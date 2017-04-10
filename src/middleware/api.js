/**
 * Created by xwatson on 2017/1/3.
 */
import { message } from 'antd'
import auth from '../utils/Auth'
import ReponseCode from '../utils/ResponseCode'
import fetch from '../utils/HttpFetch'
import { LoadingAction } from '../constants/ActionTypes'

export const CALL_API = Symbol('Call API')

let loginTimeOut = true
let loginTimer = null
export default store => next => action => {
    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
        return next(action)
    }
    let { endpoint, options } = callAPI
    const { types } = callAPI

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }

    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.')
    }
    function showLoading() {
        return { type: LoadingAction.LOADING_SHOW }
    }
    function hideLoading() {
        return { type: LoadingAction.LOADING_HIDE }
    }
    function actionWith(data) {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }
    const [ requestType, successType, failureType ] = types
    let needShowLoading = false
    if (requestType !== '') {
        if (requestType.indexOf(LoadingAction.LOADING_SHOW)) {
            next(showLoading())
            needShowLoading = true
        }
        next(actionWith({ type: requestType }))
    }
    function dealWithError(response) {
        if (response.code === ReponseCode.AUTH_EXPIRED) {
            if (loginTimer) clearTimeout(loginTimer)
            // 3秒内仅接受一次登录超时
            loginTimer = setTimeout(() => {
                loginTimeOut = true
            }, 3000)
            if (loginTimeOut) {
                auth.loginOut()
                auth.dispatchAuthExpiredAction()
                message.error(response.message)
                if (needShowLoading) next(hideLoading())
                loginTimeOut = false
            }
            return false
        }
        next(actionWith({ type: failureType, error: response.message || 'Something bad happened' }))
        if (needShowLoading) next(hideLoading())
    }
    return fetch(endpoint, options).then(
        response => {
            console.log('response.code', response.code)
            if (response.code === ReponseCode.SUCCESS) {
                next(actionWith({ response, type: successType }))
                if (needShowLoading) next(hideLoading())
            } else {
                dealWithError(response)
            }
        },
        error => {
            console.log('response.error', error)
            dealWithError(error)
        }
    )
}
