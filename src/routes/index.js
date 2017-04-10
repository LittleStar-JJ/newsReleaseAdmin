/**
 * Created by xwatson on 2016/12/8.
 */
import CoreLayout from '../layouts/CoreLayout'
// import AuthLayout from '../layouts/AuthLayout'
import Home from './Home'
import NotFound from './NotFound'
// import Login from './Login'
import AdminList from './AccountManage/AdminList'
import UserList from './AccountManage/UserList'
import UserEdit from './AccountManage/UserEdit'
import AuthorityList from './AuthorityManage/AuthorityList'
import AuthorityEdit from './AuthorityManage/AuthorityEdit'
import ClassifyList from './ClassifyManage/ClassifyList'
import ClassifyEdit from './ClassifyManage/ClassifyEdit'

export const createRoutes = (store) => ([
    {
        path: '/',
        component: CoreLayout,
        indexRoute: Home,
        childRoutes: [
            AdminList(store),
            UserList(store),
            UserEdit(store),
            AuthorityList(store),
            AuthorityEdit(store),
            ClassifyList(store),
            ClassifyEdit(store)

        ]
    },
    {
        path: '*',
        component: CoreLayout,
        indexRoute: NotFound,
        childRoutes: []
    }
])

export default createRoutes
