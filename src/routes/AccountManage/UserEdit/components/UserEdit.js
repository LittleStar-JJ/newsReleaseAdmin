import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { QuotePlanStatus, genderStatus } from '../../../../constants/Status'

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
                disabled:this.state.disabled,
                fieldName:'nickName',
                placeholder:'请输入',
                initialValue:userDetail.nickName,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'邮箱',
                disabled:this.state.disabled,
                fieldName:'email',
                placeholder:'请输入',
                initialValue:userDetail.email,
                onChange:() => {}
            },
            {
                type:'password',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'密码',
                disabled:this.state.disabled,
                fieldName:'password',
                placeholder:'请输入',
                initialValue:userDetail.password,
                onChange:() => {}
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(QuotePlanStatus),
                    selected:userDetail.status,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
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
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(genderStatus),
                    selected:userDetail.gender ? userDetail.gender.id : 'MALE',
                    onChange:(val) => {}
                },
                fieldLabel:'性别',
                fieldName:'gender'
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'联系地址',
                disabled:this.state.disabled,
                fieldName:'address',
                placeholder:'请输入',
                initialValue:userDetail.address,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'QQ',
                disabled:this.state.disabled,
                fieldName:'qq',
                placeholder:'请输入',
                initialValue:userDetail.qq,
                onChange:() => {}
            },
            {
                type:'datePicker',
                rules:[{ required:true, message:'请选择' }],
                disabled:this.state.disabled,
                fieldLabel:'生日',
                fieldName:'birthday',
                initialValue:moment(userDetail.birthday),
                placeholder:'请选择',
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                disabled:this.state.disabled,
                fieldLabel:'积分',
                fieldName:'integral',
                placeholder:'请输入',
                initialValue:userDetail.integral,
                onChange:() => {}
            },
            {
                type:'textArea',
                placeholder:'介绍（Introduction）',
                disabled:this.state.disabled,
                style:{ height:'60px' },
                fieldLabel:'介绍',
                fieldName:'receiver',
                initialValue:userDetail.introduction,
                onChange:() => {}
            }
        ]

        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    {
                        <div>
                            <Popconfirm title="保存信息不可修改，是否确认？" onConfirm={(e) => { this.save(e) }}>
                                <Button type="primary">保存</Button>
                            </Popconfirm>
                        </div>
                    }
                </div>
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" />
                </div>
            </div>
        )
    }

    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            value.birthday = value.birthday.format('x')
            console.log('aaaaaa', value)
            if (!this.id) {
                this.props.createUser({ freightBill:JSON.stringify(book) })
            } else {
                book.id = this.id
                this.props.updateUser({ freightBill:JSON.stringify(book) })
            }
        })
    }
}

export default Form.create()(UesrEdit)
