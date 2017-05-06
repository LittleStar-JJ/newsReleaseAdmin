import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { QuotePlanStatus, genderStatus } from '../../../../constants/Status'

class CommentEdit extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        CommentEdit: React.PropTypes.object,

        clearState: React.PropTypes.func,
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
            //  this.props.getCommentById(this.id)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.CommentEdit.commentDetail) {
            const commentDetail = nextProps.CommentEdit.commentDetail
            this.setState({ commentDetail: commentDetail })
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
                fieldName:'name',
                text:''
            },
            {
                type:'html',
                fieldLabel:'用户名',
                fieldName:'user.name',
                text:''
            },
            {
                type:'html',
                fieldLabel:'留言内容',
                fieldName:'content',
                text:''
            },
            {
                type:'html',
                fieldLabel:'评论时间',
                fieldName:'createdAt',
                text:''
            },
            {
                type:'html',
                fieldLabel:'状态',
                fieldName:'status',
                text:''
            }
        ]

        return (
            <div className="page-container page-detail">
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" edit />
                </div>
            </div>
        )
    }
}

export default Form.create()(CommentEdit)
