import { CALL_API } from '../../../../../middleware/api'
import { CommonAction } from '../../../../../constants/ActionTypes'

const CLEAR_OPERATION = 'CLEAR_OPERATION'
const RECEIVE_OPERATION_LIST = 'RECEIVE_OPERATION_LIST'
import { OperationApi } from '../../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_OPERATION
    }
}
export function getOperationList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_OPERATION_LIST, CommonAction.REQUEST_FAILURE + '_OPERATION_LIST' ],
            endpoint: OperationApi.getList,
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
    [CommonAction.REQUEST_FAILURE + '_OPERATION_LIST']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_OPERATION_LIST] : (state, action) => {
        return ({ ...state, fetching: false, list: action.response.data, error: null })
    },
    [CLEAR_OPERATION] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
