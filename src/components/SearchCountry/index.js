/**
 * Created by xwatson on 2017/1/22.
 */
import { connect } from 'react-redux'
import SearchCountry from './SearchCountry'
import { getCountryList } from '../../actions/country'

const mapDispatchToProps = {
    getCountryList : (q) => getCountryList(q)
}

const mapStateToProps = (state) => ({
    Country : state.country
})

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(SearchCountry)
