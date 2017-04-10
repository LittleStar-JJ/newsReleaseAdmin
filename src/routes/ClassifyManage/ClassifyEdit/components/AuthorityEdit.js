import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { QuotePlanStatus, genderStatus } from '../../../../constants/Status'

class AuthorityEdit extends React.Component {
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
            //  this.props.getUesrById(this.id)
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
        const optionsWithDisabled = [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange', disabled: false }
        ]
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'名称',
                disabled:this.state.disabled,
                fieldName:'authName',
                placeholder:'请输入',
                initialValue:userDetail.nickName,
                onChange:() => {}
            },
            {
                type:'checkboxGroup',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'value',
                    textField:'label',
                    placeholder:'选择可操作组',
                    options:optionsWithDisabled,
                    selected:userDetail.status,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'可操作组',
                fieldName:'operationGroup'
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
            console.log('aaaaaa', value)
            if (!this.id) {
                this.props.createUser({ freightBill:JSON.stringify(value) })
            } else {
                book.id = this.id
                this.props.updateUser({ freightBill:JSON.stringify(value) })
            }
        })
    }
}

export default Form.create()(AuthorityEdit)
