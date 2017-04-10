/**
 * Created by xwatson on 2016/12/9.
 */
import { combineReducers } from 'redux'
import locationReducer from './location'
// import actions from '../actions'

export const makeRootReducer = (asyncReducers) => {
    return combineReducers({
        location: locationReducer,
        // ...actions,
        ...asyncReducers
    })
}

export const injectReducer = (store, { key, reducer }) => {
    store.asyncReducers[key] = reducer
    store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
