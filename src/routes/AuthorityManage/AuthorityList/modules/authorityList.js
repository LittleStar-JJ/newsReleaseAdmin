import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_USERS = 'CLEAR_USERS'
const RECEIVE_AUTHORITY_LIST = 'RECEIVE_AUTHORITY_LIST'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_USERS
    }
}
export function getAuthorityList(query) {
    return {
        /* [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_AUTHORITY_LIST, CommonAction.REQUEST_FAILURE + 'USER' ],
            endpoint: BookApi.getList,
            options: { body: query, method:'GET' }
        } */
        type: 'RECEIVE_AUTHORITY_LIST',
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
    [CLEAR_USERS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
