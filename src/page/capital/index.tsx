import { Alert, Button, Menu, Table } from 'antd'
import { AccountBookOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import './index.less'
import { ChForm, ChTablePanel, FormItemType } from 'ch-ui'
import constants, { AjAxPageCommonSetting } from '../../config/constants'
import { Route, Switch, useHistory } from 'react-router-dom'
import CommonPage from '../../component/template/CommonPage'
import DropRangePicker from '../../component/from/DropRangePicker'
import PSelect from '../../component/from/PSelect'
import { usePage } from '../../utils/chHooks'
import { ICallBackUrlSetting } from '../applicationCenter/interface'
import { GlobalStore } from '../../store/globalStore'
import HasAppCheck from '../../component/auth/HasAppCheck'
import MerchantCapital from './MerchantCapital'
const { SubMenu } = Menu

function Capital() {
    const { currentApp } = GlobalStore.useContainer()

    return (
        <HasAppCheck>
            <CommonPage
                pageIcon={<div className="applicationCenter-icon"></div>}
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
                    },
                    {
                        path: '/capital/recharge',
                        name: '充值管理',
                        icon: <DollarOutlined />,
                    },
                ]}
            />
        </HasAppCheck>
    )
}

export default Capital
