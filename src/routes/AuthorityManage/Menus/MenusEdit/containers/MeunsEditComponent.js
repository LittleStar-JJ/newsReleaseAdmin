import { connect } from 'react-redux'
import { clearState, getMenuById, createMenu, updateMenu, getMenuList } from '../modules/menusEdit'
import MenusEdit from '../components/MenusEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getMenuList: (id) => getMenuList(id),
    getMenuById: (id) => getMenuById(id),
    createMenu: (query) => createMenu(query),
    updateMenu: (query) => updateMenu(query)
}

const mapStateToProps = (state) => ({
    MenuEdit : state.MenuEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(MenusEdit)
