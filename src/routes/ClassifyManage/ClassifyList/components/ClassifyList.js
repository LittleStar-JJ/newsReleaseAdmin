import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import { QuotePlanStatus } from '../../../../constants/Status'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'

export default class ClassifyList extends React.Component {
    static propTypes = {
        ClassifyList: React.PropTypes.object,
        getClassifyList: React.PropTypes.func,
        clearState: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        classifyList: [],
        isClearRowKeys:false
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getClassifys = () => {
        this.props.getClassifyList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        this.pageNum = 1
        this.query = value
        this.getClassifys()
    }
    componentWillMount() {
        this.getClassifys()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.ClassifyList.classifyList) {
            this.pageTotalElement = nextProps.ClassifyList.classifyList.totalElement
            const classifyList = nextProps.ClassifyList.classifyList
            classifyList.map((item) => {
                item.statusName = QuotePlanStatus[item.status]
            })
            this.setState({ classifyList: classifyList })
            this.props.clearState()
        }
        if (nextProps.ClassifyList.error) {
            message.error(nextProps.ClassifyList.error.error)
            this.props.clearState()
        }
    }
    translateStatus = (status) => {
        let newStatus = []
        Object.keys(status).map((key) => {
            newStatus.push({ id:key, name:status[key] })
        })
        return newStatus
    }
    render() {
        const classifyList = this.state.classifyList || []
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'分类名称',
                fieldName:'name',
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
                fieldLabel:'状态',
                fieldName:'stauts'
            }
        ]
        const gridColumns = [
            {
                title: '分类名称', // 标题
                dataIndex: 'name' // 字段名称
            },
            {
                title: '上级分类', // 标题
                dataIndex: 'parent.name' // 字段名称
            },
            {
                title: '状态', // 标题
                dataIndex: 'stauts' // 字段名称
            },
            {
                title: '导航标记', // 标题
                dataIndex: 'isNav' // 字段名称
            },
            {
                title: '序号', // 标题
                dataIndex: 'sort' // 字段名称
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
                        onClick:(index) => { this.context.router.push('/classifyEdit/' + classifyList[index].id) }
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
                this.getClassifys()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getClassifys()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <Button className="page-top-btns" type="primary" onClick={() => this.context.router.push('/authorityEdit')}>添加分类</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={classifyList} pagination={pagination} />
                </div>
            </div>
        )
    }
}
