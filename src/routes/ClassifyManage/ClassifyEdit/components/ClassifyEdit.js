import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Tree } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { CommonStatus } from '../../../../constants/Status'

class ClassifyEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        ClassifyEdit: React.PropTypes.object,
        clearState: React.PropTypes.func,
        getClassifyList: React.PropTypes.func,
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
        list:[],
        create:{},
        update:{}
    }
    componentWillMount() {
        this.props.getClassifyList()
        if (this.id) {
            this.props.getClassifyById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.ClassifyEdit.list) {
            const list = nextProps.ClassifyEdit.list.content
            const parent = []
            list.map((item) => {
                if (item.id.toString() !== this.id) {
                    parent.push(item)
                }
            })
            this.setState({ list:parent })
            this.props.clearState()
        }
        if (nextProps.ClassifyEdit.classifyDetail) {
            const classifyDetail = nextProps.ClassifyEdit.classifyDetail
            this.setState({ classifyDetail: classifyDetail })
            this.props.clearState()
        }
        if (nextProps.ClassifyEdit.create) {
            message.success('创建成功')
            this.context.router.push('/classifyList')
            this.props.clearState()
        }
        if (nextProps.ClassifyEdit.update) {
            message.success('修改成功')
            this.context.router.push('/classifyList')
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
                fieldLabel:'路由地址',
                fieldName:'router',
                placeholder:'请输入',
                initialValue:classifyDetail.router,
                onChange:() => {}
            },
            {
                type:'switch',
                fieldLabel:'是否导航',
                fieldName:'is_nav',
                option:{
                    checked:'是', // 启用显示文本
                    unChecked:'否', // 关闭显示文本
                    initialValue: classifyDetail.is_nav,
                    onChange:(val) => {
                    }
                }
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.state.list,
                    selected:classifyDetail.parent_id,
                    onChange:(val) => {}
                },
                fieldLabel:'上级分类',
                fieldName:'parent_id'
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(CommonStatus),
                    selected:classifyDetail.status,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'状态',
                fieldName:'status'
            }
            /* {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'序号',
                disabled:this.state.disabled,
                fieldName:'sort',
                placeholder:'请输入',
                initialValue:classifyDetail.sort,
                onChange:() => {}
            } */
        ]

        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    {
                        <div>
                            <Button type="primary" onClick={(e) => { this.save(e) }}>保存</Button>
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
            value.is_nav = typeof value.is_nav === 'undefined' ? false : value.is_nav
            if (!this.id) {
                this.props.createClassify(value)
            } else {
                value.id = this.id
                this.props.updateClassify(value)
            }
        })
    }
}

export default Form.create()(ClassifyEdit)
