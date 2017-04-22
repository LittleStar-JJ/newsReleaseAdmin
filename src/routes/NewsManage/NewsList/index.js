import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'newsList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const NewsList = require('./containers/NewsListContainer').default
            const reducer = require('./modules/newsList').default
            injectReducer(store, { key: 'NewsList', reducer })
            cb(null, NewsList)
        })
    }
})
