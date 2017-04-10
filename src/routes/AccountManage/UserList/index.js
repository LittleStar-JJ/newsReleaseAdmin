import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'userList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const UserList = require('./containers/UserListContainer').default
            const reducer = require('./modules/userList').default
            injectReducer(store, { key: 'UserList', reducer })
            cb(null, UserList)
        })
    }
})
