import { connect } from 'react-redux'
import { clearState, getCommentList } from '../modules/commentList'

import CommentList from '../components/CommentList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getCommentList: (query) => getCommentList(query)
}

const mapStateToProps = (state) => ({
    CommentList : state.CommentList
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentList)
