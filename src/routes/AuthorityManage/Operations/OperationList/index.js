import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    path: 'operationList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const OperationList = require('./containers/OperationListContainer').default
            const reducer = require('./modules/operationList').default
            injectReducer(store, { key: 'OperationList', reducer })
            cb(null, OperationList)
        })
    }
})
