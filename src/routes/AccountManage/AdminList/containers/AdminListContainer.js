import { connect } from 'react-redux'
import { clearState, getAdminList } from '../modules/adminList'

import AdminList from '../components/AdminList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getAdminList: (query) => getAdminList(query)
}

const mapStateToProps = (state) => ({
    AdminList : state.AdminList
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminList)
