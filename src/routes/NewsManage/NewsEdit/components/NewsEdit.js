import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import UEditor from '../../../../components/UEditor'
import { CommonStatus } from '../../../../constants/Status'
import ResponseCode from '../../../../utils/ResponseCode'
import auth from '../../../../utils/Auth'
import { NewsApi } from '../../../../constants/Api'
const config = require('../../../../../config/config.json')[NODE_ENV.toUpperCase()]

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
        const session = auth.getAccount()
        let { authToken = undefined } = session
        this.authToken = authToken
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
            const thumbnailPic = []
            const carouselPic = []
            newsDetail.thumbnailPic = (newsDetail.thumbnailPic || '')
            newsDetail.carouselPic = (newsDetail.carouselPic || '')
            const thumbnailPicName = newsDetail.thumbnailPic.substr(newsDetail.thumbnailPic.lastIndexOf('/') + 1, newsDetail.thumbnailPic.length)
            const carouselPicName = newsDetail.carouselPic.substr(newsDetail.carouselPic.lastIndexOf('/') + 1, newsDetail.carouselPic.length)
            if (newsDetail.thumbnailPic) {
                thumbnailPic.push({
                    uid:thumbnailPicName || 1,
                    name: thumbnailPicName,
                    status: 'done',
                    url:newsDetail.thumbnailPic
                })
            }
            if (newsDetail.carouselPic) {
                carouselPic.push({
                    uid:carouselPicName || 1,
                    name: carouselPicName,
                    status: 'done',
                    url:newsDetail.carouselPic
                })
            }
            this.refs.UEditor1.setContent(newsDetail.content || '')
            this.setState({
                newsDetail: newsDetail,
                thumbnailPicFileList:thumbnailPic,
                carouselPicFileList:carouselPic
            })
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
            /* {
                type:'editor',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'内容',
                disabled:this.state.disabled,
                fieldName:'content',
                placeholder:'请输入',
                initialValue:newsDetail.content,
                onChange:() => {}
            }, */
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
                    accept:'.jpg,.jpeg,.gif,.png,.bmp',
                    action: NewsApi.upload,
                    data:{ authToken:this.authToken },
                    fileList:this.state.thumbnailPicFileList,
                    listType:'picture',
                    onRemove:(file) => {
                        this.state.thumbnailPicFileList.map((item, i) => {
                            if (item.uid === file.uid) {
                                this.state.thumbnailPicFileList.splice(i, 1)
                            }
                        })
                        this.setState({ thumbnailPicFileList:this.state.thumbnailPicFileList })
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
                                this.setState({ thumbnailPicFileList:_otherFiles })
                                return false
                            } else {
                                if (info.file.response.code === ResponseCode.AUTH_EXPIRED) this.context.router.replace('/login')
                                message.error(info.file.response.message)
                            }
                        } else if (info.file.status === 'error') {
                            message.error(`${info.file.name} 上传失败.`)
                        }
                        this.setState({ thumbnailPicFileList:[info.file] })
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
                    accept:'.jpg,.jpeg,.gif,.png,.bmp',
                    action: NewsApi.upload,
                    data:{ authToken:this.authToken },
                    fileList:this.state.carouselPicFileList,
                    listType:'picture',
                    onRemove:(file) => {
                        this.state.fileList.map((item, i) => {
                            if (item.uid === file.uid) {
                                this.state.carouselPicFileList.splice(i, 1)
                            }
                        })
                        this.setState({ carouselPicFileList:this.state.carouselPicFileList })
                        return true
                    },
                    onChange: (info) => {
                        if (info.file.status === 'done') {
                            if (info.file.response.code === ResponseCode.SUCCESS) {
                                const fileData = info.file.response.data
                                let _otherFiles = []
                                _otherFiles.push({
                                    uid: fileData.id,
                                    name: info.file.name,
                                    status: 'done',
                                    url:`${config.apiHost}/${fileData.path}`,
                                    thumbUrl:`${config.apiHost}/${fileData.path}`
                                })
                                message.success(`${info.file.name} 上传成功`)
                                this.setState({ carouselPicFileList:_otherFiles })
                                return false
                            } else {
                                if (info.file.response.code === ResponseCode.AUTH_EXPIRED) this.context.router.replace('/login')
                                message.error(info.file.response.message)
                            }
                        } else if (info.file.status === 'error') {
                            message.error(`${info.file.name} 上传失败.`)
                        }
                        this.setState({ carouselPicFileList:[info.file] })
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
                <Row>
                    <Col style={{ marginLeft:'10.5%' }} span={1} ><span style={{ color:'red' }}>*</span>内容：</Col>
                    <Col span={18}>
                        <div style={{ marginTop:'-10px' }}>
                            <UEditor html={newsDetail.content} ref="UEditor1" />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            const thumbnailPic = this.state.thumbnailPicFileList.map((item) => item.url)
            const carouselPic = this.state.carouselPicFileList.map((item) => item.url)
            value.thumbnailPic = thumbnailPic.join(',')
            value.carouselPic = carouselPic.join(',')
            value.content = this.refs.UEditor1.getContent()
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
