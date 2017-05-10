/**
 * Created by xwatson on 2016/12/28.
 */
import { CALL_API } from '../../../middleware/api'
const CLEAR_LOGIN_STATE = 'CLEAR_LOGIN_STATE' // 清除状态
const LOGIN_SINGOUT = 'LOGIN_SINGOUT' // 登出
const RECEIVE_USER = 'RECEIVE_USER' // 接受用户
const RECEIVE_CHANNER = 'RECEIVE_CHANNER' // 接受渠道

import { CommonAction } from '../../../constants/ActionTypes'
import { LoginApi } from '../../../constants/Api'
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
            endpoint: LoginApi.login,
            options: { body: user,
                method:'POST'
            }
        }
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
