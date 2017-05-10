import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import TableGrid from '../../../../../components/TableGrid'
import QueryList from '../../../../../components/QueryList'
import { CommonStatus } from '../../../../../constants/Status'

export default class AuthorityList extends React.Component {
    static propTypes = {
        MenusList: React.PropTypes.object,
        getMenuList: React.PropTypes.func,
        clearState: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        list: [],
        isClearRowKeys:false
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getList = () => {
        this.props.getMenuList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        this.pageNum = 1
        this.query = value
        this.getList()
    }
    componentWillMount() {
        this.getList()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.MenusList.list) {
            const list = nextProps.MenusList.list
            list.map((item) => {
                item.statusName = CommonStatus[item.status]
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.parent = list.find((v, i) => {
                    return v.id === item.parent_id
                })
            })
            this.setState({ list: list })
            this.props.clearState()
        }
        if (nextProps.MenusList.error) {
            message.error(nextProps.MenusList.error.error)
            this.props.clearState()
        }
    }
    render() {
        const list = this.state.list || []
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'菜单名称',
                fieldName:'name',
                initialValue:'',
                onChange:() => {}
            }
        ]
        const gridColumns = [
            {
                title: '菜单名称', // 标题
                dataIndex: 'name' // 字段名称
            },
            {
                title: '路由地址', // 标题
                dataIndex: 'router' // 字段名称
            },
            {
                title: '图标', // 标题
                dataIndex: 'icon' // 字段名称
            },
            {
                title: '序号', // 标题
                dataIndex: 'sort' // 字段名称
            },
            {
                title: '上级菜单', // 标题
                dataIndex: 'parent.name' // 字段名称
            },
            {
                title: '状态', // 标题
                dataIndex: 'statusName' // 字段名称
            },
            {
                title: '创建时间', // 标题
                dataIndex: 'createdAt' // 字段名称
            },
            {
                title: '操作',
                type:'operation',
                dataIndex: 'operation',
                btns:[
                    {
                        type:'link',
                        text:'编辑',
                        onClick:(index) => { this.context.router.push('/menuEdit/' + list[index].id) }
                    },
                    {
                        type:'popConfirm',
                        text:'删除',
                        title:'确定删除吗？',
                        onClick:(index) => {
                        }
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
                this.getList()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getList()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <Button className="page-top-btns" type="primary" onClick={() => this.context.router.push('/menuEdit')}>添加菜单</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={list} />
                </div>
            </div>
        )
    }
}
