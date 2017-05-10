import { connect } from 'react-redux'
import { clearState, getClassifyById, createClassify, updateClassify, getClassifyList } from '../modules/classifyEdit'
import ClassifyEdit from '../components/ClassifyEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getClassifyById: (id) => getClassifyById(id),
    createClassify: (query) => createClassify(query),
    updateClassify: (query) => updateClassify(query),
    getClassifyList: (query) => getClassifyList(query)
}

const mapStateToProps = (state) => ({
    ClassifyEdit : state.ClassifyEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(ClassifyEdit)
