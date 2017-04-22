import { connect } from 'react-redux'
import { clearState, getUesrById, createUser, updateUser } from '../modules/commentEdit'
import CommentEdit from '../components/CommentEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getCommentById: (id) => getCommentById(id)
}

const mapStateToProps = (state) => ({
    CommentEdit : state.CommentEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentEdit)
