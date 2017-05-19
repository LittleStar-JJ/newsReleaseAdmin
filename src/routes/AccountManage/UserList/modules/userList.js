import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_USERS = 'CLEAR_USERS'
const RECEIVE_USER_LIST = 'RECEIVE_USER_LIST'
const RECEIVE_USER_DELETE = 'RECEIVE_USER_DELETE'
import { UserApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_USERS
    }
}
export function getUserList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_USER_LIST, CommonAction.REQUEST_FAILURE + 'USER' ],
            endpoint: UserApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}
export function deleteUser(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_USER_DELETE, CommonAction.REQUEST_FAILURE + 'USER' ],
            endpoint: UserApi.delete,
            options: { body: query, method:'POST' }
        }
    }
}
const initialState = {
    fetching:false,
    users:null,
    delete:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'USER']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_USER_LIST] : (state, action) => {
        return ({ ...state, fetching: false, users: action.response.data, error: null })
    },
    [RECEIVE_USER_DELETE] : (state, action) => {
        return ({ ...state, fetching: false, delete: action.response, error: null })
    },
    [CLEAR_USERS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
