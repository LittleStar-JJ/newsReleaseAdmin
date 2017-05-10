import { connect } from 'react-redux'
import { clearState, getList, getCategorys } from '../modules/newsList'

import NewsList from '../components/NewsList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getList: (query) => getList(query),
    getCategorys: (query) => getCategorys(query)
}

const mapStateToProps = (state) => ({
    NewsList : state.NewsList
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsList)
