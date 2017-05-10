/**
 * Created by leeqj on 16/9/8.
 */
import 'isomorphic-fetch'
import AppConstants from '../containers/AppContainer'
import ObjectUtils from './ObjectUtils'
import FormData from 'form-data'
import ResponseCode from './ResponseCode'
import auth from './Auth'
import Encrypt from './Encrypt'
function formatParams(options) {
    const body = options.body
    if (!options.method || options.method.toUpperCase() === 'GET') {
        var arr = []
        for (let name in body) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(body[name]))
        }
        delete options.body
        return (arr.length ? '?' : '') + arr.join('&')
    } else if (options.method.toUpperCase() === 'POST') {
        let form = new FormData()
        for (let name in body) {
            form.append(name, body[name])
        }
        options.body = form
    }
    return ''
}

function dealWithCommonParmas(options) {
    let body = options.body ? options.body : {}
    console.log('body:', body)
    const session = auth.getAccount()
    if (session && session != null) {
        let { authToken = undefined } = session // aid=undefined,
        if (authToken) {
            body.authToken = authToken
        }
    }
    // 时间戳
    body['timestamp'] = Date.now()
    let parmasKeys = Object.keys(body)
    // let sign =''
    let keysAndValues = ''
    if (parmasKeys && Array.isArray(parmasKeys) && parmasKeys.length > 0) {
        parmasKeys.sort()
        parmasKeys.forEach((key) => {
            let value = body[key]
            let keyValue = ''
            if (!value || typeof value === 'undefined' || (typeof value === 'string' && value.trim() === '') ||
                (value && typeof value === 'object' && typeof value.length === 'number' && !value.length)
            ) {
                delete body[key]
            } else {
                keyValue = key + value.toString().trim()
            }
            keysAndValues += keyValue
        })
    }
    keysAndValues = keysAndValues.replace(/[\r|\n|\t| ]*/g, '')
    let sign = Encrypt.md5(keysAndValues).toUpperCase()
    sign = Encrypt.md5(sign + 'OBORSERVICE_TOKEN_SIGN_OS').toUpperCase()
    options.body = body
    // const commonHeaders = { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
    // options.headers = options.headers ? { ...options.headers, commonHeaders } : commonHeaders
    // options.mode = 'cors'
    return options
}

export default function(endpoint, options) { // , schema
    options = dealWithCommonParmas(options)
    const prams = ObjectUtils.clone(options.body)
    const fullUrl = ((endpoint.indexOf(AppConstants.host.BASE_API_URL) === -1) ? AppConstants.host.BASE_API_URL + endpoint : endpoint) + formatParams(options)
    return fetch(fullUrl, options)
        .then(response =>
            response.json().then(json => ({ json, response }))
        ).then(({ json, response }) => {
            if (!response.ok || json.code !== ResponseCode.SUCCESS) {
                return Promise.reject(json)
            }
            return {
                data: json.data,
                requestParams:prams,
                code: json.code,
                headers:response.headers
            }
        })
}
