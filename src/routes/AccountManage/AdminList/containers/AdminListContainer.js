import { connect } from 'react-redux'
import { clearState, getAdminList, createAdmin, updateAdmin, getAuthList, deleteAdmin } from '../modules/adminList'

import AdminList from '../components/AdminList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getAdminList: (query) => getAdminList(query),
    createAdmin: (query) => createAdmin(query),
    updateAdmin: (query) => updateAdmin(query),
    getAuthList: (query) => getAuthList(query),
    deleteAdmin: (query) => deleteAdmin(query)
}

const mapStateToProps = (state) => ({
    AdminList : state.AdminList
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminList)
