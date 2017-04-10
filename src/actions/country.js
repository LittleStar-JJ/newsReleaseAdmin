/**
 * Created by xwatson on 2017/1/22.
 */
import { CALL_API } from '../middleware/api'
import { CommonAction } from '../constants/ActionTypes'
import { WearhouseApi } from '../constants/Api'

const CLEAR_COUNTRY = 'CLEAR_COUNTRY'
const RECEIVE_COUNTRY = 'RECEIVE_COUNTRY'

export function clearWarehouse() {
    return {
        type : CLEAR_COUNTRY
    }
}
function fetchCountry(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_COUNTRY, CommonAction.REQUEST_FAILURE + '_COUNTRY' ],
            endpoint: WearhouseApi.getCountries,
            cache:true,
            options: { body:{ name:query }, method:'GET' }
        }
    }
}
export function getCountryList(query) {
    return (dispatch) => {
        dispatch(fetchCountry(query))
    }
}
const initialState = {
    Country:null,
    error:null
}
const ACTION_HANDLERS = {
    [CLEAR_COUNTRY]: () => {
        return ({ ...initialState })
    },
    [RECEIVE_COUNTRY]: (state, action) => {
        return ({ Country: action.response.data, error: null })
    },
    [CommonAction.REQUEST_FAILURE + '_COUNTRY']: (state, action) => {
        return ({ entrust: null, error: action })
    }
}
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
