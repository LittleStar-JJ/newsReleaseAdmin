/**
 * Created by xwatson on 2017/1/17.
 */
import { LoadingAction } from '../constants/ActionTypes'
import { LOCATION_CHANGE } from '../store/location'

const ACTION_HANDLERS = {
    [LoadingAction.LOADING_SHOW]: (state) => {
        state.count++
        return ({ status: true, count:state.count })
    },
    [LoadingAction.LOADING_HIDE]: (state) => {
        state.count--
        return ({ status: false, count:state.count })
    }
}
const initialState = {
    status:null,
    count:0,
    initCount:0,
    start:false
}
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]
    console.log('action.type', action.type)
    // 过滤从@@INIT到路由变化的无用的状态
    if (action.type === '@@INIT') {
        initialState.initCount++
        initialState.start = false
    } else if (action.type === LOCATION_CHANGE) {
        initialState.start = true
        initialState.initCount = 0
    }
    if (initialState.initCount > 1) {
        initialState.start = true
    }
    if (!initialState.start) {
        initialState.count = 0
        return state
    }
    return handler ? handler(state, action) : state
}
