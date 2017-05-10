import { CALL_API } from '../../../../../middleware/api'
import { CommonAction } from '../../../../../constants/ActionTypes'

const CLEAR_MENU_DETAIL = 'CLEAR_MENU_DETAIL'
const RECEIVE_MENU_LIST = 'RECEIVE_MENU_LIST'
const RECEIVE_MENU_DETAIL = 'RECEIVE_MENU_DETAIL'
const RECEIVE_MENU_UPDATE = 'RECEIVE_MENU_UPDATE'
const RECEIVE_MENU_CREATE = 'RECEIVE_MENU_CREATE'
import { MenuApi } from '../../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_MENU_DETAIL
    }
}
export function getMenuList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_MENU_LIST, CommonAction.REQUEST_FAILURE + '_MENU_LIST' ],
            endpoint: MenuApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}
export function getMenuById(id) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_MENU_DETAIL, CommonAction.REQUEST_FAILURE + '_MENU_DETAIL' ],
            endpoint: MenuApi.getDetail(id),
            options: { method:'GET' }
        }
    }
}
export function createMenu(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_MENU_CREATE, CommonAction.REQUEST_FAILURE + '_MENU_DETAIL' ],
            endpoint: MenuApi.create,
            options: { body:p, method:'POST' }
        }
    }
}
export function updateMenu(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_MENU_UPDATE, CommonAction.REQUEST_FAILURE + '_MENU_DETAIL' ],
            endpoint: MenuApi.update,
            options: { body:p, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    list:null,
    detail:null,
    create:null,
    update:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + '_MENU_DETAIL']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_MENU_LIST] : (state, action) => {
        return ({ ...state, fetching: false, list: action.response.data, error: null })
    },
    [RECEIVE_MENU_DETAIL] : (state, action) => {
        return ({ ...state, fetching: false, detail: action.response.data, error: null })
    },
    [RECEIVE_MENU_CREATE] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response.data, error: null })
    },
    [RECEIVE_MENU_UPDATE] : (state, action) => {
        return ({ ...state, fetching: false, update: action.response.data, error: null })
    },
    [CLEAR_MENU_DETAIL] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
