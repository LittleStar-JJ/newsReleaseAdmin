import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_COMMENTS = 'CLEAR_COMMENTS'
const RECEIVE_COMMENT_LIST = 'RECEIVE_COMMENT_LIST'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_COMMENTS
    }
}
export function getCommentList(query) {
    return {
        /* [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_COMMENT_LIST, CommonAction.REQUEST_FAILURE + 'COMMENT' ],
            endpoint: BookApi.getList,
            options: { body: query, method:'GET' }
        } */
        type: 'RECEIVE_COMMENT_LIST',
        response: {
            data: [{
                id:1,
                name:1,
                parent:{
                    id:1,
                    name:'lxj'
                },
                status:'ENABLE',
                isNav:'ENABLE',
                sort:23,
                createdAt:12222222222222
            }]
        }
    }
}

const initialState = {
    fetching:false,
    commentList:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'COMMENT']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_COMMENT_LIST] : (state, action) => {
        return ({ ...state, fetching: false, commentList: action.response.data, error: null })
    },
    [CLEAR_COMMENTS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
