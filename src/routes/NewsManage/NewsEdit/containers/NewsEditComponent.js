import { connect } from 'react-redux'
import { clearState, getNewsById, createNews, updateNews } from '../modules/newsEdit'
import NewsEdit from '../components/NewsEdit'

const mapDispatchToProps = {
    clearState: () => clearState(),
    getNewsById: (id) => getNewsById(id),
    createNews: (query) => createNews(query),
    updateNews: (query) => updateNews(query)
}

const mapStateToProps = (state) => ({
    NewsEdit : state.NewsEdit
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsEdit)
