import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_ADMINS = 'CLEAR_ADMINS'
const RECEIVE_ADMIN_LIST = 'RECEIVE_ADMIN_LIST'
const RECEIVE_UPDATE_ADMIN = 'RECEIVE_UPDATE_ADMIN'
const RECEIVE_CREATE_ADMIN = 'RECEIVE_CREATE_ADMIN'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_ADMINS
    }
}
export function getAdminList(query) {
    return {
        /* [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_ADMIN_LIST, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: BookApi.getList,
            options: { body: query, method:'GET' }
        } */
        type: 'RECEIVE_ADMIN_LIST',
        response:{
            code:0,
            data:{
                totalElement: 1,
                content: [
                    {
                        adminName:1,
                        email:1,
                        auth: {
                            name:'启用',
                            id:'ENABLE'
                        },
                        createdAt:'11111111',
                        loginTime:'11111111',
                        status:'ENABLE'
                    }
                ]
            }
        }
    }
}
export function createMsg(query) {
    return {
        /* [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CREATE_ADMIN, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: BookApi.getList,
            options: { body: query, method:'GET' }
        } */
        type: 'RECEIVE_CREATE_ADMIN',
        response: {
            code: 0,
            mag: ''
        }
    }
}
export function updateMsg(query) {
    return {
        /* [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE_ADMIN, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: BookApi.getList,
            options: { body: query, method:'GET' }
        } */
        type: 'RECEIVE_UPDATE_ADMIN',
        response: {
            code: 0,
            mag: ''
        }
    }
}

const initialState = {
    fetching:false,
    admins:null,
    create:null,
    update:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'ADMIN']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_ADMIN_LIST] : (state, action) => {
        return ({ ...state, fetching: false, admins: action.response.data, error: null })
    },
    [RECEIVE_UPDATE_ADMIN] : (state, action) => {
        return ({ ...state, fetching: false, update: action.response, error: null })
    },
    [RECEIVE_CREATE_ADMIN] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response, error: null })
    },
    [CLEAR_ADMINS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
