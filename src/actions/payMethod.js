/**
 * Created by xwatson on 2017/1/13.
 */
/**
 * Created by xwatson on 2017/1/12.
 */
import { CALL_API } from '../middleware/api'
import { CommonAction } from '../constants/ActionTypes'
import { PayMethodApi } from '../constants/Api'

const RECEIVE_PAY_METHOD = 'RECEIVE_PAY_METHOD'

// 请求渠道
function fetchPayMethod(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_PAY_METHOD, CommonAction.REQUEST_FAILURE + '_PAY_METHOD' ],
            endpoint: PayMethodApi.getList,
            options: { body:{ ...query }, method:'GET' }
        }
    }
}

/**
 * 获取支付方式
 * @param query 查询条件
 * @returns {function(*, *)}
 */
export function getPayMethod(query) {
    return (dispatch, getState) => {
        dispatch(fetchPayMethod(query))
    }
}
const ACTION_HANDLERS = {
    [RECEIVE_PAY_METHOD]: (state, action) => {
        return ({ PayMethod: action.response.data.content, error: null })
    },
    [CommonAction.REQUEST_FAILURE + '_PAY_METHOD']: (state, action) => {
        return ({ PayMethod: null, error: action })
    }
}
const initialState = {
    PayMethod:null,
    error:null
}
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
