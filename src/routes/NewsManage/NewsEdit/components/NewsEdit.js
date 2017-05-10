import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { CommonStatus } from '../../../../constants/Status'
import ResponseCode from '../../../../utils/ResponseCode'

class NewsEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        NewsEdit: React.PropTypes.object,
        clearState: React.PropTypes.func,
        getCategoryList: React.PropTypes.func,
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
        category: [],
        carouselPicFileList: [],
        thumbnailPicFileList: [],
        newsDetail: {},
        disabled:false,
        create:{},
        update:{}
    }
    componentWillMount() {
        this.props.getCategoryList()
        if (this.id) {
            this.props.getNewsById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.NewsEdit.category) {
            const category = nextProps.NewsEdit.category.content
            this.setState({ category })
            this.props.clearState()
        }
        if (nextProps.NewsEdit.newsDetail) {
            const newsDetail = nextProps.NewsEdit.newsDetail
            this.setState({ newsDetail: newsDetail })
            this.props.clearState()
        }
        if (nextProps.NewsEdit.create) {
            message.success('创建成功')
            this.context.router.push('/newsList')
            this.props.clearState()
        }
        if (nextProps.NewsEdit.update) {
            message.success('修改成功')
            this.context.router.push('/newsList')
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
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'标题',
                disabled:this.state.disabled,
                fieldName:'title',
                placeholder:'请输入',
                initialValue:newsDetail.title,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'关键字',
                disabled:this.state.disabled,
                fieldName:'keyWords',
                placeholder:'请输入',
                initialValue:newsDetail.keyWords,
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
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.state.category,
                    selected:newsDetail.category_id,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'分类',
                fieldName:'category_id'
            },
            {
                type:'editor',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'内容',
                disabled:this.state.disabled,
                fieldName:'content',
                placeholder:'请输入',
                initialValue:newsDetail.content,
                onChange:() => {}
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
                initialValue:newsDetail.source,
                onChange:() => {}
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(CommonStatus),
                    selected:newsDetail.status,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'switch',
                fieldLabel:'是否轮播',
                fieldName:'is_carousel',
                option:{
                    checked:'是', // 启用显示文本
                    unChecked:'否', // 关闭显示文本
                    initialValue: newsDetail.is_carousel, // 默认值（true/false）
                    onChange:(val) => {}
                }
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
                    fileList:this.state.thumbnailPicFileList,
                    listType:'picture',
                    onRemove:(file) => {
                        this.state.fileList.map((item, i) => {
                            if (item.uid === file.uid) {
                                this.state.thumbnailPicFileList.splice(i, 1)
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
                    fileList:this.state.carouselPicFileList,
                    listType:'picture',
                    onRemove:(file) => {
                        this.state.fileList.map((item, i) => {
                            if (item.uid === file.uid) {
                                this.state.carouselPicFileList.splice(i, 1)
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
                type:'text',
                fieldLabel:'访问数',
                disabled:true,
                fieldName:'accessCount',
                placeholder:'请输入',
                initialValue:newsDetail.accessCount,
                onChange:() => {}
            }
        ]

        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    {
                        <div>
                            <Button type="primary" onClick={(e) => { this.save(e) }}>保存</Button>
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
            value.thumbnailPic = 'test' // this.state.thumbnailPicFileList
            value.carouselPic = '' // this.state.carouselPicFileList
            if (!this.id) {
                this.props.createNews(value)
            } else {
                value.id = this.id
                this.props.updateNews(value)
            }
        })
    }
}

export default Form.create()(NewsEdit)
