/**
 * 提交委托
 * Created by xwatson on 2017/1/22.
 */
import { CALL_API } from '../middleware/api'
import { CommonAction } from '../constants/ActionTypes'
import { EntrustApi } from '../constants/Api'

const CLEAR_SUBMIT_COMMISSION = 'CLEAR_SUBMIT_COMMISSION'
const SUBMIT_COMMISSION = 'SUBMIT_COMMISSION'
const SUBMIT_COMMISSION_ONE = 'SUBMIT_COMMISSION_ONE'

export function clearSubmitCommissionedState() {
    return {
        type: CLEAR_SUBMIT_COMMISSION
    }
}

function fetchCommissioned(params) {
    return {
        [CALL_API]: {
            types: [CommonAction.REQUEST_START, SUBMIT_COMMISSION, CommonAction.REQUEST_FAILURE + '_SUBMIT_COMMISSION'],
            endpoint: EntrustApi.createEntrust,
            options: { body:{ consignmentNote: params }, method: 'POST' }
        }
    }
}
function fetchSubmitOne(id) {
    return {
        [CALL_API]: {
            types: [CommonAction.REQUEST_START, SUBMIT_COMMISSION_ONE, CommonAction.REQUEST_FAILURE + '_SUBMIT_COMMISSION'],
            endpoint: EntrustApi.submit(id),
            options: { method: 'POST' }
        }
    }
}

// 提交委托
export function submitCommissioned(params) {
    return (dispatch, getState) => {
        dispatch(fetchCommissioned(params))
    }
}
// 列表中提交委托
export function submitOne(id) {
    return (dispatch, getState) => {
        dispatch(fetchSubmitOne(id))
    }
}
const initialState = {
    entrust:null,
    entrustOne:null,
    error:null
}
const ACTION_HANDLERS = {
    [CLEAR_SUBMIT_COMMISSION]: (state, action) => {
        return ({ ...initialState })
    },
    [SUBMIT_COMMISSION]: (state, action) => {
        return ({ entrust: action.response.data, error: null })
    },
    [SUBMIT_COMMISSION_ONE]: (state, action) => {
        return ({ entrustOne: action.response.data, error: null })
    },
    [CommonAction.REQUEST_FAILURE + '_SUBMIT_COMMISSION']: (state, action) => {
        return ({ entrust: null, error: action })
    }
}
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
