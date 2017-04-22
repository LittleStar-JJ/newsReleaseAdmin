import { connect } from 'react-redux'
import { clearState, getAdminList, createMsg, updateMsg } from '../modules/adminList'

import AdminList from '../components/AdminList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getAdminList: (query) => getAdminList(query),
    createMsg: (query) => createMsg(query),
    updateMsg: (query) => updateMsg(query)
}

const mapStateToProps = (state) => ({
    AdminList : state.AdminList
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminList)
