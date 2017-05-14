import React from 'react'
import { Tabs, Button, message, Modal } from 'antd'
import moment from 'moment'
import { CommonStatus } from '../../../../constants/Status'
import TableGrid from '../../../../components/TableGrid'
import QueryList from '../../../../components/QueryList'
import OBOREdit from '../../../../components/OBOREdit'
import ResponseCode from '../../../../utils/ResponseCode'
import { LinksApi } from '../../../../constants/Api'
const config = require('../../../../../config/config.json')[NODE_ENV.toUpperCase()]

export default class LinksList extends React.Component {
    static propTypes = {
        LinksList: React.PropTypes.object,
        getLinksList: React.PropTypes.func,
        clearState: React.PropTypes.func,
        createLinks: React.PropTypes.func,
        updateLinks: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        links: [],
        fileList: [],
        create:{},
        update:{},
        modalVisible:false,
        newRandomKeys:Math.random(),
        LinksOne:null
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
        this.getLinks()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.LinksList.links) {
            this.pageTotalElement = nextProps.LinksList.links.totalElement
            const links = nextProps.LinksList.links.content
            links.map((item) => {
                item.createdAt = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                item.statusName = CommonStatus[item.status]
            })
            this.setState({ links: links })
            this.props.clearState()
        }
        if (nextProps.LinksList.create) {
            message.success('创建成功')
            this.getLinks()
            this.setState({ LinksOne:null })
            this.props.clearState()
        }
        if (nextProps.LinksList.update) {
            message.success('修改成功')
            this.getLinks()
            this.setState({ LinksOne:null })
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
        const links = this.state.links || []
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
                    options:this.translateStatus(CommonStatus),
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
                            const _c = links[index]
                            _c.icon = _c.icon || ''
                            const icon = _c.icon.substr(_c.icon.lastIndexOf('/') + 1, _c.icon.length)
                            const fileList = [{
                                uid:icon + Math.random(),
                                name: icon,
                                status: 'done',
                                url:_c.icon
                            }]
                            this.setState({ newRandomKeys:Math.random(), modalVisible:true, LinksOne: _c, fileList })
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
                    options:this.translateStatus(CommonStatus),
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
                    key:this.state.newRandomKeys,
                    name: 'file',
                    accept:'.jpg,.jpeg,.gif,.png,.bmp',
                    action: LinksApi.upload,
                    data:{ authToken:this.authToken },
                    fileList:Object.assign([], [], this.state.fileList),
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
                                let _otherFiles = [{
                                    uid: fileData.id,
                                    name: info.file.name,
                                    status: 'done',
                                    url:`${config.apiHost}/${fileData.path}`
                                }]
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
                        this.setState({ fileList:[info.file] })
                    }
                },
                fieldName:'icon',
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
        console.log('s',this.state.newRandomKeys)
        return (
            <div className="page-container">
                <div className="page-tabs-query">
                    <Button className="page-top-btns" type="primary" onClick={() => {
                        this.setState({ newRandomKeys:Math.random(), modalVisible:true, LinksOne:null, fileList:[] })
                    }}>友情链接创建</Button>
                    <div className="page-query">
                        <QueryList queryOptions={queryOptions} onSearchChange={this.handleSearch} />
                    </div>
                </div>
                <div className="page-tabs-table">
                    <TableGrid columns={gridColumns} dataSource={links} pagination={pagination} />
                </div>
                <Modal title="友情链接编辑" key={this.state.newRandomKeys} visible={this.state.modalVisible} width="40%" onCancel={() => { this.setState({ modalVisible:false }) }}
                  footer={[<Button key="back" type="ghost" size="large" onClick={(e) => this.save(e)}>确认</Button>]} >
                    <OBOREdit ref="OBOREdit1" colSpan={24} options={modalOption} />
                </Modal>
            </div>
        )
    }
    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value1) => {
            const icon = this.state.fileList.map((item) => item.url)
            value1.icon = icon.join(',')
            if (this.state.LinksOne) {
                value1.id = this.state.LinksOne.id
                this.props.updateLinks(value1)
            } else {
                this.props.createLinks(value1)
            }
            this.setState({ modalVisible:false })
        })
    }
}
