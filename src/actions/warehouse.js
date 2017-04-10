/**
 * Created by xwatson on 2017/1/22.
 */
import { CALL_API } from '../middleware/api'
import { CommonAction } from '../constants/ActionTypes'
import { WearhouseApi } from '../constants/Api'

const CLEAR_WAREHOUSE = 'CLEAR_WAREHOUSE'
const RECEIVE_WAREHOUSE = 'RECEIVE_WAREHOUSE'

export function clearWarehouse() {
    return {
        type : CLEAR_WAREHOUSE
    }
}
function fetchWarehouse(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_WAREHOUSE, CommonAction.REQUEST_FAILURE + '_WAREHOUSE' ],
            endpoint: WearhouseApi.getList,
            options: { body:{ ...query }, method:'GET' }
        }
    }
}
export function getWarehouseList(query) {
    return (dispatch) => {
        dispatch(fetchWarehouse(query))
    }
}
const initialState = {
    Warehouse:null,
    error:null
}
const ACTION_HANDLERS = {
    [CLEAR_WAREHOUSE]: () => {
        return ({ ...initialState })
    },
    [RECEIVE_WAREHOUSE]: (state, action) => {
        return ({ Warehouse: action.response.data, error: null })
    },
    [CommonAction.REQUEST_FAILURE + '_WAREHOUSE']: (state, action) => {
        return ({ entrust: null, error: action })
    }
}
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
