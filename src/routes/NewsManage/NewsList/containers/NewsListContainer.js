import { connect } from 'react-redux'
import { clearState, getList, getCategorys, deleteNews } from '../modules/newsList'

import NewsList from '../components/NewsList'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getList: (query) => getList(query),
    getCategorys: (query) => getCategorys(query),
    deleteNews: (query) => deleteNews(query)
}

const mapStateToProps = (state) => ({
    NewsList : state.NewsList
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsList)
