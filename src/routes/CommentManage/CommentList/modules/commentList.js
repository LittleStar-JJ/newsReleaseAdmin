import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_COMMENTS = 'CLEAR_COMMENTS'
const RECEIVE_COMMENT_LIST = 'RECEIVE_COMMENT_LIST'
const RECEIVE_COMMENT_DELETE = 'RECEIVE_COMMENT_DELETE'
import { CommentApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_COMMENTS
    }
}
export function getCommentList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_COMMENT_LIST, CommonAction.REQUEST_FAILURE + 'COMMENT' ],
            endpoint: CommentApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}
export function deleteComment(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_COMMENT_DELETE, CommonAction.REQUEST_FAILURE + 'COMMENT' ],
            endpoint: CommentApi.delete,
            options: { body: query, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    commentList:null,
    delete:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'COMMENT']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_COMMENT_LIST] : (state, action) => {
        return ({ ...state, fetching: false, commentList: action.response.data, error: null })
    },
    [RECEIVE_COMMENT_DELETE] : (state, action) => {
        return ({ ...state, fetching: false, delete: action.response, error: null })
    },
    [CLEAR_COMMENTS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
