import { connect } from 'react-redux'
import { clearState, getOperationList } from '../modules/operationList'

import OperationList from '../components/OperationList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getOperationList: (query) => getOperationList(query)
}

const mapStateToProps = (state) => ({
    OperationList : state.OperationList
})

export default connect(mapStateToProps, mapDispatchToProps)(OperationList)
