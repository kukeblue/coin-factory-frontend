import { Button, Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import './index.less'
import { Menu } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { SyncOutlined } from '@ant-design/icons'
import { GlobalStore } from '../store/globalStore'

const { Header } = Layout

const LayoutConfig = {
    headerMenus: [
        {
            path: '/',
            name: '首页',
        },
        {
            path: '/capital',
            name: '资金',
        },
        {
            path: '/security',
            name: '安全',
        },
        {
            path: '/applicationCenter',
            name: '应用中心',
        },
    ],
}

function LayoutHeader() {
    const location = useLocation()
    const history = useHistory()
    const [currentPath, setCurrentPath] = useState('')
    const { headerMenus } = LayoutConfig
    const { currentApp } = GlobalStore.useContainer()
    useEffect(() => {
        setCurrentPath(location.pathname)
    }, [location.pathname])

    const logout = () => {
        localStorage.clear()
        window.location.href = '/login'
    }

    return (
        <Header style={{ background: '#23282B' }} className="flex-center">
            <div className="layout-header flex-row-between">
                <div className="flex-center">
                    <div className="layout-logo"></div>
                    <div className="layout-splitline"></div>
                    <div
                        onClick={() => {
                            history.push('/application')
                        }}
                        className={location.pathname === '/application' ? 'layout-change-application active' : 'layout-change-application'}
                    >
                        <SyncOutlined />
                        <span className="m-l-5">切换应用</span>
                    </div>
                    <Menu selectedKeys={[currentPath]} theme="dark" className="layout-menu" mode="horizontal">
                        {headerMenus.map((item) => {
                            return (
                                <Menu.Item
                                    key={item.path}
                                    onClick={() => {
                                        history.push(item.path)
                                    }}
                                >
                                    {item.name}
                                </Menu.Item>
                            )
                        })}

                        <Menu.Item key="5">开发文档</Menu.Item>
                        <Menu.Item key="6">上币申请</Menu.Item>
                        <Menu.Item key="7">商户中心</Menu.Item>
                    </Menu>
                </div>
                <div className="flex-center layout-header-right">
                    <div style={{ fontSize: 12 }} className="layout-header-option m-r-10">
                        当前应用:<a className="m-l-5">{currentApp?.app_name || '无'}</a>
                    </div>
                    <div className="flex-center layout-header-option m-r-20">
                        <span className="iconfont icon-xiaoxi"></span>
                        消息
                    </div>
                    <div onClick={logout} className="layout-header-option m-b-3">
                        退出
                    </div>
                </div>
            </div>
        </Header>
    )
}

function AdminLayout({ children }: { children: JSX.Element }) {
    return (
        <div className="admin-layout">
            <LayoutHeader />
            <div className="layout-content">{children}</div>
        </div>
    )
}

function MyLayout({ children }: { children: JSX.Element }) {
    return (
        <div className="layout">
            <AdminLayout>{children}</AdminLayout>
        </div>
    )
}

export default MyLayout
