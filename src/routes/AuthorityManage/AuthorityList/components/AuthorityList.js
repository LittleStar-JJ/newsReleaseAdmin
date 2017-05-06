import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'

export default class AuthorityList extends React.Component {
    static propTypes = {
        AuthorityList: React.PropTypes.object,
        getAuthorityList: React.PropTypes.func,
        clearState: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        authorityList: [],
        isClearRowKeys:false
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getAuthoritys = () => {
        this.props.getAuthorityList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        this.pageNum = 1
        this.query = value
        this.getAuthoritys()
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
        this.getAuthoritys()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.AuthorityList.authorityList) {
            this.pageTotalElement = nextProps.AuthorityList.authorityList.totalElement
            const authorityList = nextProps.AuthorityList.authorityList
            authorityList.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
            })
            this.setState({ authorityList: authorityList })
            this.props.clearState()
        }
        if (nextProps.AuthorityList.error) {
            message.error(nextProps.AuthorityList.error.error)
            this.props.clearState()
        }
    }
    render() {
        const authorityList = this.state.authorityList || []
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'权限名称',
                fieldName:'name',
                initialValue:'',
                onChange:() => {}
            }
        ]
        const gridColumns = [
            {
                title: '权限名称', // 标题
                dataIndex: 'name' // 字段名称
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
                        status:{
                            field:'status',
                            actions: []
                        },
                        onClick:(index) => { this.context.router.push('/authorityEdit/' + authorityList[index].id) }
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
                this.getAuthoritys()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getAuthoritys()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <Button className="page-top-btns" type="primary" onClick={() => this.context.router.push('/authorityEdit')}>添加权限</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={authorityList} pagination={pagination} />
                </div>
            </div>
        )
    }
}
