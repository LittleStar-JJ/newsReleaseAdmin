import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'adminList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const AdminList = require('./containers/AdminListContainer').default
            const reducer = require('./modules/adminList').default
            injectReducer(store, { key: 'AdminList', reducer })
            cb(null, AdminList)
        })
    }
})
