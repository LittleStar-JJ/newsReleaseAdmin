import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    path: 'menuEdit(/:id)',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const MeunsEdit = require('./containers/MeunsEditComponent').default
            const reducer = require('./modules/menusEdit').default
            injectReducer(store, { key: 'MenuEdit', reducer })
            cb(null, MeunsEdit)
        })
    }
})
