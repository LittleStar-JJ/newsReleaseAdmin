import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_LINKS = 'CLEAR_LINKS'
const RECEIVE_LINKS_LIST = 'RECEIVE_LINKS_LIST'
const RECEIVE_UPDATE_LINKS = 'RECEIVE_UPDATE_LINKS'
const RECEIVE_CREATE_LINKS = 'RECEIVE_CREATE_LINKS'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_LINKS
    }
}
export function getAdminList(query) {
    return {
        /* [CALL_API]: {
         types: [ CommonAction.REQUEST_START, RECEIVE_LINKS_LIST, CommonAction.REQUEST_FAILURE + 'LINKS' ],
         endpoint: BookApi.getList,
         options: { body: query, method:'GET' }
         } */
        type: 'RECEIVE_LINKS_LIST',
        response: {
            data: [{
                adminName:1,
                email:2,
                auth: {
                    id: 'ENABLE',
                    name:'启用'
                },
                createdAt:'s',
                loginTime:'d',
                status:'启用'
            }]
        }
    }
}
export function createMsg(query) {
    return {
        /* [CALL_API]: {
         types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE_LINKS, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
         endpoint: BookApi.getList,
         options: { body: query, method:'GET' }
         } */
        type: 'RECEIVE_UPDATE_LINKS',
        response: {
            code: 0,
            mag: ''
        }
    }
}
export function updateMsg(query) {
    return {
        /* [CALL_API]: {
         types: [ CommonAction.REQUEST_START, RECEIVE_CREATE_LINKS, CommonAction.REQUEST_FAILURE + 'ADMIN' ],
         endpoint: BookApi.getList,
         options: { body: query, method:'GET' }
         } */
        type: 'RECEIVE_CREATE_LINKS',
        response: {
            code: 0,
            mag: ''
        }
    }
}

const initialState = {
    fetching:false,
    links:null,
    error:null,
    create:null,
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
    [CLEAR_LINKS] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
