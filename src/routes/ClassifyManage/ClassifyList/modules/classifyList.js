import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_CLASSIFYS = 'CLEAR_CLASSIFYS'
const RECEIVE_CLASSIFY_LIST = 'RECEIVE_CLASSIFY_LIST'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_CLASSIFYS
    }
}
export function getClassifyList(query) {
    return {
        /* [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_AUTHORITY_LIST, CommonAction.REQUEST_FAILURE + 'CLEAR_CLASSIFYS' ],
            endpoint: BookApi.getList,
            options: { body: query, method:'GET' }
        } */
        type: 'RECEIVE_CLASSIFY_LIST',
        response: {
            data: [{
                id:1,
                name:1,
                createdAt:12222222222222
            }]
        }
    }
}

const initialState = {
    fetching:false,
    classifyList:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'USER']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_CLASSIFY_LIST] : (state, action) => {
        return ({ ...state, fetching: false, classifyList: action.response.data, error: null })
    },
    [CLEAR_CLASSIFYS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
