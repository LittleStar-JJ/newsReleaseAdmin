import { connect } from 'react-redux'
import { clearState, saveMsg } from '../modules/siteConfig'
import SiteConfig from '../components/SiteConfig'

const mapDispatchToProps = {
    clearState: () => clearState(),
    saveMsg: (query) => saveMsg(query)
}

const mapStateToProps = (state) => ({
    SiteConfig : state.SiteConfig
})

export default connect(mapStateToProps, mapDispatchToProps)(SiteConfig)
