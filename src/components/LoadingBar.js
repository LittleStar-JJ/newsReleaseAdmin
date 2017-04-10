/**
 * Created by xwatson on 2017/1/17.
 */
import React from 'react'
import { connect } from 'react-redux'

class LoadingBar extends React.Component {
    static propTypes = {
        loading : React.PropTypes.object
    }
    constructor(props) {
        super(props)
        this.timer = null
        this.timerOut = null
        this.speed = 500
        this.isUnmount = false
    }
    state = {
        style: {
            display:'none',
            width:'0%'
        }
    }
    componentWillMount() {
        this.isUnmount = false
    }
    componentWillReceiveProps(nextProps) {
        clearTimeout(this.timerOut)
        if (nextProps.loading.status) {
            clearInterval(this.timer)
            let progress = 0
            this.setState({ style: { width:'0.5%', display:'block' } })
            this.timer = setInterval(() => {
                if (progress < 95) {
                    this.setState({ style: Object.assign({}, this.state.style, { width: `${progress += 2}%`, transition: 'width 500ms ease-out', WebkitTransition: 'width 500ms ease-out' }) })
                } else {
                    clearInterval(this.timer)
                }
            }, this.speed)
        } else {
            clearInterval(this.timer)
            this.setState({ style: Object.assign({}, this.state.style, { width: '100%' }) })
            // 等待动画播放完成
            this.timerOut = setTimeout(() => {
                if (!this.isUnmount) {
                    this.setState({ style: Object.assign({}, this.state.style, { display: 'none', width:'0', transition:'initial', WebkitTransition:'initial' }) })
                }
            }, 490)
        }
    }
    render() {
        return (
            <div className="loading-bar" style={this.state.style}>&nbsp;</div>
        )
    }
    componentWillUnmount() {
        this.isUnmount = true
    }
}

const mapStateToProps = (state) => ({
    loading: state.loading
})
export default connect(mapStateToProps)(LoadingBar)
