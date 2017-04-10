/**
 * Created by xwatson on 2017/1/12.
 */
import { CALL_API } from '../middleware/api'
import { CommonAction } from '../constants/ActionTypes'
import { ChannelApi } from '../constants/Api'

const CLEAR_CHANNEL = 'CLEAR_CHANNEL'
const CLEAR_CREATE_CHANNEL = 'CLEAR_CREATE_CHANNEL'
const RECEIVE_CHANNEL = 'RECEIVE_CHANNEL'
const RECEIVE_SALES_CHANNEL = 'RECEIVE_SALES_CHANNEL' // 销售渠道列表
const RECEIVE_SALES_CHANNEL_CREATE = 'RECEIVE_SALES_CHANNEL_CREATE' // 销售渠道创建
const RECEIVE_TRADE_PLATFORM_LIST = 'RECEIVE_TRADE_PLATFORM_LIST'

export function clearChannelState() {
    return {
        type: CLEAR_CHANNEL
    }
}
// 请求渠道
function fetchChannel(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_CHANNEL, CommonAction.REQUEST_FAILURE + '_CHANNEL' ],
            endpoint: ChannelApi.getChannel,
            options: { body:{ ...query }, method:'GET' }
        }
    }
}
// 请求接口销售渠道（下拉框使用）
function fetchSalesChannelBySelect(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_SALES_CHANNEL, CommonAction.REQUEST_FAILURE + '_CHANNEL' ],
            endpoint: ChannelApi.getSalesChannelBySelect,
            options: { body:query, method:'GET' }
        }
    }
}
// 请求接口销售渠道列表（分页）
function fetchSalesChannelList(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_SALES_CHANNEL, CommonAction.REQUEST_FAILURE + '_CHANNEL' ],
            endpoint: ChannelApi.getSalesChannelList,
            options: { body:query, method:'GET' }
        }
    }
}
// 创建销售渠道
function fetchCreateSalesChannel(params) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_SALES_CHANNEL_CREATE, CommonAction.REQUEST_FAILURE + '_CHANNEL' ],
            endpoint: ChannelApi.createSalesChannel,
            options: { body:params, method:'POST' }
        }
    }
}

function fetchUpdateSalesChannel(params) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_SALES_CHANNEL_CREATE, CommonAction.REQUEST_FAILURE + '_CHANNEL' ],
            endpoint: ChannelApi.updateSalesChannel,
            options: { body:params, method:'POST' }
        }
    }
}

// 批量创建销售渠道
function fetchBatchCreateSalesChannel(params) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_SALES_CHANNEL_CREATE, CommonAction.REQUEST_FAILURE + '_CHANNEL' ],
            endpoint: ChannelApi.batchCreateSalesChannel,
            options: { body:params, method:'POST' }
        }
    }
}

function fetchTradePlatform(query) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_TRADE_PLATFORM_LIST, CommonAction.REQUEST_FAILURE + 'TRADE_PLATFORM' ],
            endpoint: ChannelApi.getTradePlatform,
            options: { body: query, method:'GET' }
        }
    }
}

/**
 * 获取渠道
 * @param query 查询条件
 * @returns {function(*, *)}
 */
export function getChannel(query) {
    return (dispatch, getState) => {
        dispatch(fetchChannel(query))
    }
}
/**
 * 获取销售渠道（下拉框使用）
 * @param query
 * @returns {function(*, *)}
 */
export function getSalesChannelBySelect(query) {
    return (dispatch, getState) => {
        dispatch(fetchSalesChannelBySelect(query))
    }
}
/**
 * 获取销售渠道列表（分页）
 * @param query
 * @returns {function(*, *)}
 */
export function getSalesChannelList(query) {
    return (dispatch, getState) => {
        dispatch(fetchSalesChannelList(query))
    }
}
/**
 * 创建销售渠道
 * @param query
 * @returns {function(*, *)}
 */
export function createSalesChannel(params) {
    return (dispatch, getState) => {
        dispatch(fetchCreateSalesChannel(params))
    }
}

export function updateSalesChannel(params) {
    return (dispatch, getState) => {
        dispatch(fetchUpdateSalesChannel(params))
    }
}

/**
 * 批量创建销售渠道
 * @param params
 * @returns {function(*, *)}
 */
export function batchCreateSalesChannelList(params) {
    return (dispatch, getState) => {
        dispatch(fetchBatchCreateSalesChannel(params))
    }
}

export function getTradePlatform(query) {
    return (dispatch, getState) => {
        dispatch(fetchTradePlatform(query))
    }
}
export function clearCreateChannel() {
    return {
        type: CLEAR_CREATE_CHANNEL
    }
}

const initialState = {
    Channels:null,
    SalesChannels:null,
    CrateSalesChannels:null,
    Platforms:null,
    error:null
}
const ACTION_HANDLERS = {
    [CLEAR_CHANNEL]: () => {
        return ({ ...initialState })
    },
    [CLEAR_CREATE_CHANNEL]: (state, action) => {
        return ({ ...state, CrateSalesChannels: null })
    },
    [RECEIVE_CHANNEL]: (state, action) => {
        return ({ ...state, Channels: action.response.data.content, error: null })
    },
    [RECEIVE_SALES_CHANNEL]: (state, action) => {
        return ({ ...state, SalesChannels: action.response.data, error: null })
    },
    [RECEIVE_SALES_CHANNEL_CREATE]: (state, action) => {
        return ({ ...state, CrateSalesChannels: action.response, error: null })
    },
    [RECEIVE_TRADE_PLATFORM_LIST] : (state, action) => {
        return ({ ...state, Platforms: action.response.data.content, error: null })
    },
    [CommonAction.REQUEST_FAILURE + '_CHANNEL']: (state, action) => {
        return ({ Channels: null, error: action })
    }
}
export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
