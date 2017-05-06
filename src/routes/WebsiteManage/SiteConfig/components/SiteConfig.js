import React from 'react'
import moment from 'moment'
import { Button, Popconfirm, message, Form, Row, Col } from 'antd'
import OBOREdit from '../../../../components/OBOREdit'
import { QuotePlanStatus, genderStatus } from '../../../../constants/Status'

class SiteConfig extends React.Component {
    static propTypes = {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        SiteConfig: React.PropTypes.object,

        clearState: React.PropTypes.func,
        saveMsg: React.PropTypes.func
    }
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        disabled:false,
        save:{}
    }
    componentWillMount() {}
    componentWillReceiveProps(nextProps) {
        if (nextProps.SiteConfig.save) {

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
        const classifyDetail = this.state.classifyDetail || {}
        const options = [
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'网站名称',
                disabled:this.state.disabled,
                fieldName:'name',
                placeholder:'请输入',
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'网站标题',
                disabled:this.state.disabled,
                fieldName:'title',
                placeholder:'请输入',
                onChange:() => {}
            },
            {
                type:'text',
                rules:[{ required:true, message:'请输入' }],
                fieldLabel:'网站关键字',
                disabled:this.state.disabled,
                fieldName:'keyWords',
                placeholder:'请输入',
                onChange:() => {}
            },
            {
                type:'select',
                rules:[{ required:true, message:'请选择' }],
                option:{
                    valueField:'id',
                    textField:'name',
                    placeholder:'请选择',
                    options:this.convertStatus(QuotePlanStatus),
                    // selected:classifyDetail.status,
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
                onChange:() => {}
            },
            {
                type:'textArea',
                style:{ height:'60px' },
                fieldLabel:'统计代码',
                disabled:this.state.disabled,
                fieldName:'statisticsCode',
                placeholder:'请输入',
                initialValue:classifyDetail.sort,
                onChange:() => {}
            },
            {
                type:'textArea',
                style:{ height:'60px' },
                fieldLabel:'维护信息',
                disabled:this.state.disabled,
                fieldName:'message',
                placeholder:'请输入',
                onChange:() => {}
            }
        ]

        return (
            <div className="page-container page-detail">
                <div className="page-top-btns">
                    {
                        <div>
                            <Popconfirm title="保存信息不可修改，是否确认？" onConfirm={(e) => { this.save(e) }}>
                                <Button type="primary">保存</Button>
                            </Popconfirm>
                        </div>
                    }
                </div>
                <div style={{ width: '50%' }}>
                    <OBOREdit options={options} colSpan={24} ref="OBOREdit1" />
                </div>
            </div>
        )
    }

    save = (e) => {
        this.refs.OBOREdit1.handleValidator(e, (value) => {
            this.props.saveMsg({ freightBill:JSON.stringify(value) })
        })
    }
}

export default Form.create()(SiteConfig)
