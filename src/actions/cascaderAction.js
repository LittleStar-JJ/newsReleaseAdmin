/**
 * Created by xwatson on 2017/1/12.
 */
const CLEAR_OBORCASCADER_STATE = 'RECEIVE_OBORCASCADER'
const RECEIVE_OBORCASCADER = 'RECEIVE_OBORCASCADER'
import { CALL_API } from '../middleware/api'
import { CommonAction } from '../constants/ActionTypes'
import { CascaderApi } from '../constants/Api'

export function clearCascadeState() {
    return {
        type : CLEAR_OBORCASCADER_STATE
    }
}
// 获取地区数据
export function fetchAllArea(code) {
    return {
        [CALL_API]: {
            types: [ CommonAction.REQUEST_START, RECEIVE_OBORCASCADER, CommonAction.REQUEST_FAILURE + '_OBORCASCADER' ],
            endpoint: CascaderApi.getArea,
            cache:true,
            options: { body:{ code: code || 86000000, all:true }, method:'GET' }
        }
    }
}
export function getAllArea(code) {
    return (dispatch, getState) => {
        dispatch(fetchAllArea(code))
    }
}
const initialState = {
    fetching:false,
    area:null,
    error:null
}
const ACTION_HANDLERS = {
    [CLEAR_OBORCASCADER_STATE]: (state, action) => {
        return ({ ...initialState })
    },
    [CommonAction.REQUEST_FAILURE + '_OBORCascader']: (state, action) => {
        return ({ ...state, fetching: false, area: null, error: action })
    },
    [RECEIVE_OBORCASCADER] : (state, action) => {
        let result = action.response ? action.response.data : {}
        let areas = new Map()
        let areaKeys = Object.keys(result)
        areaKeys.forEach(keyCode => {
            let keyCodeInt = parseInt(keyCode)
            if (keyCodeInt % 1000000 === 0) {
            } else if (keyCodeInt % 10000 === 0) {
                let province = areas.get(keyCode)
                if (!province) {
                    province = {
                        value:keyCodeInt,
                        label:result[keyCode],
                        children:new Map()
                    }
                }
                areas.set(keyCode, province)
            } else if (keyCodeInt % 100 === 0) {
                let provinceKeyCode = parseInt(keyCodeInt / 10000) * 10000
                let province = areas.get(`${provinceKeyCode}`)
                if (!province) {
                    province = {
                        value:keyCodeInt,
                        label:result[`${provinceKeyCode}`],
                        children:new Map()
                    }
                }
                let citiesOfProvince = province.children
                let city = citiesOfProvince.get(keyCode)
                if (!city) {
                    city = {
                        value:keyCodeInt,
                        label:result[keyCode],
                        children:new Map()
                    }
                }
                citiesOfProvince.set(keyCode, city)
            } else {
                let provinceKeyCode = parseInt(keyCodeInt / 10000) * 10000
                let province = areas.get(`${provinceKeyCode}`)
                if (!province) {
                    province = {
                        value:keyCodeInt,
                        label:result[`${provinceKeyCode}`],
                        children:new Map()
                    }
                }
                let citiesOfProvince = province.children
                let cityCode = parseInt(keyCodeInt / 100) * 100
                let city = citiesOfProvince.get(`${cityCode}`)
                if (!city) {
                    city = {
                        value:keyCodeInt,
                        label:result[`${cityCode}`],
                        children:new Map()
                    }
                }
                let areasOfCity = city.children
                let area = areasOfCity.get(keyCode)
                if (!area) {
                    area = {
                        value:keyCodeInt,
                        label:result[keyCode]
                    }
                }
                areasOfCity.set(keyCode, area)
            }
        })
        result = []
        areas.forEach((provinceObject, key) => {
            let cities = provinceObject.children
            let provinceName = provinceObject.label
            let provinceCode = provinceObject.value
            let provinceCities = []
            cities.forEach((cityObject, cityKey) => {
                let cityName = cityObject.label
                let cityCode = cityObject.value
                let cityAreas = []
                let areas = cityObject.children
                areas.forEach((areaObject, areaKey) => {
                    let areaName = areaObject.label
                    let areaCode = areaObject.value
                    let area = { value:areaCode, label: areaName }
                    cityAreas.push(area)
                })
                let city = { value:cityCode, label: cityName, children:cityAreas }
                provinceCities.push(city)
            })
            let province = { value:provinceCode, label: provinceName, children: provinceCities }
            result.push(province)
        })
        return ({ ...state, fetching: false, area: result, error: null })
    }
}

export default function reducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type]

    return handler ? handler(state, action) : state
}
