import { CALL_API } from '../../../../middleware/api'
import { CommonAction } from '../../../../constants/ActionTypes'

const CLEAR_BOOKEDIT = 'CLEAR_BOOKEDIT'
const RECEIVE_USER = 'RECEIVE_USER'
const RECEIVE_CREATE = 'RECEIVE_CREATE'
const RECEIVE_UPDATE = 'RECEIVE_UPDATE'
import { BookApi } from '../../../../constants/Api'

export function clearState() {
    return {
        type: CLEAR_BOOKEDIT
    }
}
export function getUesrById(id) {
    return {
        /* [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_USER, CommonAction.REQUEST_FAILURE + 'BOOKEDIT' ],
            endpoint: BookApi.getUesrById(id),
            options: { method:'GET' }
        } */
        type: 'RECEIVE_USER',
        response: {
            data: {
                id:1,
                nickName:1,
                email:2,
                qq:'qq',
                integral:1,
                introduction:'sssssss',
                birthday: 121111,
                password:'女',
                address:12222222222222,
                gender:{
                    id: 'MALE',
                    name:'男'
                },
                phone:1,
                name:1,
                status:'ENABLE'
            }
        }
    }
}
export function createUser(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CREATE, CommonAction.REQUEST_FAILURE + 'BOOKEDIT' ],
            endpoint: BookApi.createUser,
            options: { body:p, method:'POST' }
        }
    }
}
export function updateUser(p) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_UPDATE, CommonAction.REQUEST_FAILURE + 'BOOKEDIT' ],
            endpoint: BookApi.updateUser,
            options: { body:p, method:'POST' }
        }
    }
}

const initialState = {
    fetching:false,
    userDetail:null,
    create:null,
    update:null,
    error:null
}
const ACTION_HANDLERS = {
    [CommonAction.REQUEST_FAILURE + 'BOOKEDIT']: (state, action) => {
        return ({ ...state, fetching: false, error: action })
    },
    [RECEIVE_USER] : (state, action) => {
        return ({ ...state, fetching: false, userDetail: action.response.data, error: null })
    },
    [RECEIVE_CREATE] : (state, action) => {
        return ({ ...state, fetching: false, create: action.response.data, error: null })
    },
    [RECEIVE_UPDATE] : (state, action) => {
        return ({ ...state, fetching: false, update: action.response.data, error: null })
    },
    [CLEAR_BOOKEDIT] : () => {
        return ({ ...initialState })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
