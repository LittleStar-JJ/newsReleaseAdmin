import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import { CommentStatus, BtnOperation } from '../../../../constants/Status'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'

export default class ClassifyList extends React.Component {
    static propTypes = {
        CommentList: React.PropTypes.object,
        getCommentList: React.PropTypes.func,
        deleteComment: React.PropTypes.func,
        clearState: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        commentList: [],
        isClearRowKeys:false
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getComments = () => {
        this.props.getCommentList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        let _datas1 = []
        if (value.createdAt) {
            value.createdAt.forEach((data) => {
                _datas1.push(data.format('YYYY-MM-DD HH:mm:ss'))
            })
            value.createdAt = _datas1.join('|')
        }
        this.pageNum = 1
        this.query = value
        this.getComments()
    }
    componentWillMount() {
        this.getComments()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.CommentList.commentList) {
            this.pageTotalElement = nextProps.CommentList.commentList.totalElement
            const commentList = nextProps.CommentList.commentList.content
            commentList.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                if (item.status !== 'INIT') {
                    item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
                } else {
                    item.updatedAt = ''
                }
                item.statusName = CommentStatus[item.status]
            })
            this.setState({ commentList: commentList })
            this.props.clearState()
        }
        if (nextProps.CommentList.delete) {
            this.props.clearState()
            message.success('删除成功')
            this.getComments()
        }
        if (nextProps.CommentList.error) {
            message.error(nextProps.CommentList.error.error)
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
        const commentList = this.state.commentList || []
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'用户名',
                fieldName:'nickName',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'新闻标题',
                fieldName:'title',
                initialValue:'',
                onChange:() => {}
            },
            {
                type:'select',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.translateStatus(CommentStatus),
                    onChange:(val) => {}
                },
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'rangePicker',
                initialValue:[],
                onChange:(val) => { console.log(val) },
                fieldLabel:'评论时间',
                fieldName:'createdAt'
            }
        ]
        const gridColumns = [
            {
                title: '用户名', // 标题
                dataIndex: 'User.nickName' // 字段名称
            },
            {
                title: '内容', // 标题
                dataIndex: 'content' // 字段名称
            },
            {
                title: '新闻标题', // 标题
                dataIndex: 'News.title' // 字段名称
            },
            {
                title: '状态', // 标题
                dataIndex: 'statusName' // 字段名称
            },
            {
                title: '评论时间', // 标题
                dataIndex: 'createdAt' // 字段名称
            },
            {
                title: '审核时间', // 标题
                dataIndex: 'updatedAt' // 字段名称
            },
            {
                title: '操作',
                type:'operation',
                dataIndex: 'operation',
                btns:[
                    {
                        type:'link',
                        text:'查看',
                        authority:BtnOperation.查看,
                        status:{
                            field:'status',
                            actions: []
                        },
                        onClick:(index) => { this.context.router.push('/commentEdit/' + commentList[index].id) }
                    },
                    {
                        type:'popConfirm',
                        authority:BtnOperation.删除,
                        text:'删除',
                        title:'确定删除吗？',
                        onClick:(index) => {
                            this.props.deleteComment({ id:commentList[index].id })
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
                this.getComments()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getComments()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                    <br />
                </div>
                <br />
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={commentList} pagination={pagination} />
                </div>
            </div>
        )
    }
}
