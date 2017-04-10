/**
 * Created by xwatson on 2016/12/28.
 */
import './AuthLayout.scss'
import React from 'react'
import BaseLayout from '../Base/BaseLayout'
// import LangSwitch from '../../components/LangSwitch'

export default class AuthLayout extends BaseLayout {
    static propTypes = {
        children: React.PropTypes.any
    }
    render() {
        return (
            <div className="auth-layout">
                {/* <LangSwitch changeLocale={this.changeLocale} /> */}
                {this.props.children}
            </div>
        )
    }
}
