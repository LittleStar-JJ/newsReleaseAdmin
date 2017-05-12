import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col, Tree } from 'antd'
const TreeNode = Tree.TreeNode
import OBOREdit from '../../../../../components/OBOREdit'
import { OperationType } from '../../../../../constants/Status'

class AuthorityEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        AuthorityEdit: React.PropTypes.object,
        clearState: React.PropTypes.func,
        getAuthById: React.PropTypes.func,
        createAuth: React.PropTypes.func,
        updateAuth: React.PropTypes.func,
        getOperations: React.PropTypes.func,
        getMenus: React.PropTypes.func
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
        menus: [],
        menusCheckedKeys: [],
        selectedKeys: [],
        expandedKeys: [],
        operationTypes: [],
        operations: [],
        selectedOperations: [],
        detail: {},
        disabled:false,
        autoExpandParent:false,
        create:{},
        update:{}
    }
    componentWillMount() {
        this.props.getMenus()
        this.props.getOperations()
        if (this.id) {
            this.props.getAuthById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.AuthorityEdit.detail) {
            const detail = nextProps.AuthorityEdit.detail
            const selectedOperations = []
            const menusCheckedKeys = []
            detail.AuthOperation = detail.AuthOperation || []
            detail.AuthMenu = detail.AuthMenu || []
            detail.AuthOperation.map((item) => {
                selectedOperations.push(item.id)
            })
            detail.AuthMenu.map((item) => {
                menusCheckedKeys.push(item.id.toString())
            })
            this.setState({ detail, menusCheckedKeys, selectedOperations, expandedKeys:menusCheckedKeys })
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.menus) {
            const menus = nextProps.AuthorityEdit.menus
            const firstMenu = menus.filter((item) => item.parent_id === 0)
            firstMenu.map((item, i) => {
                this.setMenusData(item.id, item, menus)
            })
            this.setState({ menus:firstMenu, menusCheckedKeys:[] })
            console.log('ss', firstMenu)
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.operations) {
            const list = nextProps.AuthorityEdit.operations.content
            const operations = []
            list.map((item) => {
                operations.push({
                    label:item.name, value:item.id
                })
            })
            this.setState({ operations })
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.update) {
            message.success('修改成功')
            this.context.router.push('/authorityList')
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.create) {
            message.success('创建成功')
            this.context.router.push('/authorityList')
            this.props.clearState()
        }
        if (nextProps.AuthorityEdit.error) {
            message.error(nextProps.AuthorityEdit.error.error)
            this.props.clearState()
        }
    }
    setMenusData = (id, firstMenu, menus) => {
        const find = menus.filter((v) => {
            return id === v.parent_id
        })
        if (find.length) {
            find.map((f) => {
                f.key = `${id}-${f.id}`
                firstMenu.child = find
                this.setMenusData(f.id, f, menus)
            })
        }
    }
    onTreeSelect = (selectedKeys, info) => {
        console.log('select', selectedKeys)
        this.setState({ selectedKeys })
    }
    onTreeCheck = (checkedKeys, info) => {
        this.setState({ menusCheckedKeys:checkedKeys })
    }
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false
        })
    }
    render() {
        // const { getFieldDecorator } = this.props.form
        const detail = this.state.detail || {}
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'角色名称',
                disabled:this.state.disabled,
                fieldName:'name',
                placeholder:'请输入',
                initialValue:detail.name,
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
                type:'checkboxGroup',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'value',
                    textField:'label',
                    placeholder:'选择可操作组',
                    options:this.state.operations,
                    selected:this.state.selectedOperations,
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
                    <Button type="primary" onClick={(e) => { this.save(e) }}>保存</Button>
                </div>
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" />
                </div>
                <Row>
                    <Col offset={3} span={1} >菜单：</Col>
                    <Col span={12}>
                        <div style={{ marginTop:'-10px' }}>
                            <Tree checkable
                              onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
                              autoExpandParent={this.state.autoExpandParent}
                              onCheck={this.onTreeCheck} checkedKeys={this.state.menusCheckedKeys}
                              onSelect={this.onTreeSelect} selectedKeys={this.state.selectedKeys} >
                                {this._renderTreeNode(this.state.menus)}
                            </Tree>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
    _renderTreeNode = (menus) => {
        return menus.map((item) => {
            if (item.child) {
                return (
                    <TreeNode title={item.name} key={item.id} >
                        {this._renderTreeNode(item.child)}
                    </TreeNode>
                )
            } else {
                return <TreeNode title={item.name} key={item.id} />
            }
        })
    }
    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            value.operation_ids = value.operationGroup.join(',')
            value.menu_ids = this.state.menusCheckedKeys.join(',')
            delete value.operationGroup
            console.log('aaaaaa', value)
            if (!this.id) {
                this.props.createAuth(value)
            } else {
                value.id = this.id
                this.props.updateAuth(value)
            }
        })
    }
}

export default Form.create()(AuthorityEdit)
