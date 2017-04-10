/**
 * Created by xwatson on 2017/1/22.
 */
import React from 'react'
import InputSearch from '../InputSearch'

export default class SearchCountry extends React.Component {
    static propTypes = {
        initialValue    : React.PropTypes.any,
        placeholder    : React.PropTypes.string,
        Country         : React.PropTypes.object,
        clearValue         : React.PropTypes.bool,
        getCountryList  : React.PropTypes.func,
        onChange        : React.PropTypes.func,
        onSearch        : React.PropTypes.func
    }
    constructor(props) {
        super(props)
        this.searchCallback = null
    }
    handleValidator = () => {
        return this.refs.SearchCountryInputSearch.handleValidator()
    }
    handleChange = (value) => {
        if (this.props.onChange instanceof Function) {
            this.props.onChange(value)
        }
    }
    handleSearch = (value, callback) => {
        this.warehouseName = value
        if (this.props.onSearch instanceof Function) this.props.onSearch(value)
        if (value === '') return false
        this.props.getCountryList(value)
        this.searchCallback = callback
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.Country.Country) {
            if (this.searchCallback instanceof Function) {
                this.searchCallback(nextProps.Country.Country.content)
            }
        }
    }
    render() {
        const option = {
            valueField:'id',
            textField:'name'
        }
        return (
            <InputSearch initialValue={this.props.initialValue} clearValue={this.props.clearValue} placeholder={this.props.placeholder}
              onChange={this.handleChange} ref="SearchCountryInputSearch" option={option} onSearch={this.handleSearch} />
        )
    }
}
