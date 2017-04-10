/**
 * Created by xwatson on 2017/2/21.
 */
import { CALL_API } from '../middleware/api'
import { CommonAction } from '../constants/ActionTypes'
import { ProductApi } from '../constants/Api'

const CLEAR_GOODS = 'CLEAR_GOODS'
const RECEIVE_GOODS_GET_ID = 'RECEIVE_GOODS_GET_ID'
const RECEIVE_GOODS_LIST = 'RECEIVE_GOODS_LIST'

export function clearGoods() {
    return {
        type : CLEAR_GOODS
    }
}
function fetchGoodsById(id) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_GOODS_GET_ID, CommonAction.REQUEST_FAILURE + '_GOODS' ],
            endpoint: ProductApi.getDetail(id),
            options: {
                method:'GET'
            }
        }
    }
}
function fetchGoods(q) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_GOODS_LIST, CommonAction.REQUEST_FAILURE + '_GOODS' ],
            endpoint: ProductApi.getList,
            options: {
                body: q,
                method:'GET'
            }
        }
    }
}
// 根据id获取
export function getGoodsById(id) {
    return (dispatch, getState) => {
        dispatch(fetchGoodsById(id))
    }
}
// 获取list
export function getGoods(q) {
    return (dispatch, getState) => {
        dispatch(fetchGoods(q))
    }
}
const initialState = {
    GoodsOne:null,
    Goods:null,
    Error:null
}
const ACTION_HANDLERS = {
    [CLEAR_GOODS]: () => {
        return ({ ...initialState })
    },
    [RECEIVE_GOODS_LIST]: (state, action) => {
        return ({ Goods: action.response.data, Error: null })
    },
    [RECEIVE_GOODS_GET_ID]: (state, action) => {
        return ({ GoodsOne: action.response.data, Error: null })
    },
    [CommonAction.REQUEST_FAILURE + '_GOODS']: (state, action) => {
        return ({ GoodsOne: null, Goods: null, Error: action })
    }
}
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
