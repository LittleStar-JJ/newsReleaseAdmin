import { CALL_API } from '../../../../../middleware/api'
import { CommonAction } from '../../../../../constants/ActionTypes'

const CLEAR_AUTHORITY_LIST = 'CLEAR_AUTHORITY_LIST'
const RECEIVE_AUTHORITY_LIST = 'RECEIVE_AUTHORITY_LIST'
import { AuthorityApi } from '../../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_AUTHORITY_LIST
    }
}
export function getAuthorityList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_AUTHORITY_LIST, CommonAction.REQUEST_FAILURE + 'USER' ],
            endpoint: AuthorityApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}

const initialState = {
    fetching:false,
    authorityList:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'USER']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_AUTHORITY_LIST] : (state, action) => {
        return ({ ...state, fetching: false, authorityList: action.response.data, error: null })
    },
    [CLEAR_AUTHORITY_LIST] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
