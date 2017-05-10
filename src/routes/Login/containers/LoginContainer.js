/**
 * Created by xwatson on 2016/12/28.
 */
import { connect } from 'react-redux'
import { singIn, clearState } from '../modules/login'

import Login from '../components/Login'

const mapDispatchToProps = {
    singIn : (user) => singIn(user),
    clearState: (user) => clearState(user)
}

const mapStateToProps = (state) => ({
    UserInfo : state.User
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
