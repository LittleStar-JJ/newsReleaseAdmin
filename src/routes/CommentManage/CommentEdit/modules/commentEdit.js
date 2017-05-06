import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_CLASS_EDIT = 'CLEAR_CLASS_EDIT'
const RECEIVE_CLASS_EDIT = 'RECEIVE_CLASS_EDIT'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_CLASS_EDIT
    }
}
export function getCommentById(id) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CLASS_EDIT, CommonAction.REQUEST_FAILURE + 'CLASSEDIT' ],
            endpoint: BookApi.getUesrById(id),
            options: { method:'GET' }
        }
    }
}

const initialState = {
    fetching:false,
    classifyDetail:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'CLASSEDIT']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_CLASS_EDIT] : (state, action) => {
        return ({ ...state, fetching: false, classifyDetail: action.response.data, error: null })
    },
    [CLEAR_CLASS_EDIT] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}