import { connect } from 'react-redux'
import { clearState, getLinksList, createMsg, updateMsg } from '../modules/linksList'

import LinksList from '../components/LinksList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getLinksList: (query) => getLinksList(query),
    createMsg: (query) => createMsg(query),
    updateMsg: (query) => updateMsg(query)
}

const mapStateToProps = (state) => ({
    LinksList : state.LinksList
})

export default connect(mapStateToProps, mapDispatchToProps)(LinksList)
