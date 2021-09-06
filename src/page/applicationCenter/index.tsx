import React from 'react'
import { UnorderedListOutlined, DollarCircleOutlined, SyncOutlined } from '@ant-design/icons'
import CommonPage from '../../component/template/CommonPage'
import './index.less'
import Information from './Information'
import OpenCoins from './openCoins'
import CallbackManagement from './callbackManagement'
import { GlobalStore } from '../../store/globalStore'

function ApplicationCenter() {
    const { currentApp } = GlobalStore.useContainer()
    const pageRouters = currentApp
        ? [
              {
                  path: '/applicationCenter',
                  name: '应用信息',
                  icon: <UnorderedListOutlined />,
                  component: <Information />,
              },
              {
                  path: '/applicationCenter/openCoin',
                  name: '开通币种',
                  icon: <DollarCircleOutlined />,
                  component: <OpenCoins />,
              },
              {
                  path: '/applicationCenter/callbackManagement',
                  name: '回调管理',
                  icon: <SyncOutlined />,
                  component: <CallbackManagement />,
              },
          ]
        : []
    return (
        <div className="application-page">
            <CommonPage pageName="应用中心" pageIcon={<div className="applicationCenter-icon"></div>} pageRouters={pageRouters} />
        </div>
    )
}

export default ApplicationCenter
