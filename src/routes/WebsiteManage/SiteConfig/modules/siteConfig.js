import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_SITE = 'CLEAR_SITE'
const RECEIVE_SAVE = 'RECEIVE_SAVE'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_SITE
    }
}

export function saveMsg(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_SAVE, CommonAction.REQUEST_FAILURE + 'SITE' ],
            endpoint: BookApi.updateUser,
            options: { body:p, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    save:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'SITE']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_SAVE] : (state, action) => {
        return ({ ...state, fetching: false, classifyDetail: action.response.data, error: null })
    },
    [CLEAR_SITE] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
