import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'
import { QuotePlanStatus } from '../../../../constants/Status'
export default class NewsList extends React.Component {
    static propTypes = {
        NewsList: React.PropTypes.object,
        getList: React.PropTypes.func,
        clearState: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        news: [],
        isClearRowKeys:false
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getNews = () => {
        this.props.getList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        let _datas1 = []
        if (value.createdAt) {
            value.createdAt.forEach((data) => {
                _datas1.push(data.format('x'))
            })
            value.createdAt = _datas1.join('-')
        }
        this.pageNum = 1
        this.query = value
        this.getNews()
    }
    componentWillMount() {
        this.getNews()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.NewsList.news) {
            this.pageTotalElement = nextProps.NewsList.news.totalElement
            const contenet = nextProps.NewsList.news
            contenet.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = QuotePlanStatus[item.status]
            })
            this.setState({ news: contenet, isClearRowKeys:false })
            this.props.clearState()
        }
        if (nextProps.NewsList.error) {
            message.error(nextProps.NewsList.error.error)
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
        const news = this.state.news || []
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'标题',
                fieldName:'title',
                onChange:() => {}
            },
            {
                type:'selectSearch',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(QuotePlanStatus),
                    onChange:(val) => {}
                },
                fieldLabel:'分类',
                fieldName:'category.id'
            },
            {
                type:'text',
                fieldLabel:'作者',
                fieldName:'author',
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
                fieldLabel:'添加时间',
                fieldName:'createdAt'
            }
        ]
        const gridColumns = [
            {
                title: '标题', // 标题
                dataIndex: 'title' // 字段名称
            },
            {
                title: '分类', // 标题
                dataIndex: 'category.name' // 字段名称
            },
            {
                title: '作者', // 标题
                dataIndex: 'author' // 字段名称
            },
            {
                title: '来源', // 标题
                dataIndex: 'source' // 字段名称
            },
            {
                title: '关键字', // 标题
                dataIndex: 'keyWords' // 字段名称
            },
            {
                title: '访问数', // 标题
                dataIndex: 'accessCount' // 字段名称
            },
            {
                title: '置顶标记', // 标题
                dataIndex: 'isTop' // 字段名称
            },
            {
                title: '状态', // 标题
                dataIndex: 'statusName' // 字段名称
            },
            {
                title: '添加时间', // 标题
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
                        onClick:(index) => { this.context.router.push('/newsEdit/' + news[index].id) }
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
                this.getNews()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getNews()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <Button className="page-top-btns" type="primary" onClick={() => this.context.router.push('/userEdit')}>新闻添加</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={news}
                      pagination={pagination} isClearRowKeys={this.state.isClearRowKeys} />
                </div>
            </div>
        )
    }
}
