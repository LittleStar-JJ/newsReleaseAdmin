import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_CLASS_EDIT = 'CLEAR_CLASS_EDIT'
const RECEIVE_CLASS_LIST = 'RECEIVE_CLASS_LIST'
const RECEIVE_CLASS_EDIT = 'RECEIVE_CLASS_EDIT'
const RECEIVE_CREATE = 'RECEIVE_CLASS_CREATE'
const RECEIVE_UPDATE = 'RECEIVE_CLASS_UPDATE'
import { CategoryApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_CLASS_EDIT
    }
}
export function getClassifyList(q) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CLASS_LIST, CommonAction.REQUEST_FAILURE + 'CLASSEDIT' ],
            endpoint: CategoryApi.getList,
            options: { body:q, method:'GET' }
        }
    }
}
export function getClassifyById(id) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CLASS_EDIT, CommonAction.REQUEST_FAILURE + 'CLASSEDIT' ],
            endpoint: CategoryApi.getDetail(id),
            options: { method:'GET' }
        }
    }
}
export function createClassify(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CREATE, CommonAction.REQUEST_FAILURE + 'CLASSEDIT' ],
            endpoint: CategoryApi.create,
            options: { body:p, method:'POST' }
        }
    }
}
export function updateClassify(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE, CommonAction.REQUEST_FAILURE + 'CLASSEDIT' ],
            endpoint: CategoryApi.update,
            options: { body:p, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    list:null,
    classifyDetail:null,
    create:null,
    update:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'CLASSEDIT']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_CLASS_LIST] : (state, action) => {
        return ({ ...state, fetching: false, list: action.response.data, error: null })
    },
    [RECEIVE_CLASS_EDIT] : (state, action) => {
        return ({ ...state, fetching: false, classifyDetail: action.response.data, error: null })
    },
    [RECEIVE_CREATE] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response.data, error: null })
    },
    [RECEIVE_UPDATE] : (state, action) => {
        return ({ ...state, fetching: false, update: action.response.data, error: null })
    },
    [CLEAR_CLASS_EDIT] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
