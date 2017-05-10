import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_NEWS = 'CLEAR_NEWS'
const RECEIVE_NEWS_LIST = 'RECEIVE_NEWS_LIST'
const RECEIVE_CATEGORY_LIST = 'RECEIVE_CATEGORY_LIST'
import { NewsApi, CategoryApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_NEWS
    }
}
export function getList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_NEWS_LIST, CommonAction.REQUEST_FAILURE + 'USER' ],
            endpoint: NewsApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}
export function getCategorys(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CATEGORY_LIST, CommonAction.REQUEST_FAILURE + 'USER' ],
            endpoint: CategoryApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}

const initialState = {
    fetching:false,
    news:null,
    category:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'USER']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_NEWS_LIST] : (state, action) => {
        return ({ ...state, fetching: false, news: action.response.data, error: null })
    },
    [RECEIVE_CATEGORY_LIST] : (state, action) => {
        return ({ ...state, fetching: false, category: action.response.data, error: null })
    },
    [CLEAR_NEWS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
