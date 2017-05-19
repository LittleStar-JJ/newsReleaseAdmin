import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_USER = 'CLEAR_USER'
const RECEIVE_USER = 'RECEIVE_USER'
const RECEIVE_CREATE = 'RECEIVE_USER_CREATE'
const RECEIVE_UPDATE = 'RECEIVE_USER_UPDATE'
import { UserApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_USER
    }
}
export function getUesrById(id) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_USER, CommonAction.REQUEST_FAILURE + '_USER' ],
            endpoint: UserApi.getDetail(id),
            options: { method:'GET' }
        }
    }
}
export function createUser(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CREATE, CommonAction.REQUEST_FAILURE + '_USER' ],
            endpoint: UserApi.create,
            options: { body:p, method:'POST' }
        }
    }
}
export function updateUser(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE, CommonAction.REQUEST_FAILURE + '_USER' ],
            endpoint: UserApi.update,
            options: { body:p, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    userDetail:null,
    create:null,
    update:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + '_USER']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_USER] : (state, action) => {
        return ({ ...state, fetching: false, userDetail: action.response.data, error: null })
    },
    [RECEIVE_CREATE] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response.data, error: null })
    },
    [RECEIVE_UPDATE] : (state, action) => {
        return ({ ...state, fetching: false, update: action.response.data, error: null })
    },
    [CLEAR_USER] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
