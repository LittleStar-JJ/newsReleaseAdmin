import { connect } from 'react-redux'
import { clearState, getMenuList, deleteMenu } from '../modules/menusList'

import MenusList from '../components/MenusList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getMenuList: (query) => getMenuList(query),
    deleteMenu: (query) => deleteMenu(query)
}

const mapStateToProps = (state) => ({
    MenusList : state.MenusList
})

export default connect(mapStateToProps, mapDispatchToProps)(MenusList)
