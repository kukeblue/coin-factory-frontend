import { Alert, Menu } from 'antd'
import { AccountBookOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import './index.less'
import { ChForm, ChTablePanel, FormItemType } from 'ch-ui'
import constants from '../../config/constants'
const { SubMenu } = Menu

function CapitalContent() {
    return (
        <div className="capital-content">
            <div className="capital-content-header">
                <Menu defaultSelectedKeys={['1']} mode="horizontal">
                    <Menu.Item key="1">充值记录</Menu.Item>
                    <Menu.Item key="2">提币记录</Menu.Item>
                </Menu>
            </div>
            <div className="capital-search">
                <ChForm
                    layout={{
                        labelCol: { span: 8 },
                        wrapperCol: { span: 16 },
                    }}
                    formData={[
                        {
                            type: FormItemType.input,
                            label: '时间范围',
                            name: 'name',
                            layout: {
                                span: 8,
                            },
                        },
                    ]}
                />
            </div>
            <div className="m-t-30 p-l-30 p-r-30">
                <ChTablePanel
                    formData={[]}
                    columns={[
                        {
                            title: 'ID',
                            key: 'id',
                            dataIndex: 'id',
                        },
                    ]}
                    url=""
                />
            </div>
        </div>
    )
}

function Capital() {
    return (
        <div className="capital">
            <div className="p-t-10 p-b-10">
                <Alert message={constants.rechargeTip} type="warning" showIcon closable />
            </div>
            <div className="capital-page flex-center">
                <div className="capital-side">
                    <div className="capital-side-icon flex-column-all-center">
                        <div className="side-icon"></div>
                        <div className="capital-side-icon-text">资金</div>
                    </div>
                    <Menu className="m-t-80" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item style={{ height: 55 }} className="capital-side-item" key="1">
                            <div className="capital-menu-item flex-center">
                                <DollarOutlined style={{ fontSize: 20 }} /> <span>商户资金</span>
                            </div>
                        </Menu.Item>
                        <Menu.Item style={{ height: 55 }} className="capital-side-item" key="2">
                            <div className="capital-menu-item flex-center">
                                <EnvironmentOutlined style={{ fontSize: 20 }} />
                                <span>地址管理</span>
                            </div>
                        </Menu.Item>
                        <Menu.Item style={{ height: 55 }} className="capital-side-item" key="3">
                            <div className="capital-menu-item flex-center">
                                <AccountBookOutlined style={{ fontSize: 20 }} /> <span>提充管理</span>
                            </div>
                        </Menu.Item>
                    </Menu>
                </div>
                <CapitalContent />
            </div>
        </div>
    )
}

export default Capital
