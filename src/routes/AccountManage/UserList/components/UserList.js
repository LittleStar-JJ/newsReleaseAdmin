import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'
import { QuotePlanStatus } from '../../../../constants/Status'
export default class UserList extends React.Component {
    static propTypes = {
        UserList: React.PropTypes.object,
        getUserList: React.PropTypes.func,
        clearState: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        users: [],
        isClearRowKeys:false
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    UserList = () => {
        this.props.getUserList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        let _datas1 = []
        if (value.createdAt) {
            value.createdAt.forEach((data) => {
                _datas1.push(data.format('x'))
            })
            value.createdAt = _datas1.join('-')
        }
        let _datas2 = []
        if (value.loginTime) {
            value.loginTime.forEach((data) => {
                _datas2.push(data.format('x'))
            })
            value.loginTime = _datas2.join('-')
        }
        this.pageNum = 1
        this.query = value
        this.UserList()
    }
    getGridOperationState = (s) => {
        let gridOperationState = []
        Object.keys(WorkOrderStatus).forEach((key) => {
            if (key === s) {
                gridOperationState.push({ [key]:{ show: true } })
            } else {
                gridOperationState.push({ [key]:{ show: false } })
            }
        })
        return gridOperationState
    }
    componentWillMount() {
        this.UserList()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.UserList.users) {
            this.pageTotalElement = nextProps.UserList.users.totalElement
            const users = nextProps.UserList.users
            users.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.loginTime = moment(item.loginTime).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = QuotePlanStatus[item.status]
            })
            this.setState({ users: users, isClearRowKeys:false })
            this.props.clearState()
        }
        if (nextProps.UserList.error) {
            message.error(nextProps.UserList.error.error)
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
        const users = this.state.users || []
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'用户名',
                fieldName:'adminName',
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
                    options:this.convertStatus(QuotePlanStatus),
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
                title: '昵称', // 标题
                dataIndex: 'nickName' // 字段名称
            },
            {
                title: '邮箱', // 标题
                dataIndex: 'email' // 字段名称
            },
            {
                title: '性别', // 标题
                dataIndex: 'gender.name' // 字段名称
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
                title: '积分', // 标题
                dataIndex: 'integral' // 字段名称
            },
            {
                title: '登录IP', // 标题
                dataIndex: 'loginIP' // 字段名称
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
                        text:'编辑',
                        status:{
                            field:'status',
                            actions: []
                        },
                        onClick:(index) => { this.context.router.push('/userEdit/' + users[index].id) }
                    }
                ]
            }
        ]
        const pagination = {
            total: this.pageTotalElement,
            showSizeChanger: true,
            current: this.pageNum,
            onShowSizeChange: (current, pageSize) => {
                this.pageSize = pageSize
                this.pageNum = current
                this.UserList()
            },
            onChange: (current) => {
                this.pageNum = current
                this.UserList()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <Button className="page-top-btns" type="primary" onClick={() => this.context.router.push('/userEdit')}>会员创建</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={users}
                      pagination={pagination} isClearRowKeys={this.state.isClearRowKeys} />
                </div>
            </div>
        )
    }
}
