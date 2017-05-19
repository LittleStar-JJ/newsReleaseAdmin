import { connect } from 'react-redux'
import { clearState, getCommentList, deleteComment } from '../modules/commentList'

import CommentList from '../components/CommentList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getCommentList: (query) => getCommentList(query),
    deleteComment: (query) => deleteComment(query)
}

const mapStateToProps = (state) => ({
    CommentList : state.CommentList
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentList)
