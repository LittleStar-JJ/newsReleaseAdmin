import { connect } from 'react-redux'
import { clearState, getLinksList, createLinks, updateLinks } from '../modules/linksList'

import LinksList from '../components/LinksList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getLinksList: (query) => getLinksList(query),
    createLinks: (query) => createLinks(query),
    updateLinks: (query) => updateLinks(query)
}

const mapStateToProps = (state) => ({
    LinksList : state.LinksList
})

export default connect(mapStateToProps, mapDispatchToProps)(LinksList)
