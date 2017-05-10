import { injectReducer } from '../../../../store/reducers'

export default (store) => ({
    path: 'menuList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const MenusList = require('./containers/MenusListContainer').default
            const reducer = require('./modules/menusList').default
            injectReducer(store, { key: 'MenusList', reducer })
            cb(null, MenusList)
        })
    }
})
