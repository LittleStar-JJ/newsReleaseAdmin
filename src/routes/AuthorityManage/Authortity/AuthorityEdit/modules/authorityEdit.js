import { CALL_API } from '../../../../../middleware/api'
import { CommonAction } from '../../../../../constants/ActionTypes'

const CLEAR_AUTHORITY_EDIT = 'CLEAR_AUTHORITY_EDIT'
const RECEIVE_AUTHORITY_DETAIL = 'RECEIVE_AUTHORITY_DETAIL'
const RECEIVE_CREATE = 'RECEIVE_AUTHORITY_CREATE'
const RECEIVE_UPDATE = 'RECEIVE_AUTHORITY_UPDATE'
const RECEIVE_AUTHORITY_MENUS = 'RECEIVE_AUTHORITY_MENUS'
const RECEIVE_AUTHORITY_OPERATION = 'RECEIVE_AUTHORITY_OPERATION'
import { AuthorityApi, MenuApi, OperationApi } from '../../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_AUTHORITY_EDIT
    }
}
export function getAuthById(id) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_AUTHORITY_DETAIL, CommonAction.REQUEST_FAILURE + '_AUTHORITY_EDIT' ],
            endpoint: AuthorityApi.getDetail(id),
            options: { method:'GET' }
        }
    }
}
export function getMenus(q) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_AUTHORITY_MENUS, CommonAction.REQUEST_FAILURE + '_AUTHORITY_EDIT' ],
            endpoint: MenuApi.getList,
            options: { body:q, method:'GET' }
        }
    }
}
export function getOperations(q) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_AUTHORITY_OPERATION, CommonAction.REQUEST_FAILURE + '_AUTHORITY_EDIT' ],
            endpoint: OperationApi.getList,
            options: { body:q, method:'GET' }
        }
    }
}
export function createAuth(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CREATE, CommonAction.REQUEST_FAILURE + '_AUTHORITY_EDIT' ],
            endpoint: AuthorityApi.create,
            options: { body:p, method:'POST' }
        }
    }
}
export function updateAuth(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE, CommonAction.REQUEST_FAILURE + '_AUTHORITY_EDIT' ],
            endpoint: AuthorityApi.update,
            options: { body:p, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    detail:null,
    create:null,
    update:null,
    menus:null,
    operations:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + '_AUTHORITY_EDIT']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_AUTHORITY_DETAIL] : (state, action) => {
        return ({ ...state, fetching: false, detail: action.response.data, error: null })
    },
    [RECEIVE_CREATE] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response.data, error: null })
    },
    [RECEIVE_UPDATE] : (state, action) => {
        return ({ ...state, fetching: false, update: action.response.data, error: null })
    },
    [RECEIVE_AUTHORITY_MENUS] : (state, action) => {
        return ({ ...state, fetching: false, menus: action.response.data, error: null })
    },
    [RECEIVE_AUTHORITY_OPERATION] : (state, action) => {
        return ({ ...state, fetching: false, operations: action.response.data, error: null })
    },
    [CLEAR_AUTHORITY_EDIT] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
