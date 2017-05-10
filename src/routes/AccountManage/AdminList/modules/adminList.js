import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_ADMINS = 'CLEAR_ADMINS'
const RECEIVE_ADMIN_LIST = 'RECEIVE_ADMIN_LIST'
const RECEIVE_AUTH_LIST = 'RECEIVE_AUTH_LIST'
const RECEIVE_UPDATE_ADMIN = 'RECEIVE_UPDATE_ADMIN'
const RECEIVE_CREATE_ADMIN = 'RECEIVE_CREATE_ADMIN'
import { AdminApi, AuthorityApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_ADMINS
    }
}
export function getAdminList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_ADMIN_LIST, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: AdminApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}
export function getAuthList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_AUTH_LIST, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: AuthorityApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}
export function createAdmin(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CREATE_ADMIN, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: AdminApi.create,
            options: { body: query, method:'POST' }
        }
    }
}
export function updateAdmin(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE_ADMIN, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: AdminApi.update,
            options: { body: query, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    admins:null,
    auths:null,
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
        return ({ ...state, fetching: false, update: action.response.data, error: null })
    },
    [RECEIVE_CREATE_ADMIN] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response.data, error: null })
    },
    [RECEIVE_AUTH_LIST] : (state, action) => {
        return ({ ...state, fetching: false, auths: action.response.data, error: null })
    },
    [CLEAR_ADMINS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
