import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_CLASSIFY = 'CLEAR_CLASSIFY'
const RECEIVE_CLASSIFY_LIST = 'RECEIVE_CLASSIFY_LIST'
import { CategoryApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_CLASSIFY
    }
}
export function getClassifyList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CLASSIFY_LIST, CommonAction.REQUEST_FAILURE + 'CLEAR_CLASSIFYS' ],
            endpoint: CategoryApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}

const initialState = {
    fetching:false,
    list:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'USER']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_CLASSIFY_LIST] : (state, action) => {
        return ({ ...state, fetching: false, list: action.response.data, error: null })
    },
    [CLEAR_CLASSIFY] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
