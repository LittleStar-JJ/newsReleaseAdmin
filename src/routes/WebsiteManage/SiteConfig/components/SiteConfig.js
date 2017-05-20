import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { SiteStatus } from '../../../../constants/Status'

class SiteConfig extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        SiteConfig: React.PropTypes.object,
        getSite: React.PropTypes.func,
        clearState: React.PropTypes.func,
        saveMsg: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        disabled:false,
        detail:{}
    }
    componentWillMount() {
        this.props.getSite()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.SiteConfig.detail) {
            this.setState({ detail:nextProps.SiteConfig.detail })
            this.props.clearState()
        }
        if (nextProps.SiteConfig.save) {
            message.success('保存成功')
            this.props.clearState()
        }
        if (nextProps.SiteConfig.error) {
            message.error(nextProps.SiteConfig.error.error)
            this.props.clearState()
        }
    }
    convertStatus = (statusObj) => {
        let arr = []
        Object.keys(statusObj).map((key) => {
            arr.push({ id: key, name:statusObj[key] })
        })
        return arr
    }
    render() {
        const detail = this.state.detail || {}
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'网站名称',
                disabled:this.state.disabled,
                fieldName:'name',
                placeholder:'请输入',
                initialValue:detail.name,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'网站标题',
                disabled:this.state.disabled,
                fieldName:'title',
                placeholder:'请输入',
                initialValue:detail.title,
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'网站关键字',
                disabled:this.state.disabled,
                fieldName:'keyWords',
                placeholder:'请输入',
                initialValue:detail.keyWords,
                onChange:() => {}
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(SiteStatus),
                    selected:detail.status,
                    onChange:(val) => {}
                },
                disabled:false,
                fieldLabel:'状态',
                fieldName:'status'
            },
            {
                type:'text',
                fieldLabel:'网站描述',
                disabled:this.state.disabled,
                fieldName:'description',
                placeholder:'请输入',
                initialValue:detail.name,
                onChange:() => {}
            },
            {
                type:'textArea',
                style:{ height:'60px' },
                fieldLabel:'底部代码',
                disabled:this.state.disabled,
                fieldName:'statisticsCode',
                placeholder:'请输入',
                initialValue:detail.statisticsCode,
                onChange:() => {}
            },
            {
                type:'textArea',
                style:{ height:'60px' },
                fieldLabel:'维护信息',
                disabled:this.state.disabled,
                fieldName:'message',
                placeholder:'请输入',
                initialValue:detail.message,
                onChange:() => {}
            }
        ]

        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    <Button type="primary" onClick={(e) => { this.save(e) }}>保存</Button>
                </div>
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" />
                </div>
            </div>
        )
    }

    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            this.props.saveMsg(value)
        })
    }
}

export default Form.create()(SiteConfig)
