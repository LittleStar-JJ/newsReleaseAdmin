import React from 'react'
import { Button, message, Modal } from 'antd'
import moment from 'moment'
import { QuotePlanStatus } from '../../../../constants/Status'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'
import OBOREdit from '../../../../components/OBOREdit'

export default class AdminList extends React.Component {
    static propTypes = {
        AdminList: React.PropTypes.object,
        getAdminList: React.PropTypes.func,
        clearState: React.PropTypes.func,
        updateMsg: React.PropTypes.func,
        createMsg: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        admins: [],
        create:{},
        update:{},
        isClearRowKeys:false,
        modalVisible:false,
        AdminOne:{}
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
            value.createdTime.forEach((data) => {
                _data1.push(data.format('x'))
            })
            value.createdTime = _data1.join('-')
        }
        this.pageNum = 1
        this.query = value
        this.getAdmins()
    }
    componentWillMount() {
        this.getAdmins()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.AdminList.admins) {
            this.pageTotalElement = nextProps.AdminList.admins.totalElement
            const admins = nextProps.AdminList.admins
            admins.map((item) => {
                item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = WorkOrderStatus[item.status]
            })
            this.setState({ admins: admins, isClearRowKeys:false })
            this.props.clearState()
        }
        if (nextProps.AdminList.error) {
            message.error(nextProps.AdminList.error.error)
            this.props.clearState()
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
                type:'text',
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
                    options:this.translateStatus(QuotePlanStatus),
                    // selected:plan.departureHarbor ? plan.departureHarbor.id : '',
                    onChange:(val) => {}
                },
                fieldLabel:'权限',
                fieldName:'auth'
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.translateStatus(QuotePlanStatus),
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
                dataIndex: 'auth.name' // 字段名称
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
                dataIndex: 'status' // 字段名称
            },
            {
                title: '操作',
                type:'operation',
                dataIndex: 'operation',
                btns:[
                    {
                        type:'link',
                        text:'编辑',
                        status:{
                            field:'status',
                            actions: []
                        },
                        onClick:(index) => {
                            this.setState({ modalVisible:true, AdminOne: admins[index] })
                        }
                    }
                ]
            }
        ]
        const modalOption = [
            {
                type:'text',
                fieldLabel:'用户名',
                fieldName:'adminName',
                initialValue:AdminOne.adminName,
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'邮箱',
                fieldName:'email',
                initialValue:AdminOne.email,
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'密码',
                fieldName:'password',
                initialValue:AdminOne.password,
                onChange:() => {}
            },
            {
                type:'selectSearch',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'权限',
                    options:this.translateStatus(QuotePlanStatus),
                    selected:(AdminOne.auth ? AdminOne.auth : {}).id,
                    onChange:(val) => {}
                },
                fieldLabel:'权限',
                fieldName:'auth'
            },
            {
                type:'selectSearch',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'选择状态',
                    options:this.translateStatus(QuotePlanStatus),
                    selected:AdminOne.status,
                    onChange:(val) => {}
                },
                fieldLabel:'状态',
                fieldName:'status'
            }
        ]
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
                    <Button className="page-top-btns" type="primary" onClick={() => { this.setState({ modalVisible:true }) }}>账号创建</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={admins}
                      pagination={pagination} isClearRowKeys={this.state.isClearRowKeys} />
                </div>
                <Modal title="账号编辑" visible={this.state.modalVisible} width="40%" onCancel={() => { this.setState({ modalVisible:false }) }}
                  footer={[<Button key="back" type="ghost" size="large" onClick={() => this.save(e)}>确认</Button>]} >
                    <OBOREdit ref="OBOREdit1" colSpan={24} options={modalOption} />
                </Modal>
            </div>
        )
    }
    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value1) => {
            if (this.id) {
                admin.id = this.id
                this.props.updateMsg({ admin: JSON.stringify(value1) })
            } else {
                this.props.createMsg({ admin: JSON.stringify(value1) })
            }
        })
    }
}
