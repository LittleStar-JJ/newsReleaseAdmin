import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_LINKS = 'CLEAR_LINKS'
const RECEIVE_LINKS_LIST = 'RECEIVE_LINKS_LIST'
const RECEIVE_UPDATE_LINKS = 'RECEIVE_UPDATE_LINKS'
const RECEIVE_CREATE_LINKS = 'RECEIVE_CREATE_LINKS'
const RECEIVE_DELETE_LINKS = 'RECEIVE_DELETE_LINKS'
import { LinksApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_LINKS
    }
}
export function getLinksList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_LINKS_LIST, CommonAction.REQUEST_FAILURE + 'LINKS' ],
            endpoint: LinksApi.getList,
            options: { body: query, method:'GET' }
        }
    }
}
export function createLinks(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CREATE_LINKS, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: LinksApi.create,
            options: { body: query, method:'POST' }
        }
    }
}
export function updateLinks(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE_LINKS, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: LinksApi.update,
            options: { body: query, method:'POST' }
        }
    }
}
export function deleteLinks(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_DELETE_LINKS, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
            endpoint: LinksApi.delete,
            options: { body: query, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    links:null,
    error:null,
    create:null,
    delete:null,
    update:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'ADMIN']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_LINKS_LIST] : (state, action) => {
        return ({ ...state, fetching: false, links: action.response.data, error: null })
    },
    [RECEIVE_UPDATE_LINKS] : (state, action) => {
        return ({ ...state, fetching: false, update: action.response, error: null })
    },
    [RECEIVE_CREATE_LINKS] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response, error: null })
    },
    [RECEIVE_DELETE_LINKS] : (state, action) => {
        return ({ ...state, fetching: false, delete: action.response, error: null })
    },
    [CLEAR_LINKS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
