import { connect } from 'react-redux'
import { clearState, getClassifyList } from '../modules/classifyList'

import ClassifyList from '../components/ClassifyList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getClassifyList: (query) => getClassifyList(query)
}

const mapStateToProps = (state) => ({
    ClassifyList : state.ClassifyList
})

export default connect(mapStateToProps, mapDispatchToProps)(ClassifyList)
