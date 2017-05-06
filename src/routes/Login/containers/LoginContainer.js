/**
 * Created by xwatson on 2016/12/28.
 */
import { connect } from 'react-redux'
import { fetchLogin, fetchRegister, getChannel, clearState } from '../modules/login'

import Login from '../components/Login'

const mapDispatchToProps = {
    singIn : (user) => fetchLogin(user),
    fetchRegister: (user) => fetchRegister(user),
    clearState: (user) => clearState(user),
    getChannel: () => getChannel()
}

const mapStateToProps = (state) => ({
    UserInfo : state.User
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
