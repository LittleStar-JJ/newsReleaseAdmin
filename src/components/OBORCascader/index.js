/**
 * Created by xwatson on 2017/1/9.
 */
import { connect } from 'react-redux'
import OBORCascader from './OBORCascader'
import { getAllArea, clearCascadeState } from '../../actions/cascaderAction'
import { getCountryList, clearWarehouse } from '../../actions/country'

const mapDispatchToProps = {
    getAllArea : (code) => getAllArea(code),
    getCountryList : (name) => getCountryList(name),
    clearCascadeState : () => clearCascadeState(),
    clearWarehouse : () => clearWarehouse()
}

const mapStateToProps = (state) => ({
    CascaderArea : state.cascaderArea,
    country : state.country.Country
})

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(OBORCascader)
