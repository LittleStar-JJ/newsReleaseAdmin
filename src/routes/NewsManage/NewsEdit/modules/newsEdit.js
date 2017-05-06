import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_NEWS_EDIT = 'CLEAR_NEWS_EDIT'
const RECEIVE_NEWS_EDIT = 'RECEIVE_NEWS_EDIT'
const RECEIVE_CREATE_NEWS = 'RECEIVE_CREATE_NEWS'
const RECEIVE_UPDATE_NEWS = 'RECEIVE_UPDATE_NEWS'
import { NewsApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_NEWS_EDIT
    }
}
export function getNewsById(id) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_NEWS_EDIT, CommonAction.REQUEST_FAILURE + 'NEWSEDIT' ],
            endpoint: NewsApi.getNewsById(id),
            options: { method:'GET' }
        }
    }
}
export function createNews(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CREATE_NEWS, CommonAction.REQUEST_FAILURE + 'NEWSEDIT' ],
            endpoint: NewsApi.createNews,
            options: { body:p, method:'POST' }
        }
    }
}
export function updateNews(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE_NEWS, CommonAction.REQUEST_FAILURE + 'NEWSEDIT' ],
            endpoint: NewsApi.updateNews,
            options: { body:p, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    newsDetail:null,
    create:null,
    update:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'NEWSEDIT']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_NEWS_EDIT] : (state, action) => {
        return ({ ...state, fetching: false, newsDetail: action.response.data, error: null })
    },
    [RECEIVE_CREATE_NEWS] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response.data, error: null })
    },
    [RECEIVE_UPDATE_NEWS] : (state, action) => {
        return ({ ...state, fetching: false, update: action.response.data, error: null })
    },
    [CLEAR_NEWS_EDIT] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
