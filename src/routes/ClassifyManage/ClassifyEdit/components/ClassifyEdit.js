import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Tree } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { QuotePlanStatus, genderStatus } from '../../../../constants/Status'

class ClassifyEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        ClassifyEdit: React.PropTypes.object,

        clearState: React.PropTypes.func,
        getClassifyById: React.PropTypes.func,
        createClassify: React.PropTypes.func,
        updateClassify: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        const { params: { id } } = props
        this.id = id
        this.status = 'DISABLED'
    }
    state = {
        classifyDetail: {},
        disabled:false,
        create:{},
        update:{}
    }
    componentWillMount() {
        if (this.id) {
            //  this.props.getClassifyById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.ClassifyEdit.classifyDetail) {
            const classifyDetail = nextProps.ClassifyEdit.classifyDetail
            this.setState({ classifyDetail: classifyDetail })
            this.props.clearState()
        }
        if (nextProps.ClassifyEdit.error) {
            message.error(nextProps.ClassifyEdit.error.error)
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
        const classifyDetail = this.state.classifyDetail || {}
        const optionsWithDisabled = [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange', disabled: false }
        ]
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'分类名称',
                disabled:this.state.disabled,
                fieldName:'name',
                placeholder:'请输入',
                initialValue:classifyDetail.name,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'路径',
                disabled:this.state.disabled,
                fieldName:'path',
                placeholder:'请输入',
                initialValue:classifyDetail.path,
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
                    selected:classifyDetail.parent,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'上级分类',
                fieldName:'parent.id'
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(QuotePlanStatus),
                    selected:classifyDetail.status,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'switch',
                fieldLabel:'是否导航',
                fieldName:'status',
                option:{
                    checked:'启用', // 启用显示文本
                    unChecked:'禁用', // 关闭显示文本
                    initialValue: classifyDetail.status ? classifyDetail.status === 'ENABLE' : true,
                    onChange:(val) => {
                        this.status = val ? 'ENABLE' : 'DISABLED'
                    }
                }
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'序号',
                disabled:this.state.disabled,
                fieldName:'sort',
                placeholder:'请输入',
                initialValue:classifyDetail.sort,
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
            console.log('aaaaaa', value)
            if (!this.id) {
                this.props.createClassify({ freightBill:JSON.stringify(value) })
            } else {
                book.id = this.id
                this.props.updateClassify({ freightBill:JSON.stringify(value) })
            }
        })
    }
}

export default Form.create()(ClassifyEdit)
