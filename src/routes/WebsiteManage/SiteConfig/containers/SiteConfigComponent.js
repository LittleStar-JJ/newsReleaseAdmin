import { connect } from 'react-redux'
import { clearState, saveMsg, getSite } from '../modules/siteConfig'
import SiteConfig from '../components/SiteConfig'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getSite: () => getSite(),
    saveMsg: (query) => saveMsg(query)
}

const mapStateToProps = (state) => ({
    SiteConfig : state.SiteConfig
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteConfig)
