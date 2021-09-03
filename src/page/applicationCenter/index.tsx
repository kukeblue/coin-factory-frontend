import React from 'react'
import { UnorderedListOutlined, DollarCircleOutlined } from '@ant-design/icons'
import CommonPage from '../../component/template/CommonPage'
import './index.less'
import Information from './Information'

function ApplicationCenter() {
    return (
        <div className="application-page">
            <CommonPage
                pageName="应用中心"
                pageIcon={<div className="applicationCenter-icon"></div>}
                pageRouters={[
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
                        component: <div>开通币种</div>,
                    },
                ]}
            />
        </div>
    )
}

export default ApplicationCenter
