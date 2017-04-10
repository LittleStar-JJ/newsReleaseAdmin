/**
 * Created by xwatson on 2017/1/12.
 */
import cascaderAction from './cascaderAction'
import channelAction from './channelAction'
import payMethod from './payMethod'
import loading from './loading'
import submitCommissioned from './submitCommissioned'
import warehouse from './warehouse'
import country from './country'
import goods from './goods'

const actions = {
    cascaderArea: cascaderAction,
    channel: channelAction,
    payMethod: payMethod,
    loading: loading,
    submitEntrust: submitCommissioned,
    warehouse: warehouse,
    country: country,
    goods: goods
}

export default actions
