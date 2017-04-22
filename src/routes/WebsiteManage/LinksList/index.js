import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'linksList',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const LinksList = require('./containers/LinksListContainer').default
            const reducer = require('./modules/linksList').default
            injectReducer(store, { key: 'LinksList', reducer })
            cb(null, LinksList)
        })
    }
})
