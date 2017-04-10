/**
 * Created by xwatson on 2017/2/23.
 */
import React from 'react'

export default class baseComponent extends React.Component {
    handleValidateValue(value, rules, dataIndex, dataKey) {
        let _msg = ''
        value = (value || '').toString().trim()
        rules.forEach((item) => {
            if (item.required && value === '') {
                _msg = item.message
                return false
            } else if (value !== '' && item.validate && _msg === '') {
                let _keyVal = item.validate.split('=')
                switch (_keyVal[0]) {
                    case 'reg':
                        let _reg = new RegExp(_keyVal[1])
                        if (!_reg.test(value)) {
                            _msg = item.message
                            return false
                        }
                        break
                }
            } else if (value !== '' && item.customize && _msg === '') {
                const customize = item.customize(value, dataIndex, dataKey)
                if (customize !== true) {
                    _msg = customize
                    return false
                }
            }
        })
        return _msg
    }
}
