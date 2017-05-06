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
