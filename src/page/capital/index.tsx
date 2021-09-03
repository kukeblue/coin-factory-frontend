import { Alert, Menu } from 'antd'
import { AccountBookOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import './index.less'
import { ChForm, ChTablePanel, FormItemType } from 'ch-ui'
import constants from '../../config/constants'
import { Route, Switch, useHistory } from 'react-router-dom'
import CommonPage from '../../component/template/CommonPage'
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
        <CommonPage
            pageName="资金"
            pageRouters={[
                {
                    path: '/capital',
                    name: '商户资金',
                    component: <CapitalContent />,
                    icon: <AccountBookOutlined />,
                },
                {
                    path: '/capital/address',
                    name: '地址管理',
                    icon: <EnvironmentOutlined />,
                },
                {
                    path: '/capital/recharge',
                    name: '充值管理',
                    icon: <DollarOutlined />,
                },
            ]}
        />
    )
}

export default Capital
