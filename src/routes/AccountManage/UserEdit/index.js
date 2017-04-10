import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'userEdit(/:id)',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const UserEdit = require('./containers/UserEditComponent').default
            const reducer = require('./modules/userEdit').default
            injectReducer(store, { key: 'UserEdit', reducer })
            cb(null, UserEdit)
        })
    }
})
