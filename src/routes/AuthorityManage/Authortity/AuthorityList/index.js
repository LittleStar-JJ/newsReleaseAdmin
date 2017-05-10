import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    path: 'authorityList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const AuthorityList = require('./containers/AuthorityListContainer').default
            const reducer = require('./modules/authorityList').default
            injectReducer(store, { key: 'AuthorityList', reducer })
            cb(null, AuthorityList)
        })
    }
})
