import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'classifyEdit(/:id)',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const ClassifyEdit = require('./containers/ClassifyEditComponent').default
            const reducer = require('./modules/classifyEdit').default
            injectReducer(store, { key: 'ClassifyEdit', reducer })
            cb(null, ClassifyEdit)
        })
    }
})
