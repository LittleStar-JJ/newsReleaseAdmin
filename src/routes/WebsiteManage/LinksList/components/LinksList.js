import React from 'react'
import { Tabs, Button, message, Modal } from 'antd'
import moment from 'moment'
import { QuotePlanStatus } from '../../../../constants/Status'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'
import OBOREdit from '../../../../components/OBOREdit'

export default class LinksList extends React.Component {
    static propTypes = {
        LinksList: React.PropTypes.object,
        getLinksList: React.PropTypes.func,
        clearState: React.PropTypes.func,
        updateMsg: React.PropTypes.func,
        createMsg: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        links: [],
        create:{},
        update:{},
        modalVisible:false,
        newRandomKeys:Math.random(),
        LinksOne:{}
    }
    constructor(props) {
        super(props)
        this.pageNum = 1
        this.pageSize = 10
        this.pageTotalElement = 0
        this.query = {}
    }
    getLinks = () => {
        this.props.getLinksList({ page: this.pageNum, size: this.pageSize, ...this.query })
    }
    handleSearch = (value) => {
        this.pageNum = 1
        this.query = value
        this.getLinks()
    }
    componentWillMount() {
        // this.getLinks()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.LinksList.links) {
            this.pageTotalElement = nextProps.LinksList.links.totalElement
            const links = nextProps.LinksList.links.content
            links.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = WorkOrderStatus[item.status]
            })
            this.setState({ links: links })
            this.props.clearState()
        }
        if (nextProps.LinksList.error) {
            message.error(nextProps.LinksList.error.error)
            this.props.clearState()
        }
    }
    translateStatus = (status) => {
        return Object.keys(status).map((key) => {
            return ({ id:key, name:status[key] })
        })
    }
    render() {
        // const links = this.state.links || []
        const links = [
            {
                name:1,
                url:2,
                sort:2,
                createdAt:11111111,
                statusName:'启用'
            }
        ]
        const LinksOne = this.state.LinksOne || {}
        const queryOptions = [
            {
                type:'text',
                fieldLabel:'链接名称',
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
                    onChange:(val) => {}
                },
                fieldLabel:'状态',
                fieldName:'status'
            }
        ]
        const gridColumns = [
            {
                title: '链接名称', // 标题
                dataIndex: 'name' // 字段名称
            },
            {
                title: '链接地址', // 标题
                dataIndex: 'url' // 字段名称
            },
            {
                title: '序号', // 标题
                dataIndex: 'sort' // 字段名称
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
                        status:{
                            field:'status',
                            actions: []
                        },
                        onClick:(index) => {
                            this.setState({ modalVisible:true, LinksOne: links[index], newRandomKeys:Math.random() })
                        }
                    }
                ]
            }
        ]
        const modalOption = [
            {
                type:'text',
                fieldLabel:'链接名称',
                fieldName:'name',
                initialValue:LinksOne.name,
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'链接地址',
                fieldName:'url',
                initialValue:LinksOne.url,
                onChange:() => {}
            },
            {
                type:'selectSearch',
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'选择状态',
                    options:this.translateStatus(QuotePlanStatus),
                    selected:LinksOne.status,
                    onChange:(val) => {}
                },
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'file',
                fieldLabel:'图标',
                uploadProps:{
                    name: 'file',
                    multiple:true,
                    accept:'.jpg,.jpeg,.gif,.png,.bmp',
                    action: '',
                    data:{ authToken:this.authToken },
                    fileList:this.state.fileList,
                    listType:'picture',
                    onRemove:(file) => {
                        this.state.fileList.map((item, i) => {
                            if (item.uid === file.uid) {
                                this.state.fileList.splice(i, 1)
                            }
                        })
                        this.setState({ fileList:this.state.fileList })
                        return true
                    },
                    onChange: (info) => {
                        if (info.file.status === 'done') {
                            if (info.file.response.code === ResponseCode.SUCCESS) {
                                const fileData = info.file.response.data
                                let _otherFiles = []
                                this.state.fileList.forEach((item, i) => {
                                    if (item.name !== info.file.name) {
                                        _otherFiles.push(item)
                                    }
                                })
                                _otherFiles.push({
                                    uid: fileData.id,
                                    name: info.file.name,
                                    status: 'done',
                                    url:`${consts.apiHost}/consignor/business_license/${fileData.id}?authToken=${this.authToken}`,
                                    thumbUrl:`${consts.apiHost}/consignor/business_license/${fileData.id}?authToken=${this.authToken}`
                                })
                                message.success(`${info.file.name} 上传成功`)
                                this.setState({ fileList:_otherFiles })
                                return false
                            } else {
                                if (info.file.response.code === ResponseCode.AUTH_EXPIRED) this.context.router.replace('/login')
                                message.error(info.file.response.message)
                            }
                        } else if (info.file.status === 'error') {
                            message.error(`${info.file.name} 上传失败.`)
                        }
                        this.state.fileList.push(info.file)
                        this.setState({ fileList:this.state.fileList })
                    }
                },
                fieldName:'file',
                onChange:() => {}
            }
        ]
        const pagination = {
            total: this.pageTotalElement,
            showSizeChanger: true,
            current: this.pageNum,
            onShowSizeChange: (current, pageSize) => {
                this.pageSize = pageSize
                this.pageNum = current
                this.getLinks()
            },
            onChange: (current) => {
                this.pageNum = current
                this.getLinks()
            }
        }
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <Button className="page-top-btns" type="primary" onClick={() => { this.setState({ modalVisible:true, newRandomKeys:Math.random() }) }}>友情链接创建</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={links} pagination={pagination} />
                </div>
                <Modal key={this.state.newRandomKeys} title="友情链接编辑" visible={this.state.modalVisible} width="40%" onCancel={() => { this.setState({ modalVisible:false }) }}
                  footer={[<Button key="back" type="ghost" size="large" onClick={(e) => this.save(e)}>确认</Button>]} >
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
            this.setState({ modalVisible:false })
        })
    }
}