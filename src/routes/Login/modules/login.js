/**
 * Created by xwatson on 2016/12/28.
 */
import { CALL_API } from '../../../middleware/api'
const CLEAR_LOGIN_STATE = 'CLEAR_LOGIN_STATE' // 清除状态
const LOGIN_SINGOUT = 'LOGIN_SINGOUT' // 登出
const RECEIVE_USER = 'RECEIVE_USER' // 接受用户
const RECEIVE_CHANNER = 'RECEIVE_CHANNER' // 接受渠道

import { CommonAction } from '../../../constants/ActionTypes'
import { RegisterApi, ChannelApi } from '../../../constants/Api'
const consts = require('../../../../config/config.json')[NODE_ENV.toUpperCase()]

export function clearState() {
    return {
        type: CLEAR_LOGIN_STATE
    }
}
// 登录
export function singIn(user) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_USER, CommonAction.REQUEST_FAILURE + '_LOGIN' ],
            endpoint: RegisterApi.login,
            options: { body: user,
                method:'POST'
            }
        }
    }
}
// 注册
export function register(user) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_USER, CommonAction.REQUEST_FAILURE + '_LOGIN' ],
            endpoint: RegisterApi.register,
            options: { body: {
                email: user.email,
                password: user.password,
                username: user.userName,
                channelId: user.channelId,
                activateUrl: consts.cdnHost + ':' + consts.port + '/login/activation/'
            },
                method:'POST'
            }
        }
    }
}
export function channer(user) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CHANNER, CommonAction.REQUEST_FAILURE + '_LOGIN' ],
            endpoint: ChannelApi.getChannel,
            options: {
                body: {
                    page:0,
                    size:30,
                    sort:'id,desc'
                },
                method:'GET' }
        }
    }
}
// 登出
export function singOut(user = {}) {
    return {
        type: LOGIN_SINGOUT
    }
}
// 接受用户信息
export function receiveUser(user = {}) {
    return {
        type: RECEIVE_USER,
        payload:{
            User:user
        }
    }
}
/**
 * 登录
 * @param user
 * @returns {function(*, *)}
 */
export function fetchLogin(user) {
    return (dispatch, getState) => {
        dispatch(singIn(user))
    }
}
/**
 * 注册
 * @param user
 * @returns {function(*, *)}
 */
export function fetchRegister(user) {
    return (dispatch, getState) => {
        dispatch(register(user))
    }
}
/**
 * 获取渠道
 */
export function getChannel() {
    return (dispatch, getState) => {
        dispatch(channer())
    }
}
const initialState = {
    fetching:false,
    User:null,
    Channel:null,
    error:null
}
const ACTION_HANDLERS = {
    [CLEAR_LOGIN_STATE]: () => {
        return ({ ...initialState })
    },
    [RECEIVE_USER] : (state, action) => {
        return { ...state, fetching: false, User: action.response }
    },
    [RECEIVE_CHANNER] : (state, action) => {
        return { ...state, fetching: false, Channel: action.response }
    },
    [CommonAction.REQUEST_FAILURE + '_LOGIN'] : (state, action) => {
        return { ...state, fetching: false, User: null, error:action }
    }
}

export default function loginReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}
