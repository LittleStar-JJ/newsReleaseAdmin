import { connect } from 'react-redux'
import { clearState, getNewsById, createNews, updateNews, getCategoryList } from '../modules/newsEdit'
import NewsEdit from '../components/NewsEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getNewsById: (id) => getNewsById(id),
    createNews: (query) => createNews(query),
    updateNews: (query) => updateNews(query),
    getCategoryList: (query) => getCategoryList(query)
}

const mapStateToProps = (state) => ({
    NewsEdit : state.NewsEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsEdit)
