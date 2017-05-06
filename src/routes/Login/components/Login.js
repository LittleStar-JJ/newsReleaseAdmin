/**
 * Created by xwatson on 2016/12/28.
 */
import '../../../styles/LoginForm.scss'
import React from 'react'
import { Form, Icon, Input, Button, Checkbox, Modal, message } from 'antd'
// import { Link } from 'react-router'
import Auth from '../../../utils/Auth'
import ResponseCode from '../../../utils/ResponseCode'
const FormItem = Form.Item

const Login = Form.create()(React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    propTypes: {
        intl: React.PropTypes.object,
        form: React.PropTypes.any,
        singIn: React.PropTypes.func,
        UserInfo: React.PropTypes.object,
        fetchRegister: React.PropTypes.func,
        location: React.PropTypes.object,
        getChannel: React.PropTypes.func,
        clearState: React.PropTypes.func
    },
    getInitialState() {
        return {
            currentTab: 'login'
        }
    },
    handleSubmitLogin(e) {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.isValidate = true
                // this.props.singIn(values)
                this.context.router.push('/')
            }
        })
    },
    handleTabsChange(key) {
        this.setState({ ...this.state, currentTab:key })
    },
    componentWillReceiveProps(nextProps) {
        if (this.isValidate) {
            if (nextProps.UserInfo.User) {
                if (nextProps.UserInfo.User.code === ResponseCode.SUCCESS) {
                    console.log('nextProps.UserInfo.User', nextProps.UserInfo.User)
                    this.isValidate = false
                    Auth.login(nextProps.UserInfo.User.data)
                    let nextPathName = '/'
                    let state = {}
                    let query = {}
                    if (this.props.location && this.props.location.state && this.props.location.state.nextPathname) {
                        nextPathName = this.props.location.state.nextPathname
                        state = this.props.location.state.preState
                        query = this.props.location.state.query
                    }
                    this.props.clearState()
                    this.context.router.replace({
                        pathname : nextPathName,
                        state    : state,
                        query    : query
                    })
                    message.success('登录成功')
                }
                this.isValidate = false
            }
            if (nextProps.UserInfo.error) {
                this.isValidate = false
                Modal.error({
                    title: '请求失败',
                    content: nextProps.UserInfo.error.error
                })
                this.props.clearState()
            }
        }
    },
    handleRegisterNow() {
        this.setState({ ...this.state, currentTab:'register' })
    },
    render() {
        const { getFieldDecorator } = this.props.form
        // const { currentTab } = this.state
        return (
            <div className="login-container">
                <div className="login-window">
                    <h3 style={{ textAlign:'center', color:'#f5f5f5', marginBottom:'10px' }}>跨境云平台端</h3>
                    <Form onSubmit={this.handleSubmitLogin} className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{
                                    required: true, message: '请输入用户名！'
                                }]
                            })(
                                <Input addonBefore={<Icon type="user" />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码！' }]
                            })(
                                <Input addonBefore={<Icon type="lock" />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem style={{ marginBottom:0 }}>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            {/* <Link to="/login/forgetPwd" className="login-form-forgot">{this.props.intl.formatMessage(messages.ForgotPwd)}</Link> */}
                            <Button style={{ marginBottom:'10px' }} type="primary" size="large" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}))

export default Login
