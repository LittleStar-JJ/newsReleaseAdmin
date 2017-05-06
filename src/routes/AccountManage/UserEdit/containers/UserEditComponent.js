import { connect } from 'react-redux'
import { clearState, getUesrById, createUser, updateUser } from '../modules/userEdit'
import UserEdit from '../components/UserEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getUesrById: (id) => getUesrById(id),
    createUser: (query) => createUser(query),
    updateUser: (query) => updateUser(query)
}

const mapStateToProps = (state) => ({
    UesrEdit : state.UserEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit)
