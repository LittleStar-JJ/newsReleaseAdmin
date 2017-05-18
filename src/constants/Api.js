/**
 * Created by xwatson on 2017/1/3.
 */
import AppConstants from './AppConstants'

const baseUrl = AppConstants.BASE_API_URL

export const UserApi = {
    getList: baseUrl + `news_admin/user/list`,
    getDetail: (id) => baseUrl + `news_admin/user/get/${id}`,
    update: (id) => baseUrl + `news_admin/user/get/${id}`,
    create: (id) => baseUrl + `news_admin/user/get/${id}`
}

export const AdminApi = {
    getList: baseUrl + `news_admin/admin/list`,
    getDetail: (id) => baseUrl + `news_admin/admin/get/${id}`,
    update: baseUrl + `news_admin/admin/update`,
    create: baseUrl + `news_admin/admin/create`
}

export const OperationApi = {
    getList: baseUrl + `news_admin/operation/list`,
    getDetail: (id) => baseUrl + `news_admin/operation/get/${id}`,
    update: baseUrl + `news_admin/operation/update`,
    create: baseUrl + `news_admin/operation/create`
}

export const MenuApi = {
    getList: baseUrl + `news_admin/menu/list`,
    getDetail: (id) => baseUrl + `news_admin/menu/get/${id}`,
    update: baseUrl + `news_admin/menu/update`,
    create: baseUrl + `news_admin/menu/create`
}

export const AuthorityApi = {
    getList: baseUrl + `news_admin/auth/list`,
    getDetail: (id) => baseUrl + `news_admin/auth/get/${id}`,
    update: baseUrl + `news_admin/auth/update`,
    create: baseUrl + `news_admin/auth/create`
}

export const CategoryApi = {
    getList: baseUrl + `news_admin/category/list`,
    getDetail: (id) => baseUrl + `news_admin/category/get/${id}`,
    update: baseUrl + `news_admin/category/update`,
    create: baseUrl + `news_admin/category/create`
}
export const NewsApi = {
    getList: baseUrl + `news_admin/news/list`,
    getDetail: (id) => baseUrl + `news_admin/news/get/${id}`,
    update: baseUrl + `news_admin/news/update`,
    create: baseUrl + `news_admin/news/create`,
    upload: baseUrl + `news_admin/news/upload`
}

export const CommentApi = {
    getList: baseUrl + `news_admin/comment/list`,
    getDetail: (id) => baseUrl + `news_admin/comment/get/${id}`,
    update: baseUrl + `news_admin/comment/update`,
    create: baseUrl + `news_admin/comment/create`,
    review: baseUrl + `news_admin/comment/review`
}
export const LinksApi = {
    getList: baseUrl + `news_admin/links/list`,
    getDetail: (id) => baseUrl + `news_admin/links/get/${id}`,
    update: baseUrl + `news_admin/links/update`,
    create: baseUrl + `news_admin/links/create`,
    upload: baseUrl + `news_admin/links/upload`
}

export const SiteApi = {
    getDetail: baseUrl + `news_admin/siteConfig/get`,
    update: baseUrl + `news_admin/siteConfig/update`
}

export const LoginApi = {
    login: baseUrl + `admin/login`
}
