import { connect } from 'react-redux'
import { clearState, getClassifyList, deleteClassify } from '../modules/classifyList'

import ClassifyList from '../components/ClassifyList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getClassifyList: (query) => getClassifyList(query),
    deleteClassify: (query) => deleteClassify(query)
}

const mapStateToProps = (state) => ({
    ClassifyList : state.ClassifyList
})

export default connect(mapStateToProps, mapDispatchToProps)(ClassifyList)
