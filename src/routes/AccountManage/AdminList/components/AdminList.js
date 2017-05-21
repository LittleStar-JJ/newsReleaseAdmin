import React from 'react'
import { Button, message, Modal } from 'antd'
import moment from 'moment'
import { CommonStatus, BtnOperation } from '../../../../constants/Status'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'
import OBOREdit from '../../../../components/OBOREdit'
import BtnPermission from '../../../../components/BtnPermission'

export default class AdminList extends React.Component {
    static propTypes = {
        AdminList: React.PropTypes.object,
        getAdminList: React.PropTypes.func,
        clearState: React.PropTypes.func,
        updateAdmin: React.PropTypes.func,
        createAdmin: React.PropTypes.func,
        getAuthList: React.PropTypes.func,
        deleteAdmin: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        admins: [],
        auths: [],
        create:{},
        update:{},
        newRandomKeys:Math.random(),
        modalVisible:false,
        AdminOne:null
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getAdmins = () => {
        this.props.getAdminList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        let _data1 = []
        if (value.createdAt) {
            value.createdAt.forEach((data) => {
                _data1.push(data.format('YYYY-MM-DD HH:mm:ss'))
            })
            value.createdAt = _data1.join('|')
        }
        this.pageNum = 1
        this.query = value
        this.getAdmins()
    }
    componentWillMount() {
        this.getAdmins()
        this.props.getAuthList()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.AdminList.admins) {
            this.pageTotalElement = nextProps.AdminList.admins.totalElement
            const admins = nextProps.AdminList.admins.content
            admins.map((item) => {
                item.loginTime = moment(item.loginTime).format('YYYY-MM-DD HH:mm:ss')
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = CommonStatus[item.status]
            })
            this.setState({ admins: admins })
            this.props.clearState()
        }
        if (nextProps.AdminList.auths) {
            console.log('sss', nextProps.AdminList.auths)
            this.setState({ auths:nextProps.AdminList.auths.content })
            this.props.clearState()
        }
        if (nextProps.AdminList.error) {
            message.error(nextProps.AdminList.error.error)
            this.props.clearState()
        }
        if (nextProps.AdminList.update) {
            message.success('修改成功')
            this.setState({ modalVisible:false })
            this.getAdmins()
            this.props.clearState()
        }
        if (nextProps.AdminList.create) {
            message.success('创建成功')
            this.setState({ modalVisible:false })
            this.getAdmins()
            this.props.clearState()
        }
        if (nextProps.AdminList.delete) {
            this.props.clearState()
            message.success('删除成功')
            this.getAdmins()
        }
    }
    translateStatus = (status) => {
        return Object.keys(status).map((key) => {
            return ({ id:key, name:status[key] })
        })
    }
    render() {
        const admins = this.state.admins || []
        const AdminOne = this.state.AdminOne || {}
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'用户名',
                fieldName:'adminName',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'email',
                fieldLabel:'邮箱',
                fieldName:'email',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.state.auths,
                    selected:'',
                    onChange:(val) => {}
                },
                fieldLabel:'权限',
                fieldName:'auth_id'
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.translateStatus(CommonStatus),
                    onChange:(val) => {}
                },
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'rangePicker',
                initialValue:[],
                onChange:(val) => { console.log(val) },
                fieldLabel:'创建时间',
                fieldName:'createdAt'
            }
        ]
        const gridColumns = [
            {
                title: '用户名', // 标题
                dataIndex: 'adminName' // 字段名称
            },
            {
                title: '邮箱', // 标题
                dataIndex: 'email' // 字段名称
            },
            {
                title: '权限', // 标题
                dataIndex: 'Auth.name' // 字段名称
            },
            {
                title: '创建时间', // 标题
                dataIndex: 'createdAt' // 字段名称
            },
            {
                title: '登录时间', // 标题
                dataIndex: 'loginTime' // 字段名称
            },
            {
                title: '状态', // 标题
                dataIndex: 'statusName' // 字段名称
            },
            {
                title: '操作',
                type:'operation',
                dataIndex: 'operation',
                btns:[
                    {
                        type:'link',
                        authority:BtnOperation.编辑,
                        text:'编辑',
                        status:{
                            field:'status',
                            actions: []
                        },
                        onClick:(index) => {
                            this.setState({ modalVisible:true, AdminOne: admins[index], newRandomKeys:Math.random() })
                        }
                    },
                    {
                        type:'popConfirm',
                        authority:BtnOperation.删除,
                        text:'删除',
                        title:'确定删除吗？',
                        onClick:(index) => {
                            this.props.deleteAdmin({ id:admins[index].id })
                        }
                    }
                ]
            }
        ]
        console.log('aaa', AdminOne.authId)
        const modalOption = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入用户名' }],
                fieldLabel:'用户名',
                fieldName:'adminName',
                initialValue:AdminOne.adminName,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱' }],
                fieldLabel:'邮箱',
                fieldName:'email',
                initialValue:AdminOne.email,
                onChange:() => {}
            },
            {
                type:'password',
                rules:[{ required:true, message:'请输入密码' }, { validate:'reg=^.{6,}$', message:'请输入6位以上密码' }],
                fieldLabel:'密码',
                fieldName:'password',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择权限' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'权限',
                    options:this.state.auths,
                    selected:AdminOne.authId,
                    onChange:(val) => {}
                },
                fieldLabel:'权限',
                fieldName:'auth_id'
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择状态' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'选择状态',
                    options:this.translateStatus(CommonStatus),
                    selected:AdminOne.status,
                    onChange:(val) => {}
                },
                fieldLabel:'状态',
                fieldName:'status'
            }
        ]
        if (this.state.AdminOne) {
            modalOption[2].fieldLabel = '原始密码'
            modalOption.splice(3, 0, {
                type:'text',
                rules:[{ validate:'reg=^.{6,}$', message:'请输入6位以上密码' }],
                fieldLabel:'新密码',
                fieldName:'new_password',
                initialValue:'',
                onChange:() => {}
            })
        }
        const pagination = {
            total: this.pageTotalElement,
            showSizeChanger: true,
            current: this.pageNum,
            onShowSizeChange: (current, pageSize) => {
                this.pageSize = pageSize
                this.pageNum = current
                this.getAdmins()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getAdmins()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <BtnPermission type={BtnOperation.添加}>
                        <Button className="page-top-btns" type="primary" onClick={() => { this.setState({ modalVisible:true, newRandomKeys:Math.random(), AdminOne: null }) }}>账号创建</Button>
                    </BtnPermission>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={admins}
                      pagination={pagination} />
                </div>
                <Modal key={this.state.newRandomKeys} title="账号编辑" visible={this.state.modalVisible} width="40%" onCancel={() => { this.setState({ modalVisible:false }) }}
                  footer={[<Button key="back" type="primary" size="large" onClick={(e) => this.save(e)}>确认</Button>]} >
                    <OBOREdit ref="OBOREdit1" colSpan={24} options={modalOption} />
                </Modal>
            </div>
        )
    }
    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value1) => {
            console.log('vvvvvvv', this.state.AdminOne)
            if (this.state.AdminOne) {
                value1.id = this.state.AdminOne.id
                this.props.updateAdmin(value1)
            } else {
                this.props.createAdmin(value1)
            }
        })
    }
}
