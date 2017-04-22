import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'newsEdit(/:id)',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const NewsEdit = require('./containers/NewsEditComponent').default
            const reducer = require('./modules/newsEdit').default
            injectReducer(store, { key: 'NewsEdit', reducer })
            cb(null, NewsEdit)
        })
    }
})
