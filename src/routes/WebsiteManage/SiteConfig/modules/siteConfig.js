import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_SITE = 'CLEAR_SITE'
const RECEIVE_SITE_SAVE = 'RECEIVE_SITE_SAVE'
const RECEIVE_SITE_DETAIL = 'RECEIVE_SITE_DETAIL'
import { SiteApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_SITE
    }
}

export function getSite(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_SITE_DETAIL, CommonAction.REQUEST_FAILURE + 'SITE' ],
            endpoint: SiteApi.getDetail,
            options: { method:'GET' }
        }
    }
}
export function saveMsg(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_SITE_SAVE, CommonAction.REQUEST_FAILURE + 'SITE' ],
            endpoint: SiteApi.update,
            options: { body:p, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    save:null,
    detail:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'SITE']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_SITE_DETAIL] : (state, action) => {
        return ({ ...state, fetching: false, detail: action.response.data, error: null })
    },
    [RECEIVE_SITE_SAVE] : (state, action) => {
        return ({ ...state, fetching: false, save: action.response, error: null })
    },
    [CLEAR_SITE] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
