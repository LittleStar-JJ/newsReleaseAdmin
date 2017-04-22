import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'commentEdit(/:id)',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const CommentEdit = require('./containers/CommentEditComponent').default
            const reducer = require('./modules/commentEdit').default
            injectReducer(store, { key: 'CommentEdit', reducer })
            cb(null, CommentEdit)
        })
    }
})
