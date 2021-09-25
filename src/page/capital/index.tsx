import { Alert, Button, Menu, Table } from 'antd'
import { AccountBookOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import './index.less'
import CommonPage from '../../component/template/CommonPage'
import { GlobalStore } from '../../store/globalStore'
import HasAppCheck from '../../component/auth/HasAppCheck'
import MerchantCapital from './merchantCapital'
import Address from './address'
import Bill from './bill'
const { SubMenu } = Menu

function Capital() {
    const { currentApp } = GlobalStore.useContainer()

    return (
        <HasAppCheck>
            <CommonPage
                pageIcon={
                    <div className="icon-vbg flex-center">
                        <DollarOutlined />
                    </div>
                }
                pageName="资金"
                pageRouters={[
                    {
                        path: '/capital',
                        name: '商户资金',
                        component: currentApp ? <MerchantCapital /> : <div></div>,
                        icon: <AccountBookOutlined />,
                    },
                    {
                        path: '/capital/address',
                        name: '地址管理',
                        icon: <EnvironmentOutlined />,
                        component: currentApp ? <Address /> : <div />,
                    },
                    {
                        path: '/capital/recharge',
                        name: '充值管理',
                        icon: <DollarOutlined />,
                        component: currentApp ? <Bill /> : <div />,
                    },
                ]}
            />
        </HasAppCheck>
    )
}

export default Capital
