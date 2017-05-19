import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { CommonStatus, genderStatus } from '../../../../constants/Status'

class UesrEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        UesrEdit: React.PropTypes.object,

        clearState: React.PropTypes.func,
        getUesrById: React.PropTypes.func,
        createUser: React.PropTypes.func,
        updateUser: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        const { params: { id } } = props
        this.id = id
    }
    state = {
        userDetail: {},
        disabled:false,
        create:{},
        update:{}
    }
    componentWillMount() {
        if (this.id) {
            this.props.getUesrById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.UesrEdit.userDetail) {
            const userDetail = nextProps.UesrEdit.userDetail
            this.setState({ userDetail: userDetail })
            this.props.clearState()
        }
        if (nextProps.UesrEdit.create) {
            message.success('创建成功')
            this.props.clearState()
            this.context.router.push('/userList')
        }
        if (nextProps.UesrEdit.update) {
            message.success('修改成功')
            this.props.clearState()
            this.context.router.push('/userList')
        }
        if (nextProps.UesrEdit.error) {
            message.error(nextProps.UesrEdit.error.error)
            this.props.clearState()
        }
    }
    convertStatus = (statusObj) => {
        let arr = []
        Object.keys(statusObj).map((key) => {
            arr.push({ id: key, name:statusObj[key] })
        })
        return arr
    }
    render() {
        // const { getFieldDecorator } = this.props.form
        const userDetail = this.state.userDetail || {}
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'昵称',
                disabled:this.id || false,
                fieldName:'nickName',
                placeholder:'请输入',
                initialValue:userDetail.nickName,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'邮箱',
                disabled:this.id || false,
                fieldName:'email',
                placeholder:'请输入',
                initialValue:userDetail.email,
                onChange:() => {}
            },
            {
                type:'password',
                rules:[{ validate:'reg=^.{6,}$', message:'请输入6位以上密码' }],
                fieldLabel:'密码',
                disabled:this.state.disabled,
                fieldName:'password',
                placeholder:'请输入',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(CommonStatus),
                    selected:userDetail.status,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'text',
                fieldLabel:'手机号',
                disabled:this.state.disabled,
                fieldName:'phone',
                placeholder:'请输入',
                initialValue:userDetail.phone,
                onChange:() => {}
            },
            {
                type:'radioButton',
                disabled:this.state.disabled,
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(genderStatus),
                    selected:userDetail.gender ? userDetail.gender : 'MALE',
                    onChange:(val) => {}
                },
                fieldLabel:'性别',
                fieldName:'gender'
            },
            {
                type:'text',
                fieldLabel:'联系地址',
                disabled:this.state.disabled,
                fieldName:'address',
                placeholder:'请输入',
                initialValue:userDetail.address,
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'QQ',
                disabled:this.state.disabled,
                fieldName:'qq',
                placeholder:'请输入',
                initialValue:userDetail.qq,
                onChange:() => {}
            },
            {
                type:'datePicker',
                disabled:this.state.disabled,
                fieldLabel:'生日',
                fieldName:'birthday',
                initialValue:userDetail.birthday ? moment(userDetail.birthday).format('YYYY-MM-DD') : '',
                placeholder:'请选择',
                onChange:() => {}
            },
            {
                type:'textArea',
                style:{ height:'60px' },
                placeholder:'介绍（Introduction）',
                disabled:this.state.disabled,
                fieldLabel:'介绍',
                fieldName:'receiver',
                initialValue:userDetail.introduction,
                onChange:() => {}
            }
        ]
        if (this.id) {
            options[2].fieldLabel = '原始密码'
            options.splice(3, 0, {
                type:'password',
                rules:[{ validate:'reg=^.{6,}$', message:'请输入6位以上密码' }],
                fieldLabel:'新密码',
                fieldName:'new_password',
                placeholder:'请输入',
                initialValue:'',
                onChange:() => {}
            })
        }
        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    <Button type="primary" onClick={(e) => { this.save(e) }}>保存</Button>
                </div>
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" />
                </div>
            </div>
        )
    }

    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            value.birthday = value.birthday ? value.birthday.format('YYYY-MM-DD') : ''
            if (!this.id) {
                this.props.createUser(value)
            } else {
                value.id = this.id
                this.props.updateUser(value)
            }
        })
    }
}

export default Form.create()(UesrEdit)
