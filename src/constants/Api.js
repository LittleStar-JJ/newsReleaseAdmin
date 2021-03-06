/**
 * Created by xwatson on 2017/1/3.
 */
import AppConstants from './AppConstants'

const baseUrl = AppConstants.BASE_API_URL

export const UserApi = {
    getList: baseUrl + `news_admin/user/list`,
    getDetail: (id) => baseUrl + `news_admin/user/get/${id}`,
    create: baseUrl + `news_admin/user/create`,
    update: baseUrl + `news_admin/user/update`,
    delete: baseUrl + `news_admin/user/delete`
}

export const AdminApi = {
    getList: baseUrl + `news_admin/admin/list`,
    getDetail: (id) => baseUrl + `news_admin/admin/get/${id}`,
    update: baseUrl + `news_admin/admin/update`,
    create: baseUrl + `news_admin/admin/create`,
    delete: baseUrl + `news_admin/admin/delete`
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
    create: baseUrl + `news_admin/menu/create`,
    delete: baseUrl + `news_admin/menu/delete`
}

export const AuthorityApi = {
    getList: baseUrl + `news_admin/auth/list`,
    getDetail: (id) => baseUrl + `news_admin/auth/get/${id}`,
    update: baseUrl + `news_admin/auth/update`,
    create: baseUrl + `news_admin/auth/create`,
    delete: baseUrl + `news_admin/auth/delete`
}

export const CategoryApi = {
    getList: baseUrl + `news_admin/category/list`,
    getDetail: (id) => baseUrl + `news_admin/category/get/${id}`,
    update: baseUrl + `news_admin/category/update`,
    create: baseUrl + `news_admin/category/create`,
    delete: baseUrl + `news_admin/category/delete`
}
export const NewsApi = {
    getList: baseUrl + `news_admin/news/list`,
    getDetail: (id) => baseUrl + `news_admin/news/get/${id}`,
    update: baseUrl + `news_admin/news/update`,
    create: baseUrl + `news_admin/news/create`,
    upload: baseUrl + `news_admin/news/upload`,
    delete: baseUrl + `news_admin/news/delete`
}

export const CommentApi = {
    getList: baseUrl + `news_admin/comment/list`,
    getDetail: (id) => baseUrl + `news_admin/comment/get/${id}`,
    update: baseUrl + `news_admin/comment/update`,
    create: baseUrl + `news_admin/comment/create`,
    review: baseUrl + `news_admin/comment/review`,
    delete: baseUrl + `news_admin/comment/delete`
}
export const LinksApi = {
    getList: baseUrl + `news_admin/links/list`,
    getDetail: (id) => baseUrl + `news_admin/links/get/${id}`,
    update: baseUrl + `news_admin/links/update`,
    create: baseUrl + `news_admin/links/create`,
    upload: baseUrl + `news_admin/links/upload`,
    delete: baseUrl + `news_admin/links/delete`
}

export const SiteApi = {
    getDetail: baseUrl + `news_admin/siteConfig/get`,
    update: baseUrl + `news_admin/siteConfig/update`
}

export const LoginApi = {
    login: baseUrl + `admin/login`
}
