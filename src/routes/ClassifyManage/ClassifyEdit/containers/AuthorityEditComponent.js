import { connect } from 'react-redux'
import { clearState, getUesrById, createUser, updateUser } from '../modules/authorityEdit'
import AuthorityEdit from '../components/AuthorityEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getUesrById: (id) => getUesrById(id),
    createUser: (query) => createUser(query),
    updateUser: (query) => updateUser(query)
}

const mapStateToProps = (state) => ({
    UesrEdit : state.UesrEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthorityEdit)
