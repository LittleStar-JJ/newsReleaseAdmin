/**
 * Created by xwatson on 2017/3/22.
 */
import React from 'react'
import { Spin, Button } from 'antd'
import { connect } from 'react-redux'

class LoadingSpin extends React.Component {
    static propTypes = {
        children : React.PropTypes.object,
        loading  : React.PropTypes.object
    }
    state = {
        spinning:false,
        refresh:false
    }
    constructor(props) {
        super(props)
        this.timer = null
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.loading.count > 0) {
            if (this.timer) clearTimeout(this.timer)
            this.setState({ spinning:true })
            this.timer = setTimeout(() => {
                this.setState({ refresh:true })
            }, 1000 * 20) // 20秒后可刷新页面
        } else {
            if (this.timer) clearTimeout(this.timer)
            this.setState({ spinning:false, refresh:false })
        }
        console.log('nextProps.loading.count', nextProps.loading.count)
    }
    render() {
        return (
            <div className="loading-spin">
                <Spin tip="Loading..." spinning={this.state.spinning} delay={300} >
                    {this.props.children}
                </Spin>
                {
                    this.state.refresh && <a className="loading-spin-refresh" onClick={() => { window.location.reload() }}>刷新</a>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    loading: state.loading
})
export default connect(mapStateToProps)(LoadingSpin)
