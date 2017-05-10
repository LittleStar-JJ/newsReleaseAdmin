import { connect } from 'react-redux'
import { clearState, getMenuList } from '../modules/menusList'

import MenusList from '../components/MenusList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getMenuList: (query) => getMenuList(query)
}

const mapStateToProps = (state) => ({
    MenusList : state.MenusList
})

export default connect(mapStateToProps, mapDispatchToProps)(MenusList)
