import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { QuotePlanStatus, genderStatus } from '../../../../constants/Status'

class NewsEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        NewsEdit: React.PropTypes.object,

        clearState: React.PropTypes.func,
        getNewsById: React.PropTypes.func,
        createNews: React.PropTypes.func,
        updateNews: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        const { params: { id } } = props
        this.id = id
    }
    state = {
        classifyDetail: {},
        disabled:false,
        create:{},
        update:{}
    }
    componentWillMount() {
        if (this.id) {
            //  this.props.getNewsById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.NewsEdit.newsDetail) {
            const newsDetail = nextProps.NewsEdit.newsDetail
            this.setState({ newsDetail: newsDetail })
            this.props.clearState()
        }
        if (nextProps.NewsEdit.error) {
            message.error(nextProps.NewsEdit.error.error)
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
        const newsDetail = this.state.newsDetail || {}
        const optionsWithDisabled = [
            { label: 'Apple', value: 'Apple' },
            { label: 'Pear', value: 'Pear' },
            { label: 'Orange', value: 'Orange', disabled: false }
        ]
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'标题',
                disabled:this.state.disabled,
                fieldName:'title',
                placeholder:'请输入',
                initialValue:newsDetail.name,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'关键字',
                disabled:this.state.disabled,
                fieldName:'keyWords',
                placeholder:'请输入',
                initialValue:newsDetail.path,
                onChange:() => {}
            },
            {
                type:'textArea',
                style:{ height:'60px' },
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'摘要',
                disabled:this.state.disabled,
                fieldName:'summary',
                placeholder:'请输入',
                initialValue:newsDetail.summary,
                onChange:() => {}
            },
            {
                type:'selectSearch',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(QuotePlanStatus),
                    selected:newsDetail.category,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'分类',
                fieldName:'category.id'
            },
            {
                type:'editor',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'摘要',
                disabled:this.state.disabled,
                fieldName:'content',
                placeholder:'请输入',
                initialValue:newsDetail.content,
                onChange:() => {}
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(QuotePlanStatus),
                    selected:newsDetail.status,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'text',
                fieldLabel:'作者',
                disabled:this.state.disabled,
                fieldName:'author',
                placeholder:'请输入',
                initialValue:newsDetail.author,
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'来源',
                disabled:this.state.disabled,
                fieldName:'source',
                placeholder:'请输入',
                initialValue:newsDetail.author,
                onChange:() => {}
            },
            {
                type:'text',
                fieldLabel:'访问数',
                disabled:this.state.disabled,
                fieldName:'accessCount',
                placeholder:'请输入',
                initialValue:newsDetail.author,
                onChange:() => {}
            },
            {
                type:'textArea',
                style:{ height:'60px' },
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'内容',
                disabled:this.state.disabled,
                fieldName:'content',
                placeholder:'请输入',
                initialValue:newsDetail.content,
                onChange:() => {}
            },
            {
                type:'switch',
                fieldLabel:'是否轮播',
                fieldName:'isCarousel',
                option:{
                    checked:'启用', // 启用显示文本
                    unChecked:'禁用', // 关闭显示文本
                    initialValue: newsDetail.isCarousel || false, // 默认值（true/false）
                    onChange:(val) => {}
                }
            },
            {
                type:'file',
                fieldLabel:'轮播图',
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
                fieldName:'carouselPic',
                onChange:() => {}
            },
            {
                type:'file',
                fieldLabel:'缩略图',
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
                fieldName:'thumbnailPic',
                onChange:() => {}
            }
        ]

        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    {
                        <div>
                            <Popconfirm title="保存信息不可修改，是否确认？" onConfirm={(e) => { this.save(e) }}>
                                <Button type="primary">保存</Button>
                            </Popconfirm>
                        </div>
                    }
                </div>
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" />
                </div>
            </div>
        )
    }

    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            console.log('aaaaaa', value)
            if (!this.id) {
                this.props.createNews({ freightBill:JSON.stringify(value) })
            } else {
                book.id = this.id
                this.props.updateNews({ freightBill:JSON.stringify(value) })
            }
        })
    }
}

export default Form.create()(NewsEdit)
