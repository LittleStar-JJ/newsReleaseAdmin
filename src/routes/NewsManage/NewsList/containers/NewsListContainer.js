import { connect } from 'react-redux'
import { clearState, getList } from '../modules/newsList'

import NewsList from '../components/NewsList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getList: (query) => getList(query)
}

const mapStateToProps = (state) => ({
    NewsList : state.NewsList
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsList)
