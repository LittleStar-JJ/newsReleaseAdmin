import { connect } from 'react-redux'
import { clearState, getAuthById, createAuth, updateAuth, getMenus, getOperations } from '../modules/authorityEdit'
import AuthorityEdit from '../components/AuthorityEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getAuthById: (id) => getAuthById(id),
    createAuth: (query) => createAuth(query),
    getMenus: (query) => getMenus(query),
    getOperations: (query) => getOperations(query),
    updateAuth: (query) => updateAuth(query)
}

const mapStateToProps = (state) => ({
    AuthorityEdit : state.AuthorityEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthorityEdit)
