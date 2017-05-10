import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    path: 'authorityEdit(/:id)',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const AuthorityEdit = require('./containers/AuthorityEditComponent').default
            const reducer = require('./modules/authorityEdit').default
            injectReducer(store, { key: 'AuthorityEdit', reducer })
            cb(null, AuthorityEdit)
        })
    }
})
