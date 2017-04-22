import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_NEWS = 'CLEAR_NEWS'
const RECEIVE_NEWS_LIST = 'RECEIVE_NEWS_LIST'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_NEWS
    }
}
export function getList(query) {
    return {
        /* [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_NEWS_LIST, CommonAction.REQUEST_FAILURE + 'USER' ],
            endpoint: BookApi.getList,
            options: { body: query, method:'GET' }
        } */
        type: 'RECEIVE_NEWS_LIST',
        response: {
            data: [{
                id:1,
                title:1,
                author:2,
                category:{
                    id: 1,
                    name:'男'
                },
                createdAt:12222222222222,
                source:12222222222222,
                keyWords:1,
                accessCount:1,
                isTop:1,
                status:'ENABLE'
            }]
        }
    }
}

const initialState = {
    fetching:false,
    news:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'USER']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_NEWS_LIST] : (state, action) => {
        return ({ ...state, fetching: false, news: action.response.data, error: null })
    },
    [CLEAR_NEWS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
