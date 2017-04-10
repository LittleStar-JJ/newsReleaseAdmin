import { connect } from 'react-redux'
import { clearState, getUserList } from '../modules/userList'

import UserList from '../components/UserList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getUserList: (query) => getUserList(query)
}

const mapStateToProps = (state) => ({
    UserList : state.UserList
})

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
