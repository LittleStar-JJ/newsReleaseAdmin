import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_COMMENT_EDIT = 'CLEAR_COMMENT_EDIT'
const RECEIVE_COMMENT_EDIT = 'RECEIVE_COMMENT_EDIT'
const RECEIVE_COMMENT_REVIEW = 'RECEIVE_COMMENT_REVIEW'
import { CommentApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_COMMENT_EDIT
    }
}
export function getCommentById(id) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_COMMENT_EDIT, CommonAction.REQUEST_FAILURE + '_COMMENT' ],
            endpoint: CommentApi.getDetail(id),
            options: { method:'GET' }
        }
    }
}
export function commentReview(q) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_COMMENT_REVIEW, CommonAction.REQUEST_FAILURE + '_COMMENT' ],
            endpoint: CommentApi.review,
            options: { body:q, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    detail:null,
    review:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + '_COMMENT']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_COMMENT_EDIT] : (state, action) => {
        return ({ ...state, fetching: false, detail: action.response.data, error: null })
    },
    [RECEIVE_COMMENT_REVIEW] : (state, action) => {
        return ({ ...state, fetching: false, review: action.response.data, error: null })
    },
    [CLEAR_COMMENT_EDIT] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
