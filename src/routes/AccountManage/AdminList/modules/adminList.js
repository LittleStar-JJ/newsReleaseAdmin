import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_ADMINS = 'CLEAR_ADMINS'
const RECEIVE_ADMIN_LIST = 'RECEIVE_ADMIN_LIST'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_ADMINS
    }
}
function fetchList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_ADMIN_LIST, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: BookApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}
// 获取
export function getAdminList(query) {
    return (dispatch, getState) => {
        dispatch(fetchList(query))
    }
}

const initialState = {
    fetching:false,
    admins:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'ADMIN']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_ADMIN_LIST] : (state, action) => {
        return ({ ...state, fetching: false, admins: action.response.data, error: null })
    },
    [CLEAR_ADMINS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
