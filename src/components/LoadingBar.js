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
        this.isLoading = false
    }
    state = {
        style: {
            display:'none',
            width:'0%'
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.loading.count > 0 && !this.isLoading) {
            clearInterval(this.timer)
            clearTimeout(this.timerOut)
            let progress = 0
            this.setState({ style: { width:'0.5%', display:'block' } })
            this.timer = setInterval(() => {
                if (progress < 95) {
                    this.setState({ style: Object.assign({}, this.state.style, { width: `${progress += 2}%`, transition: 'width 500ms ease-out', WebkitTransition: 'width 500ms ease-out' }) })
                } else {
                    clearInterval(this.timer)
                }
            }, this.speed)
            this.isLoading = true
        } else if (!nextProps.loading.count && this.isLoading) {
            clearInterval(this.timer)
            this.setState({ style: Object.assign({}, this.state.style, { width: '100%' }) })
            // 等待动画播放完成
            this.timerOut = setTimeout(() => {
                this.setState({ style: Object.assign({}, this.state.style, { display: 'none', width:'0', transition:'initial', WebkitTransition:'initial' }) })
            }, 600)
            this.isLoading = false
        }
    }
    render() {
        return (
            <div className="loading-bar" style={this.state.style}>&nbsp;</div>
        )
    }
}

const mapStateToProps = (state) => ({
    loading: state.loading
})
export default connect(mapStateToProps)(LoadingBar)
