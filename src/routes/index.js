/**
 * Created by xwatson on 2016/12/8.
 */
import CoreLayout from '../layouts/CoreLayout'
import AuthLayout from '../layouts/AuthLayout'
import Home from './Home'
import NotFound from './NotFound'
import Login from './Login'
import AdminList from './AccountManage/AdminList'
import UserList from './AccountManage/UserList'
import UserEdit from './AccountManage/UserEdit'
import AuthorityList from './AuthorityManage/AuthorityList'
import AuthorityEdit from './AuthorityManage/AuthorityEdit'
import ClassifyList from './ClassifyManage/ClassifyList'
import ClassifyEdit from './ClassifyManage/ClassifyEdit'
import NewsList from './NewsManage/NewsList'
import NewsEdit from './NewsManage/NewsEdit'
import LinksList from './WebsiteManage/LinksList'
import SiteConfig from './WebsiteManage/SiteConfig'
import CommentList from './CommentManage/CommentList'
import CommentEdit from './CommentManage/CommentEdit'

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
            ClassifyEdit(store),
            NewsList(store),
            NewsEdit(store),
            LinksList(store),
            SiteConfig(store),
            CommentList(store),
            CommentEdit(store)

        ]
    },
    {
        path: '/login',
        component: AuthLayout,
        indexRoute: Login(store)
    },
    {
        path: '*',
        component: CoreLayout,
        indexRoute: NotFound,
        childRoutes: []
    }
])

export default createRoutes
