import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'commentList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const CommentList = require('./containers/CommentListContainer').default
            const reducer = require('./modules/commentList').default
            injectReducer(store, { key: 'CommentList', reducer })
            cb(null, CommentList)
        })
    }
})
