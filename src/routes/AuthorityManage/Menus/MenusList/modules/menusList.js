import { CALL_API } from '../../../../../middleware/api'
import { CommonAction } from '../../../../../constants/ActionTypes'

const CLEAR_MENU_LIST = 'CLEAR_MENU_LIST'
const RECEIVE_MENU_LIST = 'RECEIVE_MENU_LIST'
const RECEIVE_MENU_DELETE = 'RECEIVE_MENU_DELETE'
import { MenuApi } from '../../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_MENU_LIST
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
export function deleteMenu(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_MENU_DELETE, CommonAction.REQUEST_FAILURE + '_MENU_LIST' ],
            endpoint: MenuApi.delete,
            options: { body: query, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    list:null,
    delete:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + '_MENU_LIST']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_MENU_LIST] : (state, action) => {
        return ({ ...state, fetching: false, list: action.response.data, error: null })
    },
    [RECEIVE_MENU_DELETE] : (state, action) => {
        return ({ ...state, fetching: false, delete: action.response, error: null })
    },
    [CLEAR_MENU_LIST] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
