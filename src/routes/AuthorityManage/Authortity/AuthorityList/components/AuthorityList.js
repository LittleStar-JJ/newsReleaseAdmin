import React from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import TableGrid from '../../../../../components/TableGrid'
import QueryList from '../../../../../components/QueryList'

export default class AuthorityList extends React.Component {
    static propTypes = {
        AuthorityList: React.PropTypes.object,
        getAuthorityList: React.PropTypes.func,
        deleteAuthority: React.PropTypes.func,
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
    componentWillMount() {
        this.getAuthoritys()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.AuthorityList.authorityList) {
            this.pageTotalElement = nextProps.AuthorityList.authorityList.totalElement
            const authorityList = nextProps.AuthorityList.authorityList.content
            authorityList.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.updatedAt = moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            })
            this.setState({ authorityList: authorityList })
            this.props.clearState()
        }
        if (nextProps.AuthorityList.delete) {
            message.success('删除成功')
            this.props.clearState()
            this.getAuthoritys()
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
                fieldLabel:'角色名称',
                fieldName:'name',
                initialValue:'',
                onChange:() => {}
            }
        ]
        const gridColumns = [
            {
                title: '角色名称', // 标题
                dataIndex: 'name', // 字段名称
                width:'30%'
            },
            {
                title: '创建时间', // 标题
                dataIndex: 'createdAt' // 字段名称
            },
            {
                title: '修改时间', // 标题
                dataIndex: 'updatedAt' // 字段名称
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
                    },
                    {
                        type:'popConfirm',
                        text:'删除',
                        title:'确定删除吗？',
                        onClick:(index) => {
                            this.props.deleteAuthority({ id:authorityList[index].id })
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
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={authorityList} />
                </div>
            </div>
        )
    }
}
