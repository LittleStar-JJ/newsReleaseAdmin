import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import BtnPermission from '../../../../components/BtnPermission'
import { CommentStatus, BtnOperation } from '../../../../constants/Status'

class CommentEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        CommentEdit: React.PropTypes.object,
        clearState: React.PropTypes.func,
        commentReview: React.PropTypes.func,
        getCommentById: React.PropTypes.func
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
        commentDetail: {},
        disabled:false
    }
    componentWillMount() {
        if (this.id) {
            this.props.getCommentById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.CommentEdit.detail) {
            const commentDetail = nextProps.CommentEdit.detail
            this.setState({ commentDetail: commentDetail })
            this.props.clearState()
        }
        if (nextProps.CommentEdit.review) {
            message.success('审核完成')
            this.setState({ commentDetail:nextProps.CommentEdit.review })
            this.props.clearState()
        }
        if (nextProps.CommentEdit.error) {
            message.error(nextProps.CommentEdit.error.error)
            this.props.clearState()
        }
    }
    render() {
        const commentDetail = this.state.commentDetail || {}
        const options = [
            {
                type:'html',
                fieldLabel:'新闻标题',
                fieldName:'title',
                text:(commentDetail.News || {}).title
            },
            {
                type:'html',
                fieldLabel:'用户名',
                fieldName:'user.name',
                text:(commentDetail.User || {}).nickName
            },
            {
                type:'html',
                fieldLabel:'留言内容',
                fieldName:'content',
                text:commentDetail.content
            },
            {
                type:'html',
                fieldLabel:'评论时间',
                fieldName:'createdAt',
                text:moment(commentDetail.createdAt).format('YYYY-MM-DD HH:mm:ss')
            },
            {
                type:'html',
                fieldLabel:'审核时间',
                fieldName:'updatedAt',
                text:commentDetail.status !== 'INIT' ? moment(commentDetail.updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            {
                type:'html',
                fieldLabel:'状态',
                fieldName:'status',
                text:CommentStatus[commentDetail.status]
            }
        ]

        return (
            <div className="page-container page-detail">
                <BtnPermission type={BtnOperation.审核}>
                    <div className="page-top-btns">
                        <Button type="ghost" style={{ borderColor:'red', color:'red' }} onClick={() => { this.review('REJECT') }}>审核拒绝</Button>
                        <Button type="primary" onClick={() => { this.review('PASS') }}>审核通过</Button>
                    </div>
                </BtnPermission>
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" edit />
                </div>
            </div>
        )
    }
    review = (status) => {
        this.props.commentReview({ id:this.id, status:status })
    }
}

export default Form.create()(CommentEdit)
