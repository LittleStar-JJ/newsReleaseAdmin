import { connect } from 'react-redux'
import { clearState, getUesrById, createUser, updateUser } from '../modules/classifyEdit'
import ClassifyEdit from '../components/ClassifyEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getClassifyById: (id) => getClassifyById(id),
    createClassify: (query) => createClassify(query),
    updateClassify: (query) => updateClassify(query)
}

const mapStateToProps = (state) => ({
    UesrEdit : state.UesrEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(ClassifyEdit)
