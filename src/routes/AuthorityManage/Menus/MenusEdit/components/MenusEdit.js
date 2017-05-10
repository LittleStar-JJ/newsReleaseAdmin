import React from 'react'
import moment from 'moment'
import { Button, message, Form } from 'antd'
import OBOREdit from '../../../../../components/OBOREdit'
import { QuotePlanStatus, genderStatus } from '../../../../../constants/Status'

export default class MenusEdit extends React.Component {
    static propTypes = {
        params: React.PropTypes.object,
        MenuEdit: React.PropTypes.object,
        clearState: React.PropTypes.func,
        getMenuList: React.PropTypes.func,
        getMenuById: React.PropTypes.func,
        createMenu: React.PropTypes.func,
        updateMenu: React.PropTypes.func
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
        list: [],
        detail: {},
        disabled:false,
        create:{},
        update:{}
    }
    componentWillMount() {
        if (this.id) {
            this.props.getMenuById(this.id)
        }
        this.props.getMenuList()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.MenuEdit.list) {
            const list = nextProps.MenuEdit.list
            this.setState({ list: list })
            this.props.clearState()
        }
        if (nextProps.MenuEdit.detail) {
            const detail = nextProps.MenuEdit.detail
            this.setState({ detail: detail })
            this.props.clearState()
        }
        if (nextProps.MenuEdit.update) {
            message.success('修改成功')
            this.context.router.push('/menuList')
            this.props.clearState()
        }
        if (nextProps.MenuEdit.create) {
            message.success('创建成功')
            this.context.router.push('/menuList')
            this.props.clearState()
        }
        if (nextProps.MenuEdit.error) {
            message.error(nextProps.MenuEdit.error.error)
            this.props.clearState()
        }
    }
    render() {
        const detail = this.state.detail || {}
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入菜单名称' }],
                fieldLabel:'菜单名称',
                disabled:this.state.disabled,
                fieldName:'name',
                placeholder:'请输入',
                initialValue:detail.name || '',
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'路由地址',
                disabled:this.state.disabled,
                fieldName:'router',
                placeholder:'请输入',
                initialValue:detail.router || '',
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'图标',
                disabled:this.state.disabled,
                fieldName:'icon',
                placeholder:'请输入',
                initialValue:detail.icon || '',
                onChange:() => {}
            },
            {
                type:'select', // 指定类型
                option:{ // 参数配置
                    valueField:'id', // 绑定value字段
                    textField:'name', // 绑定text字段
                    placeholder:'选择状态', // 提示信息
                    options: [{ id:'ENABLED', name:'启用' }, { id:'DISABLED', name:'禁用' }], // 下拉框option数据 (array)
                    selected: detail.status || 'ENABLED' // 选中数据（value[string]）
                },
                fieldLabel:'状态', // 显示label
                fieldName:'status' // 绑定的字段
            },
            {
                type:'select', // 指定类型
                option:{ // 参数配置
                    valueField:'id', // 绑定value字段
                    textField:'name', // 绑定text字段
                    placeholder:'选择上级菜单', // 提示信息
                    options: this.state.list, // 下拉框option数据 (array)
                    selected: detail.parent_id // 选中数据（value[string]）
                },
                fieldLabel:'上级菜单', // 显示label
                fieldName:'parent_id' // 绑定的字段
            }
        ]

        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    <Button type="primary" onClick={(e) => { this.save(e) }}>保存</Button>
                </div>
                <div style={{ width: '40%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" />
                </div>
            </div>
        )
    }

    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            if (!this.id) {
                this.props.createMenu(value)
            } else {
                value.id = this.id
                this.props.updateMenu(value)
            }
        })
    }
}
