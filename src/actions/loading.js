/**
 * Created by xwatson on 2017/1/17.
 */
import { LoadingAction } from '../constants/ActionTypes'

const ACTION_HANDLERS = {
    [LoadingAction.LOADING_SHOW]: () => {
        return ({ status: true })
    },
    [LoadingAction.LOADING_HIDE]: () => {
        return ({ status: false })
    }
}
const initialState = {
    status:null
}
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
