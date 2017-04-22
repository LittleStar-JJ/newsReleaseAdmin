import { injectReducer } from '../../../store/reducers'

export default (store) => ({
    path: 'siteConfig(/:id)',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            const SiteConfig = require('./containers/SiteConfigComponent').default
            const reducer = require('./modules/siteConfig').default
            injectReducer(store, { key: 'SiteConfig', reducer })
            cb(null, SiteConfig)
        })
    }
})
