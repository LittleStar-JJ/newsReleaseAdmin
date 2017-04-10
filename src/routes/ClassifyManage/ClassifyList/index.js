import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'classifyList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const ClassifyList = require('./containers/ClassifyListContainer').default
            const reducer = require('./modules/classifyList').default
            injectReducer(store, { key: 'AuthorityList', reducer })
            cb(null, ClassifyList)
        })
    }
})
