import React from 'react'
import { message } from 'antd'
import moment from 'moment'
import TableGrid from '../../../../../components/TableGrid'
import { OperationType, CommonStatus } from '../../../../../constants/Status'

export default class OperationList extends React.Component {
    static propTypes = {
        OperationList: React.PropTypes.object,
        getOperationList: React.PropTypes.func,
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
    getOperationList = () => {
        this.props.getOperationList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        this.pageNum = 1
        this.query = value
        this.getOperationList()
    }
    componentWillMount() {
        this.getOperationList()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.OperationList.list) {
            this.pageTotalElement = nextProps.OperationList.list.totalElement
            const list = nextProps.OperationList.list.content
            list.map((item) => {
                item.typeName = OperationType[item.type]
                item.statusName = CommonStatus[item.status]
                item.createdAt = item.createdAt ? moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') : ''
                item.updatedAt = item.updatedAt ? moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''
            })
            this.setState({ list: list })
            this.props.clearState()
        }
        if (nextProps.OperationList.error) {
            message.error(nextProps.OperationList.error.error)
            this.props.clearState()
        }
    }
    render() {
        const list = this.state.list || []
        const gridColumns = [
            {
                title: '操作名称', // 标题
                dataIndex: 'name' // 字段名称
            },
            {
                title: '类型', // 标题
                dataIndex: 'type' // 字段名称
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
                title: '修改时间', // 标题
                dataIndex: 'updatedAt' // 字段名称
            }
        ]
        const pagination = {
            total: this.pageTotalElement,
            showSizeChanger: true,
            current: this.pageNum,
            onShowSizeChange: (current, pageSize) => {
                this.pageSize = pageSize
                this.pageNum = current
                this.getOperationList()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getOperationList()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={list} pagination={pagination} />
                </div>
            </div>
        )
    }
}
