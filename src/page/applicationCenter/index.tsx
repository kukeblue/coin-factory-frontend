import React from 'react'
import { UnorderedListOutlined, DollarCircleOutlined, SyncOutlined, GlobalOutlined, FileTextOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import CommonPage from '../../component/template/CommonPage'
import './index.less'
import Information from './Information'
import OpenCoins from './openCoins'
import CallbackManagement from './callbackManagement'
import { GlobalStore } from '../../store/globalStore'
import HasAppCheck from '../../component/auth/HasAppCheck'
import ProtectionSetting from './protectionSetting'
import OperationLog from './operationLog'
import WorkOrder from './workOrder'
import WorkOrderDetail from './workOrder/detail'

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
              {
                  path: '/applicationCenter/protectionSetting',
                  name: '防护设置',
                  icon: <GlobalOutlined />,
                  component: <ProtectionSetting />,
              },
              {
                  path: '/applicationCenter/operationLog',
                  name: '操作日志',
                  icon: <FileTextOutlined />,
                  component: <OperationLog />,
              },
              {
                  path: '/applicationCenter/workOrder',
                  name: '我的工单',
                  icon: <QuestionCircleOutlined />,
                  component: <WorkOrder />,
              },
              {
                  path: '/applicationCenter/workOrder/detail/:id',
                  name: '工单详情',
                  isChildPage: true,
                  icon: <QuestionCircleOutlined />,
                  component: <WorkOrderDetail />,
              },
          ]
        : []
    return (
        <div className="application-page">
            <HasAppCheck>
                <CommonPage pageName="应用中心" pageIcon={<div className="applicationCenter-icon"></div>} pageRouters={pageRouters} />
            </HasAppCheck>
        </div>
    )
}

export default ApplicationCenter
