/**
 * Created by leeqj on 2016/11/4.
 */
const config = require('../../config/config.json')[NODE_ENV.toUpperCase()]

export default {
    BASE_API_URL: config.apiHost + '/',
    PAYED_RESULT_URL: window.location.protocol + '//' + window.location.hostname + '/payments'
}
